// authRoutes.js
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createResponse } from "./helper.js";
import { getConnection } from "./db.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Database helper function for Google auth
async function findOrCreateGoogleUser(profile) {
    const connection = await getConnection();
    try {
        let user;
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value || `${profile.id}@google.com`;

        // Check if user exists with Google ID
        const [existingUser] = await connection.query(
            `SELECT * FROM users WHERE google_id = ?`,
            [providerId]
        );

        if (existingUser.length > 0) {
            user = existingUser[0];
        } else {
            // Check if user exists with email
            const [usersByEmail] = await connection.query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (usersByEmail.length > 0) {
                // Update existing user with Google ID
                await connection.query(
                    `UPDATE users SET google_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [providerId, usersByEmail[0].id]
                );
                user = { ...usersByEmail[0], google_id: providerId };
            } else {
                // Create new user with Google
                const name =
                    profile.displayName || profile.name?.givenName || "User";
                const firstName =
                    profile.name?.givenName || name.split(" ")[0] || "";
                const lastName =
                    profile.name?.familyName ||
                    name.split(" ").slice(1).join(" ") ||
                    "";

                // Generate username from email
                const username =
                    email.split("@")[0] + Math.floor(Math.random() * 1000);

                const [result] = await connection.query(
                    `INSERT INTO users (email, username, first_name, last_name, google_id, avatar_url, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                    [
                        email,
                        username,
                        firstName,
                        lastName,
                        providerId,
                        profile.photos?.[0]?.value || "avatarDefault.png"
                    ]
                );

                const [newUser] = await connection.query(
                    "SELECT * FROM users WHERE id = ?",
                    [result.insertId]
                );
                user = newUser[0];
            }
        }

        return user;
    } finally {
        await connection.release();
    }
}

// Passport Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await findOrCreateGoogleUser(profile);
                return done(null, user);
            } catch (error) {
                console.error("Google auth error:", error);
                return done(error, null);
            }
        }
    )
);

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const connection = await getConnection();
        const [users] = await connection.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        await connection.release();
        done(null, users[0] || null);
    } catch (error) {
        done(error, null);
    }
});

// Register route (updated for new structure)
router.post("/register", async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(
                    createResponse(
                        false,
                        "Email and password are required",
                        null,
                        400
                    )
                );
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json(
                    createResponse(
                        false,
                        "Password must be at least 6 characters",
                        null,
                        400
                    )
                );
        }

        const connection = await getConnection();

        // Check if user already exists
        const [existingUsers] = await connection.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.release();
            return res
                .status(409)
                .json(
                    createResponse(false, "Email already registered", null, 409)
                );
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Generate username from email
        const username = email.split("@")[0] + Math.floor(Math.random() * 1000);

        // Insert new user with new structure
        const [result] = await connection.query(
            `INSERT INTO users (email, username, first_name, last_name, password_hash, created_at) 
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [email, username, first_name || "", last_name || "", password_hash]
        );

        // Get the created user
        const [newUser] = await connection.query(
            "SELECT id, email, username, first_name, last_name, avatar_url FROM users WHERE id = ?",
            [result.insertId]
        );

        await connection.release();

        // Create JWT token
        const token = jwt.sign({ user: newUser[0] }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(201).json(
            createResponse(true, "Registration successful", {
                token,
                user: newUser[0]
            })
        );
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json(
            createResponse(false, "Internal server error", null, 500)
        );
    }
});

// Login route (updated for new structure)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(
                    createResponse(
                        false,
                        "Email and password are required",
                        null,
                        400
                    )
                );
        }

        const connection = await getConnection();

        // Find user by email
        const [users] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        await connection.release();

        if (users.length === 0) {
            return res
                .status(401)
                .json(createResponse(false, "Invalid credentials", null, 401));
        }

        const user = users[0];

        // Check if user has password (Google users won't have one)
        if (!user.password_hash) {
            return res
                .status(401)
                .json(
                    createResponse(false, "Please login with Google", null, 401)
                );
        }

        // Check password
        const isValidPassword = await bcrypt.compare(
            password,
            user.password_hash
        );
        if (!isValidPassword) {
            return res
                .status(401)
                .json(createResponse(false, "Invalid credentials", null, 401));
        }

        // Remove sensitive data
        const { password_hash, ...userWithoutPassword } = user;

        // Create JWT token
        const token = jwt.sign(
            { user: userWithoutPassword },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json(
            createResponse(true, "Login successful", {
                token,
                user: userWithoutPassword
            })
        );
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json(
            createResponse(false, "Internal server error", null, 500)
        );
    }
});

// Profile setup route
router.post("/setup-profile", async (req, res) => {
    try {
        console.log("Setup profile request received:", req.body);
        console.log("Files:", req.files);

        // For FormData, username comes from req.body
        // avatar comes from either req.body.avatarType or req.files.avatar
        const { username } = req.body;
        const avatarType = req.body.avatarType;

        if (!username) {
            return res
                .status(400)
                .json(createResponse(false, "Username is required", null, 400));
        }

        // Get user from JWT token
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json(
                    createResponse(false, "Authentication required", null, 401)
                );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const connection = await getConnection();

        // Check username availability
        const [existingUser] = await connection.query(
            "SELECT id FROM users WHERE username = ? AND id != ?",
            [username, userId]
        );

        if (existingUser.length > 0) {
            await connection.release();
            return res
                .status(409)
                .json(
                    createResponse(false, "Username already taken", null, 409)
                );
        }

        // Handle avatar
        let avatarUrl = "avatarDefault.png";

        if (avatarType) {
            // Use predefined avatar
            avatarUrl = avatarType;
        } else if (req.files && req.files.avatar) {
            // Handle file upload
            const avatarFile = req.files.avatar;
            const fileName = `avatar_${userId}_${Date.now()}${path.extname(
                avatarFile.name
            )}`;
            const uploadPath = path.join(
                __dirname,
                "../uploads/avatars",
                fileName
            );

            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(__dirname, "../uploads/avatars");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Move the file
            await avatarFile.mv(uploadPath);
            avatarUrl = `/uploads/avatars/${fileName}`;
        }

        // Update user profile
        await connection.query(
            "UPDATE users SET username = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [username, avatarUrl, userId]
        );

        // Get updated user
        const [updatedUser] = await connection.query(
            "SELECT id, email, username, first_name, last_name, avatar_url FROM users WHERE id = ?",
            [userId]
        );

        await connection.release();

        // Generate new token with updated user info
        const newToken = jwt.sign(
            { user: updatedUser[0] },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json(
            createResponse(true, "Profile setup completed", {
                token: newToken,
                user: updatedUser[0]
            })
        );
    } catch (error) {
        console.error("Profile setup error:", error);
        res.status(500).json(
            createResponse(false, "Internal server error", null, 500)
        );
    }
});

// Google authentication routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const { password_hash, ...userWithoutPassword } = req.user;
        const token = jwt.sign(
            { user: userWithoutPassword },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

// Protected route example
router.get("/profile", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json(createResponse(false, "Access token required", null, 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json(createResponse(false, "Invalid token", null, 403));
        }
        res.json(createResponse(true, "Profile data", { user: decoded.user }));
    });
});

export default router;

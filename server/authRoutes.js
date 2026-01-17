// authRoutes.js
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createResponse } from "./helper.js";
import { getConnection } from "./db.js";

const router = express.Router();

// Database helper function
async function findOrCreateUser(profile, provider) {
    const connection = await getConnection();
    try {
        let user;
        const providerIdField = `${provider}_id`;
        const providerId = profile.id;

        // Check if user exists with provider ID
        const [existingUser] = await connection.query(
            `SELECT * FROM users WHERE ${providerIdField} = ?`,
            [providerId]
        );

        if (existingUser.length > 0) {
            user = existingUser[0];
        } else {
            // Check if user exists with email
            const email =
                profile.emails?.[0]?.value || `${profile.id}@${provider}.com`;
            const [usersByEmail] = await connection.query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (usersByEmail.length > 0) {
                // Update existing user with provider ID
                await connection.query(
                    `UPDATE users SET ${providerIdField} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [providerId, usersByEmail[0].id]
                );
                user = { ...usersByEmail[0], [providerIdField]: providerId };
            } else {
                // Create new user
                const name =
                    profile.displayName || profile.name?.givenName || "";
                const [result] = await connection.query(
                    `INSERT INTO users (email, first_name, last_name, ${providerIdField}, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                    [
                        email,
                        name.split(" ")[0] || "",
                        name.split(" ").slice(1).join(" ") || "",
                        providerId
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
                const user = await findOrCreateUser(profile, "google");
                return done(null, user);
            } catch (error) {
                console.error("Google auth error:", error);
                return done(error, null);
            }
        }
    )
);

// Passport Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["id", "emails", "name", "displayName"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await findOrCreateUser(profile, "facebook");
                return done(null, user);
            } catch (error) {
                console.error("Facebook auth error:", error);
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

// Register route
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

        // Insert new user
        const [result] = await connection.query(
            `INSERT INTO users (email, username, first_name, last_name, password_hash, created_at) 
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [email, username, first_name || "", last_name || "", password_hash]
        );

        // Get the created user
        const [newUser] = await connection.query(
            "SELECT id, email, username, first_name, last_name FROM users WHERE id = ?",
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

// Login route
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
        const { username } = req.body;
        let avatar = "avatarDefault.png";

        if (!username) {
            return res
                .status(400)
                .json(createResponse(false, "Username is required", null, 400));
        }

        // Check username availability
        const connection = await getConnection();

        const [existingUser] = await connection.query(
            "SELECT id FROM users WHERE username = ? AND id != ?",
            [username, req.user.id]
        );

        if (existingUser.length > 0) {
            await connection.release();
            return res
                .status(409)
                .json(
                    createResponse(false, "Username already taken", null, 409)
                );
        }

        // Handle avatar (in real implementation, you'd handle file upload)
        if (req.body.avatarType) {
            avatar = req.body.avatarType;
        } else if (req.files && req.files.avatar) {
            // Handle file upload - save file and get path
            const avatarFile = req.files.avatar;
            const fileName = `avatar_${req.user.id}_${Date.now()}${path.extname(
                avatarFile.name
            )}`;
            const uploadPath = path.join(
                __dirname,
                "../uploads/avatars",
                fileName
            );

            await avatarFile.mv(uploadPath);
            avatar = `/uploads/avatars/${fileName}`;
        }

        // Update user profile
        await connection.query(
            "UPDATE users SET username = ?, avatar = ?, profile_setup_completed = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [username, avatar, req.user.id]
        );

        // Get updated user
        const [updatedUser] = await connection.query(
            "SELECT id, email, username, first_name, last_name, avatar, profile_setup_completed FROM users WHERE id = ?",
            [req.user.id]
        );

        await connection.release();

        // Generate new token with updated user info
        const token = jwt.sign(
            { user: updatedUser[0] },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json(
            createResponse(true, "Profile setup completed", {
                token,
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

// Facebook authentication routes
router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
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
    // This should use the authenticateToken middleware
    // For now, using a simple check
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

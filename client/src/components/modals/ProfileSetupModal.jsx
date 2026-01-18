// components/modals/ProfileSetupModal.jsx
import { useState, useEffect } from "react";
import { X, Upload, Dice5, Check, Image as ImageIcon } from "lucide-react";
import Button from "@/components/common/Button";

const ProfileSetupModal = ({ isOpen, onClose, onComplete, user }) => {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatarDefault.png");
  const [customAvatar, setCustomAvatar] = useState(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined avatars
  const predefinedAvatars = [
    "avatarDefault.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
  ];

  // Cute username suggestions
  const cuteUsernames = [
    "FluffyPaws", "WhiskerWonder", "PurrfectCompanion", "PawsomeFriend", 
    "SnuggleBunny", "CuddleBug", "BiscuitMaker", "NoodleDoodle", 
    "MuffinTop", "PancakePaws", "WaffleWhiskers", "DonutDozer",
    "CupcakeCuddler", "SugarPlum", "HoneyBun", "BerrySweet",
    "CloudNinja", "StarDust", "MoonBeam", "SunnySide"
  ];

  // Generate random username
  const generateRandomUsername = () => {
    const randomName = cuteUsernames[Math.floor(Math.random() * cuteUsernames.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    return `${randomName}${randomNumber}`;
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setCustomAvatar(null);
    setCustomAvatarPreview(null);
  };

  // Handle custom avatar upload
  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setCustomAvatar(file);
      setSelectedAvatar("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (username.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('username', username.trim());
      
      if (customAvatar) {
        formData.append('avatar', customAvatar);
      } else if (selectedAvatar) {
        formData.append('avatarType', selectedAvatar);
      }

      // Make API call to update profile
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/setup-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...currentUser,
        username: username.trim(),
        avatar_url: data.user?.avatar_url || selectedAvatar || 'avatarDefault.png',
        avatar: data.user?.avatar_url || selectedAvatar || 'avatarDefault.png', // For backward compatibility
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('token', data.token);

      // Trigger parent callback
      onComplete(updatedUser);
      
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate username on first load
  useEffect(() => {
    if (!username && user?.email) {
      const baseUsername = user.email.split('@')[0];
      setUsername(`${baseUsername}${Math.floor(Math.random() * 99) + 1}`);
    }
  }, [user]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setSelectedAvatar("avatarDefault.png");
      setCustomAvatar(null);
      setCustomAvatarPreview(null);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Remove pinkish bg - use transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="relative bg-white rounded-xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Set up your username and avatar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content - Compact layout */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-4">
            {/* Left: Avatar Section (smaller) */}
            <div className="w-32 space-y-3">
              <label className="block text-xs font-medium text-gray-900">
                Avatar
              </label>
              
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    {customAvatarPreview ? (
                      <img 
                        src={customAvatarPreview} 
                        alt="Avatar Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : selectedAvatar ? (
                      // Updated path - assuming avatars are in public folder
                      <img 
                        src={`/images/avatar/${selectedAvatar}`}
                        alt="Selected Avatar"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${username || 'User'}&background=4f46e5&color=fff`;
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 h-6 w-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomAvatarUpload}
                      className="hidden"
                    />
                    <Upload className="h-3 w-3 text-white" />
                  </label>
                </div>
              </div>

              {/* Predefined Avatars - Smaller grid */}
              <div className="grid grid-cols-3 gap-1">
                {predefinedAvatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`h-8 w-8 rounded-full overflow-hidden border ${
                      selectedAvatar === avatar 
                        ? 'border-primary ring-1 ring-primary/30' 
                        : 'border-gray-300 hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={`/images/avatar/${avatar}`}
                      alt={`Avatar ${avatar}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${avatar}&background=4f46e5&color=fff`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Username Section */}
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-xs font-medium text-gray-900">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                    maxLength={20}
                    minLength={3}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setUsername(generateRandomUsername())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Generate random username"
                  >
                    <Dice5 className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  3-20 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 text-xs py-2"
                  disabled={isLoading}
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-xs py-2"
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
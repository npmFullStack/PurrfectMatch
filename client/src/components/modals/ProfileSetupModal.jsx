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
      setSelectedAvatar(null);
      
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
        avatar: data.avatar || selectedAvatar || 'avatarDefault.png',
        profile_setup_completed: true
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Set up your username and avatar to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              Choose Your Avatar
            </label>
            
            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {customAvatarPreview ? (
                    <img 
                      src={customAvatarPreview} 
                      alt="Avatar Preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : selectedAvatar ? (
                    <img 
                      src={`/assets/images/avatar/${selectedAvatar}`}
                      alt="Selected Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-primary" />
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatarUpload}
                    className="hidden"
                  />
                  <Upload className="h-5 w-5 text-white" />
                </label>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                Click the upload icon to add your own photo
              </p>
            </div>

            {/* Predefined Avatars */}
            <div className="grid grid-cols-5 gap-3">
              {predefinedAvatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`h-16 w-16 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatar 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={`/assets/images/avatar/${avatar}`}
                    alt={`Avatar ${avatar}`}
                    className="h-full w-full object-cover"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Username Section */}
          <div className="space-y-3">
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              Choose a Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                maxLength={20}
                minLength={3}
                required
              />
              <button
                type="button"
                onClick={() => setUsername(generateRandomUsername())}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Generate random username"
              >
                <Dice5 className="h-5 w-5 text-primary" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Username must be 3-20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
            >
              Complete Setup
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center">
            You can always update your profile later from the settings page.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
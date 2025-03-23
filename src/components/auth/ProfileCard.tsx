import { useState, useEffect } from "react";
import axios from "axios";
import { X, Camera } from "lucide-react";

interface ProfileCardProps {
  onClose: () => void;
  onUpdateSuccess: (updatedData: { fullName: string; picture: string }) => void;
  initialData?: {
    id: any;
    fullName?: string;
    picture?: string;
  };
}

export default function ProfileCard({
  onClose,
  onUpdateSuccess,
  initialData = { id: null },
}: ProfileCardProps) {
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [picture, setPicture] = useState(initialData.picture || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        "http://localhost:8080/api/user/update",
        {
          id: initialData.id,
          fullName,
          picture,
        },
        { withCredentials: true }
      );
      setIsLoading(false);
      onUpdateSuccess({ fullName, picture });
      handleCloseWithAnimation();
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to update profile", error);
    }
  };

  const handleCloseWithAnimation = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center backdrop-blur-md bg-black/40 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      onClick={(e) =>
        e.target === e.currentTarget && handleCloseWithAnimation()
      }
    >
      <div
        className={`relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white/90 to-white/80 border border-white/30 transition-all duration-300 transform ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
          }`}
      >
        <div className="absolute -top-3 -right-3">
          <button
            onClick={handleCloseWithAnimation}
            className="rounded-full p-2 bg-white/80 text-gray-600 hover:text-gray-900 hover:bg-white shadow-md transition-all duration-200 hover:scale-105"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Edit Your Profile
        </h2>

        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={picture || "/api/placeholder/150/150"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/150/150";
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="rounded-full p-2 bg-blue-500/80 text-white">
                <Camera size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture URL
            </label>
            <input
              id="profilePicture"
              type="text"
              placeholder="Enter image URL"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none"
            />
          </div>

          <div className="pt-6 flex justify-between items-center space-x-4">
            <button
              onClick={handleCloseWithAnimation}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

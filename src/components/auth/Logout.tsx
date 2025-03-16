import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import ProfileCard from "../ProfileCard";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const { user } = useSelector((state: any) => state.user) || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("useremail");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("classroom-") && key.endsWith("-role")) {
        localStorage.removeItem(key);
      }
    });
    navigate("/");
    try {
      await axios.post(
        `http://localhost:8080/api/logout`,
        {},
        { withCredentials: true }
      );

      dispatch({ type: "CLEAR_USER" });
      console.log("Logged out");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfile = () => {
    setShowProfileCard(true);
  };

  const closeProfileCard = () => {
    setShowProfileCard(false);
  };

  const handleUpdateSuccess = (updatedData: { fullName: string; picture: string }) => {
    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        ...updatedData,
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        {/* Avatar always visible */}
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 cursor-pointer">
            <img
              src={user.picture ? user.picture : "https://avatars.dicebear.com/api/avataaars/.svg"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </Avatar>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content */}
        <DropdownMenuContent className="w-48 bg-white shadow-lg rounded-md">
          <DropdownMenuItem>{user.fullName}</DropdownMenuItem>
          <DropdownMenuItem>{user.email}</DropdownMenuItem>

          <DropdownMenuItem onClick={handleProfile} className="text-blue-700">Edit Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 font-bold">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showProfileCard &&
        createPortal(
          <ProfileCard onClose={closeProfileCard} initialData={user} onUpdateSuccess={handleUpdateSuccess} />,
          document.body
        )}
    </>
  );
}

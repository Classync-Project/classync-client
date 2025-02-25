// import { useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { createPortal } from "react-dom";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import { useNavigate } from "react-router-dom";
// import ProfileCard from "../ProfileCard";

// export default function Logout() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showProfileCard, setShowProfileCard] = useState(false);

//   const { user } = useSelector((state: any) => state.user) || {};

//   const handleLogout = async () => {
//     localStorage.removeItem("useremail");
//     try {
//       await axios.post(
//         `http://localhost:8080/api/logout`,
//         {},
//         { withCredentials: true }
//       );

//       dispatch({ type: "CLEAR_USER" });
//       console.log("Logged out");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleProfile = () => {
//     setShowProfileCard(true);
//   };

//   const closeProfileCard = () => {
//     setShowProfileCard(false);
//   };

//   return (
//     <>
//       <div className="rounded-md p-1 shadow-md">
//         <DropdownMenu>
//           <DropdownMenuTrigger className="flex justify-between items-center">
//             <Avatar className="h-10 w-10 mr-2">
//               <AvatarImage src={user.picture} />
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={handleProfile}>
//               Hello {user.fullName}!
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={handleLogout}
//               className="text-red-500 font-bold"
//             >
//               Logout
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {showProfileCard &&
//         createPortal(
//           <ProfileCard onClose={closeProfileCard} initialData={user} />,
//           document.body
//         )}
//     </>
//   );
// }

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
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../ProfileCard";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const { user } = useSelector((state: any) => state.user) || {};

  const handleLogout = async () => {
    localStorage.removeItem("useremail");
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

  const handleUpdateSuccess = (updatedData: {
    fullName: string;
    picture: string;
  }) => {
    // Update the user data in Redux
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
      <div className="rounded-md p-1 shadow-md">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex justify-between items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={user.picture} />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleProfile}>
              Hello {user.fullName}!
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 font-bold"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showProfileCard &&
        createPortal(
          <ProfileCard
            onClose={closeProfileCard}
            initialData={user}
            onUpdateSuccess={handleUpdateSuccess}
          />,
          document.body
        )}
    </>
  );
}

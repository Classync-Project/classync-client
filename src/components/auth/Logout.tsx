import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Logout() {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user) || {};

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );

      dispatch({ type: "CLEAR_USER" });
      console.log("Logged out");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" rounded-md p-1 shadow-md ">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-between  items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={user.picture} />
            {/* <AvatarFallback>profile  </AvatarFallback> */}
          </Avatar>
          {user.fullName}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
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
  );
}

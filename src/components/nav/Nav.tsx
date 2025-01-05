import { useSelector } from "react-redux";
import NavLink from "../NavLink";
import LoginButton from "../auth/LoginButton";
import Logout from "../auth/Logout";

export default function Nav() {
  const user = useSelector((state: any) => state.user.user) || null;
  const navLinks: Array<{ href: string; text: string }> = [
    { href: "/dashboard", text: "Dashboard" },
    { href: "/courses", text: "Courses" },
    { href: "/tasks", text: "Tasks" },
    { href: "/resources", text: "Resources" },
  ];

  return (
    <div>
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                ClassSync
              </span>
            </div>
            <div className="flex space-x-4 text-gray-300 justify-center items-center">
              {navLinks.map((link, index) => (
                <NavLink key={index} href={link.href}>
                  {link.text}
                </NavLink>
              ))}

              {user ? <Logout /> : <LoginButton />}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

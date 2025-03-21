import { NavLinkType } from "@/types/NavLinkType";
import NavLink from "./NavLink";
import Logout from "./auth/Logout";
import LoginButton from "./auth/LoginButton";
import { useState } from "react";

const Navbar = ({ navLinks, logo, user }: { navLinks: NavLinkType[], logo: React.ReactNode, user: any }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const handleTriggerClick = (modalType: string) => {
        setActiveModal(modalType);
    };

    return (
        <nav className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">{logo}</div>
                    <div className="flex space-x-4 text-gray-300 justify-center items-center">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                href={link.href}
                                className="hover:text-purple-400 transition-colors duration-300"
                            >
                                {link.text}
                            </NavLink>
                        ))}
                        {user && (
                            <div className="flex space-x-2">
                                <button
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                    onClick={() => handleTriggerClick("create")}
                                >
                                    Create Class
                                </button>
                                <button
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                                    onClick={() => handleTriggerClick("join")}
                                >
                                    Join Class
                                </button>
                            </div>
                        )}
                        {user ? <Logout /> : <LoginButton />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

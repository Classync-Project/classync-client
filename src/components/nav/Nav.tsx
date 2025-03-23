import { NavLinkType } from "@/types/NavLinkType";
import NavLink from "./NavLink";
import Logout from "../auth/Logout";
import LoginButton from "../auth/LoginButton";
import CreateClassForm from "../classroom/CreateClassForm";
import JoinClassForm from "../classroom/JoinClassForm";
import Modal from "../common/Modal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
    const user = useSelector((state: any) => state.user.user) || null;
    const useremail = localStorage.getItem("useremail");
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const handleTriggerClick = (modalType: string) => {
        setActiveModal(modalType);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const navLinks: NavLinkType[] = useremail
        ? [
              { href: "/myclasses", text: "Classes" },
              { href: "/calendar", text: "Calendar" },
              { href: "/user-guide", text: "User-Guide" },
          ]
        : [];

    const renderLogo = () => (
        <a
            href="/"
            onClick={(e) => {
                e.preventDefault();
                navigate("/");
            }}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text hover:from-pink-600 hover:to-purple-400 transition-all duration-500 cursor-pointer"
        >
            Classync
        </a>
    );

    return (
        <div>
            <nav className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-900 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">{renderLogo()}</div>
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
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                                        onClick={() => handleTriggerClick("create")}
                                    >
                                        Create Class
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white rounded-lg hover:from-fuchsia-600 hover:to-fuchsia-700 transition-all duration-300 shadow-lg"
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

            {/* Modals */}
            <Modal isOpen={activeModal === "join"} onClose={closeModal} title="Join Classroom">
                <JoinClassForm onClose={closeModal} useremail={useremail} />
            </Modal>

            <Modal isOpen={activeModal === "create"} onClose={closeModal} title="Create Classroom">
                <CreateClassForm onClose={closeModal} useremail={useremail} />
            </Modal>
        </div>
    );
}
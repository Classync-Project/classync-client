import { useSelector } from "react-redux";
import NavLink from "../NavLink";
import LoginButton from "../auth/LoginButton";
import Logout from "../auth/Logout";
import { useState } from "react";

export default function Nav() {
  const user = useSelector((state: any) => state.user.user) || null;
  const navLinks = [
    { href: "/dashboard", text: "Dashboard" },
    { href: "/courses", text: "Courses" },
    { href: "/tasks", text: "Tasks" },
    { href: "/resources", text: "Resources" },
  ];

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleTriggerClick = (className: string) => {
    setActiveModal(className); // Set modal state based on the className of the button
  };

  const closeModal = () => {
    setActiveModal(null);
  };

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

              {user && (
                <div>
                  <button
                    className="trigger-create px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={(e) => handleTriggerClick("create")}
                  >
                    Create Class
                  </button>
                  <button
                    className="trigger-join px-4 py-2 bg-green-500 text-white rounded"
                    onClick={(e) => handleTriggerClick("join")}
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

      {activeModal === "join" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Join Classroom</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const classCode = (e.target as any).classCode.value;
                console.log("Class Code entered:", classCode);
                closeModal();
                // Add logic to handle joining a class using the class code
              }}
            >
              <label className="block mb-2">
                Class Code
                <input
                  type="text"
                  name="classCode"
                  placeholder="Enter class code"
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                  required
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "create" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Create Classroom</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Classroom created!");
                closeModal();
                // Add logic for creating a class
              }}
            >
              <label className="block mb-2">
                Classroom Name
                <input
                  type="text"
                  placeholder="Enter classroom name"
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                  required
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

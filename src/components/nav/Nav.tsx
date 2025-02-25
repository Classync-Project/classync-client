import { useSelector } from "react-redux";
import NavLink from "../NavLink";
import LoginButton from "../auth/LoginButton";
import Logout from "../auth/Logout";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const user = useSelector((state: any) => state.user.user) || null;
  const useremail = localStorage.getItem("useremail"); // Get user email from localStorage
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleTriggerClick = (modalType: string) => {
    setActiveModal(modalType); // Set modal state to either "create" or "join"
  };

  const closeModal = () => {
    setActiveModal(null); // Close any active modal
  };

  // Nav links
  const navLinks = [
    { href: "/dashboard", text: "Dashboard" },
    { href: "/courses", text: "Courses" },
    { href: "/tasks", text: "Tasks" },
    { href: "/resources", text: "Resources" },
  ];

  // Add "My Class" link only if user is logged in
  if (useremail) {
    navLinks.push({ href: "/myclass", text: "My Class" });
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/" // Set href to "/" for the home page
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  navigate("/"); // Navigate to the home page
                }}
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text hover:from-pink-600 hover:to-purple-400 transition-all duration-500 cursor-pointer"
              >
                ClassSync
              </a>
            </div>

            {/* Nav Links and Buttons */}
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

      {/* Join Class Modal */}
      {activeModal === "join" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 rounded-lg p-6 w-96 border border-gray-800 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Join Classroom
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const classCode = (e.target as any).joinClassCode.value;

                try {
                  const response = await axios.post(
                    "http://localhost:8080/api/classrooms/join",
                    {
                      classCode,
                      useremail,
                    },
                    {
                      withCredentials: true,
                    }
                  );

                  if (response.status === 200) {
                    const data = response.data;
                    toast.success(
                      `Successfully joined classroom: "${data.className}"`
                    );
                    navigate(`/classrooms/${data.id}`);
                  }
                } catch (error) {
                  console.error(error);

                  if (axios.isAxiosError(error) && error.response) {
                    const errorMessage =
                      error.response.data.error ||
                      "An error occurred while joining the classroom.";
                    toast.error(errorMessage);
                  } else {
                    toast.error(
                      "An error occurred while joining the classroom."
                    );
                  }
                }
                closeModal();
              }}
            >
              <label className="block mb-4">
                <span className="text-gray-300">Class Code</span>
                <input
                  type="text"
                  name="joinClassCode"
                  placeholder="Enter class code"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {activeModal === "create" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 rounded-lg p-6 w-96 border border-gray-800 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Create Classroom
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const classroomName = (e.target as any).createClassroomName
                  .value;

                try {
                  const response = await axios.post(
                    "http://localhost:8080/api/classrooms/create",
                    {
                      className: classroomName,
                      useremail,
                    },
                    {
                      withCredentials: true,
                    }
                  );

                  if (response.status === 200) {
                    const data = response.data;
                    toast.success(
                      `Classroom "${data.className}" created successfully!`
                    );
                    console.log(data);
                    navigate(`/myclass`);
                  } else {
                    throw new Error("Failed to create classroom.");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error(
                    "An error occurred while creating the classroom."
                  );
                }
                closeModal();
              }}
            >
              <label className="block mb-4">
                <span className="text-gray-300">Classroom Name</span>
                <input
                  type="text"
                  name="createClassroomName"
                  placeholder="Enter classroom name"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
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

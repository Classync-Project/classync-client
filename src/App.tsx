import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import axios from "axios";
import { useDispatch } from "react-redux";
import Nav from "./components/nav/Nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyClasses from "./pages/MyClasses";
import ViewClass from "./pages/ViewClass";
import ViewAssignment from "./pages/ViewAssignment";
import CalendarPage from "./pages/CalendarPage";
import UpdateAssignment from "./pages/UpdateAssignment";
import UserGuide from "./pages/user-guide/user-guide-page";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const dispatch = useDispatch();

  const loadUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
        },
      });

      if (data) {
        localStorage.setItem("useremail", data.email);
        dispatch({ type: "SET_USER", payload: data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-900 font-poppins">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Router>
        <Nav />

        {/* Content Section - Uses flex-grow to push the footer down */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/myclasses" element={<MyClasses />} />
            <Route path="/classrooms/:classroomId" element={<ViewClass />} />
            <Route
              path="/classrooms/:classroomId/assignments/:assignmentId"
              element={<ViewAssignment />}
            />
            <Route
              path="/classrooms/:classroomId/assignments/:assignmentId/edit"
              element={
                <UpdateAssignment onClose={() => { }} onAssignmentUpdated={() => { }} />
              }
            />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
};

export default App;

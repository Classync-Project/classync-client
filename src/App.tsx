import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
// import Profile from './pages/Profile';
// import Navbar from './components/Navbar';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Nav from "./components/nav/Nav";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const loadUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      if (data) {
        console.log(data);
        dispatch({ type: "SET_USER", payload: data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  const { user } = useSelector((state: any) => state.user) || {};

  console.log(user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Router>
        {/* Navbar for navigation */}
        {/* <Navbar /> */}
        <Nav />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/resources" element={<Resources />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;

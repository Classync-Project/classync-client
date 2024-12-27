import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Resources from './pages/Resources';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
// import Profile from './pages/Profile';
// import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar for navigation */}
      {/* <Navbar /> */}

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
  );
};

export default App;

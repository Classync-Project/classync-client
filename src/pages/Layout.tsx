import React from "react";
import { BookOpen, Clock, FolderGit2, Home } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const navLinks = [
    {
      href: "/dashboard",
      text: "Dashboard",
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: "/courses",
      text: "Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    { href: "/tasks", text: "Tasks", icon: <Clock className="w-4 h-4" /> },
    {
      href: "/resources",
      text: "Resources",
      icon: <FolderGit2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B0F17]">
      <nav className="w-full border-b border-gray-800/20 bg-[#0B0F17]">
        <div className="w-full max-w-[2000px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold text-purple-400">ClassSync</span>
            <div className="flex space-x-6 text-gray-400">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 hover:text-purple-400 transition-colors ${
                    currentPage === link.text ? "text-purple-400" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full max-w-[2000px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

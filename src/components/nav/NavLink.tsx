import React from "react";
import { Link } from "react-router-dom";

const NavLink: React.FC<any> = ({ href, children }) => {
  return (
    <Link to={href} className="hover:text-white transition-colors">
      {children}
    </Link>
  );
};

export default NavLink;

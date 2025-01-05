import React from "react";

const NavLink: React.FC<any> = ({ href, children }) => {
  return (
    <a href={href} className="hover:text-white transition-colors">
      {children}
    </a>
  );
};

export default NavLink;

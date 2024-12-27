import React from 'react';
import { NavLinkProps } from '../types/NavlinkProps';

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="hover:text-white transition-colors"
        >
            {children}
        </a>
    );
};

export default NavLink;
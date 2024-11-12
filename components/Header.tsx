import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 relative z-10 shadow-xl">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Commute Davao 3D</div>
        <Link
          href="https://commutedavao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          2D
        </Link>
      </nav>
    </header>
  );
};

export default Header;

import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Commute Davao 3D</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="https://commutedavao.com">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

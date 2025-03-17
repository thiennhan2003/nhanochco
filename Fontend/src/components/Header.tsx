"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-1xl font-bold text-amber-600">
            <Link to="/">World Cuisine</Link>
          </h1>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <nav className="hidden md:flex space-x-9">
          <Link to="/about" className="text-gray-700 hover:text-amber-600 font-medium">
            Giới thiệu
          </Link>
          <Link to="/restaurants" className="text-gray-700 hover:text-amber-600 font-medium">
            Nhà hàng
          </Link>
          <Link to="/posts" className="text-gray-700 hover:text-amber-600 font-medium">
            Bài đăng
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-amber-600 font-medium">
            Liên hệ
          </Link>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-md">
            <nav className="flex flex-col space-y-4">
              <Link to="/about" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Giới thiệu
              </Link>
              <Link to="/restaurants" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Nhà hàng
              </Link>
              <Link to="/posts" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Bài đăng
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Liên hệ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
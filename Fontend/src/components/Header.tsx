import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lấy username và lắng nghe thay đổi localStorage
  useEffect(() => {
    // Hàm cập nhật username từ localStorage
    const updateUsername = () => {
      const storedUsername = localStorage.getItem("username");
      console.log("Header fetched username:", storedUsername || "null");
      setUsername(storedUsername);
    };

    // Gọi lần đầu khi mount
    updateUsername();

    // Lắng nghe sự kiện storage
    window.addEventListener("storage", updateUsername);

    // Dùng setInterval để kiểm tra localStorage (dự phòng cho cùng tab)
    const intervalId = setInterval(updateUsername, 1000); // Kiểm tra mỗi 1s

    // Cleanup
    return () => {
      window.removeEventListener("storage", updateUsername);
      clearInterval(intervalId);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setUsername(null);
    console.log("User logged out");
    navigate("/login");
  };

  console.log("Current username state:", username);

  return (
    <header className="sticky top-0 z-50 bg-[#efe2db] shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#7c160f]">
            <Link to="/">World Cuisine</Link>
          </h1>
        </div>

        <nav className="hidden md:flex space-x-9">
          <Link to="/about" className="text-[#1e0907] hover:text-[#bb6f57] font-medium">
            About
          </Link>
          <Link to="/restaurants" className="text-[#1e0907] hover:text-[#bb6f57] font-medium">
            Restaurants
          </Link>
          <Link to="/menu" className="text-[#1e0907] hover:text-[#bb6f57] font-medium">
            Món ăn
          </Link>
          <Link to="/posts" className="text-[#1e0907] hover:text-[#bb6f57] font-medium">
            Posts
          </Link>
          <Link to="/contact" className="text-[#1e0907] hover:text-[#bb6f57] font-medium">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {username ? (
            <div className="flex items-center space-x-4">
              <span className="text-[#1e0907] font-medium">Xin chào, {username}</span>
              <button
                className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-1" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
            >
              <User className="h-5 w-5 mr-1" /> Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-[#1e0907]" />
          ) : (
            <Menu className="h-6 w-6 text-[#1e0907]" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#efe2db] py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/about"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/restaurants"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
              onClick={toggleMenu}
            >
              Restaurants
            </Link>
            <Link
              to="/menu"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
              onClick={toggleMenu}
            >
              Món ăn
            </Link>
            <Link
              to="/posts"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
              onClick={toggleMenu}
            >
              Posts
            </Link>
            <Link
              to="/contact"
              className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            {username ? (
              <div className="flex flex-col space-y-4">
                <span className="text-[#1e0907] font-medium">Xin chào, {username}</span>
                <button
                  className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5 mr-1" /> Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
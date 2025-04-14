import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const fetchUser = () => {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const userData = JSON.parse(userProfile);
        setUser(userData);
      }
    };

    // Gọi lần đầu khi mount
    fetchUser();

    // Lắng nghe sự kiện storage
    window.addEventListener("storage", fetchUser);

    // Dùng setInterval để kiểm tra localStorage (dự phòng cho cùng tab)
    const intervalId = setInterval(fetchUser, 1000); // Kiểm tra mỗi 1s

    // Cleanup
    return () => {
      window.removeEventListener("storage", fetchUser);
      clearInterval(intervalId);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUser(null);
    navigate("/login");
  };

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
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
              >
                <User className="h-5 w-5 mr-1" /> {user.fullname}
              </Link>
              {user.role === "restaurant_owner" && (
                <Link
                  to="/add-restaurant"
                  className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
                >
                  Thêm nhà hàng
                </Link>
              )}
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
            {user ? (
              <div className="flex flex-col space-y-4">
                <Link
                  to="/profile"
                  className="text-[#1e0907] hover:text-[#bb6f57] font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <User className="h-5 w-5 mr-1" /> {user.fullname}
                </Link>
                {user.role === "restaurant_owner" && (
                  <Link
                    to="/add-restaurant"
                    className="text-[#1e0907] hover:text-[#bb6f57] font-medium"
                    onClick={toggleMenu}
                  >
                    Thêm nhà hàng
                  </Link>
                )}
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
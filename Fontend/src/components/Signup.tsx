import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          active: true,
          avatar: "https://example.com/default-avatar.png",
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      navigate("/login");
    } catch (error: unknown) {
      console.error("Error during login:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#efe2db] px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#7c160f] mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-[#1e0907] text-sm font-bold mb-2">Account Type</label>
            <div className="flex items-center mb-2">
              <input
                className="mr-2 leading-tight"
                type="radio"
                id="customer"
                name="role"
                value="customer"
                checked={formData.role === "customer"}
                onChange={handleChange}
              />
              <label className="text-[#1e0907]" htmlFor="customer">
                Customer
              </label>
            </div>
            <div className="flex items-center">
              <input
                className="mr-2 leading-tight"
                type="radio"
                id="restaurant_owner"
                name="role"
                value="restaurant_owner"
                checked={formData.role === "restaurant_owner"}
                onChange={handleChange}
              />
              <label className="text-[#1e0907]" htmlFor="restaurant_owner">
                Restaurant Owner
              </label>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex flex-col space-y-4">
            <button
              className="w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
            <div className="text-center text-sm text-[#1e0907]">
              Already have an account?
              <Link to="/login" className="text-[#7c160f] font-bold hover:underline ml-1">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

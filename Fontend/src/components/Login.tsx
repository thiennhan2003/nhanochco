"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Login và lấy token
      const loginResponse = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      console.log("Login API response:", loginData); // Log để kiểm tra API

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed");
      }

      if (!loginData.accessToken) {
        throw new Error("No access token received");
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", loginData.accessToken);

      // Step 2: Lấy user profile
      const profileResponse = await fetch("http://localhost:8080/api/v1/auth/get-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();
      console.log("User profile fetched:", profileData); // Log profile

      // Lưu username từ profileData
      if (profileData.username) {
        localStorage.setItem("username", profileData.username);
        console.log("Stored username:", localStorage.getItem("username")); // Log để kiểm tra
      } else {
        console.warn("No username in profile response");
      }

      // Lưu profile vào localStorage
      localStorage.setItem("userProfile", JSON.stringify(profileData));

      // Chuyển hướng đến dashboard
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Error during login process:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#efe2db] px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#7c160f] mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#1e0907] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-[#1e0907] focus:outline-none focus:ring-2 focus:ring-[#bb6f57]"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-4">
            <button
              className="w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="text-center text-sm text-[#1e0907]">
              Don't have an account?
              <a href="/signup" className="text-[#7c160f] font-bold hover:underline ml-1">
                Sign Up
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
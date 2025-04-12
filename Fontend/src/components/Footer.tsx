import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          {/* Left Side */}
          <div className="w-1/2 ml-8">
            <p className="text-xl font-semibold mb-4 text-left ">World Cuisine</p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p>Categories</p>
                <p>Our Restaurant</p>
                <p>New</p>
                <p>Food Service</p>
              </div>
              <div>
                <p>Consumer Care</p>
                <p>Alumni</p>
                <p>Japan</p>
                <p>America</p>
              </div>
            </div>
            <div className="flex space-x-6 mb-2 mt-5">
              <a href="#" className="text-white">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-white">
                <FaPinterest size={24} />
              </a>
              <a href="#" className="text-white">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 mr-8">
            <p className="font-bold mb-4">Get the freshest news</p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Your email here"
                className="w-3/4 p-2 rounded-l-md"
              />
              <button className="w-1/4 bg-red-600 p-2 rounded-r-md">
                Subscribe
              </button>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <p className="text-sm">
                By checking the box, you agree that you are at least 16 years of
                age
              </p>
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-600 mb-4" />
        

        <div className="text-lg">© 2025 World Cuisine. All Rights Reserved.</div>

        <div className="mt-4">
          <a href="#" className="text-white mx-2">
            Website Terms
          </a>
          <span>|</span>
          <a href="#" className="text-white mx-2">
            Privacy Policy
          </a>
          <span>|</span>
          <a href="#" className="text-white mx-2">
            Accessibility Statement
          </a>
          <span>|</span>
          <a href="#" className="text-white mx-2">
            CA Transparency in Supply Chains Act
          </a>
          <span>|</span>
          <a href="#" className="text-white mx-2">
            Supplier Code of Conduct
          </a>
          <span>|</span>
          <a href="#" className="text-white mx-2">
            Do Not Sell My Information
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

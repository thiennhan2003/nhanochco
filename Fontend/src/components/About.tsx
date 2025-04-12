"use client"

import { motion } from "framer-motion";
import { Utensils, Globe, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#efe2db] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#c8907e]/50 blur-3xl" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-[#bb6f57]/40 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-4 px-4 py-1 text-[#7c160f] border border-[#c8907e] bg-[#c8907e]/20 rounded-full">
            Discover
          </div>
          <h2 className="text-5xl font-bold mb-6 text-[#1e0907] tracking-tight">
            About <span className="text-[#7c160f]">World Cuisine</span>
          </h2>
          <div className="w-24 h-1 bg-[#bb6f57] rounded-full mb-6" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content block */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Description paragraphs */}
            <p className="text-[#1e0907] mb-6 text-xl leading-relaxed">
              World Cuisine is a platform that connects food lovers worldwide. We showcase exceptional restaurants from various countries, providing an overview of diverse culinary cultures.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c8907e] hover:shadow-md transition-shadow">
                <Utensils className="h-8 w-8 text-[#7c160f] mb-3" />
                <h3 className="font-semibold text-lg mb-2">Diverse Cuisine</h3>
                <p className="text-[#1e0907]">Explore flavors from around the world</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c8907e] hover:shadow-md transition-shadow">
                <Globe className="h-8 w-8 text-[#7c160f] mb-3" />
                <h3 className="font-semibold text-lg mb-2">Global Culture</h3>
                <p className="text-[#1e0907]">Experience a variety of culinary traditions</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c8907e] hover:shadow-md transition-shadow">
                <Users className="h-8 w-8 text-[#7c160f] mb-3" />
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-[#1e0907]">Share experiences with fellow food enthusiasts</p>
              </div>
            </div>

            {/* Additional description */}
            <p className="text-[#1e0907] mb-6 text-xl leading-relaxed">
              More than just a restaurant directory, World Cuisine is a community where people can share experiences, reviews, and discover new dining spots through posts from other users.
            </p>

            <p className="text-[#1e0907] mb-8 text-xl leading-relaxed">
              Join us on a journey to explore flavors from all over the world and share your passion for food with the community.
            </p>

            {/* Call-to-action button */}
            <button className="px-6 py-3 bg-[#7c160f] hover:bg-[#bb6f57] text-white text-lg font-semibold rounded-lg">
              Explore Now
            </button>
          </motion.div>

          {/* Right content block */}
          <motion.div
            className="lg:w-1/2 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Decorative background for image */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-[#7c160f] rounded-2xl" />
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Restaurant interior"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Operating hours info */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg z-20 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-600">Open Daily</span>
                </div>
                <p className="text-[#1e0907] font-medium">10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

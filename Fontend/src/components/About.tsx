"use client"

import { motion } from "framer-motion"
import { Utensils, Globe, Users } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-orange-100/40 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-4 px-4 py-1 text-amber-700 border border-amber-200 bg-amber-50 rounded-full">
            Khám phá
          </div>
          <h2 className="text-5xl font-bold mb-6 text-gray-800 tracking-tight">
            Về <span className="text-amber-600">World Cuisine</span>
          </h2>
          <div className="w-24 h-1 bg-amber-500 rounded-full mb-6" />
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
            <p className="text-gray-700 mb-6 text-xl leading-relaxed">
              World Cuisine là nền tảng kết nối những người yêu thích ẩm thực trên toàn thế giới. Chúng tôi giới thiệu
              những nhà hàng đặc sắc từ nhiều quốc gia khác nhau, mang đến cho bạn cái nhìn tổng quan về văn hóa ẩm thực
              đa dạng.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <Utensils className="h-8 w-8 text-amber-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Ẩm Thực Đa Dạng</h3>
                <p className="text-gray-600">Khám phá hương vị từ khắp nơi trên thế giới</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <Globe className="h-8 w-8 text-amber-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Văn Hóa Toàn Cầu</h3>
                <p className="text-gray-600">Trải nghiệm văn hóa ẩm thực đa dạng</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <Users className="h-8 w-8 text-amber-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Cộng Đồng</h3>
                <p className="text-gray-600">Chia sẻ trải nghiệm với những người đam mê</p>
              </div>
            </div>

            {/* Additional description */}
            <p className="text-gray-700 mb-6 text-xl leading-relaxed">
              Không chỉ là nơi giới thiệu nhà hàng, World Cuisine còn là cộng đồng nơi mọi người có thể chia sẻ trải
              nghiệm, đánh giá và khám phá những địa điểm ẩm thực mới thông qua bài đăng của người dùng khác.
            </p>

            <p className="text-gray-700 mb-8 text-xl leading-relaxed">
              Hãy tham gia cùng chúng tôi trong hành trình khám phá hương vị từ khắp nơi trên thế giới và chia sẻ niềm
              đam mê ẩm thực của bạn với cộng đồng.
            </p>

            {/* Call-to-action button */}
            <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold rounded-lg">
              Khám Phá Ngay
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
              <div className="absolute -top-4 -left-4 w-full h-full bg-amber-500 rounded-2xl" />
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
                  <span className="text-sm font-medium text-green-600">Mở cửa hàng ngày</span>
                </div>
                <p className="text-gray-700 font-medium">10:00 - 22:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


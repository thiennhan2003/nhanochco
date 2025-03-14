"use client"

import { useState } from "react"
import { Star, MapPin, Phone, Mail, Clock, Menu, X, Heart, MessageCircle, Share2 } from "lucide-react"

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-1xl font-bold text-amber-600">World Cuisine</h1>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-9">
            <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium">
              Giới thiệu
            </a>
            <a href="#restaurants" className="text-gray-700 hover:text-amber-600 font-medium">
              Nhà hàng
            </a>
            <a href="#posts" className="text-gray-700 hover:text-amber-600 font-medium">
              Bài đăng
            </a>
            <a href="#contact" className="text-gray-700 hover:text-amber-600 font-medium">
              Liên hệ
            </a>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-md">
            <nav className="flex flex-col space-y-4">
              <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Giới thiệu
              </a>
              <a href="#restaurants" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Nhà hàng
              </a>
              <a href="#posts" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Bài đăng
              </a>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 font-medium" onClick={toggleMenu}>
                Liên hệ
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {/* Hero Section */}
<section className="relative h-[80vh] w-[90%] mx-auto">
  <img
    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
    alt="Restaurant ambiance"
    className="absolute inset-0 w-full h-full object-cover brightness-50"
  />
  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">World Cuisine</h1>
    <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
      Khám phá ẩm thực từ khắp nơi trên thế giới và chia sẻ trải nghiệm của bạn
    </p>
    <a
      href="#restaurants"
      className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
    >
      Khám phá nhà hàng
    </a>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50 mx-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Về World Cuisine</h2>
              <p className="text-gray-600 mb-5 text-xl">
                World Cuisine là nền tảng kết nối những người yêu thích ẩm thực trên toàn thế giới. Chúng tôi giới thiệu
                những nhà hàng đặc sắc từ nhiều quốc gia khác nhau, mang đến cho bạn cái nhìn tổng quan về văn hóa ẩm
                thực đa dạng.
              </p>
              <p className="text-gray-600 mb-4 text-xl">
                Không chỉ là nơi giới thiệu nhà hàng, World Cuisine còn là cộng đồng nơi mọi người có thể chia sẻ trải
                nghiệm, đánh giá và khám phá những địa điểm ẩm thực mới thông qua bài đăng của người dùng khác.
              </p>
              <p className="text-gray-600 text-xl">
                Hãy tham gia cùng chúng tôi trong hành trình khám phá hương vị từ khắp nơi trên thế giới và chia sẻ niềm
                đam mê ẩm thực của bạn với cộng đồng.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[400px] w-full rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section id="restaurants" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Nhà hàng nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl">
              Khám phá những nhà hàng đặc sắc từ khắp nơi trên thế giới với những món ăn truyền thống và đặc trưng của
              từng vùng miền.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Nhà hàng Ý"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Ý
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">La Trattoria</h3>
                <p className="text-gray-600 mb-4">
                  Nhà hàng Ý truyền thống với các món pasta, pizza và risotto được chế biến theo công thức gia truyền.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-amber-600 mr-1" />
                    <span className="text-gray-600 text-sm">Rome, Ý</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Nhà hàng Nhật"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Nhật Bản
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Sakura Sushi</h3>
                <p className="text-gray-600 mb-4">
                  Nhà hàng Nhật Bản với các món sushi, sashimi tươi ngon và không gian thiết kế theo phong cách truyền
                  thống.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-amber-600 mr-1" />
                    <span className="text-gray-600 text-sm">Tokyo, Nhật Bản</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600 ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Nhà hàng Pháp"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Pháp
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Le Petit Bistro</h3>
                <p className="text-gray-600 mb-4">
                  Nhà hàng Pháp sang trọng với các món ăn tinh tế và rượu vang hảo hạng từ các vùng nổi tiếng của Pháp.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-amber-600 mr-1" />
                    <span className="text-gray-600 text-sm">Paris, Pháp</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600 ml-1">4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="#"
              className="inline-block border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              Xem thêm nhà hàng
            </a>
          </div>
        </div>
      </section>

      {/* User Posts */}
      <section id="posts" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Bài đăng từ cộng đồng</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl">
              Khám phá trải nghiệm ẩm thực của cộng đồng và chia sẻ câu chuyện của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Nguyễn Văn A</p>
                    <p className="text-gray-500 text-sm">2 giờ trước</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Food post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-800 mb-3">
                  Vừa thưởng thức pizza ngon nhất từ trước đến nay tại La Trattoria ở Rome. Lớp vỏ giòn, sốt cà chua
                  tươi và phô mai tan chảy - tuyệt vời!
                </p>
                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center hover:text-amber-600">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>42</span>
                    </button>
                    <button className="flex items-center hover:text-amber-600">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>8</span>
                    </button>
                  </div>
                  <button className="hover:text-amber-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Trần Thị B</p>
                    <p className="text-gray-500 text-sm">1 ngày trước</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Food post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-800 mb-3">
                  Sakura Sushi ở Tokyo là thiên đường cho những ai yêu thích ẩm thực Nhật. Sashimi tươi ngon, không gian
                  đẹp và dịch vụ tuyệt vời. Nhất định phải thử!
                </p>
                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center hover:text-amber-600">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>67</span>
                    </button>
                    <button className="flex items-center hover:text-amber-600">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>12</span>
                    </button>
                  </div>
                  <button className="hover:text-amber-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://randomuser.me/api/portraits/men/67.jpg"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Lê Văn C</p>
                    <p className="text-gray-500 text-sm">3 ngày trước</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Food post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-800 mb-3">
                  Bữa tối lãng mạn tại Le Petit Bistro ở Paris. Món ăn tinh tế, rượu vang tuyệt hảo và không gian sang
                  trọng. Trải nghiệm ẩm thực Pháp đích thực!
                </p>
                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center hover:text-amber-600">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>53</span>
                    </button>
                    <button className="flex items-center hover:text-amber-600">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>9</span>
                    </button>
                  </div>
                  <button className="hover:text-amber-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="#"
              className="inline-block border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              Xem thêm bài đăng
            </a>
          </div>
        </div>
      </section>

      {/* Contact & Share */}
<section id="contact" className="py-16 px-4">
  <div className="container mx-auto px-4 max-w-[1400px]">
    <div className="flex flex-col md:flex-row gap-12">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Liên hệ & Chia sẻ</h2>
        <p className="text-gray-600 mb-8 text-xl">
          Hãy liên hệ với chúng tôi để chia sẻ trải nghiệm ẩm thực của bạn hoặc đề xuất nhà hàng mới cho cộng đồng.
        </p>

        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800 text-xl">Địa chỉ</h3>
              <p className="text-gray-600 text-xl">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800 text-xl">Điện thoại</h3>
              <p className="text-gray-600 text-xl">+84 28 1234 5678</p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800 text-xl">Email</h3>
              <p className="text-gray-600 text-xl">info@worldcuisine.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800 text-xl">Giờ làm việc</h3>
              <p className="text-gray-600 text-xl">Thứ 2 - Chủ nhật: 9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2">
        <form className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Chia sẻ trải nghiệm</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xl">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2 text-xl">
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2 text-xl">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="restaurant" className="block text-gray-700 mb-2 text-xl">
              Tên nhà hàng
            </label>
            <input
              type="text"
              id="restaurant"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Tên nhà hàng bạn muốn chia sẻ"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2 text-xl">
              Địa điểm
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Thành phố, Quốc gia"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="experience" className="block text-gray-700 mb-2 text-xl">
              Trải nghiệm của bạn
            </label>
            <textarea
              id="experience"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Chia sẻ trải nghiệm ẩm thực của bạn..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-700 mb-2 text-xl">
              Hình ảnh
            </label>
            <input
              type="file"
              id="photo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Đăng bài
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* Map */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-[450px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.939016532044!2d106.61994557499509!3d17.499492199566205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3147573611d2cacf%3A0x80aaae3796a92f34!2zTmjDoCBIw6BuZyBDw6FuaCBCueG7k20gxJDhu48!5e1!3m2!1svi!2s!4v1741947473583!5m2!1svi!2s"
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 max-w-[1500px] mx-auto">
  <div className="container mx-auto px-4 max-w-[1400px] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">World Cuisine</h3>
        <p className="text-gray-300 mb-4">
          Khám phá ẩm thực từ khắp nơi trên thế giới và chia sẻ trải nghiệm của bạn với cộng đồng yêu ẩm thực.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-amber-500 transition duration-300">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </a>
          <a href="#" className="text-white hover:text-amber-500 transition duration-300">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
            </svg>
          </a>
          <a href="#" className="text-white hover:text-amber-500 transition duration-300">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Liên kết nhanh</h3>
        <nav className="flex flex-col space-y-2">
          <a href="#about" className="text-gray-300 hover:text-amber-500 transition duration-300">
            Giới thiệu
          </a>
          <a href="#restaurants" className="text-gray-300 hover:text-amber-500 transition duration-300">
            Nhà hàng
          </a>
          <a href="#posts" className="text-gray-300 hover:text-amber-500 transition duration-300">
            Bài đăng
          </a>
          <a href="#contact" className="text-gray-300 hover:text-amber-500 transition duration-300">
            Liên hệ
          </a>
        </nav>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Đăng ký nhận tin</h3>
        <p className="text-gray-300 mb-4">Đăng ký để nhận thông tin về nhà hàng mới và bài đăng nổi bật.</p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Email của bạn"
            className="flex-1 px-4 py-dd rounded-md text-while-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>

    <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400">
      <p>&copy; 2024 World Cuisine. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  )
}

export default App


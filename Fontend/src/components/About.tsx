// components/About.js
function About() {
    return (
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
    );
  }
  
  export default About;
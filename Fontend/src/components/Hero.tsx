import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/autoplay";
import { motion } from "framer-motion";

interface Restaurant {
  name: string;
  image_url: string;
}

interface Post {
  title: string;
  content: string;
  image_url: string;
  user_id?: {
    fullname?: string;
    username?: string;
  };
}

const HomePage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantRes = await axios.get("http://localhost:8080/api/v1/restaurants");
        if (restaurantRes.data?.data?.restaurants) {
          setRestaurants(restaurantRes.data.data.restaurants);
        } else {
          console.error("Invalid restaurant data format");
        }

        const postRes = await axios.get("http://localhost:8080/api/v1/posts");
        if (postRes.data?.data?.posts) {
          setPosts(postRes.data.data.posts);
          console.log("Posts fetched:", postRes.data.data.posts); // Log để kiểm tra
        } else {
          console.error("Invalid post data format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="Hero"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold">Epicurean Explorer</h1>
          <p className="text-xl mt-4">Khám phá ẩm thực từ khắp nơi trên thế giới</p>
          <a href="#restaurants" className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full">
            Khám phá ngay
          </a>
        </div>
      </section>

      {/* Nhà hàng nổi bật */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="my-16 px-6"
      >
        <h2 className="text-3xl font-bold text-center">Top Nhà Hàng Nổi Bật</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg w-80 text-center">
                <img
                  src={restaurant.image_url || "https://via.placeholder.com/150"}
                  className="rounded-lg w-full h-48 object-cover"
                  alt={restaurant.name}
                />
                <h3 className="mt-4 text-xl font-semibold">{restaurant.name}</h3>
              </div>
            ))
          ) : (
            <p>Không có nhà hàng nào để hiển thị.</p>
          )}
        </div>
      </motion.section>

      {/* Món ăn nổi bật */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="my-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Món Ăn Nổi Bật</h2>
        {posts.length >= 3 ? (
          <Swiper
            slidesPerView={3}
            spaceBetween={15}
            loop
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={4000}
            modules={[Autoplay]}
          >
            {posts.map((post, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                <img
                  src={post.image_url || "https://via.placeholder.com/300x200"}
                  className="rounded-lg shadow-md w-[300px] h-[200px] object-cover"
                  alt={`Post ${index}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center">Không đủ bài viết để hiển thị.</p>
        )}
      </motion.section>

      {/* Đánh giá khách hàng */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="my-16 px-6"
      >
        <h2 className="text-3xl font-bold text-center">Đánh Giá Khách Hàng Nổi Bật</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-lg w-80 text-center">
                <img
                  src="https://via.placeholder.com/50" // Dùng placeholder vì API không có avatar
                  className="rounded-full w-16 h-16 mx-auto mb-4"
                  alt={post.user_id?.fullname || "Khách hàng"}
                />
                <p className="italic">"{post.content}"</p>
                <h3 className="mt-2 font-semibold">
                  - {post.user_id?.fullname || "Ẩn danh"}
                </h3>
              </div>
            ))
          ) : (
            <p>Không có bài viết nào để hiển thị.</p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
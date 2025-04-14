"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  _id: string;
  name: string;
  avatar_url: string;
  description?: string;
  category_id?: {
    category_name: string;
  };
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image_url?: string;
  images?: string[];
  user_id?: {
    fullname?: string;
    username?: string;
  };
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  main_image_url: string;
  price: number;
  category_id?: {
    category_name: string;
  };
}

const HomePage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [restaurantRes, postRes, menuRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/restaurants"),
          axios.get("http://localhost:8080/api/v1/posts"),
          axios.get("http://localhost:8080/api/v1/menu_item"),
        ]);

        setRestaurants(restaurantRes.data?.restaurants || []);
        setPosts(postRes.data?.data?.posts || []);
        setMenuItems(menuRes.data?.data?.menu_Item || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPostImageUrl = (post: Post) => {
    return post.image_url || (post.images?.[0] || "https://via.placeholder.com/300x200");
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-3xl font-bold text-center mb-6 text-primary">{title}</h2>
  );

  const Placeholder = ({ count }: { count: number }) => (
    <div className="flex justify-center gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 h-48 w-80 rounded-lg shadow-md"
          ></div>
        ))}
    </div>
  );

  return (
    <div className="w-full bg-gray-50">
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionTitle title="Nhà Hàng Nổi Bật" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              <Placeholder count={4} />
            ) : (showAllRestaurants ? restaurants : restaurants.slice(0, 4)).map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                <img
                  src={
                    restaurant.avatar_url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                  {restaurant.name}
                </h3>
                {restaurant.category_id && (
                  <p className="mt-2 text-sm text-gray-500">
                    {restaurant.category_id.category_name}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
          {!loading && restaurants.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                className="text-primary font-semibold hover:underline"
              >
                {showAllRestaurants ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-primary-light">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionTitle title="Bài Viết Nổi Bật" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <Placeholder count={3} />
            ) : (showAllPosts ? posts : posts.slice(0, 3)).map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <img
                  src={getPostImageUrl(post)}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-700">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {post.content?.slice(0, 100)}...
                </p>
              </div>
            ))}
          </div>
          {!loading && posts.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="text-primary font-semibold hover:underline"
              >
                {showAllPosts ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionTitle title="Món Ăn Nổi Bật" />
          {loading ? (
            <Placeholder count={3} />
          ) : menuItems.length ? (
            <Swiper
              slidesPerView={1}
              spaceBetween={15}
              loop
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="my-8"
            >
              {menuItems.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/menu_item/${item._id}`)}>
                    <img
                      src={item.main_image_url || "https://via.placeholder.com/300x200"}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {item.description.slice(0, 50)}...
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-gray-500">Không đủ món ăn để hiển thị.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

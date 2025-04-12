import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import { Link } from "react-router-dom";

type Restaurant = {
  _id: string;
  name: string;
  image_url: string;
  description: string;
  address: string;
  average_rating: number;
};

type User = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  avatar: string;
};

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [user, setUser] = useState<User | null>(null); // Lưu thông tin người dùng

  // Lấy thông tin người dùng
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage nếu có
        },
      })
      .then((res) => {
        const currentUser = res.data.find(
          (u: User) => u.email === localStorage.getItem("email") // So khớp email
        );
        setUser(currentUser);
      })
      .catch((err) => console.error("Lỗi khi tải thông tin người dùng:", err));
  }, []);

  // Lấy danh sách nhà hàng
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error("Lỗi khi tải nhà hàng:", err));
  }, []);

  return (
    <section id="restaurants" className="py-16 bg-[#efe2db]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e0907]">Nhà Hàng Nổi Bật</h2>
          <p className="text-[#1e0907] max-w-2xl mx-auto text-xl">
            Khám phá những nhà hàng đặc sắc trên toàn thế giới.
          </p>
        </div>

        {/* Hiển thị nút thêm nếu là chủ nhà hàng */}
        {user?.role === "restaurant_owner" && (
          <div className="flex justify-end mb-6">
            <Link to="/RestaurantPostForm">
              <button className="bg-[#7c160f] text-white px-4 py-2 rounded hover:bg-[#1e0907] transition">
                + Thêm Nhà Hàng
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              image={restaurant.image_url}
              alt={restaurant.name}
              country={""} // nếu API không có thì để trống hoặc thêm sau
              name={restaurant.name}
              description={restaurant.description}
              location={restaurant.address}
              rating={restaurant.average_rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Restaurants;

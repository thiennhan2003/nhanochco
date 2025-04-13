import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import { Link } from "react-router-dom";
import noImage from "../assets/no-image.svg";
import RestaurantPostForm from "./RestaurantPostForm"; // Import thêm component RestaurantPostForm

type Category = {
  _id: string;
  category_name: string;
  description: string;
};

type Owner = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  avatar: string;
};

type Restaurant = {
  _id: string;
  owner_id: Owner;
  menu_id: string[];
  name: string;
  address: string;
  phone: number;
  description: string;
  category_id: Category;
  average_rating: number;
  avatar_url: string;
  images: string[];
  comments: any[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentUser, setCurrentUser] = useState<Owner | null>(null);
  const [showForm, setShowForm] = useState(false); // Thêm state để quản lý hiển thị form

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }

    // Lấy danh sách nhà hàng
    const fetchRestaurants = async () => {
      try {
        console.log("Đang tải danh sách nhà hàng...");
        const response = await axios.get("http://localhost:8080/api/v1/restaurants");
        console.log("Dữ liệu nhận được:", response.data);
        
        if (response.data && Array.isArray(response.data.restaurants)) {
          setRestaurants(response.data.restaurants);
          console.log("Đã tải được", response.data.restaurants.length, "nhà hàng");
        } else {
          console.error("Dữ liệu không đúng định dạng:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà hàng:", error);
        if (axios.isAxiosError(error)) {
          console.error("Chi tiết lỗi:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
        }
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section id="restaurants" className="py-16 bg-[#efe2db]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e0907]">Nhà Hàng Nổi Bật</h2>
          <p className="text-[#1e0907] max-w-2xl mx-auto text-xl">
            Khám phá những nhà hàng đặc sắc với nhiều phong cách ẩm thực.
          </p>
          {/* Hiển thị số lượng nhà hàng để debug */}
          <p className="text-sm text-gray-600 mt-2">
            {restaurants.length > 0 
              ? `Đang hiển thị ${restaurants.length} nhà hàng` 
              : "Chưa có nhà hàng nào"}
          </p>
        </div>

        {/* Hiển thị nút thêm và form */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#7c160f] text-white px-4 py-2 rounded hover:bg-[#1e0907] transition"
          >
            {showForm ? "- Ẩn Form" : "+ Thêm Nhà Hàng"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            {currentUser?.role === "restaurant_owner" ? (
              <RestaurantPostForm />
            ) : (
              <p>Bạn không có quyền đăng bài</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants
            .filter((restaurant) => restaurant.is_active)
            .map((restaurant) => (
            <Link 
              key={restaurant._id} 
              to={`/restaurant/${restaurant._id}`}
              className="block hover:transform hover:scale-105 transition-transform duration-300"
            >
              <RestaurantCard
                image={restaurant.avatar_url || restaurant.images[0] || noImage}
                alt={restaurant.name}
                country={restaurant.category_id?.category_name || "Chưa phân loại"}
                name={restaurant.name}
                description={restaurant.description || "Chưa có mô tả"}
                location={restaurant.address}
                rating={restaurant.average_rating || 0}
                phone={restaurant.phone ? restaurant.phone.toString() : undefined}
              />
            </Link>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có nhà hàng nào được thêm vào.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Restaurants;

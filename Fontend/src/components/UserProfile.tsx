import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  active: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  category_id: { category_name: string };
  is_active: boolean;
  avatar_url: string;
  menu_id: { _id: string; name: string; price: number }[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = localStorage.getItem("userProfile");
        if (!userProfile) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        const userData = JSON.parse(userProfile);
        setUser(userData);

        if (userData.role === "restaurant_owner") {
          fetchUserRestaurants(userData._id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchUserRestaurants = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/restaurants?owner_id=${userId}`);
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c160f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e0907] mb-4">Thông Tin Cá Nhân</h1>
          <div className="relative mx-auto mb-6">
            <img
              src={user.avatar}
              alt={user.fullname}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
          <p className="text-[#1e0907] font-semibold text-xl">{user.fullname}</p>
          <p className="text-gray-600">@{user.username}</p>
        </div>

        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-[#1e0907] mb-2">Thông Tin Cơ Bản</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-[#1e0907] font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Vai trò</p>
                <p className="text-[#1e0907] font-medium">
                  {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Ngày tạo tài khoản</p>
                <p className="text-[#1e0907] font-medium">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Trạng thái</p>
                <p className="text-[#1e0907] font-medium">
                  {user.active ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                      Không hoạt động
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {user.role === "restaurant_owner" && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách nhà hàng</h2>
              {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square mb-4">
                        <img
                          src={restaurant.avatar_url || 'https://via.placeholder.com/300'}
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
                        <p className="text-gray-600">{restaurant.address}</p>
                        <p className="text-gray-600">Điện thoại: {restaurant.phone}</p>
                        <p className="text-gray-600">Danh mục: {restaurant.category_id.category_name}</p>
                        <div className="flex items-center text-gray-600">
                          <span className={restaurant.is_active ? 'text-green-500' : 'text-red-500'}>
                            {restaurant.is_active ? 'Đang hoạt động' : 'Đã đóng cửa'}
                          </span>
                        </div>

                        {/* Danh sách món ăn */}
                        {restaurant.menu_id.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Danh sách món ăn</h4>
                            <div className="space-y-2">
                              {restaurant.menu_id.map((menuItem: any) => (
                                <div key={menuItem._id} className="flex justify-between items-center">
                                  <span className="text-gray-600">{menuItem.name}</span>
                                  <span className="text-gray-600 font-medium">{menuItem.price.toLocaleString('vi-VN')} ₫</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-between items-center">
                          <Link
                            to={`/restaurant/${restaurant._id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Xem chi tiết
                          </Link>
                          <Link
                            to={`/edit-restaurant/${restaurant._id}`}
                            className="text-green-500 hover:text-green-700"
                          >
                            Quản lý nhà hàng
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <p>Bạn chưa có nhà hàng nào</p>
                  <Link
                    to="/add-restaurant"
                    className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Thêm nhà hàng mới
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

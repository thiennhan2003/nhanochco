import { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import axios from "axios";
import { Link } from "react-router-dom";
import noImage from "../assets/no-image.svg";
import MenuItemPostForm from "./MenuItemPostForm";
import { MenuItem } from '../types/index';

const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/menu_item");
      if (response.data && response.data.data && response.data.data.menu_Item) {
        setMenuItems(response.data.data.menu_Item);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách món ăn:", error);
    }
  };

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }

    // Lấy danh sách món ăn
    fetchMenuItems();
  }, []);

  return (
    <section id="menu-items" className="py-16 bg-[#efe2db]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e0907]">Danh Sách Món Ăn</h2>
          <p className="text-[#1e0907] max-w-2xl mx-auto text-xl">
            Khám phá những món ăn ngon từ các nhà hàng.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {menuItems.length > 0 
              ? `Đang hiển thị ${menuItems.length} món ăn` 
              : "Chưa có món ăn nào"}
          </p>
        </div>

        {/* Hiển thị nút thêm và form */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#7c160f] text-white px-4 py-2 rounded hover:bg-[#1e0907] transition"
          >
            {showForm ? "- Ẩn Form" : "+ Thêm Món Ăn"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            {currentUser?.role === "restaurant_owner" ? (
              <MenuItemPostForm 
                onClose={() => {
                  setShowForm(false);
                  fetchMenuItems(); // Refresh the list after closing the form
                }} 
              />
            ) : (
              <p>Bạn không có quyền đăng bài</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems
            .map((item) => (
            <Link 
              key={item._id} 
              to={`/menu_item/${item._id}`}
              className="block hover:transform hover:scale-105 transition-transform duration-300"
            >
              <MenuItemCard
                image={item.main_image_url || noImage}
                alt={item.name}
                category={item.category_id?.category_name || "Chưa phân loại"}
                name={item.name}
                description={item.description || "Chưa có mô tả"}
                price={item.price}
              />
            </Link>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có món ăn nào được thêm vào.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuItems;

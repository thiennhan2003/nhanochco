import { useState, useEffect } from "react";
import axios from "axios";
import noImage from "../assets/no-image.svg";

interface Category {
  _id: string;
  category_name: string;
}

const RestaurantPostForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lấy danh sách categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/categoryRestaurant");
        if (response.data && response.data.data && response.data.data.categoryRestaurants) {
          console.log("Danh sách categories:", response.data.data.categoryRestaurants);
          setCategories(response.data.data.categoryRestaurants);
          if (response.data.data.categoryRestaurants.length > 0) {
            setSelectedCategory(response.data.data.categoryRestaurants[0]._id);
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách categories:", err);
        setError("Không thể tải danh sách danh mục. Vui lòng thử lại sau.");
      }
    };

    fetchCategories();
  }, []);

  const checkIsRestaurantOwner = () => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) return false;
    const user = JSON.parse(userProfile);
    return user.role === "restaurant_owner";
  };

  const validateForm = () => {
    if (!name.trim()) return "Vui lòng nhập tên nhà hàng";
    if (!description.trim()) return "Vui lòng nhập mô tả";
    if (!location.trim()) return "Vui lòng nhập địa chỉ";
    if (!phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!/^\d{10,11}$/.test(phone)) return "Số điện thoại không hợp lệ";
    return null;
  };

  const handlePost = async () => {
    if (!checkIsRestaurantOwner()) {
      setError("Bạn cần có quyền chủ nhà hàng để thực hiện chức năng này");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) {
      setError("Vui lòng đăng nhập để thêm nhà hàng");
      return;
    }

    const user = JSON.parse(userProfile);
    const token = localStorage.getItem("token");

    const newRestaurant = {
      owner_id: user._id,
      name: name.trim(),
      address: location.trim(),
      phone: phone.trim(),
      description: description.trim(),
      category_id: selectedCategory,
      image_url: imageUrl || noImage,
      is_active: true,
    };

    try {
      setLoading(true);
      setError(null);
      
      await axios.post(
        "http://localhost:8080/api/v1/restaurants", 
        newRestaurant,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Reload the page after successful addition
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi thêm nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efe2db] py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#1e0907] mb-6">Thêm Nhà Hàng Mới</h2>
        
        {!checkIsRestaurantOwner() && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
            Bạn cần có quyền chủ nhà hàng để có thể đăng bài. Vui lòng liên hệ admin để được cấp quyền.
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Tên nhà hàng *</label>
            <input
              type="text"
              placeholder="Nhập tên nhà hàng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mô tả *</label>
            <textarea
              placeholder="Mô tả về nhà hàng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Địa chỉ *</label>
            <input
              type="text"
              placeholder="Địa chỉ nhà hàng"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Số điện thoại *</label>
            <input
              type="tel"
              placeholder="Số điện thoại liên hệ"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">URL Hình ảnh</label>
            <input
              type="text"
              placeholder="Link hình ảnh nhà hàng"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Danh mục *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePost}
            disabled={loading}
            className="w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Thêm Nhà Hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPostForm;

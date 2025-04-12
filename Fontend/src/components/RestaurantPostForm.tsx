import { useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth"; // để lấy owner_id

const RestaurantPostForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // owner_id từ người dùng đăng nhập

  const handlePost = async () => {
    if (!name || !description || !location || !user?._id) return;

    const newRestaurant = {
      owner_id: user._id,
      name,
      address: location,
      phone: "0909090909", // bạn có thể thêm field để nhập
      description,
      category_id: "67d2cbb1b3985423bcdcf188", // có thể cho chọn category
      average_rating: 4.5,
      image_url: "https://via.placeholder.com/150",
      is_active: true,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/restaurants", newRestaurant);
      alert("Thêm nhà hàng thành công!");
      setName("");
      setDescription("");
      setLocation("");
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      alert("Đã xảy ra lỗi khi thêm nhà hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#efe2db] p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1e0907] mb-4">Thêm Nhà Hàng</h2>
      <input
        type="text"
        placeholder="Tên nhà hàng"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md focus:ring-2 focus:ring-[#7c160f]"
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f]"
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f]"
      />
      <button
        onClick={handlePost}
        disabled={loading}
        className="w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded-md mt-4 transition duration-300"
      >
        {loading ? "Đang gửi..." : "Thêm Nhà Hàng"}
      </button>
    </div>
  );
};

export default RestaurantPostForm;

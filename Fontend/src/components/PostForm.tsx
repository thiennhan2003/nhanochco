import { useState, useEffect } from "react";
import axios from "axios";

interface PostFormProps {
  onAddPost: (post: {
    title: string;
    content: string;
    images: string[];
    restaurant_id?: string;
  }) => void;
  onClose: () => void;
}

interface Restaurant {
  _id: string;
  name: string;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách nhà hàng
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/restaurants");
        if (response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        } else {
          setError("Không có nhà hàng nào!");
        }
      } catch (err) {
        setError("Lỗi khi tải danh sách nhà hàng");
      }
    };
    fetchRestaurants();
  }, []);

  // Upload ảnh
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = `http://localhost:3001/uploads/${response.data.filename}`;
      setImageUrls((prev) => [...prev, imageUrl]);
    } catch (err) {
      setError("Không thể upload ảnh!");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => handleImageUpload(file));
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Vui lòng điền tiêu đề và nội dung!");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

      if (!token || !userProfile._id) {
        setError("Vui lòng đăng nhập!");
        return;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        images: imageUrls,
        user_id: userProfile._id,
        restaurant_id: restaurantId || undefined,
      };

      const response = await axios.post("http://localhost:8080/api/v1/posts", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });


      setTitle("");
      setContent("");
      setImageUrls([]);
      setImageFiles([]);
      setRestaurantId("");
      onClose();
      window.location.reload();
    } catch (err) {
      setError("Không thể đăng bài!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Tạo bài viết mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Nội dung"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              disabled={isLoading}
            >
              <option value="">Chọn nhà hàng (tùy chọn)</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
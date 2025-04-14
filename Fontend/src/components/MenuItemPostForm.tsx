import React, { useState, useEffect } from "react";
import axios from "axios";
import { MenuItem, Category } from '../types/index';

interface MenuItemPostFormProps {
  onClose: () => void;
}

const MenuItemPostForm: React.FC<MenuItemPostFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    main_image_url: "",
    main_image_file: null as File | null,
    additional_images: [] as string[],
    additional_image_files: [] as File[],
    category_id: ""
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/categoryMenuItem");
        if (response.data && response.data.data && response.data.data.categoryMenuItems) {
          setCategories(response.data.data.categoryMenuItems);
          if (response.data.data.categoryMenuItems.length > 0) {
            setFormData(prev => ({
              ...prev,
              category_id: response.data.data.categoryMenuItems[0]._id
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setError("Không thể tải danh sách danh mục. Vui lòng thử lại sau.");
      }
    };

    fetchCategories();
  }, []);

  // Xử lý upload ảnh
  const handleImageUpload = async (file: File, isMainImage: boolean) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const uploadedFilename = response.data.filename;
      const imageUrl = `http://localhost:3001/uploads/${uploadedFilename}`;

      if (isMainImage) {
        setFormData(prev => ({
          ...prev,
          main_image_url: imageUrl,
          main_image_file: file
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, imageUrl],
          additional_image_files: [...prev.additional_image_files, file]
        }));
      }
      setError(null);
    } catch (err: any) {
      console.error("Lỗi khi upload ảnh:", err);
      if (err.response) {
        setError(`Lỗi server: ${err.response.data.message || 'Không xác định'}`);
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError(`Lỗi: ${err.message}`);
      }
    }
  };

  // Xử lý khi chọn file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (isMainImage) {
      if (files.length > 0) {
        handleImageUpload(files[0], true);
      }
    } else {
      // Lọc bỏ các file không phải ảnh
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      validFiles.forEach(file => handleImageUpload(file, false));
    }
  };

  // Xóa ảnh
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index),
      additional_image_files: prev.additional_image_files.filter((_, i) => i !== index)
    }));
  };

  // Xóa ảnh chính
  const handleRemoveMainImage = () => {
    setFormData(prev => ({
      ...prev,
      main_image_url: "",
      main_image_file: null
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const user = JSON.parse(userProfile);
      const restaurantId = user.restaurant_id;

      // Kiểm tra xem có ảnh chính không
      if (!formData.main_image_url) {
        setError("Vui lòng chọn ảnh chính cho món ăn");
        return;
      }

      // Kiểm tra xem có danh mục không
      if (!formData.category_id) {
        setError("Vui lòng chọn danh mục cho món ăn");
        return;
      }

      const response = await axios.post("http://localhost:8080/api/v1/menu_item", {
        ...formData,
        restaurant_id: restaurantId
      });

      console.log("Đã thêm món ăn thành công:", response.data);
      onClose(); // Close the form
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      setError("Có lỗi khi thêm món ăn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-[#1e0907] mb-4">Thêm Món Ăn Mới</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Tên món ăn *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Mô tả
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Giá tiền *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
          required
          min="0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Ảnh chính *
        </label>
        <div className="flex items-center gap-4">
          {formData.main_image_url ? (
            <div className="relative">
              <img
                src={formData.main_image_url}
                alt="Ảnh chính"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                onClick={handleRemoveMainImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, true)}
                className="hidden"
                id="mainImageUpload"
              />
              <label
                htmlFor="mainImageUpload"
                className="bg-[#7c160f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1e0907]"
              >
                Chọn ảnh chính
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Ảnh phụ
        </label>
        <div className="flex flex-wrap gap-4">
          {formData.additional_images.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Ảnh phụ ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, false)}
              className="hidden"
              id="additionalImagesUpload"
            />
            <label
              htmlFor="additionalImagesUpload"
              className="bg-[#7c160f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1e0907]"
            >
              Chọn ảnh phụ
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#1e0907] text-sm font-medium mb-2">
          Danh mục *
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-[#1e0907] border border-[#1e0907] rounded hover:bg-[#1e0907] hover:text-white transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#1e0907] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? "Đang thêm..." : "Thêm món ăn"}
        </button>
      </div>
    </form>
  );
};

export default MenuItemPostForm;

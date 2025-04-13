import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  _id: string;
  category_name: string;
}

const RestaurantPostForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Xử lý upload ảnh
  const handleImageUpload = async (file: File, isAvatar: boolean) => {
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
      
      // Xây dựng URL hoàn chỉnh cho ảnh
      const uploadedFilename = response.data.filename;
      const imageUrl = `http://localhost:3001/uploads/${uploadedFilename}`;

      if (isAvatar) {
        setAvatarUrl(imageUrl);
        setError(null);
      } else {
        setImageUrls(prev => [...prev, imageUrl]);
        setError(null);
      }
      console.log('Upload thành công:', response.data);
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
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isAvatar: boolean) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (isAvatar) {
      setAvatarFile(files[0]);
      handleImageUpload(files[0], true);
    } else {
      // Lọc bỏ các file không phải ảnh
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      setImageFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => handleImageUpload(file, false));
    }
  };

  // Xóa ảnh
  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Xóa avatar
  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    setAvatarFile(null);
  };

  const checkIsRestaurantOwner = () => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) return false;
    const user = JSON.parse(userProfile);
    return user.role === "restaurant_owner";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập tên nhà hàng";
    }

    if (!description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    if (!location.trim()) {
      newErrors.location = "Vui lòng nhập địa chỉ";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0\d{9}|\+84\d{9})$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = "Số điện thoại không hợp lệ (ví dụ: 0987654321 hoặc +84987654321)";
    }

    if (!avatarUrl) {
      newErrors.avatar = "Vui lòng chọn ảnh đại diện";
    }

    if (!selectedCategory) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi gửi form
  const handlePost = async () => {
    if (!checkIsRestaurantOwner()) {
      setError("Bạn cần có quyền chủ nhà hàng để thực hiện chức năng này");
      return;
    }

    if (!validateForm()) {
      setError("Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) {
      setError("Vui lòng đăng nhập để thêm nhà hàng");
      return;
    }

    const user = JSON.parse(userProfile);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/restaurants",
        {
          owner_id: user._id,
          name,
          description,
          address: location,
          phone: phone.replace(/\D/g, ''), // Send as string
          category_id: selectedCategory,
          avatar_url: avatarUrl,
          images: imageUrls,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.statusCode === 201) {
        window.location.reload();
      } else {
        setError("Đã xảy ra lỗi khi thêm nhà hàng");
      }
    } catch (err: any) {
      console.error("Lỗi khi thêm nhà hàng:", err);
      if (err.response) {
        setError(err.response.data.message || "Đã xảy ra lỗi");
        console.error("Response data:", err.response.data);
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Thêm Nhà Hàng</h2>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Tên Nhà Hàng *</label>
          <input
            type="text"
            placeholder="Nhập tên nhà hàng"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: '' }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Mô tả *</label>
          <textarea
            placeholder="Mô tả về nhà hàng"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: '' }));
            }}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Địa chỉ *</label>
          <input
            type="text"
            placeholder="Địa chỉ nhà hàng"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrors(prev => ({ ...prev, location: '' }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Số điện thoại *</label>
          <input
            type="tel"
            placeholder="Số điện thoại liên hệ"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPhone(value);
              setErrors(prev => ({ ...prev, phone: '' }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Ảnh đại diện *</label>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveAvatar}
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
                  id="avatarUpload"
                />
                <label
                  htmlFor="avatarUpload"
                  className="bg-[#7c160f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#bb6f57]"
                >
                  Chọn ảnh đại diện
                </label>
              </div>
            )}
          </div>
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Ảnh nhà hàng</label>
          <div className="flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
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
                id="imagesUpload"
              />
              <label
                htmlFor="imagesUpload"
                className="bg-[#7c160f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#bb6f57]"
              >
                Chọn ảnh nhà hàng
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Danh mục *</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setErrors(prev => ({ ...prev, category: '' }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7c160f] focus:border-transparent ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category_name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
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
  );
};

export default RestaurantPostForm;

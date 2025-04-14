import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUtensils, FaBuilding, FaPlus, FaEdit, FaImage, FaTrash } from 'react-icons/fa';

interface Category {
  _id: string;
  category_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Owner {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  main_image_url: string;
  additional_images: string[];
}

interface Restaurant {
  _id: string;
  owner_id: Owner;
  name: string;
  address: string;
  phone: number;
  description: string;
  category_id: Category;
  avatar_url: string;
  images: string[];
  menu_id: MenuItem[];
  is_active: boolean;
  average_rating: number;
  createdAt: string;
  updatedAt: string;
}

const RestaurantEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantCategories, setRestaurantCategories] = useState<Category[]>([]);
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    main_image: null as File | null,
    additional_images: [] as File[],
  });
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    category_id: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);

  // Xử lý upload ảnh
  const handleImageUpload = async (file: File, isAvatar: boolean, isMenuImage: boolean = false) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFilename = response.data.filename;
      const imageUrl = `http://localhost:3001/uploads/${uploadedFilename}`;

      if (isMenuImage) {
        if (isAvatar) { // Used to differentiate main_image
          setMainImageUrl(imageUrl);
        } else {
          setAdditionalImageUrls(prev => [...prev, imageUrl]);
        }
      } else {
        if (isAvatar) {
          setAvatarUrl(imageUrl);
        } else {
          setImageUrls(prev => [...prev, imageUrl]);
        }
      }
      setError(null);
      return imageUrl;
    } catch (err: any) {
      console.error('Lỗi khi upload ảnh:', err);
      setError(err.response?.data?.message || 'Không thể upload ảnh');
      return null;
    }
  };

  // Xử lý khi chọn file cho nhà hàng
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isAvatar: boolean) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (isAvatar) {
      const file = files[0];
      setAvatarFile(file);
      handleImageUpload(file, true);

      const reader = new FileReader();
      reader.onload = e => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      setImageFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => handleImageUpload(file, false));
    }
  };

  // Xử lý khi chọn file cho món ăn
  const handleMenuFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'main' | 'additional'
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (type === 'main') {
      const file = files[0];
      setMenuFormData(prev => ({ ...prev, main_image: file }));
      handleImageUpload(file, true, true);

      const reader = new FileReader();
      reader.onload = e => setMainImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      setMenuFormData(prev => ({ ...prev, additional_images: validFiles }));
      validFiles.forEach(file => {
        handleImageUpload(file, false, true);
        const reader = new FileReader();
        reader.onload = e => {
          setAdditionalImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Xóa ảnh nhà hàng
  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Xóa avatar nhà hàng
  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // Xóa ảnh món ăn
  const handleRemoveMenuImage = (type: 'main' | 'additional', index?: number) => {
    if (type === 'main') {
      setMainImagePreview(null);
      setMainImageUrl('');
      setMenuFormData(prev => ({ ...prev, main_image: null }));
    } else if (index !== undefined) {
      setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
      setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
      setMenuFormData(prev => ({
        ...prev,
        additional_images: prev.additional_images.filter((_, i) => i !== index),
      }));
    }
  };

  // Load restaurant và categories
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get<{ data: Restaurant }>(
          `http://localhost:8080/api/v1/restaurants/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data.data;
        console.log('Restaurant data:', data);
        setRestaurant({ ...data });
        setRestaurantFormData({
          name: data.name,
          address: data.address,
          phone: data.phone.toString(),
          description: data.description,
          category_id: data.category_id._id,
        });
        setAvatarUrl(data.avatar_url);
        setImageUrls(data.images || []);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin nhà hàng');
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRestaurantCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get<{ data: { categoryRestaurants: Category[] } }>(
          'http://localhost:8080/api/v1/categoryRestaurant',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Restaurant categories response:', response.data);
        setRestaurantCategories(response.data.data.categoryRestaurants);
      } catch (err: any) {
        console.error('Error fetching restaurant categories:', err.response?.data || err.message);
        setError('Không thể tải danh mục nhà hàng');
      }
    };

    const fetchMenuCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get<{ data: { categoryMenuItems: Category[] } }>(
          'http://localhost:8080/api/v1/categoryMenuItem',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Menu categories response:', response.data);
        setMenuCategories(response.data.data.categoryMenuItems);
      } catch (err: any) {
        console.error('Error fetching menu categories:', err.response?.data || err.message);
        setError('Không thể tải danh mục món ăn');
      }
    };

    fetchRestaurant();
    fetchRestaurantCategories();
    fetchMenuCategories();
  }, [id]);

  const handleRestaurantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Restaurant input change: ${name} = ${value}`);
    setRestaurantFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Menu input change: ${name} = ${value}`);
    setMenuFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const response = await axios.get<{ data: Restaurant }>(
        `http://localhost:8080/api/v1/restaurants/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data;
      console.log('Fetched restaurant:', data);
      setRestaurant({ ...data });
      setRestaurantFormData({
        name: data.name,
        address: data.address,
        phone: data.phone.toString(),
        description: data.description,
        category_id: data.category_id._id,
      });
      setAvatarUrl(data.avatar_url);
      setImageUrls(data.images || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin nhà hàng');
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không có token. Vui lòng đăng nhập lại.');
        return;
      }

      const data = {
        name: restaurantFormData.name,
        address: restaurantFormData.address,
        phone: restaurantFormData.phone,
        description: restaurantFormData.description,
        category_id: restaurantFormData.category_id,
        avatar_url: avatarUrl,
        images: imageUrls,
        is_active: restaurant?.is_active || true,
      };

      console.log('Restaurant JSON Data:', data);

      const response = await axios.put(`http://localhost:8080/api/v1/restaurants/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Restaurant PUT Response:', response.data);

      await fetchRestaurant();

      setAvatarPreview(null);
      setAvatarFile(null);
      setImageFiles([]);
      setError(null);
      alert('Cập nhật nhà hàng thành công!');
    } catch (err: any) {
      console.error('Error updating restaurant:', err);
      console.log('Error Response:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể cập nhật thông tin nhà hàng');
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token');
  
      if (!menuFormData.name || !menuFormData.description || !menuFormData.price) {
        setError('Vui lòng điền đầy đủ tên, mô tả và giá món ăn');
        return;
      }
      if (!id) {
        setError('Không tìm thấy ID nhà hàng');
        return;
      }
  
      const price = Number(menuFormData.price);
      if (isNaN(price)) {
        setError('Giá món ăn phải là một số hợp lệ');
        return;
      }
  
      const data = {
        name: menuFormData.name,
        description: menuFormData.description,
        price,
        category_id: menuFormData.category_id,
        restaurant_id: id,
        main_image_url: mainImageUrl || '',
        additional_images: additionalImageUrls,
      };
  
      console.log('Submitting menu item data:', data);
  
      const response = await axios.post('http://localhost:8080/api/v1/menu_item', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Menu item add response:', response.data);
  
      await fetchRestaurant();
  
      setShowAddMenuForm(false);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        main_image: null,
        additional_images: [],
      });
      setMainImagePreview(null);
      setAdditionalImagePreviews([]);
      setMainImageUrl('');
      setAdditionalImageUrls([]);
      setError(null);
    } catch (err: any) {
      console.error('Error adding menu item:', err);
      console.log('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể thêm món ăn. Vui lòng thử lại.');
    }
  };
  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token');
  
      // Kiểm tra dữ liệu
      if (!menuFormData.name || !menuFormData.description || !menuFormData.price) {
        setError('Vui lòng điền đầy đủ tên, mô tả và giá món ăn');
        return;
      }
  
      const formData = new FormData();
      formData.append('name', menuFormData.name);
      formData.append('description', menuFormData.description);
      formData.append('price', menuFormData.price);
      formData.append('category_id', menuFormData.category_id);
  
      if (mainImageUrl) {
        formData.append('main_image_url', mainImageUrl);
      } else if (selectedMenuItem?.main_image_url) {
        formData.append('main_image_url', selectedMenuItem.main_image_url);
      }
  
      if (additionalImageUrls.length > 0) {
        additionalImageUrls.forEach((url, index) => {
          formData.append(`additional_images[${index}]`, url);
        });
      } else if ((selectedMenuItem?.additional_images?.length ?? 0) > 0) {
        selectedMenuItem!.additional_images.forEach((url, index) => {
          formData.append(`additional_images[${index}]`, url);
        });
      }
  
      console.log('Updating menu item data:', {
        name: menuFormData.name,
        description: menuFormData.description,
        price: menuFormData.price,
        category_id: menuFormData.category_id,
        main_image_url: mainImageUrl || selectedMenuItem?.main_image_url,
        additional_images: additionalImageUrls.length
          ? additionalImageUrls
          : selectedMenuItem?.additional_images,
      });
  
      const response = await axios.put(
        `http://localhost:8080/api/v1/menu_item/${selectedMenuItem?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Menu item update response:', response.data);
  
      await fetchRestaurant();
  
      setSelectedMenuItem(null);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        main_image: null,
        additional_images: [],
      });
      setMainImagePreview(null);
      setAdditionalImagePreviews([]);
      setMainImageUrl('');
      setAdditionalImageUrls([]);
      setError(null);
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật món ăn');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  if (!restaurant) {
    return <div className="flex justify-center items-center min-h-screen">Không tìm thấy nhà hàng</div>;
  }

  console.log('Rendering restaurant:', restaurant);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{restaurant?.name}</h1>
              <p className="text-gray-600">Địa chỉ: {restaurant?.address}</p>
              <p className="text-gray-600">Điện thoại: {restaurant?.phone}</p>
              <p className="text-gray-600">
                Danh mục: {restaurant?.category_id?.category_name || 'Không xác định'}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex space-x-4">
                <button
                  onClick={handleEditRestaurant}
                  className="px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57] flex items-center"
                >
                  <FaEdit className="mr-1" /> Lưu thay đổi
                </button>
                <Link
                  to="/profile"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Quay lại
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chỉnh sửa thông tin nhà hàng</h2>
            <form onSubmit={handleEditRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà hàng</label>
                <input
                  type="text"
                  name="name"
                  value={restaurantFormData.name}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={restaurantFormData.address}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={restaurantFormData.phone}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  required
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
  <textarea
    name="description"
    value={menuFormData.description}
    onChange={handleMenuInputChange}
    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
    rows={3}
    required // Thêm required để bắt buộc nhập mô tả
  />
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                {restaurantCategories.length === 0 ? (
                  <p className="text-red-600">Không có danh mục nào. Vui lòng kiểm tra lại.</p>
                ) : (
                  <select
                    name="category_id"
                    value={restaurantFormData.category_id}
                    onChange={handleRestaurantInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {restaurantCategories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileSelect(e, true)}
                    className="hidden"
                    id="avatar"
                  />
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
                  >
                    <FaImage className="mr-2" /> Chọn ảnh
                  </label>
                  {avatarPreview && (
                    <div className="mt-2 relative">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh nhà hàng</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handleFileSelect(e, false)}
                    className="hidden"
                    id="additional-images"
                  />
                  <label
                    htmlFor="additional-images"
                    className="cursor-pointer px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
                  >
                    <FaImage className="mr-2" /> Chọn ảnh
                  </label>
                </div>
                {imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Additional ${index}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quản lý thực đơn</h2>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddMenuForm(true)}
                className="px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57] flex items-center"
              >
                <FaPlus className="mr-2" /> Thêm món ăn
              </button>
            </div>

            {showAddMenuForm && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">
      {selectedMenuItem ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
    </h3>
    <form
      onSubmit={selectedMenuItem ? handleEditMenuItem : handleAddMenu}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
        <input
          type="text"
          name="name"
          value={menuFormData.name}
          onChange={handleMenuInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          name="description"
          value={menuFormData.description}
          onChange={handleMenuInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
        <input
          type="number"
          name="price"
          value={menuFormData.price}
          onChange={handleMenuInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
        {menuCategories.length === 0 ? (
          <p className="text-red-600">Không có danh mục nào. Vui lòng kiểm tra lại.</p>
        ) : (
          <select
            name="category_id"
            value={menuFormData.category_id}
            onChange={handleMenuInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
            required
          >
            <option value="">Chọn danh mục</option>
            {menuCategories.map(category => (
              <option key={category._id} value={category._id}>
                {category.category_name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chính</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={e => handleMenuFileChange(e, 'main')}
            className="hidden"
            id="main-image"
          />
          <label
            htmlFor="main-image"
            className="cursor-pointer px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
          >
            <FaImage className="mr-2" /> Chọn ảnh
          </label>
        </div>
        {mainImagePreview && (
          <div className="mt-2 relative">
            <img
              src={mainImagePreview}
              alt="Main Image Preview"
              className="w-32 h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveMenuImage('main')}
              className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
            >
              <FaTrash size={12} />
            </button>
          </div>
        )}
        {selectedMenuItem?.main_image_url && !mainImagePreview && (
          <div className="mt-2 relative">
            <img
              src={selectedMenuItem.main_image_url}
              alt="Current Main Image"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh phụ</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleMenuFileChange(e, 'additional')}
            className="hidden"
            id="additional dietary-images-menu"
          />
          <label
            htmlFor="additional-images-menu"
            className="cursor-pointer px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
          >
            <FaImage className="mr-2" /> Chọn ảnh
          </label>
        </div>
        {(additionalImagePreviews.length > 0 || (selectedMenuItem?.additional_images?.length ?? 0) > 0) && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {additionalImagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative">
                <img
                  src={preview}
                  alt={`Additional ${index}`}
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMenuImage('additional', index)}
                  className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
            {selectedMenuItem?.additional_images?.map((url, index) =>
              !additionalImagePreviews[index] ? (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Existing Additional ${index}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={() => {
            setShowAddMenuForm(false);
            setMenuFormData({
              name: '',
              description: '',
              price: '',
              category_id: '',
              main_image: null,
              additional_images: [],
            });
            setSelectedMenuItem(null);
            setMainImagePreview(null);
            setAdditionalImagePreviews([]);
            setMainImageUrl('');
            setAdditionalImageUrls([]);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
        >
          {selectedMenuItem ? 'Cập nhật' : 'Thêm món ăn'}
        </button>
      </div>
    </form>
  </div>
)}

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách món ăn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurant?.menu_id?.map(item => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMenuItem(item);
                            setMenuFormData({
                              name: item.name,
                              description: item.description,
                              price: item.price.toString(),
                              category_id: item.category_id,
                              main_image: null,
                              additional_images: [],
                            });
                            setMainImageUrl(item.main_image_url);
                            setAdditionalImageUrls(item.additional_images);
                            setShowAddMenuForm(true);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-800"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-gray-600 mb-2">Giá: {item.price} VND</p>
                    {item.main_image_url && (
                      <img
                        src={item.main_image_url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantEdit;
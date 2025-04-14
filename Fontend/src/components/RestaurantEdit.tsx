import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUtensils, FaBuilding, FaPlus, FaEdit, FaImage } from 'react-icons/fa';

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
  owner_id: Owner
  name: string;
  address: string;
  phone: number;
  description: string;
  category_id: Category;
  avatar_url: string;
  menu_id: MenuItem[];
  is_active: boolean;
  average_rating: number;
  createdAt: string;
  updatedAt: string;
}

const RestaurantEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    main_image: null as File | null,
    additional_images: [] as File[]
  });
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    category_id: '',
    avatar: null as File | null
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ data: Restaurant }>(`http://localhost:8080/api/v1/restaurants/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = response.data.data;
        setRestaurant(data);
        setRestaurantFormData({
          name: data.name,
          address: data.address,
          phone: data.phone.toString(),
          description: data.description,
          category_id: data.category_id._id,
          avatar: null
        });
      } catch (err) {
        setError('Không thể tải thông tin nhà hàng');
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRestaurant();
  }, [id]);

  const handleRestaurantInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenuFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không có token. Vui lòng đăng nhập lại.');
        return;
      }
  
      // Tạo FormData từ dữ liệu nhập vào
      const formData = new FormData();
      formData.append('owner_id', restaurant?.owner_id._id || '');
      formData.append('name', restaurantFormData.name);
      formData.append('address', restaurantFormData.address);
      formData.append('phone', restaurantFormData.phone);
      formData.append('description', restaurantFormData.description);
      formData.append('category_id', restaurantFormData.category_id);
      formData.append('average_rating', restaurant?.average_rating?.toString() || '0');
      formData.append('is_active', restaurant?.is_active?.toString() || 'true');
  
      // Thêm avatar nếu có
      if (restaurantFormData.avatar) {
        formData.append('avatar_url', restaurantFormData.avatar);
      }
  
      // Log dữ liệu gửi lên để debug
      console.log('Dữ liệu gửi lên API:', {
        owner_id: restaurant?.owner_id._id,
        name: restaurantFormData.name,
        address: restaurantFormData.address,
        phone: restaurantFormData.phone,
        description: restaurantFormData.description,
        category_id: restaurantFormData.category_id,
        average_rating: restaurant?.average_rating,
        is_active: restaurant?.is_active,
        hasAvatar: !!restaurantFormData.avatar,
      });
  
      // Gửi yêu cầu PUT tới API
      const response = await axios.put(
        `http://localhost:8080/api/v1/restaurants/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Log phản hồi từ API
      console.log('Phản hồi từ API:', response.data);
  
      // Cập nhật state với dữ liệu mới
      const updatedRestaurant = response.data.data;
      setRestaurant(updatedRestaurant);
      setRestaurantFormData({
        name: updatedRestaurant.name,
        address: updatedRestaurant.address,
        phone: updatedRestaurant.phone.toString(),
        description: updatedRestaurant.description,
        category_id: updatedRestaurant.category_id._id,
        avatar: null,
      });
  
      // Xóa preview ảnh và lỗi
      setAvatarPreview(null);
      setError(null);
  
      // Thông báo thành công (tùy chọn)
      alert('Cập nhật nhà hàng thành công!');
    } catch (err: any) {
      // Log lỗi chi tiết
      console.error('Lỗi khi cập nhật nhà hàng:', err);
      console.log('Phản hồi lỗi từ API:', err.response?.data);
  
      // Cập nhật thông báo lỗi
      setError(err.response?.data?.message || 'Không thể cập nhật thông tin nhà hàng');
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token');
      
      const formData = new FormData();
      
      // Add menu item data
      formData.append('name', menuFormData.name);
      formData.append('description', menuFormData.description);
      formData.append('price', menuFormData.price);
      formData.append('category_id', menuFormData.category_id);
      formData.append('restaurant_id', id || '');
      
      // Add main image if selected
      if (menuFormData.main_image) {
        formData.append('main_image', menuFormData.main_image);
      }
      
      // Add additional images if any
      if (menuFormData.additional_images.length > 0) {
        menuFormData.additional_images.forEach((image, index) => {
          formData.append(`additional_images[${index}]`, image);
        });
      }

      console.log('Submitting menu item data:', {
        name: menuFormData.name,
        description: menuFormData.description,
        price: menuFormData.price,
        category_id: menuFormData.category_id,
        hasMainImage: !!menuFormData.main_image,
        additionalImagesCount: menuFormData.additional_images.length
      });
      
      const response = await axios.post(
        'http://localhost:8080/api/v1/menu_item',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Menu item add response:', response.data);
      
      // Update restaurant data
      setRestaurant(prev => {
        if (!prev) return null;
        return {
          ...prev,
          menu_id: [...(prev.menu_id || []), response.data.data]
        };
      });
      
      // Reset form
      setShowAddMenuForm(false);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        main_image: null,
        additional_images: []
      });
      
      setError(null);
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Không thể thêm món ăn');
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token');
      
      const formData = new FormData();
      
      // Add menu item data
      formData.append('name', menuFormData.name);
      formData.append('description', menuFormData.description);
      formData.append('price', menuFormData.price);
      formData.append('category_id', menuFormData.category_id);
      
      // Add main image if selected
      if (menuFormData.main_image) {
        formData.append('main_image', menuFormData.main_image);
      }
      
      // Add additional images if any
      if (menuFormData.additional_images.length > 0) {
        menuFormData.additional_images.forEach((image, index) => {
          formData.append(`additional_images[${index}]`, image);
        });
      }

      console.log('Updating menu item data:', {
        name: menuFormData.name,
        description: menuFormData.description,
        price: menuFormData.price,
        category_id: menuFormData.category_id,
        hasMainImage: !!menuFormData.main_image,
        additionalImagesCount: menuFormData.additional_images.length
      });
      
      const response = await axios.put(
        `http://localhost:8080/api/v1/menu_item/${selectedMenuItem?._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Menu item update response:', response.data);
      
      // Update restaurant data
      setRestaurant(prev => {
        if (!prev) return null;
        const updatedMenu = prev.menu_id.map(item => 
          item._id === selectedMenuItem?._id ? response.data.data : item
        );
        return {
          ...prev,
          menu_id: updatedMenu
        };
      });
      
      // Reset form
      setSelectedMenuItem(null);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        main_image: null,
        additional_images: []
      });
      
      setError(null);
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Không thể cập nhật món ăn');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      setRestaurantFormData(prev => ({ ...prev, avatar: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'additional') => {
    if (type === 'main') {
      const file = e.target.files?.[0];
      if (file) {
        setMenuFormData(prev => ({ ...prev, main_image: file }));
      }
    } else {
      const files = Array.from(e.target.files || []);
      setMenuFormData(prev => ({ ...prev, additional_images: files }));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{restaurant?.name}</h1>
              <p className="text-gray-600">Địa chỉ: {restaurant?.address}</p>
              <p className="text-gray-600">Điện thoại: {restaurant?.phone}</p>
              <p className="text-gray-600">Danh mục: {restaurant?.category_id?.category_name || 'Không xác định'}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên nhà hàng
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={restaurantFormData.description}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  name="category_id"
                  value={restaurantFormData.category_id}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {/* TODO: Add category options from API */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
                    <div className="mt-2">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
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
                <form onSubmit={selectedMenuItem ? handleEditMenuItem : handleAddMenu} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên món ăn
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={menuFormData.description}
                      onChange={handleMenuInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      name="category_id"
                      value={menuFormData.category_id}
                      onChange={handleMenuInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {/* TODO: Add category options from API */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ảnh chính
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMenuFileChange(e, 'main')}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ảnh phụ
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleMenuFileChange(e, 'additional')}
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
                          additional_images: []
                        });
                        setSelectedMenuItem(null);
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
                {restaurant?.menu_id?.map((item) => (
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
                              additional_images: []
                            });
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

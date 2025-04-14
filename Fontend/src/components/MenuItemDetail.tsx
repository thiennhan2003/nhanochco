import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  main_image_url: string;
  additional_images: string[];
  category_id: {
    category_name: string;
  };
  restaurant_id: string;
  createdAt: string;
}

const MenuItemDetail = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/menu_item/${id}`);
        setMenuItem(response.data.data); // Chú ý lấy trực tiếp data menuItem
      } catch (error) {
        console.error("Error fetching menu item:", error);
        setMenuItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
          <div className="flex space-x-4 mb-4">
            <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
            <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
          </div>
          <div className="bg-gray-200 h-6 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return <div className="container mx-auto px-4 py-8">Không tìm thấy món ăn</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <img
              src={menuItem.main_image_url || "https://via.placeholder.com/400x300"}
              alt={menuItem.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{menuItem.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="font-medium">{menuItem.restaurant_id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(menuItem.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">Giá: {menuItem.price.toLocaleString()} VND</p>
              <p className="text-gray-600">{menuItem.description}</p>
            </div>
          </div>
        </div>

        {menuItem.additional_images && menuItem.additional_images.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Hình ảnh khác</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {menuItem.additional_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;

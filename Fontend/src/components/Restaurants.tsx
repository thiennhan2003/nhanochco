import React, { useState } from "react";
import RestaurantCard from "./RestaurantCard";

const Restaurants: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [restaurants, setRestaurants] = useState([
    {
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      alt: "Nhà hàng Ý",
      country: "Ý",
      name: "La Trattoria",
      description: "Nhà hàng Ý với pasta, pizza và risotto.",
      location: "Rome, Ý",
      rating: 4.8,
    },
    {
      image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02",
      alt: "Nhà hàng Nhật",
      country: "Nhật Bản",
      name: "Sakura Sushi",
      description: "Sushi, sashimi tươi ngon với không gian truyền thống.",
      location: "Tokyo, Nhật Bản",
      rating: 4.9,
    },
    {
      image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a",
      alt: "Nhà hàng Pháp",
      country: "Pháp",
      name: "Le Petit Bistro",
      description: "Món ăn tinh tế và rượu vang hảo hạng.",
      location: "Paris, Pháp",
      rating: 4.7,
    },
  ]);

  const [newRestaurant, setNewRestaurant] = useState({
    image: "",
    alt: "",
    country: "",
    name: "",
    description: "",
    location: "",
    rating: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRestaurant = () => {
    setRestaurants((prev) => [...prev, newRestaurant]);
    setNewRestaurant({
      image: "",
      alt: "",
      country: "",
      name: "",
      description: "",
      location: "",
      rating: 0,
    });
    setShowForm(false);
  };

  return (
    <section id="restaurants" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-right mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            {showForm ? "Hủy" : "Thêm Nhà Hàng"}
          </button>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Nhà hàng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl">
            Khám phá những nhà hàng đặc sắc từ khắp nơi trên thế giới với những món ăn truyền thống.
          </p>
        </div>

        {showForm && (
                      <div className="p-6 bg-white rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thêm nhà hàng mới</h3>
              <form className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Tên nhà hàng"
                  value={newRestaurant.name}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="image"
                  placeholder="URL hình ảnh"
                  value={newRestaurant.image}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="alt"
                  placeholder="Mô tả hình ảnh"
                  value={newRestaurant.alt}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Quốc gia"
                  value={newRestaurant.country}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  name="description"
                  placeholder="Mô tả"
                  value={newRestaurant.description}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Địa điểm"
                  value={newRestaurant.location}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Đánh giá (0-5)"
                  value={newRestaurant.rating}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddRestaurant}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                  >
                    Thêm Nhà Hàng
                  </button>
                </div>
              </form>
                      </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} {...restaurant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Restaurants;
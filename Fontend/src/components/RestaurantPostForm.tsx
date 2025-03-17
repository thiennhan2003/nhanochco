import { useState } from "react";

interface RestaurantPostFormProps {
  addPost: (post: { name: string; description: string; location: string }) => void;
}

const RestaurantPostForm: React.FC<RestaurantPostFormProps> = ({ addPost }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handlePost = () => {
    if (name && description && location) {
      addPost({ name, description, location });
      setName("");
      setDescription("");
      setLocation("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Đăng bài nhà hàng</h2>
      <input
        type="text"
        placeholder="Tên nhà hàng"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-600"
      />
      <textarea
        placeholder="Mô tả nhà hàng"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-amber-600"
      />
      <input
        type="text"
        placeholder="Địa điểm"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-amber-600"
      />
      <button
        onClick={handlePost}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md mt-4 transition duration-300"
      >
        Đăng bài
      </button>
    </div>
  );
};

export default RestaurantPostForm;

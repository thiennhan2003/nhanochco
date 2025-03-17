import { useState } from "react";
import RestaurantPostForm from "../components/RestaurantPostForm";

interface RestaurantPost {
  id: number;
  name: string;
  description: string;
  location: string;
}

const RestaurantsPage: React.FC = () => {
  const [posts, setPosts] = useState<RestaurantPost[]>([]);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const addPost = (post: { name: string; description: string; location: string }) => {
    const newPost = { id: posts.length + 1, ...post };
    setPosts([...posts, newPost]);
    setShowForm(false); // Hide form after adding a post
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Nhà hàng</h1>
      <button
        onClick={() => setShowForm(!showForm)} // Toggle form visibility
        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md mb-6 transition duration-300"
      >
        {showForm ? "Đóng" : "Thêm nhà hàng mới"}
      </button>
      {showForm && (
        <div className="mb-8">
          <RestaurantPostForm addPost={addPost} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">{post.name}</h2>
            <p className="text-gray-600">{post.description}</p>
            <p className="text-gray-500 text-sm">Địa điểm: {post.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsPage;

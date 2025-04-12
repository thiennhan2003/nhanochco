import { useState } from "react";
import axios from "axios";

interface PostFormProps {
  onAddPost: (post: { title: string; content: string; image: string }) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim()) {
      setError("Tiêu đề không được để trống!");
      return;
    }
    if (!content.trim()) {
      setError("Nội dung không được để trống!");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      
      if (!token || !userProfile._id) {
        setError("Vui lòng đăng nhập để đăng bài!");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/posts",
        {
          title: title.trim(),
          content: content.trim(),
          image_url: image.trim() || "", // Sửa image thành image_url
          user_id: userProfile._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        onAddPost(response.data.data);
        setTitle("");
        setContent("");
        setImage("");
        onClose();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng bài";
      console.error("Error creating post:", errorMessage);
      setError(`Không thể đăng bài: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="bg-[#efe2db] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#1e0907] mb-4">Create a New Post</h2>
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md focus:ring-2 focus:ring-[#7c160f]"
        disabled={isLoading}
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f] min-h-[100px]"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f]"
        disabled={isLoading}
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePost}
          disabled={isLoading}
          className="bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {isLoading ? "Đang đăng..." : "Đăng bài"}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default PostForm;
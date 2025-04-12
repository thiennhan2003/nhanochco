import { useState } from "react";

interface PostFormProps {
  onAddPost: (post: { title: string; content: string; image: string }) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handlePost = () => {
    if (title && content) {
      onAddPost({ title, content, image });
      setTitle("");
      setContent("");
      setImage("");
      onClose(); // Đóng form sau khi đăng bài
    }
  };

  return (
    <div className="bg-[#efe2db] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#1e0907] mb-4">Create a New Post</h2>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md focus:ring-2 focus:ring-[#7c160f]"
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f]"
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full px-4 py-2 border border-[#c8907e] rounded-md mt-2 focus:ring-2 focus:ring-[#7c160f]"
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePost}
          className="bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Submit Post
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostForm;

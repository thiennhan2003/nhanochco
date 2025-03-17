import { useState } from "react";

interface PostFormProps {
  addPost: (post: { title: string; content: string }) => void;
}

const PostForm: React.FC<PostFormProps> = ({ addPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (title && content) {
      addPost({ title, content });
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Đăng bài mới</h2>
      <input
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-600"
      />
      <textarea
        placeholder="Nội dung bài viết"
        value={content}
        onChange={(e) => setContent(e.target.value)}
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

export default PostForm;

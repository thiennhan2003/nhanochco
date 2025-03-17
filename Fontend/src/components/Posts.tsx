import React, { useState } from "react";

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Nhà hàng Nhật Bản yêu thích của tôi",
      content: "Tôi đã thử một nhà hàng sushi tuyệt vời ở Tokyo và nó thực sự đáng giá!",
      author: "Nguyễn Văn A",
      date: "15/03/2025",
image: "",
    },
    {
      id: 2,
      title: "Trải nghiệm ăn uống tại Ý",
      content: "Pizza Napoli ngon nhất tôi từng ăn, hương vị thật sự tuyệt vời!",
      author: "Trần Thị B",
      date: "10/03/2025",
image: "",
    },
    {
      id: 3,
      title: "Ẩm thực Pháp và rượu vang",
      content: "Tôi đã có một bữa tối lãng mạn tại một quán bistro nhỏ ở Paris.",
      author: "Lê Văn C",
      date: "05/03/2025",
image: "",
    },
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
    date: "",
image: "", // Add image property
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddPost = () => {
    if (newPost.title && newPost.content && newPost.author && newPost.date && newPost.image) {
      setPosts([...posts, { ...newPost, id: posts.length + 1 }]);
      setNewPost({ title: "", content: "", author: "", date: "", image: "" });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar: Featured Restaurants */}
          <div className="hidden md:block md:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Nhà hàng nổi bật</h2>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Restaurant A"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Nhà hàng A
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Restaurant B"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Nhà hàng B
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Restaurant C"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Nhà hàng C
              </li>
            </ul>
          </div>

          {/* Main Feed: Customer Posts */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Thêm bài viết mới</h2>
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Tiêu đề"
                  value={newPost.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="content"
                  placeholder="Nội dung"
                  value={newPost.content}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Tác giả"
                  value={newPost.author}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  name="date"
                  value={newPost.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
<input
                  type="text"
                  name="image"
                  placeholder="Link ảnh"
                  value={newPost.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleAddPost}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Thêm bài viết
                </button>
              </div>
              <h2 className="text-lg font-bold mb-4">Bài viết mới nhất</h2>
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
{post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-gray-600 mt-1">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {post.author} - {post.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar: Featured Dishes */}
          <div className="hidden md:block md:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Món ăn nổi bật</h2>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fHBob8O0fGVufDB8fHx8MTY4Mzg3Njk3Nw&ixlib=rb-4.0.3&q=80&w=50"
                  alt="Phở"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Món Phở - Nhà hàng A
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1571687949920-9476d5862de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxwaXp6YXxlbnwwfHx8fDE2ODM4NzY5OTM&ixlib=rb-4.0.3&q=80&w=50"
                  alt="Pizza"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Món Pizza - Nhà hàng B
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDl8fHN1c2hpfGVufDB8fHx8MTY4Mzg3NzAwOA&ixlib=rb-4.0.3&q=80&w=50"
                  alt="Sushi"
                  className="w-12 h-12 rounded-full object-cover"
                />
                Món Sushi - Nhà hàng C
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/posts/${id}`);
        let postData = response.data.data;
        if (postData.restaurant_id) {
          const restaurantResponse = await axios.get(
            `http://localhost:8080/api/v1/restaurants/${postData.restaurant_id}`
          );
          postData = { ...postData, restaurant_data: restaurantResponse.data.data };
        }
        setPost(postData);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (!post) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <FaUser className="text-gray-500 text-sm" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">@{post.user_id?.username || "unknown"}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Nội dung */}
      <p className="text-lg text-gray-800 mb-4">{post.content}</p>
      {post.restaurant_data?.name && (
        <p className="text-sm text-blue-600 mb-4">
          @{post.user_id?.username || "unknown"} đã gắn thẻ {post.restaurant_data.name}
        </p>
      )}

      {/* Hình ảnh */}
      {post.images && post.images.length > 0 ? (
        <div className="mb-6">
          {post.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`Post Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg mb-2"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">Không có hình ảnh.</p>
      )}

      {/* Thông tin bổ sung */}
      <div className="text-gray-600">
        <p>Lượt xem: {post.viewCount}</p>
        <p>Số lượt thích: {post.likes?.length || 0}</p>
      </div>
    </div>
  );
};

export default PostDetail;
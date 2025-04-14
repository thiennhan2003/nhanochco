import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/posts/${id}`);
        setPost(response.data.data); // Cập nhật dữ liệu bài viết
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (!post) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4 text-lg">{post.content}</p>

      {/* Kiểm tra nếu có hình ảnh */}
      {post.images && post.images.length > 0 ? (
        <div className="mt-6">
          {post.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`Post Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Không có hình ảnh cho bài viết này.</p>
      )}

      {/* Thêm thông tin khác nếu có */}
      <div className="mt-6">
        <p>Ngày tạo: {new Date(post.createdAt).toLocaleDateString()}</p>
        <p>Lượt xem: {post.viewCount}</p>
        <p>Số lượt thích: {post.likeCount}</p>
      </div>
    </div>
  );
};

export default PostDetail;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  _id: string;
  user_id: { username: string; fullname?: string };
  content: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
}

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
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // State riêng cho comments
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Fetch dữ liệu menu và comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song hai API
        const [menuResponse, commentResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/menu_item/${id}`),
          axios.get(`http://localhost:8080/api/v1/commentMenu?menu_id=${id}`),
        ]);

        console.log('Menu response:', menuResponse.data);
        console.log('Comment response:', commentResponse.data);

        setMenuItem(menuResponse.data.data);
        setComments(commentResponse.data.data.comments || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMenuItem(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  // Xử lý gửi comment
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      setSubmitError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (!currentUser) {
      setSubmitError('Vui lòng đăng nhập để đánh giá');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        menu_id: id,
        user_id: currentUser._id,
        content: commentContent.trim(),
        likeCount,
        dislikeCount,
      };

      await axios.post(`http://localhost:8080/api/v1/commentMenu`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Lấy lại danh sách comments mới nhất
      const commentResponse = await axios.get(
        `http://localhost:8080/api/v1/commentMenu?menu_id=${id}`
      );
      setComments(commentResponse.data.data.comments || []);
      setCommentContent('');
      setLikeCount(0);
      setDislikeCount(0);
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      setSubmitError('Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setLikeCount(value);
  };

  const handleDislikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setDislikeCount(value);
  };

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
              src={menuItem.main_image_url || 'https://via.placeholder.com/400x300'}
              alt={menuItem.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{menuItem.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="font-medium">{menuItem.category_id?.category_name}</p>
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
                  src={image || '/placeholder.svg'}
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

       

        {/* Phần đánh giá */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#1e0907] mb-4">Đánh giá món ăn</h3>

          {/* Form đánh giá */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              {currentUser ? (
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-[#7c160f]">Đánh giá của bạn</span>
                  <span className="text-sm text-gray-500">{currentUser.username}</span>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Vui lòng đăng nhập để đánh giá</p>
                </div>
              )}

              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Viết đánh giá của bạn về món ăn này..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent resize-none"
                rows={4}
              />

              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số like</label>
                  <input
                    type="number"
                    value={likeCount}
                    onChange={handleLikeChange}
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số dislike
                  </label>
                  <input
                    type="number"
                    value={dislikeCount}
                    onChange={handleDislikeChange}
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent"
                  />
                </div>
              </div>

              {submitError && <div className="mt-2 text-sm text-red-600">{submitError}</div>}

              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !currentUser}
                className="mt-4 w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Đăng đánh giá'}
              </button>
            </div>
          </div>

          {/* Danh sách đánh giá */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {comment.user_id?.fullname || comment.user_id?.username || 'Người dùng'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#7c160f]">
                        👍 {comment.likeCount ?? 0}
                      </span>
                      <span className="text-sm text-gray-500">
                        👎 {comment.dislikeCount ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Chưa có đánh giá nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
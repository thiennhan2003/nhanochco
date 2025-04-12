import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import noImage from "../assets/no-image.svg";
import { FaStar, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface Category {
  _id: string;
  category_name: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: number;
  description: string;
  category_id: Category;
  average_rating: number;
  image_url: string;
  comments: any[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/api/v1/restaurants/${id}`);
        
        if (response.data && response.data.data) {
          setRestaurant(response.data.data);
        } else {
          setError("Không tìm thấy thông tin nhà hàng");
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin nhà hàng:", err);
        setError("Không thể tải thông tin nhà hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      setSubmitError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (!currentUser) {
      setSubmitError("Vui lòng đăng nhập để đánh giá");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await axios.post(
        `http://localhost:8080/api/v1/commentRestaurant`,
        {
          restaurant_id: id,
          user_id: currentUser._id,
          content: commentContent.trim(),
          likeCount,
          dislikeCount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data && response.data.data) {
        // Update restaurant data with new comment
        setRestaurant(prev => {
          if (!prev) return null;
          return {
            ...prev,
            comments: [...(prev.comments || []), response.data.data]
          };
        });
        // Reset form
        setCommentContent("");
        setLikeCount(0);
        setDislikeCount(0);
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      setSubmitError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLikeCount(value);
  };

  const handleDislikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDislikeCount(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c160f]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#7c160f] text-white rounded hover:bg-[#bb6f57]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy nhà hàng</div>;
  }

  return (
    <div className="min-h-screen bg-[#efe2db]">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={restaurant.image_url || noImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>{restaurant.average_rating?.toFixed(1) || 0}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e0907] mb-4">Giới thiệu</h2>
            <p className="text-gray-700">{restaurant.description || "Chưa có mô tả"}</p>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#1e0907] mb-4">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-[#7c160f]" />
                  <span>{restaurant.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#7c160f]" />
                  <span>{restaurant.address || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1e0907] mb-4">Thông tin khác</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaClock className="text-[#7c160f]" />
                  <span>Thời gian mở cửa: 8:00 - 22:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#7c160f]">Danh mục:</span>
                  <span>{restaurant.category_id?.category_name || "Chưa phân loại"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#1e0907] mb-4">Đánh giá</h3>

            {/* Comment Form */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                {currentUser ? (
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-[#7c160f]">
                      Đánh giá của bạn
                    </span>
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
                  placeholder="Viết đánh giá của bạn..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent resize-none"
                  rows={4}
                />
                
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số like
                    </label>
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

                {submitError && (
                  <div className="mt-2 text-sm text-red-600">
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !currentUser}
                  className="mt-4 w-full bg-[#7c160f] hover:bg-[#bb6f57] text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng đánh giá"}
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c160f] mx-auto"></div>
              ) : restaurant?.comments?.length > 0 ? (
                restaurant.comments.map((comment: any) => (
                  <div key={comment._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{comment.user_id?.username || currentUser?.username || "Người dùng"}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#7c160f]">👍 {comment.likeCount}</span>
                        <span className="text-sm text-gray-500">👎 {comment.dislikeCount}</span>
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
    </div>
  );
};

export default RestaurantDetail;

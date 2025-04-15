import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import noImage from "../assets/no-image.svg";
import { FaStar, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface Category {
  _id: string;
  category_name: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  main_image_url: string;
  additional_images: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  user_id: { username: string };
  content: string;
  rating?: number;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: number;
  description: string;
  category_id: Category;
  average_rating: number;
  avatar_url: string;
  comments: Comment[];
  menu_id: MenuItem[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [rating, setRating] = useState<number>(0);
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

    if (rating < 1 || rating > 5) {
      setSubmitError("Vui lòng chọn số sao từ 1 đến 5");
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

      const payload = {
        restaurant_id: id,
        user_id: currentUser._id,
        content: commentContent.trim(),
        rating,
        likeCount,
        dislikeCount,
      };

      const response = await axios.post(
        `http://localhost:8080/api/v1/commentRestaurant`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        const updatedResponse = await axios.get(`http://localhost:8080/api/v1/restaurants/${id}`);
        if (updatedResponse.data && updatedResponse.data.data) {
          setRestaurant(updatedResponse.data.data);
        }
        setCommentContent("");
        setRating(0);
        setLikeCount(0);
        setDislikeCount(0);
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      setSubmitError("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
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
      <div className="relative h-[400px] flex items-center justify-center bg-[#7c160f]">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            {restaurant.average_rating > 0 ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < Math.round(restaurant.average_rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span>({restaurant.average_rating.toFixed(1)})</span>
              </>
            ) : (
              <span className="text-gray-300">Chưa có đánh giá</span>
            )}
          </div>
          <div className="flex justify-center">
            <img
              src={restaurant.avatar_url || noImage}
              alt={restaurant.name}
              className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = noImage;
              }}
            />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

          {/* Menu Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#1e0907] mb-6">Thực đơn</h3>
            {restaurant.menu_id?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurant.menu_id.map((menuItem: MenuItem) => (
                  <Link
                    key={menuItem._id}
                    to={`/menu_item/${menuItem._id}`}
                    className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square mb-4">
                      <img
                        src={menuItem.main_image_url || noImage}
                        alt={menuItem.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = noImage;
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-gray-800">{menuItem.name}</h4>
                      <p className="text-gray-600 line-clamp-2">{menuItem.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Giá:</span>
                        <span className="text-gray-800 font-medium">
                          {menuItem.price.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <p>Chưa có món ăn trong thực đơn</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#1e0907] mb-4">Đánh giá nhà hàng</h3>

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
                  placeholder="Viết đánh giá của bạn về nhà hàng..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c160f] focus:border-transparent resize-none"
                  rows={4}
                />

                {/* Rating Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh giá sao
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`text-2xl ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400 focus:outline-none`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

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
              ) : restaurant.comments?.length > 0 ? (
                restaurant.comments.map((comment: Comment) => (
                  <div key={comment._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{comment.user_id?.username || "Người dùng"}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {comment.rating ? (
                      <div className="flex items-center gap-2 mb-2">
                      {typeof comment.rating === "number" ? (
                        [...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`${
                              index < comment.rating! ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">Chưa có đánh giá sao</p>
                      )}
                    </div>
                    ) : (
                      <p className="text-gray-500 mb-2">Chưa có đánh giá sao</p>
                    )}
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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  user_id?: User;
  post_id?: { _id: string } | null;
  createdAt: string;
  likes: string[];
  views: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  user_id?: User;
  date: string;
  images: string[];
  likes: string[];
  views: number;
  comments: Comment[];
  restaurant_id?: string;
  restaurant_data?: { name: string; address: string };
}

interface PostCardProps {
  post: Post;
}

// Error Boundary
class PostCardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Có lỗi khi hiển thị bài viết.</div>;
    }
    return this.props.children;
  }
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
  } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const defaultAvatar = "https://via.placeholder.com/40";

  // Định dạng ngày thành DD/MM/YYYY
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không rõ";
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch {
      return "Không rõ";
    }
  };

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userProfile = localStorage.getItem("userProfile");

    if (token && userProfile) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const profile = JSON.parse(userProfile);
        setCurrentUser({
          id: payload._id || "",
          username: profile.username || "",
          fullname: profile.fullname || "",
          avatar: profile.avatar || defaultAvatar,
        });
      } catch (error) {
        console.error("Lỗi phân tích dữ liệu người dùng:", error);
        setCurrentUser(null);
      }
    }
  }, []);

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/commentPost?post_id=${post.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        // Lọc bình luận có post_id khớp
        const filteredComments = response.data.data.comments.filter(
          (comment: Comment) =>
            comment.post_id?._id === post.id && comment.user_id // Đảm bảo có user_id
        );
        setComments(filteredComments);
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [post.id]);

  // Check like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/likes/post/${post.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const likedUsers = response.data.data.users;
        setIsLiked(likedUsers.some((user: any) => user.user_id === currentUser.id));
        setLikeCount(response.data.data.likeCount || 0);
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái thích:", error);
      }
    };
    checkLikeStatus();
  }, [currentUser, post.id]);

  const toggleComments = () => setShowComments(!showComments);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setCommentError("Bình luận không được để trống!");
      return;
    }
    if (!currentUser) {
      setCommentError("Vui lòng đăng nhập để bình luận!");
      return;
    }
    try {
      setIsLoading(true);
      await axios.post(
        "http://localhost:8080/api/v1/commentPost",
        {
          post_id: post.id,
          user_id: currentUser.id,
          content: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Fetch lại comments từ API
      const response = await axios.get(
        `http://localhost:8080/api/v1/commentPost?post_id=${post.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const filteredComments = response.data.data.comments.filter(
        (comment: Comment) =>
          comment.post_id?._id === post.id && comment.user_id
      );
      setComments(filteredComments);
      setNewComment("");
      setCommentError(null);
    } catch (error) {
      setCommentError("Không thể thêm bình luận!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      setLikeError("Vui lòng đăng nhập!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/likes/likePost",
        { post_id: post.id, user_id: currentUser.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.data.action === "liked") {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      }
      setLikeError(null);
    } catch (error) {
      setLikeError("Lỗi khi thích bài viết!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostCardErrorBoundary>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        {/* Header: Username và thời gian */}
        <div className="p-4 flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
            <img
              src={post.user_id?.avatar || defaultAvatar}
              alt={post.user_id?.fullname || post.user_id?.username || "Người dùng"}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = defaultAvatar)}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              @{post.user_id?.username}
            </p>
            <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
          </div>
        </div>

        {/* Nội dung bài viết */}
        <div className="px-4">
          <p className="text-gray-800 mb-2">{post.content}</p>

          {/* Gắn thẻ nhà hàng */}
          {post.restaurant_data?.name && (
            <p className="text-sm text-blue-600 mb-2">
              @{post.user_id?.username || "Người dùng"} đã gắn thẻ{" "}
              {post.restaurant_data.name}
            </p>
          )}

          {/* Hình ảnh */}
          {post.images[0] && (
            <div className="mb-4">
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Tương tác */}
        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center ${
                isLiked ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600`}
            >
              <FaHeart className="w-5 h-5 mr-1" />
              <span>{likeCount} Thích</span>
            </button>
            <button
              className="flex items-center text-gray-600 hover:text-blue-600"
              onClick={toggleComments}
            >
              <FaComment className="w-5 h-5 mr-1" />
              <span>{comments.length} Bình luận</span>
            </button>
          </div>
          <button className="text-gray-600 hover:text-blue-600">Chia sẻ</button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {likeError && <div className="p-2 bg-red-100 text-red-600 text-sm">{likeError}</div>}

        {/* Bình luận */}
        {showComments && (
          <div className="p-4">
            {commentError && (
              <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-2">
                {commentError}
              </div>
            )}
            {comments.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <li key={comment._id} className="flex items-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-2">
                      <img
                        src={comment.user_id?.avatar || defaultAvatar}
                        alt={
                          comment.user_id?.fullname ||
                          comment.user_id?.username ||
                          "Người dùng"
                        }
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                      />
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-700 text-sm flex-1">
                      <p className="font-semibold">
                        {comment.user_id?.fullname || comment.user_id?.username || "Người dùng"}
                      </p>
                      <p>{comment.content}</p>
                      <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Chưa có bình luận.</p>
            )}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-2">
                <img
                  src={currentUser?.avatar || defaultAvatar}
                  alt={currentUser?.fullname || "Người dùng"}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = defaultAvatar)}
                />
              </div>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? "Viết bình luận..." : "Vui lòng đăng nhập"}
                className="flex-1 p-2 rounded-full border"
                disabled={isLoading || !currentUser}
              />
              <button
                onClick={handleAddComment}
                disabled={isLoading || !currentUser}
                className="ml-2 text-blue-600 font-semibold"
              >
                {isLoading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PostCardErrorBoundary>
  );
};

export default PostCard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaUser } from "react-icons/fa";

interface Comment {
  content: string;
  username: string;
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    username: string;
    date: string;
    images: string[];
    likes: string[];
    views: number;
    comments: Comment[];
    restaurant_id?: string;
    restaurant_data?: { name: string; address: string };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    fullname: string;
  } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

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
        });
      } catch (error) {
        setCurrentUser(null);
      }
    }
  }, []);

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
      const response = await axios.post(
        "http://localhost:8080/api/v1/commentPost",
        { post_id: post.id, user_id: currentUser.id, content: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments([...comments, { content: newComment.trim(), username: currentUser.fullname }]);
      setNewComment("");
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
    } catch (error) {
      setLikeError("Lỗi khi thích bài viết!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Header: Username và thời gian */}
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <FaUser className="text-gray-500 text-sm" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">@{post.username}</p>
          <p className="text-sm text-gray-500">{post.date}</p>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <div className="px-4">
        <p className="text-gray-800 mb-2">{post.content}</p>

        {/* Gắn thẻ nhà hàng */}
        {post.restaurant_data?.name && (
          <p className="text-sm text-blue-600 mb-2">
            @{post.username} đã gắn thẻ {post.restaurant_data.name}
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
            className={`flex items-center ${isLiked ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}
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
        <button className="text-gray-600 hover:text-blue-600">
    Chia sẻ
  </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {likeError && <div className="p-2 bg-red-100 text-red-600 text-sm">{likeError}</div>}

      {/* Bình luận */}
      {showComments && (
        <div className="p-4">
          {commentError && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-2">{commentError}</div>
          )}
          {comments.length > 0 ? (
            <ul className="space-y-3 mb-4">
              {comments.map((comment, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <FaUser className="text-gray-500 text-sm" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-700 text-sm flex-1">
                    <p className="font-semibold">{comment.username}</p>
                    <p>{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mb-4">Chưa có bình luận.</p>
          )}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <FaUser className="text-gray-500 text-sm" />
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
  );
};

export default PostCard;
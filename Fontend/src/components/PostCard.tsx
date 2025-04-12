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
    image: string;
    likes: string[]; // Array of user ObjectIds
    views: number;
    comments: Comment[];
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [likeCount, setLikeCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser({
          id: payload._id || "",
          username: payload.username || "Guest",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        setCurrentUser({ id: "", username: "Guest" });
      }
    }
  }, []);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/likes/count/${post.id}`
        );
        if (response.data) {
          setLikeCount(response.data.count);
        }
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchLikeCount();
  }, [post.id]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setCommentError("Bình luận không được để trống!");
      return;
    }
    if (newComment.trim().length < 3) {
      setCommentError("Bình luận phải có ít nhất 3 ký tự!");
      return;
    }
    if (!currentUser) {
      setCommentError("Vui lòng đăng nhập để bình luận!");
      return;
    }

    try {
      setIsLoading(true);
      setCommentError(null);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/v1/commentPost",
        {
          post_id: post.id,
          user_id: currentUser.id,
          content: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const addedComment: Comment = {
        content: response.data.content || newComment.trim(),
        username: currentUser.username,
      };
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
      console.error("Error adding comment:", errorMessage);
      setCommentError(`Không thể thêm bình luận: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      setLikeError("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    try {
      setIsLoading(true);
      setLikeError(null);

      const response = await axios.post(
        "http://localhost:8080/api/v1/likes/likePost",
        {
          post_id: post.id,
          user_id: currentUser.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Kiểm tra response và cập nhật số lượng like
      if (response.data && response.data.statusCode === 200) {
        setLikeCount(response.data.data.likeCount);
      } else {
        setLikeError(response.data?.message || "Không thể cập nhật like");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      if (axios.isAxiosError(error)) {
        // Lỗi từ server
        setLikeError(error.response?.data?.message || "Có lỗi xảy ra khi thích bài viết");
      } else if (error instanceof Error) {
        // Lỗi khác
        setLikeError(error.message);
      } else {
        // Lỗi không xác định
        setLikeError("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto mb-4 border border-gray-200">
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <FaUser className="text-gray-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{post.author}</p>
          <p className="text-xs text-gray-500">{post.date}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
        <p className="text-gray-700">{post.content}</p>
      </div>
      {post.image && (
        <div className="w-full">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "";
              target.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-center px-4 py-2 text-gray-600 text-sm border-t border-gray-200">
        <span>{likeCount} Likes</span>
        <span>{comments.length} Comments</span>
        <span>{post.views} Views</span>
      </div>
      <div className="flex justify-around py-2 border-t border-b border-gray-200">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center ${likeCount > 0 ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 disabled:opacity-50`}
        >
          <FaHeart className="w-5 h-5 mr-1" />
          {likeCount > 0 ? 'Unlike' : 'Like'}
        </button>
        <button
          className="flex items-center text-gray-600 hover:text-blue-600"
          onClick={toggleComments}
        >
          <FaComment className="w-5 h-5 mr-1" />
          Comment
        </button>
      </div>
      {likeError && (
        <div className="p-2 bg-red-100 text-red-600 text-sm">
          {likeError}
        </div>
      )}
      {showComments && (
        <div className="p-4">
          {commentError && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-2">
              {commentError}
            </div>
          )}
          {comments.length > 0 ? (
            <ul className="space-y-3 mb-4">
              {comments.map((comment, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <FaUser className="text-gray-500 text-sm" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-700 text-sm flex-1">
                    <p className="font-semibold">{comment.username || "Guest"}</p>
                    <p>{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mb-4">Chưa có bình luận nào.</p>
          )}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <FaUser className="text-gray-500 text-sm" />
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleAddComment}
              disabled={isLoading}
              className="ml-2 text-blue-600 hover:text-blue-800 font-semibold disabled:opacity-50"
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
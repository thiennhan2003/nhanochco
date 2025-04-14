import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { FaSpinner } from "react-icons/fa";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user_id: { _id: string; username: string };
}

interface Post {
  _id: string;
  title: string;
  content: string;
  images: string[];
  user_id: { _id: string; fullname: string; username: string };
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: Comment[];
  viewCount: number;
  is_active: boolean;
  restaurant_id?: string;
  restaurant_data?: { name: string; address: string };
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: { posts: Post[]; pagination: { totalRecord: number; limit: number; page: number } };
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser({ id: payload._id || "", username: payload.username || "Guest" });
      } catch (error) {
        setError("Token không hợp lệ!");
      }
    } else {
      setError("Vui lòng đăng nhập!");
    }
  }, []);

  const fetchPosts = async (pageNum: number, isLoadMore: boolean = false) => {
    if (!currentUser) return;
    try {
      if (!isLoadMore) setLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse>("http://localhost:8080/api/v1/posts", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, limit: 10, sort_type: "desc", sort_by: "createdAt" },
      });

      const newPosts = response.data.data.posts.filter((post) => post.is_active);
      // Lấy thông tin nhà hàng nếu có restaurant_id
      const postsWithRestaurantData = await Promise.all(
        newPosts.map(async (post) => {
          if (post.restaurant_id) {
            try {
              const restaurantResponse = await axios.get(
                `http://localhost:8080/api/v1/restaurants/${post.restaurant_id}`
              );
              return { ...post, restaurant_data: restaurantResponse.data.data };
            } catch (err) {
              return post;
            }
          }
          return post;
        })
      );

      if (isLoadMore) {
        setPosts((prevPosts) => [...prevPosts, ...postsWithRestaurantData]);
      } else {
        setPosts(postsWithRestaurantData);
      }
      setHasMore(newPosts.length === 10);
    } catch (error) {
      setError("Lỗi khi tải bài viết!");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchPosts(1);
  }, [currentUser]);

  const handleAddPost = async (newPost: {
    title: string;
    content: string;
    images: string[];
    restaurant_id?: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

      if (!token || !userProfile._id) throw new Error("Vui lòng đăng nhập!");

      const response = await axios.post(
        "http://localhost:8080/api/v1/posts",
        { ...newPost, user_id: userProfile._id },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const addedPost: Post = {
        ...response.data.data,
        user_id: {
          _id: userProfile._id,
          fullname: userProfile.fullname || "Unknown",
          username: userProfile.username || "unknown",
        },
        likes: [],
        comments: [],
        viewCount: 0,
        is_active: true,
      };

      // Lấy thông tin nhà hàng nếu có restaurant_id
      if (newPost.restaurant_id) {
        try {
          const restaurantResponse = await axios.get(
            `http://localhost:8080/api/v1/restaurants/${newPost.restaurant_id}`
          );
          addedPost.restaurant_data = restaurantResponse.data.data;
        } catch (err) {
          console.error("Lỗi khi lấy thông tin nhà hàng:", err);
        }
      }

      setPosts((prevPosts) => [addedPost, ...prevPosts]);
      setShowForm(false);
    } catch (error) {
      alert("Không thể tạo bài viết!");
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#7c160f]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-[#efe2db] min-h-screen text-[#1e0907]">
      <div className="container mx-auto py-10 px-4">
        <button
          className="fixed top-20 left-5 bg-[#7c160f] text-white px-4 py-2 rounded-full"
          onClick={() => setShowForm(true)}
        >
          + Add Post
        </button>
        {showForm && <PostForm onAddPost={handleAddPost} onClose={() => setShowForm(false)} />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PostCard
                  post={{
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    author: post.user_id?.fullname || "Unknown",
                    username: post.user_id?.username || "unknown",
                    date: new Date(post.createdAt).toLocaleDateString(),
                    images: post.images || [],
                    likes: post.likes || [],
                    views: post.viewCount || 0,
                    comments: (post.comments || []).map((c) => ({
                      content: c.content,
                      username: c.user_id?.username || "unknown",
                    })),
                    restaurant_id: post.restaurant_id,
                    restaurant_data: post.restaurant_data,
                  }}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">Không có bài viết nào!</p>
            </div>
          )}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-[#7c160f] text-white px-6 py-2 rounded-full"
            >
              {isLoadingMore ? <FaSpinner className="animate-spin inline-block mr-2" /> : null}
              {isLoadingMore ? "Đang tải..." : "Tải thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { FaHeart, FaComment, FaSpinner } from "react-icons/fa";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image_url: string;
  user_id: {
    _id: string;
    fullname: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: Comment[];
  viewCount: number;
  is_active: boolean;
  likeCount?: number;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    posts: Post[];
    pagination: {
      totalRecord: number;
      limit: number;
      page: number;
    };
  };
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
        setCurrentUser({
          id: payload._id || "",
          username: payload.username || "Guest",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
      }
    } else {
      setError("Vui lòng đăng nhập để xem bài viết.");
    }
  }, []);

  const fetchPosts = async (pageNum: number, isLoadMore: boolean = false) => {
    if (!currentUser) return;

    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      const response = await axios.get<ApiResponse>("http://localhost:8080/api/v1/posts", {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page: pageNum, 
          limit: 10, 
          sort_type: "desc", 
          sort_by: "createdAt" 
        },
      });

      if (!response.data?.data?.posts) {
        throw new Error("Không nhận được dữ liệu bài viết");
      }

      const newPosts = response.data.data.posts.filter(post => post.is_active);
      
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(newPosts.length === 10);
      
      // Update views for new posts
      for (const post of newPosts) {
        try {
          await axios.patch(
            `http://localhost:8080/api/v1/posts/${post._id}`,
            { user_id: currentUser.id, action: "view" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (viewError) {
          console.error(`Error updating views for post ${post._id}:`, viewError);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tải bài viết";
      console.error("Error fetching posts:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPosts(1);
    }
  }, [currentUser]);

  const handleAddPost = async (newPost: { title: string; content: string; image: string }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/v1/posts",
        {
          title: newPost.title,
          content: newPost.content,
          image_url: newPost.image || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedPost = response.data;
      if (addedPost.is_active) {
        setPosts(prevPosts => [addedPost, ...prevPosts]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
      console.error("Error adding post:", errorMessage);
      alert(`Không thể tạo bài viết: ${errorMessage}`);
    }
    setShowForm(false);
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
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 text-red-600 p-4 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#efe2db] min-h-screen text-[#1e0907]">
      <div className="container mx-auto py-10 px-4">
        <button
          className="fixed top-20 left-5 bg-[#7c160f] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#bb6f57] transition-colors duration-200"
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
                    author: post.user_id.fullname,
                    username: post.user_id.username,
                    date: new Date(post.createdAt).toLocaleDateString(),
                    image: post.image_url || "",
                    likes: post.likes || [],
                    views: post.viewCount,
                    comments: post.comments.map((c) => ({
                      content: c.content,
                      username: post.user_id.username,
                    })),
                  }}
                />
                <div className="flex justify-end items-center mt-2 space-x-4">
                  <button className="flex items-center text-red-500 hover:text-red-700">
                    <FaHeart className="mr-1" /> {post.likes.length}
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700">
                    <FaComment className="mr-1" /> {post.comments.length}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">Không có bài viết nào để hiển thị.</p>
            </div>
          )}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-[#7c160f] text-white px-6 py-2 rounded-full shadow-lg hover:bg-[#bb6f57] transition-colors duration-200 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : null}
              {isLoadingMore ? "Đang tải..." : "Tải thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
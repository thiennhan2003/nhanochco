interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6">
      <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
      <p className="text-gray-600 mt-2">{post.content}</p>
      <div className="mt-4 border-t pt-4 text-gray-500 text-sm">
        <p>Viết bởi: <span className="font-medium text-gray-800">{post.author}</span></p>
        <p className="mt-1">{post.date}</p>
      </div>
    </div>
  );
};

export default PostCard;

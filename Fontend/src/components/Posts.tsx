import PostCard from "./PostCard";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const Posts: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: "Nhà hàng Nhật Bản yêu thích của tôi",
      content: "Tôi đã thử một nhà hàng sushi tuyệt vời ở Tokyo và nó thực sự đáng giá!",
      author: "Nguyễn Văn A",
      date: "15/03/2025",
    },
    {
      id: 2,
      title: "Trải nghiệm ăn uống tại Ý",
      content: "Pizza Napoli ngon nhất tôi từng ăn, hương vị thật sự tuyệt vời!",
      author: "Trần Thị B",
      date: "10/03/2025",
    },
    {
      id: 3,
      title: "Ẩm thực Pháp và rượu vang",
      content: "Tôi đã có một bữa tối lãng mạn tại một quán bistro nhỏ ở Paris.",
      author: "Lê Văn C",
      date: "05/03/2025",
    },
  ];

  return (
    <section id="posts" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Bài viết mới nhất</h2>
        <p className="text-gray-600 text-center mb-12">
          Khám phá những trải nghiệm ẩm thực tuyệt vời được chia sẻ bởi cộng đồng của chúng tôi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Posts;

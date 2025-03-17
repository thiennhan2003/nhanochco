const Hero: React.FC = () => {
  return (
    <section className="relative h-[80vh] w-[90%] mx-auto">
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
        alt="Restaurant ambiance"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Epicurean Explorer</h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
          Khám phá ẩm thực từ khắp nơi trên thế giới và chia sẻ trải nghiệm của bạn
        </p>
        <a
          href="#restaurants"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
        >
          Khám phá nhà hàng
        </a>
      </div>
    </section>
  );
};

export default Hero;

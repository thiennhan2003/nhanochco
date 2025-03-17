import RestaurantCard from "./RestaurantCard";

const Restaurants: React.FC = () => {
  return (
    <section id="restaurants" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Nhà hàng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl">
            Khám phá những nhà hàng đặc sắc từ khắp nơi trên thế giới với những món ăn truyền thống.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RestaurantCard
            image="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
            alt="Nhà hàng Ý"
            country="Ý"
            name="La Trattoria"
            description="Nhà hàng Ý với pasta, pizza và risotto."
            location="Rome, Ý"
            rating={4.8}
          />
          <RestaurantCard
            image="https://images.unsplash.com/photo-1546039907-7fa05f864c02"
            alt="Nhà hàng Nhật"
            country="Nhật Bản"
            name="Sakura Sushi"
            description="Sushi, sashimi tươi ngon với không gian truyền thống."
            location="Tokyo, Nhật Bản"
            rating={4.9}
          />
          <RestaurantCard
            image="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a"
            alt="Nhà hàng Pháp"
            country="Pháp"
            name="Le Petit Bistro"
            description="Món ăn tinh tế và rượu vang hảo hạng."
            location="Paris, Pháp"
            rating={4.7}
          />
        </div>
      </div>
    </section>
  );
};

export default Restaurants;

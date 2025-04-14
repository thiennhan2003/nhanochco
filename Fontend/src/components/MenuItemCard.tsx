import { Link } from "react-router-dom";
import noImage from "../assets/no-image.svg";

interface MenuItemCardProps {
  image: string;
  alt: string;
  category: string;
  name: string;
  description: string;
  price: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ image, alt, category, name, description, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-sm text-white/90">{category}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#1e0907] mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#7c160f]">
            {price.toLocaleString()} VND
          </span>
          <Link 
            to="#" 
            className="text-[#7c160f] hover:text-[#1e0907] transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;

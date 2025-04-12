import { MapPin, Star, Phone } from "lucide-react";
import noImage from "../assets/no-image.svg";

interface RestaurantCardProps {
  image: string;
  alt: string;
  country: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  phone?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  image,
  alt,
  country,
  name,
  description,
  location,
  rating,
  phone
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = noImage;
          }}
        />
        <div className="absolute top-4 left-4 bg-[#7c160f]/90 text-white px-3 py-1 rounded-full text-sm font-medium">
          {country}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1e0907] mb-2 line-clamp-1">{name}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 text-[#7c160f] mr-2" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          {phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 text-[#7c160f] mr-2" />
              <span className="text-sm">{phone}</span>
            </div>
          )}
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {rating ? `${rating.toFixed(1)}/5` : "Chưa có đánh giá"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

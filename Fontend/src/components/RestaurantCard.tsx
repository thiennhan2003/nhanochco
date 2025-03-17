import { MapPin, Star } from "lucide-react";

interface RestaurantCardProps {
  image: string;
  alt: string;
  country: string;
  name: string;
  description: string;
  location: string;
  rating: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  image,
  alt,
  country,
  name,
  description,
  location,
  rating,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <div className="relative h-64">
        <img src={image} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {country}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-amber-600 mr-1" />
            <span className="text-gray-600 text-sm">{location}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-gray-600 ml-1">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

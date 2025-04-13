export interface UserType {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostType {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormValues {
  title: string;
  content: string;
  image_url: string;
  images: string;
  user_id: string;
}

export interface PaginationType {
  totalRecord: number;
  limit: number;
  page: number;
}

export interface PostResponseType {
  posts: PostType[];
  pagination: PaginationType;
}

export interface CategoryType {
  _id: string;
  category_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerType {
  _id: string;
  username: string;
  fullname: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentType {
  _id: string;
  user_id: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantType {
  _id: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  category_id: CategoryType;
  owner_id: OwnerType;
  average_rating: number;
  avatar_url: string;
  images: string[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: CommentType[];
}

export interface RestaurantFormData {
  id?: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  category_id: string;
  owner_id: string;
  average_rating?: number;
  avatar_url?: string;
  images?: string[];
  is_active: boolean;
}

export interface RestaurantResponse {
  statusCode: number;
  message: string;
  data: RestaurantType;
}

export interface ToggleActiveData {
  id: string;
  is_active: boolean;
}

export interface KEYs {
  getRestaurants: () => readonly ["restaurants", number, number];
  getRestaurant: (id: string) => readonly ["restaurant", string];
  getOwners: () => readonly ["owners"];
  getCategories: () => readonly ["categories"];
}

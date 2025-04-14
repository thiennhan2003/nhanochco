export interface Category {
    _id: string;
    category_name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MenuItem {
    _id: string;
    restaurant_id: string;
    name: string;
    description: string;
    category_id: Category;
    price: number;
    comments: string[];
    main_image_url: string;
    additional_images: string[];
    createdAt: string;
    updatedAt: string;
  }
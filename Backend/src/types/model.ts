export interface IUserCreate {

    username: string;
    fullname: string;
    email: string;
    password: string;
    role: string[];
}
export interface TUserEntity {
    username: string;
    fullname: string;
    email: string;
    password: string;
    role: 'customer' | 'restaurant_owner' | 'admin';
    active?: boolean; // Thêm thuộc tính active, có thể không bắt buộc
    avatar?: string;  // Thêm thuộc tính avatar, có thể không bắt buộc
}
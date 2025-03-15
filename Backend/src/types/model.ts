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
  }
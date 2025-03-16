import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}
interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  active: boolean;
}

type TAuthStore ={
  tokens: null | ITokens;
  user: null | IUser;
  setTokens: (tokens: ITokens) => void;
  clearTokens: () => void;
  setUser: (user: IUser | null)=>void;
}

export const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set) => ({
        tokens: null,
        user: null,
        setTokens: (tokens: ITokens) => {
          set({ tokens });
        },
        clearTokens: () => set({ tokens: null }),
        setUser: (user: IUser |  null)=>{
          set({ user });
        }
      }),
      {
        name: 'auth-storage', // unique name
        storage: createJSONStorage(() => localStorage), // use local storage
      }
    )
  )
);
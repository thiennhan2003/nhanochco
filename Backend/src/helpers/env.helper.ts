import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MongoDB_URI: process.env.MongoDB_URI || 'mongodb://127.0.0.1:27017/Nha_Hang'
};

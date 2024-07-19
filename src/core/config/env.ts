import dotenv from 'dotenv';
import { UserRole } from '../global/interface';


dotenv.config();


export const config = Object.freeze({
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    type: process.env.DB_TYPE,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenExpTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME as string,
    refreshTokenExpTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME as string,
    encryptoSecretKey: process.env.ENCRYPTOR_SECRET_KEY as string,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD as string,
    email: process.env.ADMIN_EMAIL as string,
    userName: process.env.ADMIN_USERNAME as string,
    role: process.env.ADMIN_ROLE as UserRole,
  },
  vm: {
    healthurl: process.env.VM_HEALTH_URL as string,
    starturl: process.env.VM_START_URL as string,
    stopurl: process.env.VM_STOP_URL as string,
    deleteurl: process.env.VM_DELETE_URL as string,
    createurl: process.env.VM_CREATE_URL as string,
  },
});
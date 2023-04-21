import dotenv from "dotenv";

dotenv.config();
export default {
    env: process.env.NODE_ENV || 'development',
    
    port: process.env.PORT || 3000,

    mongo: {
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        db: process.env.MONGO_DB,
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/scrum_db',
    },

    jwt: {
        secret_key: process.env.JWT_PRIVATE_KEY
    }
};
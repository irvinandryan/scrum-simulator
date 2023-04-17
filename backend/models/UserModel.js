import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	username: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
	password: { 
        type: String, 
        required: true,
    },
});

export default mongoose.model('UserModel', UserSchema);
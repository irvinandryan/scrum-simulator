import mongoose from "mongoose";

var User = mongoose.Schema({
    username: String,
    password: String,
});

export default mongoose.model('UserModel', User);
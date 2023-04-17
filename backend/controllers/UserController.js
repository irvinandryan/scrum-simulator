import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";

const validateUserData = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
}

export const register = async (req, res) => {
    try {
        const {error} = validateUserData(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const isUserAlready = await UserModel.findOne({username: req.body.username});
        if (isUserAlready) {
            return res.status(400).json({message: "Username is already taken"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        UserModel.create({
            username: req.body.username,
            password: hashedPassword,
        }).then(user => {
            const token = jwt.sign({ username: req.body.username }, process.env.JWT_PRIVATE_KEY, {expiresIn: 86400});
            res.status(200).json({auth: true, token: token, user: user});
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {error} = validateUserData(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const isUserAlready = await UserModel.findOne({username: req.body.username});
        if (!isUserAlready) {
            return res.status(400).json({message: "Username not found"});
        }
        const validPassword = await bcrypt.compare(req.body.password, isUserAlready.password);
        if (!validPassword) {
            return res.status(400).json({message: "Username or password is incorrect"});
        }
        const token = jwt.sign({ username: req.body.username }, process.env.JWT_PRIVATE_KEY, {expiresIn: 86400});
        res.status(200).json({auth: true, token: token, user: isUserAlready});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
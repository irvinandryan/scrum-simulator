import Joi from "joi";
import jwt from "jsonwebtoken";

export const validateUserData = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
}

export const signAuth = (username) => {
    return jwt.sign({ username: username }, process.env.JWT_PRIVATE_KEY, {expiresIn: 86400});
}
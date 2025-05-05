import { sign } from "jsonwebtoken";
export const createToken = (data, expireIn) => {
    return sign(data, process.env.JWT_SECRET || "fallback", {
        expiresIn: expireIn || "1d"
    });
};

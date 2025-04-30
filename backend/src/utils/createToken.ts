import { sign } from "jsonwebtoken";

export const createToken = (data: any, expireIn?: any) => {
    return sign (data, process.env.JWT_SECRET || "fallback", {
        expiresIn: expireIn || "1d"
    })
}
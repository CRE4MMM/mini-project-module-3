import { sign } from "jsonwebtoken";

export const createToken = (data: any, expireIn?: any) => {
    return sign (data, process.env.TOKEN_KEY || "token", {
        expiresIn: expireIn || "1d"
    })
}
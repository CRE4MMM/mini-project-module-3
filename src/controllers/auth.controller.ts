import { NextFunction, Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { createToken } from "../utils/createToken";
import { transporter } from "../configs/nodemailer";

class AuthController {
    async createAcc (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const isExist = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }
            })

            if (!isExist) {
                return res.status(400).send({
                    success: false,
                    message: `${req.body.email} is exist, use another email`
                })
            }

            const newPass = await hashPassword(req.body.password)

            const regist = await prisma.user.create({
                data: {...req.body, password: newPass}
            })

            const token = createToken({ id: regist.id, email: regist.email })

            await transporter.sendMail({
                from: process.env.MAIL_SENDER,
                to: req.body.email,
                subject: "Verify Account Registration",
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Thank you for registering your account</h2>
                        <a href="${process.env.FE_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify now</a>
                        <p>If you dont create this account, please ignore this email</p>
                        </div>
                `
            })

            return res.status(200).send({
                success: true,
                message: "Register success"
            })
        } catch (error) {
            next(error)
        }
    }
}

class login {
    async createAcc (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}

class keepLogin {
    async createAcc (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}
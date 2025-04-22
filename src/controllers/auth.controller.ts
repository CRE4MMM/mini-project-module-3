import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { createToken } from "../utils/createToken";
import { transporter } from "../configs/nodemailer";

class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password || !firstName || !lastName) {
                return res.status(400).send({
                    success: false,
                    message: "All fields are required"
                });
            }

            const isExist = await prisma.user.findUnique({
                where: { email }
            });
            
            if (isExist) {
                return res.status(400).send({
                    success: false,
                    message: `${email} is already in use, please use another email`
                });
            }
            
            const hashedPassword = await hashPassword(password);
            
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    isVerified: false
                }
            });
            
            const token = createToken({ 
                id: newUser.id, 
                email: newUser.email 
            });
            
            await transporter.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: "Verify Your Account Registration",
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Thank you for registering your account</h2>
                    <p>Click the button below to verify your email address:</p>
                    <a href="${process.env.FE_URL}/verify?token=${token}" 
                        style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Verify Account
                    </a>
                    <p>If you didn't create this account, please ignore this email.</p>
                </div>
                `
            });
            
            return res.status(201).send({
                success: true,
                message: "Registration successful! Please check your email to verify your account."
            });
        } catch (error) {
            next(error);
        }
    }
}
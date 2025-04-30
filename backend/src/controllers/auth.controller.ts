import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { createToken } from "../utils/createToken";
import { transporter } from "../configs/nodemailer";
import { generateReferral } from "../utils/referralGen";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decode } from "punycode";

class AuthController {
    async registCust(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password, firstName, lastName, referredBy } = req.body;

            if (!email || !password || !firstName || !lastName) {
                return res.status(400).send({
                    success: false,
                    message: "All fields are required"
                });
            }

            const isExist = await prisma.user.findUnique({ where: { email } });
            if (isExist) {
                return res.status(400).send({
                    success: false,
                    message: `${email} is already in use, please use another email`
                });
            }

            let referringUser = null;
            if (referredBy) {
                referringUser = await prisma.user.findUnique({
                    where: { referralCode: referredBy }
                });

                if (!referringUser) {
                    return res.status(400).send({
                        success: false,
                        message: "Invalid referral code"
                    });
                }
            }

            const hashedPassword = await hashPassword(password);
            const referralCode = generateReferral()

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: "CUSTOMER",
                    referralCode,
                    referredBy: referredBy || null,
                    isVerified: false
                }
            });

            const token = createToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
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

    async verifyAccount(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { token } = req.query

            if (!token || typeof token !== 'string') {
                return res.status(400).send({
                    success: false,
                    message: 'Verification is required'
                })
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET ||
                'fallback'
            ) as JwtPayload

            const user = await prisma.user.findUnique({
                where: {id: decoded.id}
            })

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'User not found'
                })
            }

            if (user.isVerified) {
                return res.status(400).send({
                    success: false,
                    message: 'Account already verified'
                })
            }

            await prisma.user.update({
                where: {id: decoded.id},
                data: {isVerified: true}
            })

            return res.redirect(`${process.env.FE_URL}/verify-success`)
        } catch (error) {
            next(error)
        }
    }

    async registOrg(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const isExist = await prisma.user.findUnique({ where: { email } });
            if (isExist) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await hashPassword(password);
            const referralCode = generateReferral()

            const organizer = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: 'ORGANIZER',
                    referralCode,
                    isVerified: true
                }
            });

            return res.status(201).json({ message: "Event organizer created", data: organizer });
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            if (!user.isVerified && user.role === "CUSTOMER") {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email before signing in"
                });
            }

            const token = createToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            return res.status(200).json({
                success: true,
                message: "Sign-in successful",
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async keepSignIn(req: Request, res: Response, next: NextFunction): Promise<any> {

    }

    async signOut(req: Request, res: Response, next: NextFunction): Promise<any> {

    }
}

export default new AuthController();
import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { createToken } from "../utils/createToken";
import { generateReferral } from "../utils/referralGen";
import bcrypt from "bcrypt";

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

            return res.status(201).send({
                success: true,
                message: "Registration successful!"
            });
        } catch (error) {
            next(error);
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
        try {
            const userData = req.user;

            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const user = await prisma.user.findUnique({
                where: { id: userData.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            return res.status(200).json({
                success: true,
                message: "Signed out successfully"
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new AuthController();
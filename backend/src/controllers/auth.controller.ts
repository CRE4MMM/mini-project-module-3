import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { generateReferral } from "../utils/referralGen";
import { createToken } from "../utils/createToken";
import bcrypt from 'bcrypt'

class AuthController {
    async signUp(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { firstName, lastName, email, password, role, referredBy } = req.body

        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({message: 'all fields required'})
        }

        if (!['CUSTOMER', 'ORGANIZER'].includes(role)) {
            return res.status(400).json({message: 'invalid role'})
        }

        const isExist = await prisma.user.findUnique({where: {email}})
        if(isExist) {
            return res.status(400).send({
                success: false,
                message: `${email} is already in use, please use another email`
            })
        }

        const hashedPassword = await hashPassword(password)
        const referralCode = generateReferral()

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

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                referralCode,
                referredBy: referredBy || null,
                isVerified: true,
            },
        });


        return res.status(201).send({
            success: true,
            message: 'Signup successful',
            data: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                referralCode: newUser.referralCode,
                referredBy: newUser.referredBy,
                isVerified: newUser.isVerified,
            },
        });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: 'Server error during signup',
            });
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }

            const token = createToken({
                id: user.id,
                email: user.email,
                role: user.role,
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
                        role: user.role,
                    },
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error during sign-in",
            });
        }
    }
}

export default new AuthController();
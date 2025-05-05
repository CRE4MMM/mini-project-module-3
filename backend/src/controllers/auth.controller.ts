import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { hashPassword } from "../utils/hashPassword";
import { generateReferral } from "../utils/referralGen";
import { createToken } from "../utils/createToken";
import bcrypt from 'bcrypt';
// import { nanoid } from 'nanoid';

class AuthController {
    async signUp(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { firstName, lastName, email, password, role, referredBy } = req.body;

            if (!firstName || !lastName || !email || !password || !role) {
                return res.status(400).json({ message: 'All fields required' });
            }

            if (!['CUSTOMER', 'ORGANIZER'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const isExist = await prisma.user.findUnique({ where: { email } });
            if (isExist) {
                return res.status(400).send({
                    success: false,
                    message: `${email} is already in use, please use another email`,
                });
            }

            const hashedPassword = await hashPassword(password);
            const referralCode = generateReferral();

            let referringUser = null;
            if (referredBy) {
                referringUser = await prisma.user.findUnique({
                    where: { referralCode: referredBy },
                });

                if (!referringUser) {
                    return res.status(400).send({
                        success: false,
                        message: "Invalid referral code",
                    });
                }
            }

            // Define points for referral (10,000 points per successful referral)
            const REFERRAL_POINTS = 10000;

            // Create new user, update referring user's points, create a transaction, and generate a coupon in a single transaction
            const newUser = await prisma.$transaction(async (tx) => {
                // Create the new user
                const user = await tx.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        role,
                        referralCode,
                        referredBy: referredBy || null,
                        isVerified: true,
                        points: 0, // Initialize points for new user
                    },
                });

                // If there is a referring user, increment their points and create a transaction
                if (referringUser) {
                    await tx.user.update({
                        where: { id: referringUser.id },
                        data: {
                            points: { increment: REFERRAL_POINTS },
                        },
                    });

                    await tx.pointTransaction.create({
                        data: {
                            userId: referringUser.id,
                            points: REFERRAL_POINTS,
                            reason: "REFERRAL",
                            expiresAt: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 months from now
                        },
                    });

                    // Generate a discount coupon for the new user (10% off, expires in 1 month)
                    // const couponCode = `DISC-${nanoid(8)}`; // Generate a unique coupon code
                    // await tx.coupon.create({
                    //     data: {
                    //         code: couponCode,
                    //         userId: user.id,
                    //         discount: 10, // 10% discount
                    //         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
                    //     },
                    // });
                }

                return user;
            });

            // Fetch the coupon for the response (if created)
            let coupon = null;
            if (referredBy && referringUser) {
                coupon = await prisma.coupon.findFirst({
                    where: { userId: newUser.id },
                    orderBy: { createdAt: 'desc' },
                });
            }

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
                    points: newUser.points,
                    coupon: coupon ? { code: coupon.code, discount: coupon.discount, expiresAt: coupon.expiresAt } : null,
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

            // Calculate available points (sum of non-expired transactions)
            const availablePoints = await prisma.pointTransaction.aggregate({
                where: {
                    userId: user.id,
                    expiresAt: { gt: new Date() },
                },
                _sum: { points: true },
            }).then(result => result._sum.points || 0);

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
                        points: user.points,
                        availablePoints: availablePoints,
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
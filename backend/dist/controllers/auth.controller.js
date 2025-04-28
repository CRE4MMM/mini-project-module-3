"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../configs/prisma");
const hashPassword_1 = require("../utils/hashPassword");
const createToken_1 = require("../utils/createToken");
const nodemailer_1 = require("../configs/nodemailer");
const referralGen_1 = require("../utils/referralGen");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    registCust(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstName, lastName, referredBy } = req.body;
                if (!email || !password || !firstName || !lastName) {
                    return res.status(400).send({
                        success: false,
                        message: "All fields are required"
                    });
                }
                const isExist = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (isExist) {
                    return res.status(400).send({
                        success: false,
                        message: `${email} is already in use, please use another email`
                    });
                }
                let referringUser = null;
                if (referredBy) {
                    referringUser = yield prisma_1.prisma.user.findUnique({
                        where: { referralCode: referredBy }
                    });
                    if (!referringUser) {
                        return res.status(400).send({
                            success: false,
                            message: "Invalid referral code"
                        });
                    }
                }
                const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
                const referralCode = (0, referralGen_1.generateReferral)();
                const newUser = yield prisma_1.prisma.user.create({
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
                const token = (0, createToken_1.createToken)({
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                });
                yield nodemailer_1.transporter.sendMail({
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
            }
            catch (error) {
                next(error);
            }
        });
    }
    registOrg(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstName, lastName } = req.body;
                if (!email || !password || !firstName || !lastName) {
                    return res.status(400).json({ message: "All fields are required" });
                }
                const isExist = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (isExist) {
                    return res.status(400).json({ message: "Email already exists" });
                }
                const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
                const referralCode = (0, referralGen_1.generateReferral)();
                const organizer = yield prisma_1.prisma.user.create({
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
            }
            catch (error) {
                next(error);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        success: false,
                        message: "Email and password are required"
                    });
                }
                const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password"
                    });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
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
                const token = (0, createToken_1.createToken)({
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
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthController();

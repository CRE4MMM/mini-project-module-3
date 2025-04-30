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
const referralGen_1 = require("../utils/referralGen");
const createToken_1 = require("../utils/createToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email, password, role, referredBy } = req.body;
                if (!firstName || !lastName || !email || !password || !role) {
                    return res.status(400).json({ message: 'all fields required' });
                }
                if (!['CUSTOMER', 'ORGANIZER'].includes(role)) {
                    return res.status(400).json({ message: 'invalid role' });
                }
                const isExist = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (isExist) {
                    return res.status(400).send({
                        success: false,
                        message: `${email} is already in use, please use another email`
                    });
                }
                const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
                const referralCode = (0, referralGen_1.generateReferral)();
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
                const newUser = yield prisma_1.prisma.user.create({
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
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({
                    success: false,
                    message: 'Server error during signup',
                });
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
                        message: "Email and password are required",
                    });
                }
                const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                }
                const token = (0, createToken_1.createToken)({
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
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Server error during sign-in",
                });
            }
        });
    }
}
exports.default = new AuthController();

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
exports.getUser = exports.loginUser = exports.signupUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcrypt_1 = __importDefault(require("../utils/bcrypt"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existedUser = yield prisma_1.default.user.findFirst({
            where: { email },
        });
        if (existedUser) {
            const token = yield jwt_1.default.generateToken(existedUser.id);
            res.status(400).json({ message: "User already exists", token });
            return;
        }
        const hashPassword = yield bcrypt_1.default.hashPassword(password);
        const newUser = yield prisma_1.default.user.create({
            data: { name, email, password: hashPassword },
        });
        const token = yield jwt_1.default.generateToken(newUser.id);
        res.status(201).json(Object.assign(Object.assign({}, newUser), { token }));
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.signupUser = signupUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = yield prisma_1.default.user.findFirst({ where: { email } });
        console.log(user);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.comparePassword(password, user.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Incorrect password" });
            return;
        }
        const token = yield jwt_1.default.generateToken(user.id);
        res.status(200).json(Object.assign(Object.assign({}, user), { token }));
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        const user = yield prisma_1.default.user.findFirst({
            where: { id: userId },
        });
        console.log(userId);
        if (!user) {
            res.status(401).json({ message: "User not found" });
        }
        res.status(200).json({
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            id: user === null || user === void 0 ? void 0 : user.id,
            createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
        });
        return;
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.getUser = getUser;

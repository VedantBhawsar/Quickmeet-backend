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
exports.authMiddleware = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : undefined;
    if (!token) {
        res.status(401).json({ message: "Authorization token is missing" });
        return;
    }
    try {
        yield jwt_1.default.verifyToken(token);
        const decoded = yield jwt_1.default.decodeToken(token);
        if (!decoded) {
            res.status(401).json({ message: "Authorization token is invalid" });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log(error.message);
        res
            .status(401)
            .json({ message: error.message || "Authorization token is invalid" });
    }
});
exports.authMiddleware = authMiddleware;

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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class jwtService {
    constructor() {
        this.jwtSecret = "secret";
    }
    generateToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, this.jwtSecret, { expiresIn: "24h" });
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.verify(token, this.jwtSecret);
        });
    }
    decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.decode(token, {
                json: true,
            });
        });
    }
}
exports.default = new jwtService();

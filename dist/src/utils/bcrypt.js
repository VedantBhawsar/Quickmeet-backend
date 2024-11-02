"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class bcryptService {
    constructor() {
        this.salt = bcrypt_1.default.genSaltSync(10);
    }
    hashPassword(password) {
        return bcrypt_1.default.hashSync(password, this.salt);
    }
    comparePassword(password, hash) {
        return bcrypt_1.default.compareSync(password, hash);
    }
}
exports.default = new bcryptService();

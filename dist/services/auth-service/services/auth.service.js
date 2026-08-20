"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const users_model_1 = __importStar(require("../../../shared/models/users.model"));
const token_model_1 = __importDefault(require("../../../shared/models/token.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const jwt_helper_1 = require("../../../shared/utils/jwt.helper");
const index_model_1 = require("../../../shared/models/index.model");
class AuthService {
    static formatUser(user) {
        const userJson = user.toJSON();
        const { password, ...userWithoutPassword } = userJson;
        return userWithoutPassword;
    }
    static async createSession(user, deviceDetail = 'Unknown Device') {
        const accessToken = (0, jwt_helper_1.generateAccessToken)(user);
        const refreshToken = (0, jwt_helper_1.generateRefreshToken)(user);
        const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || '30');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        await token_model_1.default.create({
            userId: user.id,
            token: refreshToken,
            deviceDetail,
            expiresAt,
            isValid: true
        });
        return { accessToken, refreshToken };
    }
    static async registerUser(userData) {
        const { firstName, lastName, email, phone, password, role, referredBy, deviceDetail } = userData;
        const existingEmail = await users_model_1.default.findOne({ where: { email } });
        if (existingEmail)
            throw new Error('Cet email est déjà utilisé');
        const existingPhone = await users_model_1.default.findOne({ where: { phone } });
        if (existingPhone)
            throw new Error('Ce numéro de téléphone est déjà utilisé');
        const t = await index_model_1.sequelize.transaction();
        try {
            let referrerId = null;
            if (referredBy) {
                const referrer = await users_model_1.default.findOne({ where: { referralCode: referredBy }, transaction: t });
                if (referrer) {
                    referrerId = referrer.id;
                }
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const myReferralCode = (0, nanoid_1.nanoid)(8).toUpperCase();
            const newUser = await users_model_1.default.create({
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                role: role || users_model_1.UserRole.CLIENT,
                referralCode: myReferralCode,
                referredBy: referrerId,
                isVerified: false,
                kycStatus: 'pending'
            }, { transaction: t });
            const wallet = await index_model_1.Wallet.create({
                userId: newUser.id,
                balance: 0,
                savingsBalance: 0
            }, { transaction: t });
            await index_model_1.CurrencyBalance.bulkCreate([
                { walletId: wallet.id, currency: 'USD', amount: 0 },
                { walletId: wallet.id, currency: 'PI', amount: 0 },
                { walletId: wallet.id, currency: 'BTC', amount: 0 }
            ], { transaction: t });
            await t.commit();
            const tokens = await this.createSession(newUser, deviceDetail);
            return {
                user: this.formatUser(newUser),
                ...tokens
            };
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async loginUser(credentials) {
        const { email, password, deviceDetail } = credentials;
        const user = await users_model_1.default.findOne({ where: { email } });
        if (!user)
            throw new Error('Identifiants invalides');
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error('Identifiants invalides');
        const tokens = await this.createSession(user, deviceDetail);
        return {
            user: this.formatUser(user),
            ...tokens
        };
    }
    static async changePassword(userId, data) {
        const { oldPassword, newPassword } = data;
        const user = await users_model_1.default.findByPk(userId);
        if (!user)
            throw new Error('Utilisateur introuvable');
        const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            throw new Error('Ancien mot de passe incorrect');
        user.password = await bcrypt_1.default.hash(newPassword, 10);
        await user.save();
        return true;
    }
    static async getUserById(userId) {
        const user = await users_model_1.default.findByPk(userId, { include: ['wallet'] });
        if (!user)
            throw new Error('Utilisateur introuvable');
        return this.formatUser(user);
    }
    static async updateUserProfile(userId, updateData) {
        const user = await users_model_1.default.findByPk(userId);
        if (!user)
            throw new Error('Utilisateur introuvable');
        const { firstName, lastName, email, phone } = updateData;
        if (email && email !== user.email) {
            const emailExists = await users_model_1.default.findOne({ where: { email } });
            if (emailExists)
                throw new Error('Cet email est déjà utilisé');
        }
        if (phone && phone !== user.phone) {
            const phoneExists = await users_model_1.default.findOne({ where: { phone } });
            if (phoneExists)
                throw new Error('Ce téléphone est déjà utilisé');
        }
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            phone: phone || user.phone
        });
        return this.formatUser(user);
    }
    static async logout(refreshToken) {
        const session = await token_model_1.default.findOne({ where: { token: refreshToken } });
        if (session) {
            await session.destroy();
            return true;
        }
        throw new Error('Session introuvable');
    }
    static async refreshAccessToken(refreshToken) {
        const session = await token_model_1.default.findOne({
            where: { token: refreshToken, isValid: true },
            include: [{ model: users_model_1.default, as: 'user' }]
        });
        if (!session || !session.user) {
            throw new Error('Session invalide');
        }
        if (new Date() > session.expiresAt) {
            await session.destroy();
            throw new Error('Session expirée');
        }
        return { accessToken: (0, jwt_helper_1.generateAccessToken)(session.user) };
    }
}
exports.AuthService = AuthService;

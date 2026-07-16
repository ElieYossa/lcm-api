import User, { UserRole } from '../../../shared/models/users.model';
import Token from '../../../shared/models/token.model';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/jwt.helper';
import { sequelize, Wallet, CurrencyBalance } from '../../../shared/models/index.model';

export class AuthService {

    private static formatUser(user: User) {
        const userJson = user.toJSON();
        const { password, ...userWithoutPassword } = userJson;
        return userWithoutPassword;
    }

    private static async createSession(user: User, deviceDetail: string = 'Unknown Device') {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || '30');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        await Token.create({
            userId: user.id,
            token: refreshToken,
            deviceDetail,
            expiresAt,
            isValid: true
        });

        return { accessToken, refreshToken };
    }

    static async registerUser(userData: any) {
        const { firstName, lastName, email, phone, password, role, referredBy, deviceDetail } = userData;

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) throw new Error('Cet email est déjà utilisé');

        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) throw new Error('Ce numéro de téléphone est déjà utilisé');

        const t = await sequelize.transaction();

        try {
            let referrerId = null;
            if (referredBy) {
                const referrer = await User.findOne({ where: { referralCode: referredBy }, transaction: t });
                if (referrer) {
                    referrerId = referrer.id;
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const myReferralCode = nanoid(8).toUpperCase();

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                role: role || UserRole.CLIENT,
                referralCode: myReferralCode,
                referredBy: referrerId,
                isVerified: false,
                kycStatus: 'pending'
            }, { transaction: t });

            const wallet = await Wallet.create({ 
                userId: newUser.id,
                balance: 0,
                savingsBalance: 0
            }, { transaction: t });

            await CurrencyBalance.bulkCreate([
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

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async loginUser(credentials: any) {
        const { email, password, deviceDetail } = credentials;

        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Identifiants invalides');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Identifiants invalides');

        const tokens = await this.createSession(user, deviceDetail);

        return {
            user: this.formatUser(user),
            ...tokens
        };
    }

    static async changePassword(userId: string, data: any) {
        const { oldPassword, newPassword } = data;
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Utilisateur introuvable');

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error('Ancien mot de passe incorrect');

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return true;
    }

    static async getUserById(userId: string) {
        const user = await User.findByPk(userId, { include: ['wallet'] });
        if (!user) throw new Error('Utilisateur introuvable');
        
        return this.formatUser(user);
    }

    static async updateUserProfile(userId: string, updateData: any) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Utilisateur introuvable');

        const { firstName, lastName, email, phone } = updateData;

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) throw new Error('Cet email est déjà utilisé');
        }

        if (phone && phone !== user.phone) {
            const phoneExists = await User.findOne({ where: { phone } });
            if (phoneExists) throw new Error('Ce téléphone est déjà utilisé');
        }

        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            phone: phone || user.phone
        });

        return this.formatUser(user);
    }

    static async logout(refreshToken: string) {
        const session = await Token.findOne({ where: { token: refreshToken } });
        if (session) {
            await session.destroy();
            return true;
        }
        throw new Error('Session introuvable');
    }

    static async refreshAccessToken(refreshToken: string) {
        const session = await Token.findOne({
            where: { token: refreshToken, isValid: true },
            include: [{ model: User, as: 'user' }]
        });

        if (!session || !session.user) {
            throw new Error('Session invalide');
        }

        if (new Date() > session.expiresAt) {
            await session.destroy();
            throw new Error('Session expirée');
        }

        return { accessToken: generateAccessToken(session.user) };
    }
}
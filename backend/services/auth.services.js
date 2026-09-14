import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import { sendMail } from "./mail.services.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest("hex");

export const registerUser = async ({ firstname, lastname, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: "user",
        isActive: true,
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account has been deactivated");
        error.statusCode = 403;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
    );

    return { token, user };
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error("Sorry, your email is not registered. Try with your registered email");
        error.statusCode = 404;
        throw error;
    }

    await PasswordReset.destroy({ where: { userId: user.id } });

    const rawToken = crypto.randomBytes(32).toString("hex");
    await PasswordReset.create({
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    try {
        await sendMail({
            to: user.email,
            subject: "Reset your password",
            html: `
                <p>Hi ${user.firstname},</p>
                <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `,
        });
    } catch (error) {
        console.error(`Failed to send password reset email to ${user.email}: ${error.message}`);
    }
};

export const resetPassword = async (rawToken, newPassword) => {
    const record = await PasswordReset.findOne({
        where: { tokenHash: hashToken(rawToken), used: false },
    });

    if (!record || record.expiresAt < new Date()) {
        const error = new Error("Invalid or expired reset link");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByPk(record.userId);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    record.used = true;
    await record.save();
};

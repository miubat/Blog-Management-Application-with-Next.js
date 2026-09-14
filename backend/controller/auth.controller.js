import { registerUser, loginUser, forgotPassword as forgotPasswordService, resetPassword as resetPasswordService } from "../services/auth.services.js";

export const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        const user = await registerUser({ firstname, lastname, email, password });
        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        await forgotPasswordService(req.body.email);
        res.status(200).json({ message: "Please check your email for the password reset link" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        await resetPasswordService(req.params.token, req.body.password);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await loginUser({ email, password });
        res.status(200).json({
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

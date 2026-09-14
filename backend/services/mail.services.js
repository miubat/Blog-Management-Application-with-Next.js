import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    const { GMAIL, GMAIL_APP_PASSWORD } = process.env;
    if (!GMAIL || !GMAIL_APP_PASSWORD) {
        const error = new Error("GMAIL and GMAIL_APP_PASSWORD must be set in backend/.env");
        error.statusCode = 500;
        throw error;
    }

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL, pass: GMAIL_APP_PASSWORD },
    });

    return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
    const info = await getTransporter().sendMail({
        from: process.env.GMAIL,
        to,
        subject,
        html,
    });
    return { messageId: info.messageId };
};

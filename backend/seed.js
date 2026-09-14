import bcrypt from "bcrypt";
import { sequelize, User } from "./models/index.js";

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "1234";

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });
        if (existingAdmin) {
            console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
        } else {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                firstname: "Admin",
                lastname: "User",
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin",
                isActive: true,
            });
            console.log(`Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();

import app from "./app.js";
import { sequelize } from "./models/index.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5001;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

start();

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PasswordReset = sequelize.define(
    "PasswordReset",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tokenHash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "password_resets",
        timestamps: true,
        createdAt: "createAt",
        updatedAt: "updateAt",
    }
);

export default PasswordReset;

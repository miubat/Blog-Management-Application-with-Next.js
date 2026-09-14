import sequelize from "../config/db.js";
import User from "./user.model.js";
import Blog from "./blog.model.js";
import PasswordReset from "./passwordReset.model.js";

User.hasMany(Blog, { foreignKey: "userId", as: "blogs", onDelete: "CASCADE" });
Blog.belongsTo(User, { foreignKey: "userId", as: "author" });

export { sequelize, User, Blog, PasswordReset };

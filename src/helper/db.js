
import mongoose from "mongoose";
export const database_urls = Object.freeze({
    connection: process.env.DB_URL || "mongodb://127.0.0.1:27017/",
    db_name: process.env.DB_NAME || "screp",
});
const connectDB = async () => {
    try {
        (async function () {
            const dbUri = database_urls.connection + database_urls.db_name;
            await mongoose.connect(dbUri, {
            });
            console.log("database connected successfully")
        })();
    } catch (error) {
        console.error("database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
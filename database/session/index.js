import mongoose from "mongoose";
import "dotenv/config";

const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

export const databaseConnection = async () =>
	mongoose.connect(process.env.MONGODB_URL, {
		useUnifiedTopology: true,
		dbName: `${MONGO_DB_NAME}`,
	});

export const databaseDisconnect = async () => await mongoose.connection.close();

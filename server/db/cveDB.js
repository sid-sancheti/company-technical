import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const URI = process.env.ATLAS_URI || "";

async function connectToDatabase() {
  try {
    await mongoose.connect(URI, { // Use mongoose.connect()
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

export default { mongoose, connectToDatabase };
/**
 * Is responsbile for forming the connection to the MongoDB database.
 *
 * @author Sid Sancheti
 */

const mongoose = require("mongoose");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const collectionName = project.env.COLLECTION_NAME;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

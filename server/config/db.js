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
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

/**
 * Is responsbile for forming the connection to the MongoDB database.
 *
 * @author Sid Sancheti
 */

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const client = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

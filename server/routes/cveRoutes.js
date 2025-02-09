/**
 * API Endpoint definitions
 * Passed values get moved to the controller.
 *
 * @author Sid Sancheti
 */

import express from "express";
const router = express.Router();
import db from "../db/cveDB.js";

import * as dotenv from "dotenv";
dotenv.config();

router.get("/", async (req, res) => {
  let collection = await db.collection(process.env.COLLECTION_NAME);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});



export default router;

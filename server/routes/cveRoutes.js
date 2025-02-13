/**
 * API Endpoint definitions
 * Passed values get moved to the controller.
 *
 * @author Sid Sancheti
 */

import express from "express";
const router = express.Router();
import {
  getSomeCves,
  getACve,
  getTotalCveCount,
} from "../controllers/cveController.js";

import * as dotenv from "dotenv";
dotenv.config();


router.get("/", getSomeCves);
router.get("/totalCount", getTotalCveCount);

router.get("/cve/:cveId", getACve);



export default router;

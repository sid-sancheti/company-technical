/**
 * CVE Service - Handles fetching, storing, and retrieving CVE data from MongoDB and the NVD API.
 * Business logic.
 *
 * @author Sid Sancheti
 */

// I can probably remove this file because I can migrate everything over to the controller.

import axios from "axios";
import Cve from "../models/Cve"; // Import CVE Mongoose model

import * as dotenv from "dotenv";
dotenv.config();


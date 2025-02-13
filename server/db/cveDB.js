import mongoose from "mongoose";
import Cve from "../models/Cve.js";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const URI = process.env.ATLAS_URI || "";

async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");
    console.log(
      `Connected to database: ${mongoose.connection.db.databaseName}`
    );

    // On startup, update the database with new data. If it is empty, fill it.
    const cveCount = await Cve.countDocuments();
    if (cveCount === 0) {
      await populateDatabase();
      console.log("Database populated with CVEs! Conatins", cveCount, "CVEs.");
    } else {
      console.log("Database already contains CVEs.");
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

/**
 * Called when the database connects to the MongoDB database.
 *
 * Ensures that the database is populated with CVEs from the NVD API.
 * TODO: Implement a method to update the database with new CVEs.
 */
async function populateDatabase() {
  // Get the total number of cves from the NVD API
  let currentCveCount = 0;
  let totalCves = 0;
  const resultsPerCall = 1000;
  do {
    try {
      console.log("Querying the NVD API for new CVEs...");
      console.log("Starting index:", currentCveCount);

      // Query the NVD API for new CVEs. If a status 500 is received, try again in 30 seconds.
      do {
        const response = await axios.get(
          "https://services.nvd.nist.gov/rest/json/cves/2.0/",
          {
            params: {
              resultsPerPage: resultsPerCall,
              startIndex: currentCveCount,
            },
          }
        );
        if (response.status === 503) {
          console.log("Received status 503. Retrying in 30 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 30000));
        }
      } while (response.status === 500);

      if (totalCves === 0) {
        totalCves = response.data.totalResults;
        console.log(`Total number of CVEs: ${totalCves}`);
      }

      currentCveCount += resultsPerCall;
      console.log(
        "\nUpdating the database with new CVEs...\nCurrent count:",
        currentCveCount
      );

      insertCves(response.data.vulnerabilities);

      // Sleep for 6 seconds
      await new Promise((resolve) => setTimeout(resolve, 6000));
    } catch (error) {
      console.error("Error fetching or saving CVEs:", error);
    }
  } while (currentCveCount < totalCves);

  console.log("Database updated with new CVEs!");
}

async function insertCves(cves) {
  try {
    let cveList = cves.map(async (vuln) => {
      console.log("CVEId:", vuln.cve.id);
      const newCve = new Cve({
        id: vuln.cve.id,
        sourceIdentifier: vuln.cve.sourceIdentifier,
        published: vuln.cve.published,
        lastModified: vuln.cve.lastModified,
        vulnStatus: vuln.cve.vulnStatus,
        cveTags: vuln.cve.cveTags,
        descriptions: vuln.cve.descriptions,
        metrics: {
          cvssMetricV2: vuln.cve.metrics.cvssMetricV2,
        },
        weaknesses: vuln.cve.weaknesses,
        configurations: vuln.cve.configurations,
        references: vuln.cve.references,
      });
      await newCve.save();
    });

  } catch (err) {
    console.error("Error inserting CVEs into the database:", err.message);
  }
}

export { mongoose, connectToDatabase };

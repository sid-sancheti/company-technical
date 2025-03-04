import mongoose from "mongoose";
import Cve from "../models/Cve.js";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const URI = process.env.ATLAS_URI || "";
const NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0/";
const RESULTS_PER_CALL = 1000;
const DELAY_BETWEEN_REQUESTS = 6000; // 6 seconds
const RETRY_DELAY = 30000; // 30 seconds

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

    const cveCount = await Cve.countDocuments();
    if (cveCount === 0) {
      await populateDatabase();
    } else {
      console.log("Database already contains CVEs. Updating...");
      await updateDatabase(); // Call updateDatabase if collection exists
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

async function fetchFromNvdApi(startIndex) {
  try {
    let response;
    do {
      response = await axios.get(NVD_API_URL, {
        params: {
          resultsPerPage: RESULTS_PER_CALL,
          startIndex,
        },
      });

      if (response.status === 503) {
        console.log("Received status 503. Retrying in 30 seconds...");
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else if (response.status !== 200) {
        console.error(`NVD API returned status ${response.status}`);
        throw new Error(`NVD API returned an error: ${response.status}`); // Throw an error for other non-200 statuses
      }
    } while (response.status === 503);

    return response.data;
  } catch (error) {
    console.error("Error fetching from NVD API:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function populateDatabase() {
  let currentCveCount = 0;
  let totalCves = 0;

  do {
    try {
      const data = await fetchFromNvdApi(currentCveCount);

      if (totalCves === 0) {
        totalCves = data.totalResults;
        console.log(`Total number of CVEs: ${totalCves}`);
      }

      currentCveCount += RESULTS_PER_CALL;
      console.log(
        "\nPopulating database with CVEs...\nCurrent count:",
        currentCveCount
      );

      await insertCves(data.vulnerabilities);
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_REQUESTS)
      );
    } catch (error) {
      console.error("Error in populateDatabase loop:", error);
      break; // Exit the loop on error
    }
  } while (currentCveCount < totalCves);

  console.log("Database populated with CVEs!");
}

async function updateDatabase() {
  let currentCveCount = 0;
  let totalCves = 0;

  do {
    try {
      const data = await fetchFromNvdApi(currentCveCount);

      if (totalCves === 0) {
        totalCves = data.totalResults;
        console.log(`Total number of CVEs: ${totalCves}`);
      }

      currentCveCount += RESULTS_PER_CALL;
      console.log(
        "\nUpdating database with CVEs...\nCurrent count:",
        currentCveCount
      );

      await updateCves(data.vulnerabilities); // Use updateCves function
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_REQUESTS)
      );
    } catch (error) {
      console.error("Error in updateDatabase loop:", error);
      break; // Exit the loop on error
    }
  } while (currentCveCount < totalCves);

  console.log("Database update complete.");
}

async function insertCves(cves) {
  if (!cves || cves.length === 0) return; // Handle empty or missing vulnerabilities

  try {
    const cvePromises = cves.map(async (vuln) => {
      try {
        const newCve = new Cve(createCveObject(vuln));
        await newCve.save();
        console.log("Inserted CVE:", vuln.cve.id);
      } catch (innerError) {
        console.error("Error inserting CVE:", vuln.cve.id, innerError.message);
      }
    });

    await Promise.all(cvePromises);
  } catch (error) {
    console.error("Error in insertCves:", error);
  }
}

async function updateCves(cves) {
  if (!cves || cves.length === 0) return;

  try {
    const updatePromises = cves.map(async (vuln) => {
      try {
        const cveData = createCveObject(vuln);
        const result = await Cve.updateOne(
          { id: vuln.cve.id },
          { $set: cveData },
          { upsert: true }
        );
        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          console.log(`Updated CVE: ${vuln.cve.id}`);
        } else {
          console.log(`CVE ${vuln.cve.id} not found, inserting`);
          const newCve = new Cve(cveData);
          await newCve.save();
        }
      } catch (innerError) {
        console.error("Error updating CVE:", vuln.cve.id, innerError);
      }
    });
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error in updateCves:", error);
  }
}

const createCveObject = (vuln) => ({
  id: vuln.cve.id,
  sourceIdentifier: vuln.cve.sourceIdentifier,
  published: vuln.cve.published,
  lastModified: vuln.cve.lastModified,
  vulnStatus: vuln.cve.vulnStatus,
  cveTags: vuln.cve.cveTags,
  descriptions: vuln.cve.descriptions,
  metrics: {
    cvssMetricV2: vuln.cve.metrics?.cvssMetricV2 || [], // Handle potential undefined metrics
  },
  weaknesses: vuln.cve.weaknesses,
  configurations: vuln.cve.configurations,
  references: vuln.cve.references,
});

export { mongoose, connectToDatabase };

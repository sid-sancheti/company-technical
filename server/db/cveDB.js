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
  // do {
    try {
      const response = await axios.get(
        "https://services.nvd.nist.gov/rest/json/cves/2.0/",
        {
          params: {
            resultsPerPage: resultsPerCall,
            startIndex: currentCveCount,
          },
        }
      );

      if (totalCves === 0) {
        totalCves = response.data.totalResults;
        console.log(`Total number of CVEs: ${totalCves}`);
      }

      currentCveCount += resultsPerCall;
      const cves = response.data.vulnerabilities;
      console.log("\nUpdating the database with new CVEs...\nCurrent count:", currentCveCount);

      insertCves(cves);
      await new Promise((resolve) => setTimeout(resolve, 6000));
    } catch (error) {
      console.error("Error fetching or saving CVEs:", error);
    }

    // Sleep for 6 seconds to avoid rate limiting
  // } while (currentCveCount < totalCves);

  console.log("Database updated with new CVEs!");
}

async function insertCves(cves) {
  // Map each CVE in the cves array to a new Cve instance
  const cvePromises = cves.slice(0, 1000).map(async (cveData) => {
    const newCve = new Cve({
      id: cveData.cve.id,
      sourceIdentifier: cveData.cve.sourceIdentifier,
      published: new Date(cveData.cve.published),
      lastModified: new Date(cveData.cve.lastModified),
      vulnStatus: cveData.cve.vulnStatus,
      cveTags: cveData.cve.cveTags || [],
      descriptions: cveData.cve.descriptions.map((desc) => ({
        lang: desc.lang,
        value: desc.value,
      })),
      metrics: {
        cvssMetricV2: cveData.cve.metrics.cvssMetricV2.map((metric) => ({
          source: metric.source,
          type: metric.type,
          cvssData: {
            version: metric.cvssData.version,
            vectorString: metric.cvssData.vectorString,
            baseScore: metric.cvssData.baseScore,
            accessVector: metric.cvssData.accessVector,
            accessComplexity: metric.cvssData.accessComplexity,
            authentication: metric.cvssData.authentication,
            confidentialityImpact: metric.cvssData.confidentialityImpact,
            integrityImpact: metric.cvssData.integrityImpact,
            availabilityImpact: metric.cvssData.availabilityImpact,
          },
          baseSeverity: metric.baseSeverity,
          exploitabilityScore: metric.exploitabilityScore,
          impactScore: metric.impactScore,
          acInsufInfo: metric.acInsufInfo,
          obtainAllPrivilege: metric.obtainAllPrivilege,
          obtainUserPrivilege: metric.obtainUserPrivilege,
          obtainOtherPrivilege: metric.obtainOtherPrivilege,
          userInteractionRequired: metric.userInteractionRequired,
        })),
      },
      weaknesses: cveData.cve.weaknesses.map((weakness) => ({
        source: weakness.source,
        type: weakness.type,
        description: weakness.description.map((desc) => ({
          lang: desc.lang,
          value: desc.value,
        })),
      })),
      configurations: cveData.cve.configurations.map((config) => ({
        nodes: config.nodes.map((node) => ({
          operator: node.operator,
          negate: node.negate,
          cpeMatch: node.cpeMatch.map((cpe) => ({
            vulnerable: cpe.vulnerable,
            criteria: cpe.criteria,
            matchCriteriaId: cpe.matchCriteriaId,
          })),
        })),
      })),
      references: cveData.cve.references.map((ref) => ({
        url: ref.url,
        source: ref.source,
      })),
    });
    console.log("Saving new CVE:", newCve.id);
    await newCve.save(); // Save each newCve instance
  });

  // Wait for all promises to resolve
  await Promise.all(cvePromises);
}

export { mongoose, connectToDatabase };

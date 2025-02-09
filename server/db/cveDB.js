import mongoose from "mongoose";
import Cve from "../models/Cve.js";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const URI = process.env.ATLAS_URI || "";

async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      // Use mongoose.connect()
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");

    // On startup, update the database with new data. If it is empty, fill it.
    const cveCount = await Cve.countDocuments();
    if (cveCount === 0) {
      await populateDatabase();
      console.log("Database populated with CVEs!");
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

async function populateDatabase() {
  // Get the total number of cves from the NVD API
  let currentCveCount = 0;
  let totalCves = 0;
  const resultsPerCall = 1000;
  do {
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
      }

      currentCveCount += resultsPerCall;
      const cves = response.data.vulnerabilities; // Assuming this is how the NVD API returns data

      for (const cve of cves) {
        try {
          const newCve = new Cve({
            cveId: cve.cve.id,
            sourceIdentifier: cve.cve.sourceIdentifier,
            published: cve.cve.published,
            lastModified: cve.cve.lastModified,
            vulnStatus: cve.cve.vulnStatus,
            descriptions: cve.cve.descriptions.map((desc) => ({
              lang: desc.lang,
              value: desc.value,
            })),
            metrics: {
              cvssMetricV2: cve.cve.metrics.cvssMetricV2.map((metric) => ({
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
            weaknesses: cve.cve.weaknesses.map((weakness) => ({
              source: weakness.source,
              type: weakness.type,
              description: weakness.description.map((desc) => ({
                lang: desc.lang,
                value: desc.value,
              })),
            })),
            configurations: cve.cve.configurations.map((config) => ({
              nodes: config.nodes.map((node) => ({
                operator: node.operator,
                negate: node.negate,
                cpeMatch: node.cpeMatch.map((match) => ({
                  vulnerable: match.vulnerable,
                  criteria: match.criteria,
                  matchCriteriaId: match.matchCriteriaId,
                })),
              })),
            })),
            references: cve.cve.references.map((ref) => ({
              url: ref.url,
              source: ref.source,
            })),
          });

          await newCve.save(); // Save the CVE
          console.log(`Saved CVE: ${cve.cve.id}`);
        } catch (error) {
          if (error.code === 11000 && error.keyPattern.cveId === 1) {
            console.warn(`Duplicate CVE found: ${cve.cve.id}, skipping...`);
            // You can update the existing CVE here if needed instead of skipping
          } else {
            console.error(`Error saving CVE ${cve.cve.id}:`, error);
            // Handle other errors (e.g., validation errors, connection errors)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching or saving CVEs:", error);
    }

    // Sleep for 6 seconds to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } while (currentCveCount < totalCves);
}

export { mongoose, connectToDatabase };

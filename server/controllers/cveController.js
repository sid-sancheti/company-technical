/**
 * Controller for handling CVE-related API requests.
 *
 * @author Sid Sancheti
 */

const { getAllCves, getCveById } = require("../services/cveService");

/**
 * The number of results to display per page.
 * Default value is 10.
 */
let resultsPerPage = 10;

/**
 * Sets the number of results to display per page.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const setResultsPerPage = async (req, res) => {
  try {
    const newResultsPerPage = req.body.resultsPerPage;
    resultsPerPage = newResultsPerPage;
    console.log("Results per page updated to:", resultsPerPage);
    res.json({ message: "Results per page updated successfully" });
  } catch (error) {
    console.error("Error setting results per page:", error);
    res.status(500).json({ message: "Error setting results per page" });
  }
};

// Function to simulate a sleep/delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches and stores CVEs from the NVD API.
 * This function will "sleep" for 6 seconds to adhere to NVD API's best practices.
 */
const fetchAndStoreCves = async () => {
  let startIndex = 0;
  let totalResults = null;
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    while (totalResults === null || startIndex < totalResults) {
      const url = `${API_URL}?startIndex=${startIndex}`;
      console.log(`📡 Fetching data from: ${url}`);

      const response = await axios.get(url);
      const {
        resultsPerPage,
        vulnerabilities,
        totalResults: newTotal,
      } = response.data;

      if (totalResults === null) totalResults = newTotal;
      console.log(
        `📊 Total CVEs: ${totalResults} | Downloading ${resultsPerPage} records...`
      );

      // Process and insert data into MongoDB
      const documents = vulnerabilities.map((v) => ({
        cveId: v.cve.id,
        descriptions: v.cve.descriptions,
        published: v.cve.published,
        lastModified: v.cve.lastModified,
        metrics: v.cve.metrics,
        references: v.cve.references,
      }));

      // Insert into MongoDB (upsert to avoid duplicates)
      const bulkOps = documents.map((doc) => ({
        updateOne: {
          filter: { cveId: doc.cveId },
          update: { $set: doc },
          upsert: true,
        },
      }));

      await collection.bulkWrite(bulkOps);
      console.log(`✅ Inserted/Updated ${documents.length} CVE records`);

      startIndex += RESULTS_PER_PAGE;
      setTimeout(() => {}, 6000); // 6 second delay
    }

    console.log("🎉 Data fetching complete!");
    await client.close();
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
};

/**
 * Gets all CVEs with optional pagination, filtering, and sorting.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const getCves = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || {}; // Implement your filtering logic here
    const sort = req.query.sort || {}; // Implement your sorting logic here

    const result = await getAllCves(page, resultsPerPage, filter, sort);
    res.json(result);
  } catch (error) {
    console.error("Error getting CVEs:", error);
    res.status(500).json({ message: "Error getting CVEs" });
  }
};

/**
 * Gets a single CVE by ID.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const getCve = async (req, res) => {
  try {
    const cveId = req.params.id;
    const cve = await getCveById(cveId);

    if (!cve) {
      return res.status(404).json({ message: "CVE not found" });
    }

    res.json(cve);
  } catch (error) {
    console.error("Error getting CVE:", error);
    res.status(500).json({ message: "Error getting CVE" });
  }
};

module.exports = {
  fetchAndStoreCves,
  getCves,
  getCve,
  setResultsPerPage,
};

/**
 * Controller for handling CVE-related API requests.
 *
 * @author Sid Sancheti
 */

const {
  getAllCves,
  getCveById,
} = require("../services/cveService");

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
    const newResultsPerPage = req.body.resultsPerPage; // Correctly access the value from req.body
    resultsPerPage = newResultsPerPage; // Update the variable
    console.log('Results per page updated to:', resultsPerPage);
    res.json({ message: 'Results per page updated successfully' });
  } catch (error) {
    console.error('Error setting results per page:', error);
    res.status(500).json({ message: 'Error setting results per page' });
  }
};

// Function to simulate a sleep/delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches and stores CVEs from the NVD API.
 * This function will "sleep" for 6 seconds to adhere to NVD API's best practices.
 */
const fetchAndStoreCves = async () => {
  try {
    let startIndex = 0;
    const resultsPerPage = 2000; // Adjust as needed
    let totalResults = 0;

    do {
      const response = await axios.get(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`
      );
      totalResults = response.data.totalResults;
      const cves = response.data.vulnerabilities;

      const cveDocuments = cves.map(
        (cve) =>
          new Cve({
            cveId: cve.cve.id,
            sourceIdentifier: cve.cve.sourceIdentifier,
            published: cve.cve.published,
            lastModified: cve.cve.lastModified,
            vulnStatus: cve.cve.vulnStatus,
            descriptions: cve.cve.descriptions,
            metrics: cve.cve.metrics,
            weaknesses: cve.cve.weaknesses,
            configurations: cve.cve.configurations,
            references: cve.cve.references,
          })
      );

      await Cve.insertMany(cveDocuments, { ordered: false }); // Use ordered: false to skip errors

      startIndex += resultsPerPage;

      // Program sleeps to adhere to NVD api's best practices for time between calls.
      await sleep(6000);

    } while (startIndex < totalResults);

    console.log("CVE data fetched and stored successfully!");
  } catch (error) {
    console.error("Error fetching or storing CVEs:", error);
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

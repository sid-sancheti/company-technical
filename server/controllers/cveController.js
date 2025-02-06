/**
 * Controller for handling CVE-related API requests.
 * 
 * @author Sid Sancheti
 */

const {
  fetchCveData,
  transformAndSaveCveData,
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
    const newResultsPerPage = req.body.resultsPerPage;
    resultsPerPage = newResultsPerPage;
    console.log("Results per page updated to:", resultsPerPage);
    res.json({ message: "Results per page updated successfully" });
  } catch (error) {
    console.error("Error setting results per page:", error);
    res.status(500).json({ message: "Error setting results per page" });
  }
};

/**
 * Fetches and stores CVEs from the NVD API.
 */
const fetchAndStoreCves = async () => {
  try {
    let startIndex = 0;
    const resultsPerPage = 2000; // TODO: Get this value from the UI Dropdown menu.
    let totalResults = 0;

    do {
      const data = await fetchCveData(startIndex, resultsPerPage);
      totalResults = data.totalResults;

      await transformAndSaveCveData(data.CVE_Items);

      startIndex += resultsPerPage;
    } while (startIndex < totalResults);

    console.log("CVE data fetched and stored successfully!");
  } catch (error) {
    console.error("Error in CVE pipeline:", error);
    // Additional error handling or logging as needed
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
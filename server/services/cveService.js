/**
 * CVE Service - Handles fetching, storing, and retrieving CVE data from MongoDB and the NVD API.
 *
 * @author Sid Sancheti
 */

const axios = require("axios");
const Cve = require("../models/Cve"); // Import CVE Mongoose model

const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0/";

/**
 * Fetch CVE data from the NVD API.
 * @param {number} startIndex - The starting index for pagination.
 * @param {number} resultsPerPage - The number of results per request.
 * @returns {Promise<Object>} - The API response data.
 */
const fetchCveData = async (startIndex, resultsPerPage) => {
    try {
        const response = await axios.get(`${BASE_URL}?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching CVE data:", error);
        throw new Error("Failed to fetch CVE data from NVD API");
    }
};

/**
 * Transforms and stores CVE data in MongoDB.
 * @param {Array} cveItems - List of CVEs from the NVD API.
 * @returns {Promise<void>}
 */
const transformAndSaveCveData = async (cveItems) => {
    try {
        const transformedCves = cveItems.map((cve) => ({
            cveId: cve.cve.CVE_data_meta.ID,
            description: cve.cve.description?.description_data[0]?.value || "No description available",
            publishedDate: cve.publishedDate,
            lastModifiedDate: cve.lastModifiedDate,
            severity: cve.impact?.baseMetricV3?.cvssV3?.baseSeverity || "UNKNOWN",
            // Add more fields as needed
        }));

        await Cve.insertMany(transformedCves, { ordered: false });
        console.log("CVE data successfully saved to MongoDB.");
    } catch (error) {
        console.error("Error saving CVE data:", error);
        throw new Error("Failed to save CVE data to database");
    }
};

/**
 * Retrieves paginated CVEs from the database.
 * @param {number} page - The page number.
 * @param {number} limit - The number of results per page.
 * @param {Object} filter - Optional filtering criteria.
 * @param {Object} sort - Sorting options.
 * @returns {Promise<Object>} - Paginated CVE data.
 */
const getAllCves = async (page = 1, limit = 10, filter = {}, sort = {}) => {
    try {
        const options = { page, limit, sort };
        const cves = await Cve.paginate(filter, options);
        return cves;
    } catch (error) {
        console.error("Error retrieving CVEs:", error);
        throw new Error("Failed to retrieve CVEs from database");
    }
};

/**
 * Retrieves a single CVE by its ID.
 * @param {string} cveId - The CVE ID (e.g., "CVE-1999-0095").
 * @returns {Promise<Object|null>} - The CVE document, or null if not found.
 */
const getCveById = async (cveId) => {
    try {
        return await Cve.findOne({ cveId });
    } catch (error) {
        console.error("Error retrieving CVE by ID:", error);
        throw new Error("Failed to retrieve CVE");
    }
};

/**
 * Checks if the database is empty.
 * @returns {Promise<boolean>} - True if the database is empty, otherwise false.
 */
const checkDatabaseEmpty = async () => {
    try {
        const count = await Cve.countDocuments();
        return count === 0;
    } catch (error) {
        console.error("Error checking database:", error);
        throw new Error("Failed to check database state");
    }
};

/**
 * Updates the results-per-page setting.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const setResultsPerPage = async (req, res) => {
    try {
        const { resultsPerPage } = req.body;
        if (!resultsPerPage || typeof resultsPerPage !== "number" || resultsPerPage <= 0) {
            return res.status(400).json({ message: "Invalid resultsPerPage value" });
        }

        console.log("Results per page updated to:", resultsPerPage);
        res.json({ message: "Results per page updated successfully" });
    } catch (error) {
        console.error("Error updating results per page:", error);
        res.status(500).json({ message: "Failed to update results per page" });
    }
};

module.exports = {
    fetchCveData,
    transformAndSaveCveData,
    getAllCves,
    getCveById,
    checkDatabaseEmpty,
    setResultsPerPage,
};

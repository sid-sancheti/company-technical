// services/cveServices.js

const axios = require("axios");
const Cve = require("../models/Cve");

// Fetch CVE data from the NVD API
const fetchCveData = async (startIndex, resultsPerPage) => {
  try {
    const response = await axios.get(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`,
      {
        headers: {
          apiKey: process.env.NVD_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching CVE data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Transform and save CVE data to MongoDB
// TODO: Configure my MongoDB data
const transformAndSaveCveData = async (cveItems) => {
  try {
    const transformedCves = cveItems.map((cve) => ({
      // Map NVD API response fields to your Mongoose schema
      cveId: cve.cve.CVE_data_meta.ID,
      //... other fields...
    }));

    await Cve.insertMany(transformedCves, { ordered: false }); // Use ordered: false to skip errors
  } catch (error) {
    console.error("Error transforming or saving CVE data:", error);
    throw error; // Re-throw for caller to handle
  }
};

// Get all CVEs from the database (with optional pagination, filtering, sorting)
const getAllCves = async (page = 1, limit = 10, filter = {}, sort = {}) => {
  try {
    const options = {
      page: page,
      limit: limit,
      sort: sort,
    };

    const cves = await Cve.paginate(filter, options);
    return cves;
  } catch (error) {
    console.error("Error getting all CVEs:", error);
    throw error;
  }
};

// Get a single CVE by ID
const getCveById = async (cveId) => {
  try {
    const cve = await Cve.findOne({ cveId: cveId });
    return cve;
  } catch (error) {
    console.error("Error getting CVE by ID:", error);
    throw error;
  }
};

/**
 * Sets the number of results to display per page.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const setResultsPerPage = async (req, res) => {
  try {
    const newResultsPerPage = req.body.resultsPerPage; // Access the new value from the request body
    resultsPerPage = newResultsPerPage; // Update the `resultsPerPage` variable
    console.log("Results per page updated to:", resultsPerPage);
    res.json({ message: "Results per page updated successfully" }); // Send a success response
  } catch (error) {
    console.error("Error setting results per page:", error);
    res.status(500).json({ message: "Error setting results per page" }); // Send an error response
  }
};

/**
 * Checks the database to see if it is empty.
 * Used to determine if the database needs to be populated with data.
 *
 * @returns {boolean} True if the database is empty, false otherwise
 */
const checkDatabaseEmpty = async () => {
  try {
    const count = await Cve.countDocuments();
    return count === 0;
  } catch (error) {
    console.error("Error checking database:", error);
    throw error;
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

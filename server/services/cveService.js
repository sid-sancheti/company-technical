// services/cveServices.js

const axios = require('axios');
const Cve = require('../models/Cve');

// Fetch CVE data from the NVD API
const fetchCveData = async (startIndex, resultsPerPage) => {
    try {
        const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`, {
            headers: {
                'apiKey': process.env.NVD_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching CVE data:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

// Transform and save CVE data to MongoDB
const transformAndSaveCveData = async (cveItems) => {
    try {
        const transformedCves = cveItems.map(cve => ({
            // Map NVD API response fields to your Mongoose schema
            cveId: cve.cve.CVE_data_meta.ID,
            //... other fields...
        }));

        await Cve.insertMany(transformedCves, { ordered: false }); // Use ordered: false to skip errors
    } catch (error) {
        console.error('Error transforming or saving CVE data:', error);
        throw error; // Re-throw for caller to handle
    }
};

// Get all CVEs from the database (with optional pagination, filtering, sorting)
const getAllCves = async (page = 1, limit = 10, filter = {}, sort = {}) => {
    try {
        const options = {
            page: page,
            limit: limit,
            sort: sort
        };

        const cves = await Cve.paginate(filter, options);
        return cves;
    } catch (error) {
        console.error('Error getting all CVEs:', error);
        throw error;
    }
};

// Get a single CVE by ID
const getCveById = async (cveId) => {
    try {
        const cve = await Cve.findOne({ cveId: cveId });
        return cve;
    } catch (error) {
        console.error('Error getting CVE by ID:', error);
        throw error;
    }
};

module.exports = {
    fetchCveData,
    transformAndSaveCveData,
    getAllCves,
    getCveById
};

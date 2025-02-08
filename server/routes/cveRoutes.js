const express = require("express");
const router = express.Router();
const { query, validationResult } = require("express-validator");
const cveService  = require("../services/cveService");

// TODO: Verify this route
// Search CVEs - with input validation
router.get(
  "/search",
  [
    query("cveId")
      .optional()
      .trim()
      .escape()
      .isString()
      .matches(/^CVE-\d{4}-\d{4,}$/), // Validate CVE ID format
    query("severity")
      .optional()
      .trim()
      .escape()
      .isIn(["CRITICAL", "HIGH", "MEDIUM", "LOW"])
      .toUpperCase(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      }); // Return validation errors
    }

    try {
      const { cveId, severity } = req.query;
      const results = await cveService.searchCves(cveId, severity); // Removed req.db
      res.json(results);
    } catch (error) {
      console.error("Error in /search route:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

/**
 * Get all CVEs with optional pagination.
 * 
 */
router.get(
  "/",
  [
    query("limit").optional().isInt({ min: 10, max: 500 }).toInt(), // Limit between 10-500
    query("page").optional().isInt({ min: 1 }).toInt(), // Page must be >= 1
		// query("filter").optional().isString().escape(),									// When we want to get the first n rows filtered by a value.
		// query("sort").optional().isString().escape(),		  							// When we want to sort the results by a value.
		// query("ascending").optional().isBoolean().toBoolean()						// When we want to sort the results in ascending order.
	],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      }); // Return validation errors
    }
    try {
      // Extract pagination params
      const limit = req.query.limit || 10; // Default: 10
      const page = req.query.page || 1; // Default: 1
			// const filter = req.query.filter || {}; // Default: empty object
			// const sort = req.query.sort || {}; // Default: empty object
			// const ascending = req.query.ascending || true; // Default: true
      const skip = (page - 1) * limit; // Calculate offset

      // Fetch paginated CVEs from MongoDB
      const results = await cveService.getAllCves(limit, skip);

      res.json({
        page,
        limit,
        totalRecords: results.totalRecords,
        totalPages: Math.ceil(results.totalRecords / limit),
        data: results.cves,
      });
    } catch (error) {
      console.error("Error in /api/cves route:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

router.post("/set-results-per-page", setResultsPerPage);
module.exports = router;

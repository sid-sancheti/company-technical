const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const {
  cveService,
  setResultsPerPage
} = require('../services/cveService');

// Search CVEs - with input validation
router.get('/search', [
  query('cveId').optional().trim().escape().isString().matches(/^CVE-\d{4}-\d{4,}$/), // Validate CVE ID format
  query('severity').optional().trim().escape().isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).toUpperCase(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    }); // Return validation errors
  }

  try {
    const {
      cveId,
      severity
    } = req.query;
    const results = await cveService.searchCves(cveId, severity); // Removed req.db
    res.json(results);
  } catch (error) {
    console.error('Error in /search route:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

//Get all CVEs with validation
router.get('/', [
  // Optional: Add validation for pagination parameters if needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    }); // Return validation errors
  }
  try {
    const result = await cveService.getAllCves(); // Removed req.db
    res.json(result);
  } catch (error) {
    console.error('Error in / route:', error); // Log the error
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    }); // Send error message
  }
});



router.post('/set-results-per-page', setResultsPerPage);
module.exports = router;
/**
 * Controller for handling CVE-related API requests.
 * Acts as a bridge between the client and the business logic.
 * Handles incoming requests, extract relavent data, and prepare a response to send back the the client.
 *
 * @author Sid Sancheti
 */

// For some reason, the server crashes after I make another request to the api. This is an issue.

import db from "../db.js";
import Cve from "../models/Cve.js";

/**
 * Finds "items" number of CVES starting from "page" number.
 *
 * @param {*} req
 * @param {*} res
 * @author Sid Sancheti
 */
export const getSomeCves = (req, res) => {
  const collection = db.collection("cves");
  const itemsPerPage = parseInt(req.query.items) || 10;
  const pageNumber = parseInt(req.query.page) || 1;

  const skip = (pageNumber - 1) * itemsPerPage;
  Cve.find({})
    .skip(skip)
    .limit(itemsPerPage)
    .exec()
    .then((cves) => {
      if (!cves) {
        return res.status(404).json({ message: "No CVEs found" });
      }
      res.json({ cves, page: pageNumber, itemsPerPage });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  console.log(`Items per page: ${itemsPerPage}`);
  console.log(`Page number: ${pageNumber}`);

  res.json({ message: "Handling get some Cves", itemsPerPage, pageNumber });
};

/**
 * Finds a CVE matching the cveId and returns it.
 *
 * @param {*} req
 * @param {*} res
 */

export const getACve = (req, res) => {
  const cveId = req.params.cveId;

  Cve.findOne({ cveId: cveId })
    .exec()
    .then((cve) => {
      if (!cve) {
        // Handle the case where the CVE is not found
        return res.status(404).json({ message: "CVE not found" });
      }
      res.json(cve);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  console.log(`Handling get a CVE with ID: ${cveId}`); // This will now log *after* the request is handled.
};

//TODO: Implement a method to check for duplicate cveIds and remove one.

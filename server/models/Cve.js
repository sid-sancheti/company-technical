import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import * as dotenv from "dotenv";
dotenv.config();

const cveSchema = new mongoose.Schema({
  cveId: {
    type: String,
    required: true,
    unique: true,
  },
  sourceIdentifier: {
    type: String,
  },
  published: {
    type: Date,
  },
  lastModified: {
    type: Date,
  },
  vulnStatus: {
    type: String,
  },
  descriptions: [
    {
      lang: String,
      value: String,
    },
  ],
  metrics: {
    cvssMetricV2: [
      {
        source: String,
        type: String,
        cvssData: {
          version: String,
          vectorString: String,
          baseScore: Number,
          accessVector: String,
          accessComplexity: String,
          authentication: String,
          confidentialityImpact: String,
          integrityImpact: String,
          availabilityImpact: String,
        },
        baseSeverity: String,
        exploitabilityScore: Number,
        impactScore: Number,
        acInsufInfo: Boolean,
        obtainAllPrivilege: Boolean,
        obtainUserPrivilege: Boolean,
        obtainOtherPrivilege: Boolean,
        userInteractionRequired: Boolean,
      },
    ],
  },
  weaknesses: [
    {
      source: String,
      type: String,
      description: [
        {
          lang: String,
          value: String,
        },
      ],
    },
  ],
  configurations: [
    {
      nodes: [
        {
          operator: String,
          negate: Boolean,
          cpeMatch: [
            {
              vulnerable: Boolean,
              criteria: String,
              matchCriteriaId: String,
            },
          ],
        },
      ],
    },
  ],
  references: [
    {
      url: String,
      source: String,
    },
  ],
});

cveSchema.plugin(mongoosePaginate);

/**
 * Helper function to find a CVE by its ID.
 * Note: The findOne method is defined by MongoDB and Mongoose.
 * 
 * @param {string} cveId - The CVE ID to search for.
 * @returns {Promise<Object|null>} - The found CVE document or null if not found.
 */
cveSchema.statics.findByCveId = async function (cveId) {
  return await this.findOne({ cveId });
};

/**
* Retrieves the most recent CVEs based on the published date.
* @param {number} limit - Number of CVEs to retrieve.
* @returns {Promise<Array>} - List of recent CVEs.
*/
cveSchema.statics.getRecentCves = async function (limit = 10) {
  return await this.find().sort({ published: -1 }).limit(limit);
};

/**
* Searches CVEs based on a keyword in the description.
* @param {string} keyword - The keyword to search for.
* @param {number} limit - The number of results to return.
* @returns {Promise<Array>} - List of matching CVEs.
*/
cveSchema.statics.searchCvesByKeyword = async function (keyword, limit = 10) {
  return await this.find({
      "descriptions.value": { $regex: keyword, $options: "i" },
  }).limit(limit);
};

/**
* Deletes a CVE by its ID.
* @param {string} cveId - The CVE ID to delete.
* @returns {Promise<Object|null>} - The deleted CVE document or null if not found.
*/
cveSchema.statics.deleteCveById = async function (cveId) {
  return await this.findOneAndDelete({ cveId });
};

/**
* Updates a CVE by its ID.
* @param {string} cveId - The CVE ID to update.
* @param {Object} updateData - The data to update.
* @returns {Promise<Object|null>} - The updated CVE document or null if not found.
*/
cveSchema.statics.updateCveById = async function (cveId, updateData) {
  return await this.findOneAndUpdate({ cveId }, updateData, { new: true });
};

const Cve = mongoose.model("Cve", cveSchema, process.env.COLLECTION_NAME);

export default Cve;

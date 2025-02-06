const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
const Cve = mongoose.model("Cve", cveSchema);

module.exports = Cve;

import { mongoose } from "../db/cveDB.js";
import mongoosePaginate from "mongoose-paginate-v2";
import * as dotenv from "dotenv";
dotenv.config();


// CVE Schema
const cvssDataSchema = new mongoose.Schema({
  version: { type: String, required: true },
  vectorString: { type: String, required: true },
  baseScore: { type: Number, required: true },
  accessVector: { type: String, required: true },
  accessComplexity: { type: String, required: true },
  authentication: { type: String, required: true },
  confidentialityImpact: { type: String, required: true },
  integrityImpact: { type: String, required: true },
  availabilityImpact: { type: String, required: true },
});

const cvssMetricV2Schema = new mongoose.Schema({
  source: { type: String, required: true },
  type: { type: String, required: true },
  cvssData: cvssDataSchema,
  baseSeverity: { type: String, required: true },
  exploitabilityScore: { type: Number, required: true },
  impactScore: { type: Number, required: true },
  acInsufInfo: { type: Boolean, required: true },
  obtainAllPrivilege: { type: Boolean, required: true },
  obtainUserPrivilege: { type: Boolean, required: true },
  obtainOtherPrivilege: { type: Boolean, required: true },
  userInteractionRequired: { type: Boolean, required: true },
});

const descriptionSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  value: { type: String, required: true },
});

const weaknessesDescriptionSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  value: { type: String, required: true },
});

const cpeMatchSchema = new mongoose.Schema({
  vulnerable: { type: Boolean, required: true },
  criteria: { type: String, required: true },
  matchCriteriaId: { type: String, required: true },
});

const nodeSchema = new mongoose.Schema({
  operator: { type: String, required: true },
  negate: { type: Boolean, required: true },
  cpeMatch: [cpeMatchSchema],
});

const configurationSchema = new mongoose.Schema({
  nodes: [nodeSchema],
});

const referenceSchema = new mongoose.Schema({
  url: { type: String, required: true },
  source: { type: String, required: true },
});

const cveSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sourceIdentifier: { type: String, required: true },
  published: { type: Date, required: true },
  lastModified: { type: Date, required: true },
  vulnStatus: { type: String, required: true },
  cveTags: [String],
  descriptions: [descriptionSchema],
  metrics: {
    cvssMetricV2: [cvssMetricV2Schema],
  },
  weaknesses: [
    {
      source: { type: String, required: true },
      type: { type: String, required: true },
      description: [weaknessesDescriptionSchema],
    },
  ],
  configurations: [configurationSchema],
  references: [referenceSchema],
});

cveSchema.plugin(mongoosePaginate);

const Cve = mongoose.model("Cve", cveSchema, process.env.COLLECTION_NAME);

export default Cve;

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // For pagination

const cveSchema = new mongoose.Schema({
  cveId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  publishedDate: {
    type: Date
  },
  lastModifiedDate: {
    type: Date
  },
  cveScore: {
    v2: {
      baseScore: Number,
      vectorString: String
    },
    v3: {
      baseScore: Number,
      vectorString: String
    }
  },
  cpe: [
    {
      criteria: String,
      matchCriteriaId: String,
      vulnerable: Boolean
    }
  ],
  //... other fields to store...
});

cveSchema.plugin(mongoosePaginate); // Add pagination plugin to the schema

const Cve = mongoose.model('Cve', cveSchema);

module.exports = Cve;
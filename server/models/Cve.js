const mongoose = require('mongoose');

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
});


const Cve = mongoose.model('Cve', cveSchema);

module.exports = Cve;
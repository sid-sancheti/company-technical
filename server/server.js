const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const helmet = require('helmet'); // For security. Sets HTTP heads that improve security.
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],  // Only allow resources from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (need to refactor to before deployment to prod)
        imgSrc: ["'self'", "data:"], // Allow self and data URLs
        styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"], //Add bootstrap source.
        connectSrc: ["'self'", "https://services.nvd.nist.gov"], // Allow connections NVD API
      },
  })
);

app.disable('x-powered-by'); // Disable the X-Powered-By header. Hide information about the server

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello, MERN!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const buildPath = path.join(__dirname, 'build'); // Replace with the actual path to build directory

app.use('/cves', express.static(buildPath));

app.get('/cves/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ... other server code ...

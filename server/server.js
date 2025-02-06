const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const helmet = require('helmet'); // For security. Sets HTTP heads that improve security.
const rateLimit = require('express-rate-limit'); // Limits the number of requests a client can make.
require("dotenv").config();

const connectDB = require("./config/db");
const { fetchAndStoreCves } = require("./controllers/cveController");

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

/*
 * Security: Rate limiting to prevent DDoS attacks.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Connects to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Hello, MERN!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const buildPath = path.join(__dirname, 'build');

// app.use('/cves', express.static(buildPath));

app.get('/cves/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

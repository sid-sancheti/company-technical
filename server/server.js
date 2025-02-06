const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello, MERN!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const buildPath = path.join(__dirname, 'build'); // Replace with the actual path to build directory

app.use('/cves', express.static(buildPath));

app.get('/cves/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ... other server code ...

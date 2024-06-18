const express = require("express");
const resizeVideo = require("./handlers/resizeVideo");
const downloadVideo = require("./handlers/downloadVideo");
const uploadVideo = require("./handlers/uploadVideo");
const app = express();
const serverless = require("serverless-http");

app.use(express.json());

app.post("/resize", downloadVideo, resizeVideo, uploadVideo);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("Reached the error handling.");
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

module.exports.handler = serverless(app);

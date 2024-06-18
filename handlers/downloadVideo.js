const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function (req, res, next) {
  console.log("downloading video...");
  try {
    // define path and filename and attach to request
    req.fileName = Date.now();
    req.videoPath = path.join("/tmp", `${req.fileName}.mp4`);
    const writer = fs.createWriteStream(req.videoPath);

    // download video
    const res = await axios({
      url: req.body.video_url,
      method: "GET",
      responseType: "stream",
    });

    // save it in /tmp
    await res.data.pipe(writer);

    // create promise to handle finish or err
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("video downloaded");
    // pass it to the next middleware
    next();
  } catch (err) {
    console.error("Error in downloading the video...");
    next(err);
  }
};

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

// Set the ffmpeg pat
ffmpeg.setFfmpegPath("/opt/bin/ffmpeg");
ffmpeg.setFfprobePath("/opt/bin/ffprobe");

module.exports = async function (req, res, next) {
  console.log("resizing video...");
  try {
    // define new resized path
    req.resizedVideoPath = path.join("/tmp", `${req.fileName}_resized.mp4`);
    // resize
    await new Promise((resolve, reject) => {
      ffmpeg(req.videoPath)
        .size("640x360")
        .save(req.resizedVideoPath)
        .on("end", resolve)
        .on("error", reject);
    });
    console.log("video resized");
    next();
  } catch (err) {
    console.error("Error in resizing video...");
    next(err);
  }
};

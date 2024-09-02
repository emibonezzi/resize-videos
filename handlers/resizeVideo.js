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
    // Define image output path
    req.imagePath = path.join("/tmp", `${req.fileName}_frame.png`);

    // resize
    await new Promise((resolve, reject) => {
      ffmpeg(req.videoPath)
        .size("640x360")
        .save(req.resizedVideoPath)
        .on("end", resolve)
        .on("error", reject);
    });
    console.log("video resized");

    // Save a specific frame as an image
    await new Promise((resolve, reject) => {
      ffmpeg(req.videoPath)
        .screenshots({
          timestamps: ["82%"], // Capture a frame at 3/4 of the video (82% of the duration)
          filename: `${req.fileName}_frame.png`, // Name of the output image file
          folder: "/tmp", // Output folder
          size: "640x360", // Size of the output image
        })
        .on("end", resolve)
        .on("error", reject);
    });

    next();
  } catch (err) {
    console.error("Error in resizing video...");
    next(err);
  }
};

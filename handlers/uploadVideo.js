const AWS = require("aws-sdk");
const fs = require("fs");

// Configure AWS SDK
const s3 = new AWS.S3();

module.exports = async function (req, res, next) {
  console.log("uploading video...");
  try {
    // Upload resized video to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${req.fileName}_resized.mp4`,
      Body: fs.createReadStream(req.resizedVideoPath),
      ContentType: "video/mp4",
    };
    const uploadResult = await s3.upload(uploadParams).promise();
    console.log("video uploaded");
    // Send back url
    res.json({
      original_url: req.body.video_url,
      resizedVideoUrl: uploadResult.Location,
    });
  } catch (err) {
    next(err);
  }
};

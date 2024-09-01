const AWS = require("aws-sdk");
const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_TOKEN_SECRET,
});

const rwClient = client.readWrite;

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

    // Upload screenshot to S3
    const screenshotUploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${req.fileName}_frame.png`,
      Body: fs.createReadStream(req.imagePath),
      ContentType: "image/png",
    };
    const screenshotUploadResult = await s3
      .upload(screenshotUploadParams)
      .promise();
    console.log("screenshot uploaded");

    // Upload the image to Twitter
    const mediaId = await rwClient.v1.uploadMedia(req.imagePath);

    // Send back url
    res.json({
      original_url: req.body.video_url,
      resizedVideoUrl: uploadResult.Location,
      screenshotUrl: screenshotUploadResult.Location,
      mediaIdTwitter: mediaId,
    });
  } catch (err) {
    next(err);
  }
};

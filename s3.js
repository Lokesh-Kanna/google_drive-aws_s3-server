import S3 from "aws-sdk/clients/s3";
import fs from "fs";

const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_ACCESS_SECRET;
const region = process.env.S3_BUCKET_REGION;
const bucketname = process.env.S3_BUCKET_NAME;

const s3 = new S3({
  region,
  accessKey,
  secretKey,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketname,
    Key: file.filename,
    Body: fileStream,
  };
  return s3.upload(uploadParams).promise();
}

function getFileStream(fileKey) {
  const downloadParams = {
    Bucket: bucketname,
    Key: fileKey,
  };

  let fileStream = s3.getObject(downloadParams).createReadStream();
  return fileStream;
}

export { uploadFile, getFileStream };

const S3 = require('aws-sdk/clients/s3');
const path = require("path");
const uuid = require('uuid');

const { S3_BUCKET_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME } = require("../configs/configs")

const s3Bucket = new S3({
    region: S3_BUCKET_REGION,
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
});

function createFileName(fileName, itemType, itemId) {
    const extname = path.extname(fileName);
    return `${itemType}/${itemId}/${uuid.v4()}${extname}`;
}

async function uploadPublicFile(fileToUpload, itemType, itemId) {
    return s3Bucket.upload({
        ContentType: fileToUpload.mimetype,
        ACL: "public-read",
        Body: fileToUpload.data,
        Bucket: S3_BUCKET_NAME,
        Key: createFileName(fileToUpload.name, itemType, itemId)
    }).promise()
}

async function deleteImage(itemType, itemId, imageUrl) {
    try {
        const imageName = imageUrl.split('/').pop();
        // console.log('imageName', imageName);

        await s3Bucket.deleteObject({
            Bucket: S3_BUCKET_NAME,
            Key: `${itemType}/${itemId}/${imageName}`
        }).promise();

        console.log('Image deleted successfully');
    } catch (err) {
        console.error('Error deleting image:', err);
    }
}

module.exports = { uploadPublicFile, deleteImage };


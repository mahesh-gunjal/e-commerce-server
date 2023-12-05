// dependencies
const { S3Client, PutObjectCommand, DeleteObjectCommand, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

// configs
const config = require("../config/environment");

// Create an S3 client with the provided credentials
const s3Client = new S3Client({
	region: config.aws.awsRegion,
	credentials: {
		accessKeyId: config.aws.awsAccessKeyId,
		secretAccessKey: config.aws.awsSecretAccessKey
	}
});


/**
 * Make file public access to an AWS S3 bucket.
 * @param {String} filePath - The folder in the S3 bucket.
 * @returns {Object<PutBucketPolicyCommand>}
 */
const makeFilePublicAccess = (filePath) => {
	try {
		const s3BucketName = config.aws.s3BucketName;

		// create a bucket policy to make the object public
		const bucketPolicy = {
			Version: "2021-06-01",
			Statement: [
				{
					Sid: "AllowPublicRead",
					Effect: "Allow",
					Principal: "*",
					Action: "s3:GetObject",
					Resource: `arn:aws:s3:::${s3BucketName}/${filePath}` // Specify the object's ARN
				}
			]
		};

		// create PutBucketPolicyCommand params
		const params = {
			Bucket: s3BucketName,
			Policy: JSON.stringify(bucketPolicy)
		};

		// create PutObjectCommand object
		const policyCommand = new PutBucketPolicyCommand(params);

		// set the bucket policy
		return s3Client.send(policyCommand);
	} catch (error) {
		throw Error(`Error while make file public: ${error}`);
	}
};

/**
 * Uploads a file to an AWS S3 bucket.
 * @param {File} file - The  file that you want to upload
 * @param {String} destinationFolder - The folder in the S3 bucket.
 * @returns {Object<PutObjectCommandResult, PublicURL>}
 */
const uploadFileToS3 = async (file, destinationFolder) => {
	try {
		const s3Key = `${destinationFolder}/${file.originalname}`;
		const s3BucketName = config.aws.s3BucketName;
		const awsRegion = config.aws.awsRegion;

		// create PutObjectCommand parameters
		const params = {
			Bucket: s3BucketName,
			Body: file,
			Key: s3Key,
			ContentType: file.mimetype,
			ACL: "public-read" // Set the ACL to public-read to grant public access
		};

		// create PutObjectCommand object
		const uploadCommand = new PutObjectCommand(params);

		// upload file to s3 bucket
		const data = await s3Client.send(uploadCommand);

		await makeFilePublicAccess(s3Key);

		// generate a public URL for the uploaded object
		const fileUrl = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/${s3Key}`;
		return { ...data, fileUrl };
	} catch (error) {
		throw Error(`File uploading failed: ${error}`);
	}
};

/**
 * Delete a file from an AWS S3 bucket.
 * @param {String} s3Key - The  file that you want to delete. It like folder/fileName in the bucket
 * @returns {Object<DeleteObjectCommand>}
 */
const deleteS3File = async (s3Key) => {
	try {
		// create DeleteObjectCommand object
		const params = {
			Bucket: config.aws.s3BucketName,
			Key: s3Key
		};

		// create DeleteOjectCommand's instance
		const deleteCommand = new DeleteObjectCommand(params);

		// return request of delete object command
		return await s3Client.send(deleteCommand);
	} catch (error) {
		throw Error(`File Deletion failed: ${error}`);
	}
};



module.exports = { uploadFileToS3, deleteS3File };
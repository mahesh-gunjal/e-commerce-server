const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

// extract environment object from process
const envVars = process.env;

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	siteUrl: envVars.SITE_URL,
	mongoose: {
		url: envVars.MONGODB_URL,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES
	},
	socialLogin: {
		google: { clientId: envVars.GOOGLE_CLIENT_ID },
		facebook: { clientId: envVars.FACEBOOK_APP_ID }
	},
	email: {
		provider: envVars.EMAIL_PROVIDER, // sendgrid, aws, nodemailer
		key: envVars.EMAIL_PROVIDER_KEY,  // For sendgrid and aws
		smtp: {
			host: envVars.SMTP_HOST,
			port: envVars.SMTP_PORT,
			auth: {
				user: envVars.SMTP_USERNAME,
				pass: envVars.SMTP_PASSWORD
			}
		},
		from: envVars.EMAIL_FROM
	},
	aws: {
		s3BucketName: envVars.AWS_S3_BUCKET,
		awsRegion: envVars.AWS_S3_REGION,
		secretAccessKey: envVars.AWS_S3_ACCESS_KEY_ID,
		accessKeyId: envVars.AWS_S3_SECRET_ACCESS_KEY
	}
};
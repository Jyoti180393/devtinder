// Purpose:
// sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const credentials = {
  accessKeyId: process.env.AWS_SES_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:
    process.env.AWS_SES_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY,
};
const REGION = "ap-south-1";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({ region: REGION, credentials });
module.exports = { sesClient };

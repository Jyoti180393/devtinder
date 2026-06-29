/*
Purpose:
Send emails using Amazon SES. This helper builds a SendEmailCommand
that accepts `htmlBody` and `textBody` so it can be used with templates.
*/
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

/**
 * Example runner that demonstrates how to use an HTML template.
 * Replace the example addresses and template generation with real data in your app.
 */
const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "pokhariajyoti18@gmail.com",
    process.env.DEV_TINDER_UPDATE_EMAIL,
    subject,
    body,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };

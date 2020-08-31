import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "us-east-1" });

async function sendEmail(event, context) {
  const record = event.Records[0];
  console.log("record processing", record);

  const emailRecord = JSON.parse(record.body);
  const {
    subject,
    body,
    recipient: { email },
  } = emailRecord;

  const params = {
    Source: "kkonly4u@gmail.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendEmail;

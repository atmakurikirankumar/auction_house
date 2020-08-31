import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    await dynamodb.update(params).promise();

    const {
      title,
      seller,
      highestBid: { bidAmount, bidder },
    } = auction;

    console.log(auction);
    if (bidAmount === 0) {
      const response = await sqs
        .sendMessage({
          QueueUrl: process.env.EMAIL_QUEUE_URL,
          MessageBody: JSON.stringify({
            subject: "No Bids on your Auction Item :(",
            recipient: seller,
            body: `Oh No! Your Item "${title}" did not get any bids. Better Luck next time.`,
          }),
        })
        .promise();
      console.log(response);
      return;
    }

    const notifySeller = sqs
      .sendMessage({
        QueueUrl: process.env.EMAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: "Your Item has been sold",
          recipient: seller,
          body: `Wohoo! Your Item "${title}" has been sold for $${bidAmount}`,
        }),
      })
      .promise();
    const notifyBidder = sqs
      .sendMessage({
        QueueUrl: process.env.EMAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: "You won an auction",
          recipient: bidder,
          body: `What a great deal. You got yourself a "${title}" for $${bidAmount}`,
        }),
      })
      .promise();

    return Promise.all([notifyBidder, notifySeller]);
  } catch (error) {
    console.error(error);
  }
}

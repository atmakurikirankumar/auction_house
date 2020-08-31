import createError from "http-errors";
import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctionById = async (id) => {
  let auction;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();
    auction = result.Item;
  } catch (error) {
    console.log(error);
    createError.InternalServerError(error);
  }
  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" is not found`);
  }
  return auction;
};

export default getAuctionById;

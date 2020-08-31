import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import AWS from "aws-sdk";
import placeBidSchema from "../schemas/placeBidSchema";
import validator from "@middy/validator";
import getAuctionById from "../lib/getAuctionById";
import sendResponse from "../lib/sendResponse";
import getUserFromJWTToken from "../lib/getUserFromJWTToken";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const {
    user: { email },
  } = await getUserFromJWTToken(event.headers.Authorization);

  const auction = await getAuctionById(id);

  if (email === auction.seller.email) {
    return sendResponse(403, `Your can't place bid on your own auctions`);
  }

  if (email === auction.highestBid.bidder) {
    return sendResponse(403, `You are already the highest bidder`);
  }

  if (auction.status !== "OPEN") {
    return sendResponse(403, `You can't place bid on closed Auction Item`);
  }

  if (amount < auction.minimumPriceToBid) {
    return sendResponse(
      403,
      `Your bid must be greater than or equal to ${auction.minimumPriceToBid}`
    );
  }

  if (amount <= auction.highestBid.amount) {
    return sendResponse(403, `Your bid must be higher than ${auction.highestBid.amount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.bidAmount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.log(error);
    createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid).use(validator({ inputSchema: placeBidSchema }));

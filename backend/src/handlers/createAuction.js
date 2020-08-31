import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import createAuctionSchema from "../schemas/createAuctionSchema";
import createError from "http-errors";
import AWS from "aws-sdk";
import getUserFromJWTToken from "../lib/getUserFromJWTToken";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const decoded = await getUserFromJWTToken(event.headers.Authorization);
  const {
    user: { id, email },
  } = decoded;

  const auction = {
    id: uuid(),
    title: event.body.title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    minimumPriceToBid: event.body.minPrice,
    highestBid: {
      bidAmount: 0,
      bidder: "",
    },
    seller: {
      sellerId: id,
      email,
    },
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);

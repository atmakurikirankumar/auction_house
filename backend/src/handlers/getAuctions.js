import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import getAuctionsSchema from "../schemas/getAuctionsSchema";
import createError from "http-errors";
import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  const { status } = event.queryStringParameters;
  let auctions;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "queryByStatusAndEndingAt",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
    auctions = result.Items;
  } catch (error) {
    console.log(error);
    createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema, useDefaults: true })
);

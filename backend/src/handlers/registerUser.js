import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import registerUserSchema from "../schemas/registerUserSchema";
import createError from "http-errors";
import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import signToken from "../lib/signToken";
import getUserFromDB from "../lib/getUserFromDB";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const registerUser = async (event, context) => {
  const { name, email, password } = event.body;
  let token;
  let user;

  try {
    user = await getUserFromDB(email);
    if (user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `User already exist with email id - ${email}` }),
      };
    }
    user = { id: uuid(), name, email, password };
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save user
    await dynamodb
      .put({
        TableName: process.env.USERS_TABLE_NAME,
        Item: user,
      })
      .promise();

    token = await signToken(user);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(token),
  };
};

export const handler = commonMiddleware(registerUser).use(
  validator({ inputSchema: registerUserSchema })
);

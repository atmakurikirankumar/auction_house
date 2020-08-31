import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import userLoginSchema from "../schemas/userLoginSchema";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import signToken from "../lib/signToken";
import getUserFromDB from "../lib/getUserFromDB";

const userLogin = async (event, context) => {
  const { email, password } = event.body;
  let token;
  let user;

  try {
    user = await getUserFromDB(email);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `User does not exist with email id - ${email}` }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `Invalid Credentials` }),
      };
    }

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

export const handler = commonMiddleware(userLogin).use(validator({ inputSchema: userLoginSchema }));

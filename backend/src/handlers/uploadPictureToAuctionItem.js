import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { setAuctionPictureUrl } from "../lib/setAuctionPictureUrl";
import getUserFromJWTToken from "../lib/getUserFromJWTToken";
import getAuctionById from "../lib/getAuctionById";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "@middy/validator";
import uploadAuctionPictureSchema from "../schemas/uploadAuctionPictureSchema";
import cors from "@middy/http-cors";
import createError from "http-errors";
import sendResponse from "../lib/sendResponse";

const uploadAuctionPicture = async (event, context) => {
  const { id } = event.pathParameters;
  const {
    user: { email },
  } = await getUserFromJWTToken(event.headers.Authorization);

  const auction = await getAuctionById(id);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  if (auction.seller.email !== email) {
    return sendResponse(403, `You are not the seller of this auction Item - ${auction.title}`);
  }

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(`${auction.id}.jpg`, buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionPictureSchema }))
  .use(cors());

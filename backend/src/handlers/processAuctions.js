import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "../lib/closeAuction";
import createError from "http-errors";

const processAuctions = async (event, context) => {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) => closeAuction(auction));
    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = processAuctions;

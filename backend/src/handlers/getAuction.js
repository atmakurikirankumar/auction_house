import commonMiddleware from "../lib/commonMiddleware";
import getAuctionById from "../lib/getAuctionById";

const getAuction = async (event, context) => {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(getAuction);

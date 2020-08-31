import getUserFromJWTToken from "../lib/getUserFromJWTToken";

const generatePolicy = async (principalId, methodArn) => {
  const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*";
  console.log(apiGatewayWildcard);
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

const verifyToken = async (event, context) => {
  console.log(event);
  if (!event.authorizationToken || !event.methodArn) {
    throw "Unauthorized";
  }

  const token = event.authorizationToken.replace("Bearer ", "");

  const {
    user: { id },
  } = await getUserFromJWTToken(token);

  const policy = generatePolicy(id, event.methodArn);

  return policy;
};

export const handler = verifyToken;

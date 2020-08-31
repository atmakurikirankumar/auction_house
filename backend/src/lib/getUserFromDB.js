import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getUserFromDB = async (email) => {
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    IndexName: "queryByEmail",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  const result = await dynamodb.query(params).promise();
  const user = result.Items[0];
  return user;
};

export default getUserFromDB;

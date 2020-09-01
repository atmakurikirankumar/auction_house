Created a serverless backend with custom authorizer using JWT Auction House app.

Please follow these steps to setup this in your local

Pre-requsities: 
  1) Have a trial account with AWS
  2) install AWS cli
  3) Create an IAM User
  4) Setup your user credentials in aws cli using the command aws configure
  5) Install Postaman or any relevant API testing tool

Then, cLone this repository. cd into this folder and do npm install. 

After all dependencies are insatlled execute this command and see the magic of all APIs were created in your AWS account.

sls deploy -v
------------------------
Created a Front end as well.

Clone the frontend folder and cd into the directory and do npm install. Create a .env file under the root folder and create environment variable REACT_APP_AUCTIONS_ENDPOINT. Value will equal to your backend api url created in the backend process.

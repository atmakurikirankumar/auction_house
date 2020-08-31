const sendResponse = (statusCode, msg) => {
  return {
    statusCode,
    body: JSON.stringify({ msg }),
  };
};

export default sendResponse;

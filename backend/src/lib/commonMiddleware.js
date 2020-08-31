const middy = require("@middy/core");
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

const commonMiddleware = (handler) =>
  middy(handler).use([httpErrorHandler(), httpEventNormalizer(), httpJsonBodyParser(), cors()]);

export default commonMiddleware;

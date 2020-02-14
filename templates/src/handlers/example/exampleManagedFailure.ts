import { IHandlerFunction, wrapper, IWrapperFunction } from "aws-orchestrate";
import { IExampleRequest, IExampleResponse } from "./index";
import { HttpStatusCodes } from "common-types";

export const config: IWrapperFunction = {
  description: `An example of a managed failure.`,
  events: [
    {
      http: {
        method: "post",
        path: "/example/managed-failure",
        cors: true
      }
    }
  ]
};

export const fn: IHandlerFunction<IExampleRequest, IExampleResponse> = async (
  request,
  context
) => {
  const { log } = context;
  log.info(`Someone has sent us a dangerous message!`, {
    message: request.theMessage
  });

  context.errorMgmt.addHandler(HttpStatusCodes.IAmATeapot, {
    messageContains: "shit"
  });

  context.errorMgmt.setDefaultErrorCode(999);

  context.errorMgmt.addHandler(HttpStatusCodes.Gone, {
    messageContains: "not here dude"
  });

  throw new Error("oh shit!");

  return {
    heyho: "well that message was not that important; back to sleeping",
    carrots: 5
  };
};

export const handler = wrapper(fn);

import { IHandlerFunction, wrapper, IWrapperFunction } from "aws-orchestrate";
import { IExampleRequest, IExampleResponse } from "./index";

export const config: IWrapperFunction = {
  description: `An example of an unhandled failure.`,
  events: [
    {
      http: {
        method: "post",
        path: "/example/failure",
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

  throw new Error("oh shit!");

  return {
    heyho: "well that message was not that important; back to sleeping",
    carrots: 5
  };
};

export const handler = wrapper(fn);

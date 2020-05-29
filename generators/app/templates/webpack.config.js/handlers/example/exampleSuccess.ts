import { IHandlerFunction, wrapper, IWrapperFunction } from "aws-orchestrate";
import { IExampleRequest, IExampleResponse } from "./index";

export const config: IWrapperFunction = {
  description: `An example of a successful handler.`,
  events: [
    {
      http: {
        method: "post",
        path: "/example/success",
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
  log.info(`Someone has sent us an important message`, {
    message: request.theMessage
  });

  return {
    heyho: "well that message was not that important; back to sleeping",
    carrots: 99
  };
};

export const handler = wrapper(fn);

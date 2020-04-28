import { IHandlerFunction, wrapper, IWrapperFunction } from "aws-orchestrate";
import { IExampleRequest, IExampleResponse } from "./index";

export const config: IWrapperFunction = {
  description: `An example of a successful handler.`,
  events: [
    {
      http: {
        method: "post",
        path: "/example/nothing",
        cors: true
      }
    }
  ]
};

export const fn: IHandlerFunction<IExampleRequest, void> = async (
  request,
  context
) => {
  const { log } = context;
  log.info(`Someone has sent us an important message`, {
    message: request.theMessage
  });
};

export const handler = wrapper(fn);

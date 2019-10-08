import { IHandlerFunction, wrapper, IWrapperFunction } from "aws-orchestrate";

export const config: IWrapperFunction = {
  description: `This is a test function to demonstrate how you might write your own.`
};

export interface IPingRequest {
  /** the URLs to test */
  urls: string[];
}

export interface IPingStatus {
  /** the URL that was tested */
  url: string;
  /** the ms it took to load the resource */
  loadtime: number;
}

export interface IPingResponse {
  urlResponses: IPingStatus[];
}

/**
 * This is a test handler function that gets wrapped up by the `aws-orchestrate`'s
 * **wrapper** function.
 *
 * @param request the typed request object defined by `IPingRequest`
 * @param context the AWS context object enhanced with a number of new features
 */
export const fn: IHandlerFunction<IPingRequest, IPingResponse> = async (
  request,
  context
) => {
  const { log, sequence, apiGateway } = context;
  log.info("this is just a test; but what a test it is :)", request);

  return {
    urlResponses: []
  };
};

export const handler = wrapper(fn);

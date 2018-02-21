import { AWSGatewayCallback, IDictionary } from "common-types";
export function handler(
  event: IDictionary,
  context: IDBArrayKey,
  callback: AWSGatewayCallback
) {
  console.log("EVENT\n", JSON.stringify(event, null, 2));
}

// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessFunction, IDictionary } from "common-types";

const ping: IServerlessFunction = {
  handler: "lib/handlers/ping.handler"
};

const functions: IDictionary<IServerlessFunction> = {
  ping
};

export default functions;

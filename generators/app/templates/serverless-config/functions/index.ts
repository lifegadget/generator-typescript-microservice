// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessFunction, IDictionary } from "common-types";
import inline from "./inline";

const functions: IDictionary<IServerlessFunction> = {
  ...inline
};

export default functions;

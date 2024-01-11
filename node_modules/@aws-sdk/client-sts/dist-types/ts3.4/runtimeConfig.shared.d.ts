import { Logger as __Logger } from "@aws-sdk/types";
import { STSClientConfig } from "./STSClient";
export declare const getRuntimeConfig: (config: STSClientConfig) => {
  apiVersion: string;
  disableHostPrefix: boolean;
  endpointProvider: (
    endpointParams: import("./endpoint/EndpointParameters").EndpointParameters,
    context?: {
      logger?: __Logger | undefined;
    }
  ) => import("@aws-sdk/types").EndpointV2;
  logger: __Logger;
  serviceId: string;
  urlParser: import("@aws-sdk/types").UrlParser;
};

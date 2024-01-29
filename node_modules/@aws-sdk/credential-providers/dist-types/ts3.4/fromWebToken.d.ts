import { STSClientConfig } from "@aws-sdk/client-sts";
import { FromWebTokenInit as _FromWebTokenInit } from "@aws-sdk/credential-provider-web-identity";
import { CredentialProvider, Pluggable } from "@aws-sdk/types";
export interface FromWebTokenInit extends _FromWebTokenInit {
  clientConfig?: STSClientConfig;
  clientPlugins?: Pluggable<any, any>[];
}
export declare const fromWebToken: (
  init: FromWebTokenInit
) => CredentialProvider;

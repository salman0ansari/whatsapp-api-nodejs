import { STSClientConfig } from "@aws-sdk/client-sts";
import { FromIniInit as _FromIniInit } from "@aws-sdk/credential-provider-ini";
import { CredentialProvider, Pluggable } from "@aws-sdk/types";
export interface FromIniInit extends _FromIniInit {
  clientConfig?: STSClientConfig;
  clientPlugins?: Pluggable<any, any>[];
}
export declare const fromIni: (init?: FromIniInit) => CredentialProvider;

import { STSClientConfig } from "@aws-sdk/client-sts";
import { DefaultProviderInit } from "@aws-sdk/credential-provider-node";
import { CredentialProvider, Pluggable } from "@aws-sdk/types";
export interface fromNodeProviderChainInit extends DefaultProviderInit {
  clientConfig?: STSClientConfig;
  clientPlugins?: Pluggable<any, any>[];
}
export declare const fromNodeProviderChain: (
  init?: fromNodeProviderChainInit
) => CredentialProvider;

import { RemoteProviderInit as _RemoteProviderInit } from "@aws-sdk/credential-provider-imds";
import { CredentialProvider } from "@aws-sdk/types";
export interface RemoteProviderInit extends _RemoteProviderInit {}
export declare const fromContainerMetadata: (
  init?: RemoteProviderInit | undefined
) => CredentialProvider;

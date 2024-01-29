import { AssumeRoleCommandInput, STSClientConfig } from "@aws-sdk/client-sts";
import { CredentialProvider, Credentials, Pluggable } from "@aws-sdk/types";
export interface FromTemporaryCredentialsOptions {
  params: Pick<
    AssumeRoleCommandInput,
    Exclude<keyof AssumeRoleCommandInput, "RoleSessionName">
  > & {
    RoleSessionName?: string;
  };
  masterCredentials?: Credentials | CredentialProvider;
  clientConfig?: STSClientConfig;
  clientPlugins?: Pluggable<any, any>[];
  mfaCodeProvider?: (mfaSerial: string) => Promise<string>;
}
export declare const fromTemporaryCredentials: (
  options: FromTemporaryCredentialsOptions
) => CredentialProvider;

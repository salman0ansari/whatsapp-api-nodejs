import { Provider } from "./util";
export interface AwsCredentialIdentity {
  readonly expiration?: Date;
}
export interface Credentials extends AwsCredentialIdentity {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken?: string;
}
export declare type CredentialProvider = Provider<Credentials>;

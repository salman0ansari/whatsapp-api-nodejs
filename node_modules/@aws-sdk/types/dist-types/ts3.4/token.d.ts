import { Provider } from "./util";
export interface Token {
  readonly token: string;
  readonly expiration?: Date;
}
export declare type TokenProvider = Provider<Token>;

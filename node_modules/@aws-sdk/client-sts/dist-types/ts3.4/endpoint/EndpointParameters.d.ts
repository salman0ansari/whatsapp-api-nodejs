import {
  EndpointParameters as __EndpointParameters,
  Provider,
} from "@aws-sdk/types";
export interface ClientInputEndpointParameters {
  region?: string | Provider<string>;
  useDualstackEndpoint?: boolean | Provider<boolean>;
  useFipsEndpoint?: boolean | Provider<boolean>;
  endpoint?: string | Provider<string>;
  useGlobalEndpoint?: boolean | Provider<boolean>;
}
export declare type ClientResolvedEndpointParameters =
  ClientInputEndpointParameters & {
    defaultSigningName: string;
  };
export declare const resolveClientEndpointParameters: <T>(
  options: T & ClientInputEndpointParameters
) => T &
  ClientInputEndpointParameters & {
    defaultSigningName: string;
  };
export interface EndpointParameters extends __EndpointParameters {
  Region?: string;
  UseDualStack?: boolean;
  UseFIPS?: boolean;
  Endpoint?: string;
  UseGlobalEndpoint?: boolean;
}

import {
  DeserializeHandlerOptions,
  EndpointBearer,
  MetadataBearer,
  Pluggable,
  RequestSerializer,
  ResponseDeserializer,
  SerializeHandlerOptions,
  UrlParser,
} from "@aws-sdk/types";
export declare const deserializerMiddlewareOption: DeserializeHandlerOptions;
export declare const serializerMiddlewareOption: SerializeHandlerOptions;
export declare type V1OrV2Endpoint<T extends EndpointBearer> = T & {
  urlParser?: UrlParser;
};
export declare function getSerdePlugin<
  InputType extends object,
  SerDeContext extends EndpointBearer,
  OutputType extends MetadataBearer
>(
  config: V1OrV2Endpoint<SerDeContext>,
  serializer: RequestSerializer<any, SerDeContext>,
  deserializer: ResponseDeserializer<OutputType, any, SerDeContext>
): Pluggable<InputType, OutputType>;

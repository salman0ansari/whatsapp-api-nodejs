import { parseUrl } from "@aws-sdk/url-parser";
import { defaultEndpointResolver } from "./endpoint/endpointResolver";
export const getRuntimeConfig = (config) => ({
    apiVersion: "2011-06-15",
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    logger: config?.logger ?? {},
    serviceId: config?.serviceId ?? "STS",
    urlParser: config?.urlParser ?? parseUrl,
});

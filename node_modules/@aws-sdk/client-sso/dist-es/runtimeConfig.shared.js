import { parseUrl } from "@aws-sdk/url-parser";
import { defaultRegionInfoProvider } from "./endpoints";
export const getRuntimeConfig = (config) => ({
    apiVersion: "2019-06-10",
    disableHostPrefix: config?.disableHostPrefix ?? false,
    logger: config?.logger ?? {},
    regionInfoProvider: config?.regionInfoProvider ?? defaultRegionInfoProvider,
    serviceId: config?.serviceId ?? "SSO",
    urlParser: config?.urlParser ?? parseUrl,
});

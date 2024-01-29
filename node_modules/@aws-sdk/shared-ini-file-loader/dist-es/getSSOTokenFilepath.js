import { createHash } from "crypto";
import { join } from "path";
import { getHomeDir } from "./getHomeDir";
export const getSSOTokenFilepath = (ssoStartUrl) => {
    const hasher = createHash("sha1");
    const cacheName = hasher.update(ssoStartUrl).digest("hex");
    return join(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
};

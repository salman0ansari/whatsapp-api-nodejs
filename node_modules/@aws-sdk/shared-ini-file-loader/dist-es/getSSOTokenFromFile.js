import { promises as fsPromises } from "fs";
import { getSSOTokenFilepath } from "./getSSOTokenFilepath";
const { readFile } = fsPromises;
export const getSSOTokenFromFile = async (ssoStartUrl) => {
    const ssoTokenFilepath = getSSOTokenFilepath(ssoStartUrl);
    const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
};

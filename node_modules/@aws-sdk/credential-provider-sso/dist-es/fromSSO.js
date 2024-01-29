import { CredentialsProviderError } from "@aws-sdk/property-provider";
import { getProfileName, parseKnownFiles } from "@aws-sdk/shared-ini-file-loader";
import { isSsoProfile } from "./isSsoProfile";
import { resolveSSOCredentials } from "./resolveSSOCredentials";
import { validateSsoProfile } from "./validateSsoProfile";
export const fromSSO = (init = {}) => async () => {
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient } = init;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName) {
        const profiles = await parseKnownFiles(init);
        const profileName = getProfileName(init);
        const profile = profiles[profileName];
        if (!isSsoProfile(profile)) {
            throw new CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name } = validateSsoProfile(profile);
        return resolveSSOCredentials({
            ssoStartUrl: sso_start_url,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
            ssoClient: ssoClient,
        });
    }
    else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl",' +
            ' "ssoAccountId", "ssoRegion", "ssoRoleName"');
    }
    else {
        return resolveSSOCredentials({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient });
    }
};

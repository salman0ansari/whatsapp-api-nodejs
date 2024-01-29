"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateEndpointRule = void 0;
const evaluateConditions_1 = require("./evaluateConditions");
const getEndpointHeaders_1 = require("./getEndpointHeaders");
const getEndpointProperties_1 = require("./getEndpointProperties");
const getEndpointUrl_1 = require("./getEndpointUrl");
const evaluateEndpointRule = (endpointRule, options) => {
    const { conditions, endpoint } = endpointRule;
    const { result, referenceRecord } = (0, evaluateConditions_1.evaluateConditions)(conditions, options);
    if (!result) {
        return;
    }
    const endpointRuleOptions = {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    };
    const { url, properties, headers } = endpoint;
    return {
        ...(headers != undefined && {
            headers: (0, getEndpointHeaders_1.getEndpointHeaders)(headers, endpointRuleOptions),
        }),
        ...(properties != undefined && {
            properties: (0, getEndpointProperties_1.getEndpointProperties)(properties, endpointRuleOptions),
        }),
        url: (0, getEndpointUrl_1.getEndpointUrl)(url, endpointRuleOptions),
    };
};
exports.evaluateEndpointRule = evaluateEndpointRule;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEndpoint = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
const resolveEndpoint = (ruleSetObject, options) => {
    var _a, _b;
    const { endpointParams, logger } = options;
    const { parameters, rules } = ruleSetObject;
    const paramsWithDefault = Object.entries(parameters)
        .filter(([, v]) => v.default != null)
        .map(([k, v]) => [k, v.default]);
    if (paramsWithDefault.length > 0) {
        for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
            endpointParams[paramKey] = (_a = endpointParams[paramKey]) !== null && _a !== void 0 ? _a : paramDefaultValue;
        }
    }
    const requiredParams = Object.entries(parameters)
        .filter(([, v]) => v.required)
        .map(([k]) => k);
    for (const requiredParam of requiredParams) {
        if (endpointParams[requiredParam] == null) {
            throw new types_1.EndpointError(`Missing required parameter: '${requiredParam}'`);
        }
    }
    const endpoint = (0, utils_1.evaluateRules)(rules, { endpointParams, logger, referenceRecord: {} });
    if ((_b = options.endpointParams) === null || _b === void 0 ? void 0 : _b.Endpoint) {
        try {
            const givenEndpoint = new URL(options.endpointParams.Endpoint);
            const { protocol, port } = givenEndpoint;
            endpoint.url.protocol = protocol;
            endpoint.url.port = port;
        }
        catch (e) {
        }
    }
    return endpoint;
};
exports.resolveEndpoint = resolveEndpoint;

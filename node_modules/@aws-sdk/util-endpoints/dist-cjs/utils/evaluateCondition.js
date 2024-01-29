"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCondition = void 0;
const types_1 = require("../types");
const callFunction_1 = require("./callFunction");
const evaluateCondition = ({ assign, ...fnArgs }, options) => {
    if (assign && assign in options.referenceRecord) {
        throw new types_1.EndpointError(`'${assign}' is already defined in Reference Record.`);
    }
    const value = (0, callFunction_1.callFunction)(fnArgs, options);
    return {
        result: value === "" ? true : !!value,
        ...(assign != null && { toAssign: { name: assign, value } }),
    };
};
exports.evaluateCondition = evaluateCondition;

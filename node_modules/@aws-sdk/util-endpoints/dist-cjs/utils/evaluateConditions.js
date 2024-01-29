"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateConditions = void 0;
const evaluateCondition_1 = require("./evaluateCondition");
const evaluateConditions = (conditions = [], options) => {
    const conditionsReferenceRecord = {};
    for (const condition of conditions) {
        const { result, toAssign } = (0, evaluateCondition_1.evaluateCondition)(condition, {
            ...options,
            referenceRecord: {
                ...options.referenceRecord,
                ...conditionsReferenceRecord,
            },
        });
        if (!result) {
            return { result };
        }
        if (toAssign) {
            conditionsReferenceRecord[toAssign.name] = toAssign.value;
        }
    }
    return { result: true, referenceRecord: conditionsReferenceRecord };
};
exports.evaluateConditions = evaluateConditions;

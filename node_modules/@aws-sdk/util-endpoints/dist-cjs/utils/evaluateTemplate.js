"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTemplate = void 0;
const lib_1 = require("../lib");
const ATTR_SHORTHAND_REGEX = new RegExp("\\${([\\w]+)#([\\w]+)}", "g");
const evaluateTemplate = (template, options) => {
    const templateToEvaluate = template
        .replace(new RegExp(`\{([^{}]+)\}`, "g"), "${$1}")
        .replace(new RegExp(`\{\\$\{([^{}]+)\}\}`, "g"), "{$1}");
    const templateContext = {
        ...options.endpointParams,
        ...options.referenceRecord,
    };
    const attrShortHandList = templateToEvaluate.match(ATTR_SHORTHAND_REGEX) || [];
    const attrShortHandMap = attrShortHandList.reduce((acc, attrShortHand) => {
        const indexOfHash = attrShortHand.indexOf("#");
        const refName = attrShortHand.substring(2, indexOfHash);
        const attrName = attrShortHand.substring(indexOfHash + 1, attrShortHand.length - 1);
        acc[attrShortHand] = (0, lib_1.getAttr)(templateContext[refName], attrName);
        return acc;
    }, {});
    const templateWithAttr = Object.entries(attrShortHandMap).reduce((acc, [shortHand, value]) => acc.replace(shortHand, value), templateToEvaluate);
    const templateContextNames = Object.keys(templateContext);
    const templateContextValues = Object.values(templateContext);
    const templateWithTildeEscaped = templateWithAttr.replace(/\`/g, "\\`");
    return new Function(...templateContextNames, `return \`${templateWithTildeEscaped}\``)(...templateContextValues);
};
exports.evaluateTemplate = evaluateTemplate;

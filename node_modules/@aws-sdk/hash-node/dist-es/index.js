import { fromArrayBuffer, fromString } from "@aws-sdk/util-buffer-from";
import { Buffer } from "buffer";
import { createHash, createHmac } from "crypto";
export class Hash {
    constructor(algorithmIdentifier, secret) {
        this.hash = secret ? createHmac(algorithmIdentifier, castSourceData(secret)) : createHash(algorithmIdentifier);
    }
    update(toHash, encoding) {
        this.hash.update(castSourceData(toHash, encoding));
    }
    digest() {
        return Promise.resolve(this.hash.digest());
    }
}
function castSourceData(toCast, encoding) {
    if (Buffer.isBuffer(toCast)) {
        return toCast;
    }
    if (typeof toCast === "string") {
        return fromString(toCast, encoding);
    }
    if (ArrayBuffer.isView(toCast)) {
        return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    }
    return fromArrayBuffer(toCast);
}

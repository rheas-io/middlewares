"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyStrings = void 0;
const transformRequest_1 = require("./transformRequest");
class EmptyStrings extends transformRequest_1.TransformRequest {
    /**
     * Set the request value to null if it is an empty string.
     *
     * @param value Request field value
     * @param key Request field key
     */
    clean(value) {
        return value === '' ? null : value;
    }
}
exports.EmptyStrings = EmptyStrings;

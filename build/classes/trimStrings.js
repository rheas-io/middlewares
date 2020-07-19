"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimStrings = void 0;
const transformRequest_1 = require("./transformRequest");
class TrimStrings extends transformRequest_1.TransformRequest {
    /**
     * Trim the given request value.
     *
     * @param value Field value
     */
    clean(value) {
        return value.trim();
    }
}
exports.TrimStrings = TrimStrings;

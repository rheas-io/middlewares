"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@rheas/support/helpers");
const trimStrings_1 = require("./classes/trimStrings");
/**
 * Trims all the trailing whitespaces from the req inputs.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req, res, next) {
    const exceptionKeys = helpers_1.app().exceptions('TrimStrings');
    new trimStrings_1.TrimStrings(exceptionKeys).handle(req);
    return await next(req, res);
}
exports.default = handler;

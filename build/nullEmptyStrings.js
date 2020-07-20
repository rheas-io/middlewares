"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@rheas/support/helpers");
const emptyStrings_1 = require("./classes/emptyStrings");
/**
 * Changes all empty strings to null.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req, res, next) {
    const exceptionKeys = helpers_1.app().exceptions('EmptyStrings');
    new emptyStrings_1.EmptyStrings(exceptionKeys).handle(req);
    return await next(req, res);
}
exports.default = handler;

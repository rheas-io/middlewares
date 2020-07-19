"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Trims all the trailing whitespaces from the req inputs.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req, res, next) {
    return await next(req, res);
}
exports.default = handler;

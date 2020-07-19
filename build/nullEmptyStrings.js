"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Changes all empty strings to null.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req, res, next) {
    return await next(req, res);
}
exports.default = handler;

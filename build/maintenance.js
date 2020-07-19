"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@rheas/support/helpers");
/**
 * This middleware will abort the req and send a 503 response if the
 * application is undergoing maintenance. This is determined from the
 * app configs.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req, res, next) {
    if (helpers_1.config('app.maintenance')) {
        helpers_1.abort(503, 'We are undergoing a scheduled maintenance. Please try again later.');
    }
    return await next(req, res);
}
exports.default = handler;

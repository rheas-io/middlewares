import { config } from '@rheas/support/helpers';
import { abort } from '@rheas/support/helpers/exception';
import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * This middleware will abort the req and send a 503 response if the
 * application is undergoing maintenance. This is determined from the
 * app configs.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    if (config('app.maintenance')) {
        abort(503, 'We are undergoing a scheduled maintenance. Please try again later.');
    }
    return await next(req, res);
}

export default handler;

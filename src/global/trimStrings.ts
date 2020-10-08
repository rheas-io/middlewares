import { app } from '@rheas/support/helpers';
import { TrimStrings } from '../classes/trimStrings';
import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * Trims all the trailing whitespaces from the req inputs.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    const exceptionKeys: string[] = app().exceptions('string.trim');

    new TrimStrings(exceptionKeys).handle(req);

    return await next(req, res);
}

export default handler;

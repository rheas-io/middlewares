import { app } from '@rheas/support/helpers';
import { EmptyStrings } from '../classes/emptyStrings';
import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * Changes all empty strings to null.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    const exceptionKeys: string[] = app().exceptions('string.empty');

    new EmptyStrings(exceptionKeys).handle(req);

    return await next(req, res);
}

export default handler;

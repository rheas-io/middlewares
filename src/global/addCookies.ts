import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * This middleware adds all the queued cookies to the response
 * header.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    res = await next(req, res);

    // Add queued cookies to response
    const cookieHeaders: string[] = [];

    Object.values(req.cookies().queuedCookies()).forEach((cookie) => {
        cookieHeaders.push(cookie.toString());
    });

    res.setHeader('Set-Cookie', cookieHeaders);

    return res;
}

export default handler;

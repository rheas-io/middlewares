import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * Verify the CSRF token of the request and throws an exception if
 * a request requiring CSRF does not have one. Otherwise, the request flows
 * through all the pipeline and finally adds a CSRF cookie on to the cookie
 * queue.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    if (!req.isReadRequest() && !req.isExemptedIn('csrf') && !req.isCsrfProtected()) {
        throw new Error();
    }

    res = await next(req, res);

    const sessionManager = req.sessions();
    const session = sessionManager.getSession();

    if (session) {
        req.cookies().queue(
            sessionManager.getCookie('XSRF-TOKEN', session.getCsrf(), session.getExpiry()),
        );
    }
    return res;
}

export default handler;

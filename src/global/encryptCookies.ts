import { IApp } from '@rheas/contracts/core';
import { IEncrypter } from '@rheas/contracts/security';
import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';

/**
 * This middleware decrypts all the incoming cookies and pass the
 * request to the next pipeline. Once flow through all the pipeline is
 * completed, we will encrypt the queued cookies and set it to the
 * response headers for delivery.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    const cookiesManager = req.cookies();
    const encrypter: IEncrypter = req.get('encrypter');

    // Decrypt all the incoming cookies.
    Object.values(cookiesManager.incomingCookies()).forEach((cookie) => {
        cookie.setValue(encrypter.decrypt(cookie.getValue()));
    });

    res = await next(req, res);

    /**
     * Encrypts all the cookies that are not in the exceptions list. We will not
     * encrypt XSRF-TOKEN even if it's not in the list. XSRF-TOKEN is only used to
     * check for CSRF issues. Encrypted or non-encrypted, the end user won't be doing
     * any check on it and will be simply passing the same value to the server. So,
     * if we encrypt it, we will have to decrypt it and check. To eliminate the double
     * work that serves no purpose, we are avoiding it.
     *
     * If you find any reason to encrypt it, please let me know.
     */
    const app: IApp = req.get('app');
    const exceptions = (app && app.exceptions('cookies.encrypt')) || [];

    exceptions.push('XSRF-TOKEN');

    await Promise.all(
        Object.values(cookiesManager.queuedCookies()).map(async (cookie) => {
            let cookieValue = cookie.getValue();

            if (!exceptions.includes(cookie.getName())) {
                cookieValue = await encrypter.encrypt(cookie.getValue());
            }
            return cookie.setValue(cookieValue);
        }),
    );

    return res;
}

export default handler;

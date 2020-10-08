import { IApp } from '@rheas/contracts/core';
import { ICookie } from '@rheas/contracts/cookies';
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
    const encrypter: IEncrypter = req.get('encrypt');

    const exceptions = (req.get('app') as IApp).exceptions('cookies.encrypt');

    // Decrypt all the incoming cookies.
    Object.values(cookiesManager.incomingCookies()).forEach(
        decryptCookie.bind(null, encrypter, exceptions),
    );

    res = await next(req, res);

    // Encrypt all the outgoing cookies.
    await Promise.all(
        Object.values(cookiesManager.queuedCookies()).map(
            encryptCookie.bind(null, encrypter, exceptions),
        ),
    );

    return res;
}

/**
 * Decrypts a cookie value and updates the cookie with the decrypted value.
 *
 * If a decrypt error occurs, the cookie value is set to empty string and the
 * cookie is marked as expired.
 *
 * @param encrypter
 * @param exceptions collection of cookie names that has to be exempted from decryption
 * @param cookie
 */
function decryptCookie(encrypter: IEncrypter, exceptions: string[], cookie: ICookie) {
    if (exceptions.includes(cookie.getName())) {
        return;
    }

    try {
        cookie.setValue(encrypter.decrypt(cookie.getValue()));
    } catch (err) {
        // The cookie is possibly tampered, if we are unable to
        // decrypt it. Set the cookie value to empty and mark it
        // as expired.
        cookie.setValue('').expire();
    }
}

/**
 * Encrypts a cookie value and returns it.
 *
 * We will throw an error, when the cookie value was not encrypted. This happens when
 * there is an internal error with encryption key/cipher setting.
 *
 * @param encrypter
 * @param exceptions collection of cookie names that has to be exempted from encryption
 * @param cookie
 */
async function encryptCookie(encrypter: IEncrypter, exceptions: string[], cookie: ICookie) {
    if (exceptions.includes(cookie.getName())) {
        return cookie;
    }
    const cookieValue = await encrypter.encrypt(cookie.getValue());

    return cookie.setValue(cookieValue);
}

export default handler;

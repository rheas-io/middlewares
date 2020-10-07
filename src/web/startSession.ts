import { IRequest } from '@rheas/contracts/core/request';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IResponse } from '@rheas/contracts/core/response';
import { ICookie } from '@rheas/contracts/cookies';

/**
 * This middleware starts the request session. If a session token
 * is present in the cookie, that session is loaded from the data
 * store. Otherwise a new session is created. Then the request flows
 * through the other pipeline and returns back. At that point, we will
 * queue the session cookie to be sent with the response and ends the
 * session by writing it to the data store.
 *
 * @param req
 * @param res
 * @param next
 */
async function handler(req: IRequest, res: IResponse, next: IRequestHandler) {
    const sessionsManager = req.sessions();

    // Start the session by loading the session data from the
    // datastore.
    const sessionCookie = req.cookies().get(sessionsManager.getSessionCookieName());

    const session = await sessionsManager.startSession(
        await sessionsManager.loadSession(sessionCookie?.getValue() || ''),
    );

    res = await next(req, res);

    // Add session id cookie to the queue
    req.cookies().queue(
        sessionsManager.getCookie(
            sessionsManager.getSessionCookieName(),
            session.getId(),
            session.getExpiry(),
        ),
    );

    // Save the session on the datastore.
    sessionsManager.endSession(session);

    return res;
}

export default handler;

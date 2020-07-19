import { IRequest } from "@rheas/contracts/core/request";
import { IRequestHandler } from "@rheas/contracts/routes";
import { IResponse } from "@rheas/contracts/core/response";
/**
 * This middleware will abort the req and send a 503 response if the
 * application is undergoing maintenance. This is determined from the
 * app configs.
 *
 * @param req
 * @param res
 * @param next
 */
declare function handler(req: IRequest, res: IResponse, next: IRequestHandler): Promise<IResponse>;
export default handler;

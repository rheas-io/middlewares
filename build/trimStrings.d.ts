import { IRequest } from "@rheas/contracts/core/request";
import { IRequestHandler } from "@rheas/contracts/routes";
import { IResponse } from "@rheas/contracts/core/response";
/**
 * Trims all the trailing whitespaces from the req inputs.
 *
 * @param req
 * @param res
 * @param next
 */
declare function handler(req: IRequest, res: IResponse, next: IRequestHandler): Promise<IResponse>;
export default handler;

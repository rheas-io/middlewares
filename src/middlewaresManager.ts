import { Exception } from '@rheas/errors';
import { KeyValue } from '@rheas/contracts';
import { IMiddleware, INameParams } from '@rheas/contracts/middlewares';

export class MiddlewaresManager {
    /**
     * List of all the middlewares used in the application
     *
     * @var Object
     */
    protected _middlewares: KeyValue<IMiddleware> = {};

    /**
     * Application's global middleware list.
     *
     * @var array
     */
    protected _globalMiddlewares: string[] = [];

    /**
     * Returns middleware string as name and params array.
     *
     * @param middleware
     */
    public middlewareNameParams(middleware: string): INameParams {
        let [name, ...others] = middleware.trim().split(':');

        let params: string = others.join(':');

        return [name, params.length > 0 ? params.split(',') : []];
    }

    /**
     * Returns middleware handler function.
     *
     * @param nameParam
     */
    public resolveMiddleware([name, params]: INameParams): IMiddleware {
        return async (req, res, next) => {
            const typeMiddleware = typeof this._middlewares[name];

            if (typeMiddleware !== 'function') {
                throw new Exception(
                    `Middleware ${name} has to be a function. Found: ${typeMiddleware}`,
                );
            }
            return await this._middlewares[name](req, res, next, ...params);
        };
    }

    /**
     * Returns the global middleware list. 
     * 
     * All the request will go through this global middleware list before 
     * dispatching to the router.
     *
     * @returns
     */
    public globalMiddlewares(): string[] {
        return this._globalMiddlewares;
    }
}

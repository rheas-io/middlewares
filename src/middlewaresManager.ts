import { Exception } from '@rheas/errors';
import { KeyValue } from '@rheas/contracts';
import { InvalidArgumentException } from '@rheas/errors/invalidArgument';
import { IMiddleware, IMiddlewareManager, INameParams } from '@rheas/contracts/middlewares';
import { IMiddlewareTypes, IMiddlewareMap, IMiddlewareValues } from '@rheas/contracts/middlewares';

export class MiddlewaresManager implements IMiddlewareManager {
    /**
     * List of all the middlewares used in the application
     *
     * @var Object
     */
    protected _middlewares: IMiddlewareMap = {
        global: [
            '@rheas/middlewares/global/maintenance',
            '@rheas/middlewares/global/trimStrings',
            '@rheas/middlewares/global/nullEmptyStrings',
            '@rheas/middlewares/global/addCookies',
            '@rheas/middlewares/global/encryptCookies',
        ],
        web: ['@rheas/middlewares/web/startSession', '@rheas/middlewares/web/verifyCsrf'],
        api: ['@rheas/middlewares/api/throttle'],
    };

    /**
     * Cache of middleware functions mapped to the file path.
     *
     * @var object
     */
    protected _cachedMiddlewares: KeyValue<IMiddleware> = {};

    /**
     * Registers a new middleware on the application for the given `name`. 
     * 
     * An exception will be thrown if the application tries to register a middleware for
     * the keys `global`, `web` and `api`. These are core middlewares and can't be updated
     * dynamically. Developers can override these on the app/middlewares file.
     * 
     * @param name
     * @param middleware
     */
    public registerMiddleware(name: string, middleware: IMiddlewareValues): IMiddlewareManager {
        if (['global', 'web', 'api'].includes(name)) {
            throw new InvalidArgumentException('Cannot register a middleware for ' + name);
        }

        this._middlewares[name] = middleware;

        return this;
    }

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
     * Returns a list of middleware handlers for the given middleware name.
     *
     * @param nameParam
     */
    public resolveMiddlewares([name, params]: INameParams): IMiddleware[] {
        return this.middlewaresFromName(name).map((middleware) => {
            return async (req, res, next) => {
                return await middleware(req, res, next, ...params);
            };
        });
    }

    /**
     * Returns a collection of middleware functions from the middleware name.
     *
     * Middleware groups defined as array of handlers will return a collection of middleware
     * functions in the same order.
     *
     * If the handler for the `name` is a string or a function, an array with a single
     * middleware function will be returned.
     *
     * @param name
     */
    public middlewaresFromName(name: string): IMiddleware[] {
        const middleware = this._middlewares[name];

        if (Array.isArray(middleware)) {
            return (middleware as Array<IMiddlewareTypes>).map((value) =>
                this.middlewareFromHandler(value),
            );
        }
        return [this.middlewareFromHandler(middleware)];
    }

    /**
     * Returns a middleware function from the handler.
     *
     * If the `handler` is a function, it is considered as a middleware function and
     * is returned immediately.
     *
     * If the `handler` is a string ie middleware file path, we will try to return the
     * corresponding middleware function from the cache. If not found found, we will load
     * it, cache it and returns it. We will use the `default` export as middleware function.
     *
     * @param handler
     */
    public middlewareFromHandler(handler: string | IMiddleware): IMiddleware {
        if (typeof handler === 'function') {
            return handler;
        }

        if (typeof this._cachedMiddlewares[handler] === 'function') {
            return this._cachedMiddlewares[handler];
        }

        const resolvedFunction = require(handler)['default'];

        if (typeof resolvedFunction !== 'function') {
            throw new Exception(
                `Middleware has to be a function. Found: ${typeof resolvedFunction}`,
            );
        }
        return (this._cachedMiddlewares[handler] = resolvedFunction);
    }

    /**
     * Returns the global middleware pipeline.
     *
     * All the request will go through this global middleware pipeline before
     * dispatching to the router.
     *
     * @returns
     */
    public globalMiddlewares(): IMiddleware[] {
        return this.resolveMiddlewares(['global', []]);
    }
}

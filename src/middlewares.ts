import { Exception } from '@rheas/errors';
import { KeyValue } from '@rheas/contracts';
import { IMiddleware, INameParams } from '@rheas/contracts/middlewares';

export class Middlewares {
    /**
     * List of all the middlewares used in the application
     *
     * @var Object
     */
    protected middlewares: KeyValue<IMiddleware> = {};

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
            const typeMiddleware = typeof this.middlewares[name];

            if (typeMiddleware !== 'function') {
                throw new Exception(
                    `Middleware ${name} has to be a function. Found: ${typeMiddleware}`,
                );
            }
            return await this.middlewares[name](req, res, next, ...params);
        };
    }
}

import { IRequest } from '@rheas/contracts/core/request';

export class TransformRequest {
    /**
     * The keys which should be exempted from the transformation.
     *
     * @var array
     */
    protected _except: string[];

    /**
     * Creates a new request field transformer. For instance, we can
     * trim all the string fields of req, or replace empty strings with
     * null etc.
     *
     * The argument except consists of the field names that has to be
     * exempted from transformations.
     *
     * @param except
     */
    constructor(except: string[] = []) {
        this._except = except;
    }

    /**
     * Transforms the inputs on the request. Request query and
     * request body fields are transformed.
     *
     * @param req
     */
    public handle(req: IRequest) {
        this.transformRequest(req.query());
        this.transformRequest(req.body());
    }

    /**
     * Iterate through fields and transform each string fields.
     *
     * @param item Field value
     * @param key
     */
    protected transformRequest(item: any, key?: string): any {
        // If the item is an object, iterate through
        // each property and transform the property.
        if (null !== item && typeof item === 'object') {
            for (let prop in item) {
                item[prop] = this.transformRequest(item[prop], prop);
            }
            return item;
        }

        // If the item is a string, transform the item. Transform
        // function can be different based on the child class that
        // extends this base class.
        if (typeof item === 'string') {
            item = this.transform(item, key);
        }
        return item == null ? null : item;
    }

    /**
     * Transforms the request field as required and returns the
     * transformed value.
     *
     * As this is an abstract class, returns the value as it is.
     *
     * @param value
     * @param key
     */
    protected transform(value: string, key?: string): any {
        // Check if the key exists in the exception list. If
        // exists return the value as it is.
        //
        // For example, password and password_confirmation keys
        // should not be trimmed.
        if (null != key && this._except.includes(key)) {
            return value;
        }
        return this.clean(value);
    }

    /**
     * Extended classes can define the value cleaning within this
     * function. This is where the actual string transformation takes
     * place.
     *
     * @param value
     */
    protected clean(value: string): any {
        return value;
    }
}

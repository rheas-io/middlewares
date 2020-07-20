import { IRequest } from "@rheas/contracts/core/request";
export declare class TransformRequest {
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
    constructor(except?: string[]);
    /**
     * Transforms the inputs on the request. Request query and
     * request body fields are transformed.
     *
     * @param req
     */
    handle(req: IRequest): void;
    /**
     * Iterate through fields and transform each string fields.
     *
     * @param item Field value
     * @param key
     */
    protected transformRequest(item: any, key?: string): any;
    /**
     * Transforms the request field as required and returns the
     * transformed value.
     *
     * As this is an abstract class, returns the value as it is.
     *
     * @param value
     * @param key
     */
    protected transform(value: string, key?: string): any;
    /**
     * Extended classes can define the value cleaning within this
     * function. This is where the actual string transformation takes
     * place.
     *
     * @param value
     */
    protected clean(value: string): any;
}

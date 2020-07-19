import { TransformRequest } from "./transformRequest";

export class EmptyStrings extends TransformRequest {

    /**
     * Set the request value to null if it is an empty string.
     * 
     * @param value Request field value
     * @param key Request field key
     */
    protected clean(value: string): any {
        return value === '' ? null : value;
    }
}
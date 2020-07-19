import { TransformRequest } from "./transformRequest";

export class TrimStrings extends TransformRequest {

    /**
     * Trim the given request value.
     * 
     * @param value Field value
     */
    protected clean(value: string): any {
        return value.trim();
    }
}
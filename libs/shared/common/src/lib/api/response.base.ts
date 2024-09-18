export interface BaseResponseProps<TData> {
    message: string;
    code: string;
    success: boolean;
    desc?: string;
    data?: TData;
    errors?: string[];
}

/**
 * ResponseBase
 *
 * @property message - Message of response
 * @property code - Unique response code which can used for internationalization
 * @property data - Response data
 * @property errors - Response data
 */
export class ResponseBase<TData = undefined> implements BaseResponseProps<TData> {
    constructor(props: BaseResponseProps<TData>) {
        this.message = props.message;
        this.code = props.code;
        this.data = props.data;
        this.errors = props.errors;
    }

    readonly message: string;
    readonly success: boolean;
    readonly code: string;
    readonly desc?: string;
    readonly data?: TData;
    readonly errors?: string[];
}

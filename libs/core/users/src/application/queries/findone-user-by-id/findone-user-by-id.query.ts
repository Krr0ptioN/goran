import { QueryBase } from '@goran/common';

export class FindOneUserByIdQuery extends QueryBase {
    readonly id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }
}

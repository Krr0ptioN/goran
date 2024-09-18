import { QueryBase } from '@goran/common';

export class FindOneUserByUsernameQuery extends QueryBase {
    readonly username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }
}

import { PaginatedParams, PaginatedQueryBase } from '@goran/common';

export class FindAllUsersPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindAllUsersPaginatedQuery>) {
    super(props);
  }
}

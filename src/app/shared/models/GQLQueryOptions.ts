export class GQLQueryOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchField?: string;
  searchTerm?: string;
  filters?: string;
  relations?: string[];
}

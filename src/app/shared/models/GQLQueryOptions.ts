export class GQLQueryOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchField?: string;
  searchTerm?: string;
  filters?: { [key: string]: string[] };
  relations?: string[];
}

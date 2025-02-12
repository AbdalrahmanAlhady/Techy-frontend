import { Injectable, signal } from '@angular/core';
import { GQLQueryOptions } from '../models/GQLQueryOptions';

import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import {
  GET_CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  GET_CATEGORIES_COUNT,
  UPDATE_CATEGORY_MUTATION,
} from '../gql/category-gql';
import { Apollo, MutationResult } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoriesSignal = signal<Category[]>([]);
  filtersAppliedSignal = signal<boolean>(false);
  categoriesPerPage: number = 6;
  currentCategoriesPageSignal = signal<number>(1);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();
  constructor(private apollo: Apollo) {
    this.queryOptions.limit = this.categoriesPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }

  getCategoriesCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ categoriesCount: number }>> {
    return this.apollo.watchQuery<{ categoriesCount: number }>({
      query: GET_CATEGORIES_COUNT,
      variables: {
        options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  getCategories(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ categories: Category[] }>> {
    return this.apollo.watchQuery<{ categories: Category[] }>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        id: id,
        options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  createCategory(
    name: string
  ): Observable<MutationResult<{ createCategory: Category }>> {
    return this.apollo.mutate<{ createCategory: Category }>({
      mutation: CREATE_CATEGORY_MUTATION,
      variables: {
        name,
      },
    });
  }
  updateCategory(
    id: string,
    name: string
  ): Observable<MutationResult<{ updateCategory: Category }>> {
    return this.apollo.mutate<{ updateCategory: Category }>({
      mutation: UPDATE_CATEGORY_MUTATION,
      variables: {
        categoryId: id,
        name,
      },
    });
  }
  deleteCategory(
    id: string
  ): Observable<MutationResult<{ deleteCategory: boolean }>> {
    return this.apollo.mutate<{ deleteCategory: boolean }>({
      mutation: CREATE_CATEGORY_MUTATION,
      variables: {
        categoryId: id,
      },
    });
  }
}

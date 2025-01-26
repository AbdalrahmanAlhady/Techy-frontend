import { Injectable, signal } from '@angular/core';
import { GQLQueryOptions } from '../models/GQLQueryOptions';

import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { CATEGORIES_QUERY, GET_CATEGORIES_COUNT } from '../gql/category-gql';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoriesPerPage: number = 6;
  currentCategoriesPageSignal = signal<number>(1);
  constructor(private apollo: Apollo) {}

  getCategoriesCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ categoriesCount: number }>> {
    return this.apollo.watchQuery<{ categoriesCount: number }>({
      query: GET_CATEGORIES_COUNT,
      variables: {
        options: options,
      },
    }).valueChanges;
  }
  getCategories(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ categories: Category[] }>> {
    return this.apollo.watchQuery<{ categories: Category[] }>({
      query: CATEGORIES_QUERY,
      variables: {
        id: id,
        options: options,
      },
    }).valueChanges;
  }
}

import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';

import { Brand } from '../models/Brand';
import { BRANDS_QUERY, GET_BRANDS_COUNT } from '../gql/brand-gql';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brandsPerPage: number = 6;
  currentBrandsPageSignal = signal<number>(1);
  constructor(private apollo: Apollo) {}

  getBrandsCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ brandsCount: number }>> {
    return this.apollo.watchQuery<{ brandsCount: number }>({
      query: GET_BRANDS_COUNT,
      variables: {
        options: options,
      },
    }).valueChanges;
  }
  getBrands(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ brands: Brand[] }>> {
    return this.apollo.watchQuery<{ brands: Brand[] }>({
      query: BRANDS_QUERY,
      variables: {
        id: id,
        options: options,
      },
    }).valueChanges;
  }
}

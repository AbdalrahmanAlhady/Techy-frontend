import { Injectable, signal } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';

import { Brand } from '../models/Brand';
import {
  GET_BRANDS_QUERY,
  GET_BRANDS_COUNT_QUERY,
  UPDATE_BRAND_MUTATION,
  CREATE_BRAND_MUTATION,
} from '../gql/brand-gql';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brandsSignal = signal<Brand[]>([]);
  filtersAppliedSignal = signal<boolean>(false);
  brandsPerPage: number = 6;
  currentBrandsPageSignal = signal<number>(1);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();

  constructor(private apollo: Apollo) {
    this.queryOptions.limit = this.brandsPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }
  getBrandsCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ brandsCount: number }>> {
    return this.apollo.watchQuery<{ brandsCount: number }>({
      query: GET_BRANDS_COUNT_QUERY,
      variables: {
        options
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  getBrands(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ brands: Brand[] }>> {
    return this.apollo.watchQuery<{ brands: Brand[] }>({
      query: GET_BRANDS_QUERY,
      variables: {
        id,
        options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  createBrand(
    name: string
  ): Observable<MutationResult<{ createBrand: Brand }>> {
    return this.apollo.mutate<{ createBrand: Brand }>({
      mutation: CREATE_BRAND_MUTATION,
      variables: {
        name,
      },
    });
  }
  updateBrand(
    id: string,
    name: string
  ): Observable<MutationResult<{ updateBrand: Brand }>> {
    return this.apollo.mutate<{ updateBrand: Brand }>({
      mutation: UPDATE_BRAND_MUTATION,
      variables: {
        brandId:id,
        name,
      },
    });
  }
  deleteBrand(
    id: string
  ): Observable<MutationResult<{ deleteBrand: boolean }>> {
    return this.apollo.mutate<{ deleteBrand: boolean }>({
      mutation: UPDATE_BRAND_MUTATION,
      variables: {
        id,
      },
    });
  }
}

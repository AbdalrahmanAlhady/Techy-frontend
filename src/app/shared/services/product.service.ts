import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  GET_PRODUCTS_COUNT,
  GET_PRODUCTS_NAMES,
  GET_PRODUCTS_PRICE_RANGE,
  PRODUCTS_QUERY,
} from '../gql/product-gql';
import { Product } from '../models/Product';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsSignal = signal<Product[]>([]); // carousel uses this
  filtersAppliedSignal = signal<boolean>(false);
  productsPerPage: number = 6;
  currentProductsPageSignal = signal<number>(1);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();

  constructor(private apollo: Apollo) {
    this.queryOptions.limit = this.productsPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }

  getProductsCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ productsCount: number }>> {
    return this.apollo.watchQuery<{ productsCount: number }>({
      query: GET_PRODUCTS_COUNT,
      variables: {
        options: options,
      },
    }).valueChanges;
  }

  getProductsNames(
    options?: GQLQueryOptions
  ): Observable<
    ApolloQueryResult<{
      productsNames: { id: string; name: string; cover: string }[];
    }>
  > {
    return this.apollo.watchQuery<{
      productsNames: { id: string; name: string; cover: string }[];
    }>({
      query: GET_PRODUCTS_NAMES,
      variables: {
        options: options,
      },
    }).valueChanges;
  }
  getProductsPriceRange(
    options?: GQLQueryOptions
  ): Observable<
    ApolloQueryResult<{ productsPriceRange: { min: number; max: number } }>
  > {
    return this.apollo.watchQuery<{
      productsPriceRange: { min: number; max: number };
    }>({
      query: GET_PRODUCTS_PRICE_RANGE,
      variables: {
        options: options,
      },
    }).valueChanges;
  }
  getProducts(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ products: Product[] }>> {
    return this.apollo.watchQuery<{ products: Product[] }>({
      query: PRODUCTS_QUERY,
      variables: {
        id: id,
        options: options,
      },
    }).valueChanges;
  }
}

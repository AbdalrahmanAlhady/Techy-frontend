import { Injectable, signal } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  CREATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  GET_PRODUCTS_COUNT_QUERY,
  GET_PRODUCTS_NAMES_QUERY,
  GET_PRODUCTS_PRICE_RANGE_QUERY,
  GET_PRODUCTS_QUERY,
  UPDATE_PRODUCT_MUTATION,
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
      query: GET_PRODUCTS_COUNT_QUERY,
      variables: {
        options: options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  getProductsNames(options?: GQLQueryOptions): Observable<
    ApolloQueryResult<{
      productsNames: { id: string; name: string; cover: string }[];
    }>
  > {
    return this.apollo.watchQuery<{
      productsNames: { id: string; name: string; cover: string }[];
    }>({
      query: GET_PRODUCTS_NAMES_QUERY,
      variables: {
        options: options,
      },
      context: {
        headers: { skip: 'true' },
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
      query: GET_PRODUCTS_PRICE_RANGE_QUERY,
      variables: {
        options: options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  getProducts(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ products: Product[] }>> {
    return this.apollo.watchQuery<{ products: Product[] }>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        id: id,
        options: options,
      },
      context: {
        headers: { skip: 'true' },
      },
    }).valueChanges;
  }
  createProduct(
    name: string,
    description: string,
    price: number,
    category: string,
    brand: string,
    cover: string,
    inventory: number
  ): Observable<MutationResult<{ createProduct: Product }>> {
    return this.apollo.mutate<{ createProduct: Product }>({
      mutation: CREATE_PRODUCT_MUTATION,
      variables: {
        name,
        description,
        price,
        category,
        brand,
        cover,
        inventory,
      },
    });
  }
  updateProduct(
    productId: string,
    name: string,
    price: number,
    inventory: number,
    cover: string
  ): Observable<MutationResult<{ updateProduct: Product }>> {
    return this.apollo.mutate<{ updateProduct: Product }>({
      mutation: UPDATE_PRODUCT_MUTATION,
      variables: {
        productId,
        name,
        price,
        inventory,
        cover,
      },
    });
  }
  deleteProduct(
    productId: string
  ): Observable<MutationResult<{ deleteProduct: boolean }>> {
    return this.apollo.mutate<{ deleteProduct: boolean }>({
      mutation: DELETE_PRODUCT_MUTATION,
      variables: {
        productId,
      },
    });
  }
}

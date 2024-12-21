import { Injectable, Signal, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GET_PRODUCTS_COUNT, PRODUCTS_QUERY } from '../querys/product-querys';
import { Product } from '../models/Product';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core/types';
import { LocalStorageService } from './local-storage.service';
import { OrderItem } from '../models/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsSignal = signal<Product[]>([]); // carousel uses this
  productsPerPage: number = 6;
  currentProductsPageSignal = signal<number>(1);

  constructor(
    private apollo: Apollo,
  ) {}

  getProductsCount(options?: GQLQueryOptions) {
    return this.apollo.watchQuery<{ productsCount: number }>({
      query: GET_PRODUCTS_COUNT,
      variables: {
        options: options,
      },
    }).valueChanges;
  }

  getProducts(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ products: Product[] }>> {
    return this.apollo.watchQuery<{ products: Product[] }>({
      query: PRODUCTS_QUERY,
      variables: {
        options: options,
      },
    }).valueChanges;
  }
}

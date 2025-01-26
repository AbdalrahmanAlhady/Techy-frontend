import { Injectable, signal } from '@angular/core';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { Apollo, MutationResult } from 'apollo-angular';

import { OrderItem } from '../models/OrderItem';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { Order } from '../models/Order';
import {
  CREATE_ORDER_MUTATION,
  GET_ORDERS_COUNT,
  ORDERS_QUERY,
} from '../gql/order-gql';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  ordersPerPage: number = 6;
  currentOrdersPageSignal = signal<number>(1);
  constructor(private apollo: Apollo) {}

  getOrdersCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ ordersCount: number }>> {
    return this.apollo.watchQuery<{ ordersCount: number }>({
      query: GET_ORDERS_COUNT,
      variables: {
        options: options,
      },
    }).valueChanges;
  }

  getOrders(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ orders: Order[] }>> {
    return this.apollo.watchQuery<{ orders: Order[] }>({
      query: ORDERS_QUERY,
      variables: {
        id: id,
        options: options,
      },
    }).valueChanges;
  }

  createOrder(
    orderItems: OrderItem[],
    userId: string,
    totalAmount: number,
    deliveryFee: number,
    address: string
  ): Observable<MutationResult<{ createOrder: Order }>> {
    return this.apollo.mutate<{ createOrder: Order }>({
      mutation: CREATE_ORDER_MUTATION,
      variables: {
        orderItems,
        userId,
        totalAmount,
        deliveryFee,
        address
      },
    });
  }
}

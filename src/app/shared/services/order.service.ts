import { Injectable, signal } from '@angular/core';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { Apollo, MutationResult } from 'apollo-angular';

import { OrderItem } from '../models/OrderItem';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { Order } from '../models/Order';
import {
  CREATE_ORDER_MUTATION,
  DELETE_ORDER_MUTATION,
  GET_ORDERS_COUNT_QUERY,
  GET_ORDERS_QUERY,
  UPDATE_ORDER_MUTATION,
} from '../gql/order-gql';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  ordersSignal = signal<Order[]>([]);
  ordersPerPage: number = 6;
  currentOrdersPageSignal = signal<number>(1);
  filtersAppliedSignal = signal<boolean>(false);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();

  constructor(private apollo: Apollo) {
    this.queryOptions.limit = this.ordersPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }

  getOrdersCount(
    options?: GQLQueryOptions
  ): Observable<ApolloQueryResult<{ ordersCount: number }>> {
    return this.apollo.watchQuery<{ ordersCount: number }>({
      query: GET_ORDERS_COUNT_QUERY,
      variables: {
        options
      },
    }).valueChanges;
  }

  getOrders(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ orders: Order[] }>> {
    return this.apollo.watchQuery<{ orders: Order[] }>({
      query: GET_ORDERS_QUERY,
      variables: {
        id: id,
        options
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
        address,
      },
    });
  }
  updateOrder(
    orderId: string,
    deliveryFee: number,
    totalAmount: number,
    orderStatus: string,
    address: string
  ): Observable<MutationResult<{ updateOrder: Order }>> {
    return this.apollo.mutate<{ updateOrder: Order }>({
      mutation: UPDATE_ORDER_MUTATION,
      variables: {
        orderId,
        deliveryFee,
        totalAmount,
        orderStatus,
        address
      },
    });
  }
  deleteOrder(
    orderId: string
  ): Observable<MutationResult<{ deleteOrder: boolean }>> {
    return this.apollo.mutate<{ deleteOrder: boolean }>({
      mutation: DELETE_ORDER_MUTATION,
      variables: {
        orderId,
      },
    });
  }
}

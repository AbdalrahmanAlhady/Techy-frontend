import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CREATE_ORDER_ITEM_MUTATION,
  DELETE_ORDER_ITEM_MUTATION,

  GET_ORDER_ITEMS_COUNT_QUERY,

  GET_ORDER_ITEMS_QUERY,

  UPDATE_ORDER_ITEM_MUTATION,
} from '../gql/order_item_gql';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { OrderItem } from '../models/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  orderItemsSignal = signal<OrderItem[]>([]);
  orderItemsPerPage: number = 6;
  currentOrderItemsPageSignal = signal<number>(1);
  filtersAppliedSignal = signal<boolean>(false);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();

  constructor(private apollo: Apollo) {
    this.queryOptions.limit = this.orderItemsPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }
  getOrderItemsCount(
    options?: GQLQueryOptions,
    orderId?: string,
    vendorId?: string
  ): Observable<ApolloQueryResult<{ orderItemsCount: number }>> {
    return this.apollo.watchQuery<{ orderItemsCount: number }>({
      query: GET_ORDER_ITEMS_COUNT_QUERY,
      variables: {
        orderId,
        vendorId,
        options
      },
    }).valueChanges;
  }
  
  getOrderItems(
    options?: GQLQueryOptions,
    orderId?: string,
    orderItemId?: string,
    vendorId?: string
  ): Observable<ApolloQueryResult<{ orderItems: OrderItem[] }>> {
    return this.apollo.watchQuery<{ orderItems: OrderItem[] }>({
      query: GET_ORDER_ITEMS_QUERY,
      variables: {
        orderId,
        vendorId,
        orderItemId,
        options
      },
    }).valueChanges;
  }
  createOrderItem(
    quantity: number,
    unitPrice: number,
    totalPrice: number,
    orderId: string,
    productId: string
  ): Observable<MutationResult<{ createOrderItem: OrderItem }>> {
    return this.apollo.mutate<{ createOrderItem: OrderItem }>({
      mutation: CREATE_ORDER_ITEM_MUTATION,
      variables: {
        quantity,
        unitPrice,
        totalPrice,
        orderId,
        productId,
      },
    });
  }
  updateOrderItem(
    orderItemId: string,
    quantity: number,
    unitPrice: number,
    totalPrice: number
  ): Observable<MutationResult<{ updateOrderItem: OrderItem }>> {
    return this.apollo.mutate<{ updateOrderItem: OrderItem }>({
      mutation: UPDATE_ORDER_ITEM_MUTATION,
      variables: {
        orderItemId,
        quantity,
        unitPrice,
        totalPrice,
      },
    });
  }
  deleteOrderItem(
    orderItemId: string
  ): Observable<MutationResult<{ deleteOrderItem: boolean }>> {
    return this.apollo.mutate<{ deleteOrderItem: boolean }>({
      mutation: DELETE_ORDER_ITEM_MUTATION,
      variables: {
        orderItemId,
      },
    });
  }
}

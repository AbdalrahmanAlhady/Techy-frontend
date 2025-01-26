import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CREATE_ORDER_ITEM_MUTATION,
  DELETE_ORDER_ITEM_MUTATION,
  ORDER_ITEMS_QUERY,
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
  constructor(private apollo: Apollo) {}
  getOrderItems(
    options?: GQLQueryOptions,
    orderId?: string,
    orderItemId?: string,
    vendorId?: string
  ): Observable<ApolloQueryResult<{ orderItems: OrderItem[] }>> {
    return this.apollo.watchQuery<{ orderItems: OrderItem[] }>({
      query: ORDER_ITEMS_QUERY,
      variables: {
        orderId: orderId,
        vendorId: vendorId,
        orderItemId: orderItemId,
        options: options,
      },
    }).valueChanges;
  }
  createOrderItem(
    quantity: number,
    unitPrice: number,
    totalPrice: number,
    orderId: string,
    productId: string
  ): Observable<MutationResult<{ CreateOrderItem: OrderItem }>> {
    return this.apollo.mutate<{ CreateOrderItem: OrderItem }>({
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

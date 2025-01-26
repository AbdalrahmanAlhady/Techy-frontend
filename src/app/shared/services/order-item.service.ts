import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDER_ITEMS_QUERY } from '../gql/order_item_gql';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
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
}

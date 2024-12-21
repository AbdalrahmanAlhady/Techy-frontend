import { Injectable } from '@angular/core';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { Apollo } from 'apollo-angular';
import { createOrder_mutation } from '../querys/order-mutations';
import { OrderItem } from '../models/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private apollo: Apollo) {}
  createOrder(
    orderItems: OrderItem[],
    userId: string,
    totalAmount: number,
    deliveryFee: number
  ) {
    return this.apollo.mutate({
      mutation: createOrder_mutation,
      variables: {
        orderItems,
        userId,
        totalAmount,
        deliveryFee,
      },
    });
  }
}

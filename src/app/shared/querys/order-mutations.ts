import { gql } from 'apollo-angular';
export const createOrder_mutation = gql`
  mutation CreateOrder(
    $orderItems: [OrderItemInput!]!
    $userId: String!
    $totalAmount: Float!
    $deliveryFee: Float!
  ) {
    createOrder(
      orderItems: $orderItems
      userId: $userId
      totalAmount: $totalAmount
      deliveryFee: $deliveryFee
    ) {
      id
      orderStatus
      totalAmount
      deliveryFee
      orderItems {
        id
        quantity
        unitPrice
        totalPrice
      }
    }
  }
`;

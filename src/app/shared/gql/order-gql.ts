import { gql } from 'apollo-angular';

export const GET_ORDERS_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    ordersCount(options: $options)
  }
`;
export const ORDERS_QUERY = gql`
  query Orders($options: QueryOptionsInput, $ordersId: String) {
    orders(options: $options, id: $ordersId) {
      id
      orderStatus
      deliveryFee
      totalAmount
      address
      user {
        lastName
        firstName
        id
      }
      orderItems {
        id
        quantity
        unitPrice
        totalPrice
       
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder(
    $orderItems: [OrderItemInput!]!
    $userId: String!
    $address: String!
    $totalAmount: Float!
    $deliveryFee: Float!
  ) {
    createOrder(
      orderItems: $orderItems
      userId: $userId
      totalAmount: $totalAmount
      deliveryFee: $deliveryFee
      address: $address
    ) {
      id
      orderStatus
      totalAmount
      deliveryFee
      address
      orderItems {
        id
        quantity
        unitPrice
        totalPrice
      }
    }
  }
`;

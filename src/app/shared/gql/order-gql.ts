import { gql } from 'apollo-angular';

export const GET_ORDERS_COUNT_QUERY = gql`
  query Query($options: QueryOptionsInput) {
    ordersCount(options: $options)
  }
`;
export const GET_ORDERS_QUERY = gql`
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
export const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder(
    $orderId: String!
    $deliveryFee: Float
    $totalAmount: Float
    $orderStatus: String
  ) {
    updateOrder(
      id: $orderId
      deliveryFee: $deliveryFee
      totalAmount: $totalAmount
      orderStatus: $orderStatus
    ) {
      id
      orderStatus
      address
      deliveryFee
      totalAmount
      user {
        firstName
        lastName
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
export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($orderId: String!) {
    deleteOrder(id: $orderId)
  }
`;

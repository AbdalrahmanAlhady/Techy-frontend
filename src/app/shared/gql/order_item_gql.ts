import { gql } from 'apollo-angular';

export const ORDER_ITEMS_QUERY = gql`
  query OrderItems(
    $options: QueryOptionsInput
    $vendorId: String
    $orderId: String
    $orderItemId: String
  ) {
    orderItems(
      options: $options
      vendorId: $vendorId
      orderId: $orderId
      orderItemId: $orderItemId
    ) {
      id
      quantity
      totalPrice
      unitPrice
      product {
        id
        name
        cover
      }
      order {
        id
        orderStatus
      }
    }
  }
`;

export const CREATE_ORDER_ITEM_MUTATION = gql`
  mutation CreateOrderItem(
    $productId: String!
    $orderId: String!
    $totalPrice: Float!
    $unitPrice: Float!
    $quantity: Float!
  ) {
    createOrderItem(
      productId: $productId
      orderId: $orderId
      totalPrice: $totalPrice
      unitPrice: $unitPrice
      quantity: $quantity
    ) {
      id
      quantity
      totalPrice
      unitPrice
      order {
        id
        orderStatus
      }
      product {
        id
        name
        cover
      }
    }
  }
`;

export const UPDATE_ORDER_ITEM_MUTATION = gql`
  mutation UpdateOrderItem(
    $orderItemId: String!
    $totalPrice: Float
    $unitPrice: Float
    $quantity: Float
  ) {
    updateOrderItem(
      id: $orderItemId
      totalPrice: $totalPrice
      unitPrice: $unitPrice
      quantity: $quantity
    ) {
      id
      quantity
      totalPrice
      unitPrice
      order {
        id
        orderStatus
      }
      product {
        id
        name
        cover
      }
    }
  }
`;

export const DELETE_ORDER_ITEM_MUTATION = gql`
  mutation DeleteOrderItem($orderItemId: String!) {
    deleteOrderItem(id: $orderItemId) {
      id
    }
  }
`;

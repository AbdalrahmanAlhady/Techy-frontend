import { gql } from 'apollo-angular';

export const GET_ORDER_ITEMS_COUNT_QUERY = gql`
  query OrderItemsCount(
    $options: QueryOptionsInput
    $orderId: String
    $vendorId: String!
  ) {
    orderItemsCount(orderId: $orderId, options: $options, vendorId: $vendorId)
  }
`;
export const GET_ORDER_ITEMS_QUERY = gql`
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
        vendor {
          id
          firstName
          lastName
        }
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

export const DELETE_ORDER_ITEM_MUTATION = gql`
  mutation DeleteOrderItem($orderItemId: String!) {
    deleteOrderItem(id: $orderItemId) {
      id
    }
  }
`;

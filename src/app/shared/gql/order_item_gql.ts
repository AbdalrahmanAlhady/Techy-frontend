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

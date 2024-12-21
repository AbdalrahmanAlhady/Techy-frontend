import { gql } from 'apollo-angular';

export const PRODUCTS_QUERY = gql`
  query Query($options: QueryOptionsInput) {
    products(options: $options) {
      name
      description
      cover
      id
      price
      brand {
        id
        name
      }
      category {
        id
        name
      }
      vendor {
        firstName
        lastName
      }
    }
  }
`;
export const GET_PRODUCTS_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    productsCount(options: $options)
  }
`;

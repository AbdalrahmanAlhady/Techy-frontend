import { gql } from 'apollo-angular';

export const GET_PRODUCTS_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    productsCount(options: $options)
  }
`;
export const GET_PRODUCTS_NAMES = gql`
  query ProductsNames($options: QueryOptionsInput) {
    productsNames(options: $options) {
      id
      name
      cover
    }
  }
`;
export const GET_PRODUCTS_PRICE_RANGE = gql`
  query ProductsPriceRange($options: QueryOptionsInput) {
    productsPriceRange(options: $options) {
      min
      max
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  query Query($options: QueryOptionsInput, $id: String) {
    products(options: $options, id: $id) {
      id
      name
      cover
      description
      inventory
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
        id
        firstName
        lastName
      }
    }
  }
`;

import { gql } from "apollo-angular";

export const GET_BRANDS_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    brandsCount(options: $options)
  }
`;

export const BRANDS_QUERY = gql`
  query Brands($options: QueryOptionsInput, $brandId: String) {
    brands(options: $options, id: $brandId) {
      id
      name
      products {
        id
        name
      }
    }
  }
`;

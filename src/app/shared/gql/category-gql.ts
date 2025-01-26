import { gql } from "apollo-angular";

export const GET_CATEGORIES_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    categoriesCount(options: $options)
  }
`;
export const CATEGORIES_QUERY = gql`
  query Categories($options: QueryOptionsInput, $categoryId: String) {
    categories(options: $options, id: $categoryId) {
      id
      name
      products {
        id
        name
      }
    }
  }
`;

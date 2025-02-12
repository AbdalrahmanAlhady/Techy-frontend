import { gql } from 'apollo-angular';

export const GET_CATEGORIES_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    categoriesCount(options: $options)
  }
`;
export const GET_CATEGORIES_QUERY = gql`
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
export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;
export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($name: String!, $categoryId: String!) {
    updateCategory(name: $name, id: $categoryId) {
     id
      name
      products {
        id
        name
      }
    }
  }
`;
export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($categoryId: String!) {
    deleteCategory(id: $categoryId)
  }
`;

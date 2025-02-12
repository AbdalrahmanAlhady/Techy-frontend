import { gql } from 'apollo-angular';

export const GET_BRANDS_COUNT_QUERY = gql`
  query Query($options: QueryOptionsInput) {
    brandsCount(options: $options)
  }
`;
export const GET_BRANDS_QUERY = gql`
  query Brands($options: QueryOptionsInput, $id: String) {
    brands(options: $options, id: $id) {
      id
      name
      products {
        id
        name
      }
    }
  }
`;
export const CREATE_BRAND_MUTATION = gql`
  mutation CreateBrand($name: String!) {
    createBrand(name: $name) {
      id
      name
    }
  }
`;
export const UPDATE_BRAND_MUTATION = gql`
  mutation UpdateBrand($name: String!, $brandId: String!) {
    updateBrand(name: $name, id: $brandId) {
      id
      name
      products {
        id
        name
      }
    }
  }
`;
export const DELETE_BRAND_MUTATION = gql`
  mutation DeleteBrand($brandId: String!) {
    deleteBrand(id: $brandId)
  }
`;

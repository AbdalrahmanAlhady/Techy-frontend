import { gql } from 'apollo-angular';

export const GET_PRODUCTS_COUNT_QUERY = gql`
  query Query($options: QueryOptionsInput) {
    productsCount(options: $options)
  }
`;
export const GET_PRODUCTS_NAMES_QUERY = gql`
  query ProductsNames($options: QueryOptionsInput) {
    productsNames(options: $options) {
      id
      name
      cover
    }
  }
`;
export const GET_PRODUCTS_PRICE_RANGE_QUERY = gql`
  query ProductsPriceRange($options: QueryOptionsInput) {
    productsPriceRange(options: $options) {
      min
      max
    }
  }
`;
export const GET_PRODUCTS_QUERY = gql`
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
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct(
    $inventory: Float!
    $price: Float!
    $cover: String!
    $name: String!
    $brandId: String!
    $categoryId: String!
    $vendorId: String!
    $description: String!
  ) {
    createProduct(
      inventory: $inventory
      price: $price
      cover: $cover
      name: $name
      description: $description
      brandId: $brandId
      categoryId: $categoryId
      vendorId: $vendorId
    ) {
      id
      name
      cover
      description
      inventory
      price
      brand {
        name
      }
      category {
        name
      }
      vendor {
        firstName
        lastName
      }
    }
  }
`;
export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct(
    $productId: String!
    $inventory: Float
    $price: Float
    $cover: String
    $name: String
  ) {
    updateProduct(
      id: $productId
      inventory: $inventory
      price: $price
      cover: $cover
      name: $name
    ) {
      id
      name
      cover
      description
      inventory
      price
      brand {
        name
      }
      category {
        name
      }
      vendor {
        firstName
        lastName
      }
    }
  }
`;
export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($productId: String!) {
    deleteProduct(id: $productId)
  }
`;

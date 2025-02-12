import { gql } from 'apollo-angular';

export const GET_USERS_COUNT_QUERY = gql`
  query Query($options: QueryOptionsInput) {
    usersCount(options: $options)
  }
`;
export const GET_USERS_QUERY = gql`
  query Users($options: QueryOptionsInput, $usersId: String) {
    users(options: $options, id: $usersId) {
      id
      firstName
      lastName
      email
      verified
      role
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser(
    $role: UserRole!
    $password: String!
    $email: String!
    $lastName: String!
    $firstName: String!
  ) {
    createUser(
      role: $role
      password: $password
      email: $email
      lastName: $lastName
      firstName: $firstName
    ) {
      id
      email
      firstName
      lastName
      verified
      role
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $verified: Boolean!
    $role: UserRole!
    $password: String
    $email: String!
    $lastName: String!
    $firstName: String!
    $id: String!
  ) {
    updateUser(
      verified: $verified
      role: $role
      password: $password
      email: $email
      lastName: $lastName
      firstName: $firstName
      id: $id
    ) {
      id
      firstName
      lastName
      email
      verified
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

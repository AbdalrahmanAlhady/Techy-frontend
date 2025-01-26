import { gql } from "apollo-angular";

export const GET_USERS_COUNT = gql`
  query Query($options: QueryOptionsInput) {
    usersCount(options: $options)
  }
`;
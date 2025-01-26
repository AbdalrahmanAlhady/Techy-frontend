import { gql } from 'apollo-angular';

export const REGISTER_MUTATION = gql`
  mutation Register(
    $role: UserRole!
    $password: String!
    $cPassword: String!
    $email: String!
    $lastName: String!
    $firstName: String!
  ) {
    register(
      role: $role
      password: $password
      cPassword: $cPassword
      email: $email
      lastName: $lastName
      firstName: $firstName
    )
  }
`;
export const SIGNIN_MUTATION = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
        role
        verified
      }
    }
  }
`;
export const REFRESH_ACCESS_TOKEN_MUTATION = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken)
  }
`;
export const SEND_OTP_MAIL_MUTATION = gql`
  mutation SendMail($reason: String!, $email: String!) {
    sendMail(reason: $reason, email: $email)
  }
`;
// verify user account using otp
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($code: String!, $email: String!) {
    verifyEmail(code: $code, email: $email)
  }
`;
// reset password using otp
export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $code: String!
    $cPassword: String!
    $password: String!
    $email: String!
  ) {
    resetPassword(
      code: $code
      cPassword: $cPassword
      password: $password
      email: $email
    )
  }
`;

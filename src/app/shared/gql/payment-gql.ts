import { gql } from 'apollo-angular';

export const CREATE_PAYMENT_INTENT_MUTATION = gql`
  mutation CreatePaymentIntent($currency: String!, $amount: Float!) {
    createPaymentIntent(currency: $currency, amount: $amount)
  }
`;

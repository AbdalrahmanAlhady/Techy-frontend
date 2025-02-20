import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { CREATE_PAYMENT_INTENT_MUTATION } from '../gql/payment-gql';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apollo: Apollo) {}
  createPaymentIntent(
    currency: string,
    amount: number
  ): Observable<MutationResult<{ createPaymentIntent: string }>> {
    return this.apollo.mutate<{ createPaymentIntent: string }>({
      mutation: CREATE_PAYMENT_INTENT_MUTATION,
      variables: {
        currency,
        amount,
      },
    });
  }
}

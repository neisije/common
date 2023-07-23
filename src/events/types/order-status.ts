export enum OrderStatus {
  // When the order has been created but the ticket it is trying to order has not been reserved
  Created = 'created',

  // the ticket the order is trying to reserve has already been reserved.
  // or when the user has cancelled the order
  // or the order has expired before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket 
  AwaitingPayment = 'awaiting:payment',

  // The has reserved the ticket and the has provided the payment successfully
  Complete = 'complete'
}
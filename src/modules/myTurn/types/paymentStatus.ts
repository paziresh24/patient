export enum PaymentStatus {
  unpaid = 'unpaid',
  paying = 'paying',
  paid = 'paid',
  refunded = 'refunded',
  refundQueue = 'refund_queue',
  notRefunded = 'not_refunded',
  refundRequest = 'refund_request',
  rejectedRefund = 'rejected_refund',
}

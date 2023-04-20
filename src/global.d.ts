interface TResponse<T = void> {
  code: 200 | 400 | 500
  data?: T
  msg: string
}

type PaymentParams = { amount: number }
type PaymentData = { url: string; token: string }

type CheckerParams = { token: string }
type CheckerData = 'SUCCESS' | 'PROCESSING' | 'TIMEOUT' | 'ERROR'

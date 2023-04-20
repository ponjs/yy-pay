import { payment } from '@/utils/services'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TResponse<PaymentData>>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const amount = Math.floor(Number(req.body.amount))
  if (!amount || amount < 0) return res.json({ code: 400, msg: 'amount cannot be empty' })
  if (amount > 500000) return res.json({ code: 400, msg: 'amount must be an integer of 1~500000' })

  try {
    const data = await payment(amount)
    res.json({ code: 200, msg: 'ok', data })
  } catch (error: any) {
    res.json({ code: 500, msg: error?.message || 'fail' })
  }
}

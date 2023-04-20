import { checker } from '@/utils/services'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TResponse<CheckerData>>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body: CheckerParams = req.body
  if (!body.token) return res.json({ code: 400, msg: 'token cannot be empty' })

  try {
    const data = await checker(body.token)
    res.json({ code: 200, msg: 'ok', data })
  } catch (error: any) {
    res.json({ code: 500, msg: error?.message || 'fail' })
  }
}

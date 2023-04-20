import { JSDOM } from 'jsdom'
import jwt from 'jsonwebtoken'
import request from './request'

const YY_ACCOUNT = process.env.YY_ACCOUNT || ''
const JWT_SECRET = process.env.JWT_SECRET || 'yy_deposit'

interface TDepositForm {
  timestamp?: string
  urlKey?: string
}

// amount: 1-500000
export const payment = async (amount: number): Promise<PaymentData | undefined> => {
  const confirmRes = await request({
    url: '/userDepositCheckAction.action',
    data: {
      passport: YY_ACCOUNT,
      passport2: YY_ACCOUNT,
      duowanb: `${amount}`,
      bankId: 'webzf_weixin', // 'webzf_weixin' | 'alipayDirectPay' | 'super_alipay'
      sourcecode: 'webzf_wgpay',
      deptype: '1',
      gameName: '',
      choiceDesc: `${amount}元兑换${amount}`,
      method: 'WAZF',
      gameCoin: '0',
    },
  })

  const confirmHtml = await confirmRes.text()
  const confirmDom = new JSDOM(confirmHtml)
  const confirmForm = confirmDom.window.document.getElementById('depositForm')
  const confirmInputs = confirmForm ? [...confirmForm.getElementsByTagName('input')] : []

  const depositForm: TDepositForm = {}
  confirmInputs.forEach(input => {
    const name = input.getAttribute('name')
    const value = input.getAttribute('value')
    name && (depositForm[name as keyof TDepositForm] = value || '')
  })

  const depositRes = await request({
    url: '/userDepositAction.action',
    data: depositForm,
    headers: { Cookie: confirmRes.headers.get('set-cookie') || '' },
  })

  const depositUrl = new URL(depositRes.url)
  const depositData = depositUrl.searchParams.get('data')

  if (depositData) {
    return {
      url: JSON.parse(depositData).code_url as string,
      token: jwt.sign(depositForm, JWT_SECRET, { expiresIn: 60 * 30 }),
    }
  }
}

export const checker = async (token: string): Promise<CheckerData> => {
  try {
    const data = jwt.verify(token, JWT_SECRET) as TDepositForm
    const text = await request({ url: '/checkOrderSuccess.action', data }).then(res => res.text())

    if (text === '1') return 'SUCCESS'
    if (text === 'error') return 'PROCESSING'
    return 'ERROR'
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') return 'TIMEOUT'
    throw error
  }
}

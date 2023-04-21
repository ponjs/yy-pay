import { useState } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'

const delay = (ms: number) => new Promise<void>(reslove => setTimeout(reslove, ms))

function Home() {
  const [amount, setAmount] = useState('')
  const [qrcode, setQrcode] = useState('')
  const [loading, setLoading] = useState(false)

  const check = async (token: string) => {
    const res: TResponse<CheckerData> = await fetch('/api/check', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())

    if (res.data !== 'SUCCESS' && res.data !== 'TIMEOUT') {
      await delay(1000)
      await check(token)
    }

    return res.data
  }

  const handlePay = async () => {
    if (loading) return

    setLoading(true)
    const res: TResponse<PaymentData> = await fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify({ amount }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .finally(() => setLoading(false))

    if (!res.data) return alert(res.msg)

    const _qrcode = await QRCode.toDataURL(res.data.url, { width: 320, margin: 2 })
    setQrcode(_qrcode)

    const ret = await check(res.data.token)
    if (ret === 'SUCCESS') alert('支付成功')
    if (ret === 'TIMEOUT') alert('支付超时')
    setQrcode('')
  }

  return (
    <div>
      {qrcode ? (
        <>
          <Image src={qrcode} alt="qrcode" width={320} height={320} />
          <span>使用微信扫一扫</span>
        </>
      ) : (
        <>
          <input
            className="border border-gray-500 rounded-none outline-none"
            type="number"
            onChange={e => setAmount(e.target.value)}
          />
          <button
            className="border border-gray-500 rounded-none outline-none ml-4 px-4 cursor-pointer"
            onClick={handlePay}
          >
            {loading ? 'Loading' : 'Pay'}
          </button>
        </>
      )}
    </div>
  )
}

export default Home

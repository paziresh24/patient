import Button from '@/common/components/atom/button'
import Divider from '@/common/components/atom/divider'
import Loading from '@/common/components/atom/loading'
import Text from '@/common/components/atom/text'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function PaymentReturnLink() {
  const { query } = useRouter()
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    setCookie("payment_state", query?.status)
    setTimeout(() => {
      setShowButton(true)
    }, 3000)
  }, [])
  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen w-full'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <Loading />
        <span className='text-sm font-medium'>کمی منتظر بمانید</span>
      </div>
      {showButton && <div className='flex flex-col gap-3 w-60'>
        <Divider />
        <Text fontSize='xs' className='text-center'>اگر هنوز منتقل نشدید، روی دکمه‌ زیر بزنید.</Text>
        <Button size="sm" block onClick={() => window?.close()}>پرداخت را انجام دادم</Button>
      </div>}
    </div>
  )
}

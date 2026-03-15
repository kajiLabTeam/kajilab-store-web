'use client'
import { AdminPageTitle } from '@/app/components/AdminPageTitle';
import Loading from '@/app/components/Loading';
import { useGetAPI } from '@/app/hooks/useGetAPI';
import { Asset } from '@/types/response';
import { Button, NumberInput } from '@mantine/core';
import axios from 'axios';
import React, { useState } from 'react'
import AssetCalculator from './AssetCalculator';

function EditAssetBase() {
  const [inputMoney, setInputMoney] = useState<number | string>('')
  const [submitting, setSubmitting] = useState(false)
  const [validateMessage, setValidateMessage] = useState('')
  const {data: asset, isLoading: assetLoading, error: assetError} = useGetAPI<Asset>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/assets`
  )

  const submitForm = async() => {
    if(inputMoney == 0 || inputMoney == ''){
      setValidateMessage("必須項目です")
      return
    }
    try {
      setSubmitting(true)
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/assets`,
        { money: Number(inputMoney) },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': `${process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY}`,
          },
        }
      )
      setSubmitting(false)
      window.location.reload()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("エラー発生:", error.response?.status)
        console.error("レスポンス:", error.response?.data)
      } else {
        console.error("予期しないエラー:", error)
      }
    }
    setSubmitting(false)
  }

  if(assetLoading) return(<Loading message='資産情報取得中'/>)
  if(assetError || !asset) return(<div>読み込み失敗</div>)
  return (
    <div className='mb-10 md:pt-5 pt-0'>
      <AdminPageTitle
        title='残高修正'
        subtitle='Edit Asset'
      />
      <div className="max-w-3xl mx-auto px-3 py-2 bg-white rounded-sm shadow">
        <div className='text-xl font-bold'>現在の資産</div>
        <div>現金：{asset.money}円</div>
        <div>梶研Pay残高：{asset.debt}円</div>
      </div>

      <div className="max-w-3xl mx-auto mt-3 px-3 py-2 bg-white rounded-sm shadow">
        <div className='text-xl font-bold'>変更後の資産</div>
        <div className='flex w-full items-center justify-center'>
          <p className='text-xl'>現金：</p>
          <NumberInput
            size='md'
            key='money'
            value={inputMoney}
            onChange={setInputMoney}
          />
        </div>
        <p className='mx-auto text-center text-kirby-pink'>{validateMessage}</p>
        <div className='text-end mt-1'>
          <Button color="#FADA0A" className='mt-1 text-gray-900' onClick={submitForm} disabled={submitting}>送信</Button>
        </div>
        <div className='border-t my-3 border-gray-200'></div>

        <AssetCalculator/>
      </div>
      
    </div>
  )
}

export default EditAssetBase
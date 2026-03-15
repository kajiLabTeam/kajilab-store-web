'use client'
import { TextInput } from '@/app/components/TextInput'
import { generateUserBarcode } from '@/app/utils/generateUserBarcode';
import { Button } from '@mantine/core'
import axios from 'axios';
import React, { useState } from 'react'

type NotHaveKajilabPayCardProps = {
  setUserBarcode: React.Dispatch<React.SetStateAction<string>>
  setName: React.Dispatch<React.SetStateAction<string>>
  setQRcodeUrl: React.Dispatch<React.SetStateAction<string>>
}

function NotHaveKajilabPayCard({setUserBarcode, setName, setQRcodeUrl}: NotHaveKajilabPayCardProps) {
  const [newName, setNewName] = useState('')
  const [validateMessage, setValidateMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  //
  const validate = () => {
    if(newName.length === 0) {
      setValidateMessage("ニックネームを入力してください")
      return false
    }
    if(newName.length > 10) {
      setValidateMessage("ニックネームは10文字以内にしてください")
      return false
    }
    return true
  }

  const submitForm = async() => {
    if(!validate()) return
    setIsSubmitting(true)
    console.log("送信！")
    const newUserBarcode = generateUserBarcode()
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users`,
        { name: newName, barcode: newUserBarcode },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': `${process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY}`,
          },
        }
      )
      console.log("送信成功！")
      setUserBarcode(res.data.user.barcode)
      setName(res.data.user.name)
      setQRcodeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/balanceInqueryQR/${res.data.user.balance_qr_payload}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("エラー発生:", error.response?.status)
        console.error("レスポンス:", error.response?.data)
      } else {
        console.error("予期しないエラー:", error)
      }
    }
    setIsSubmitting(false)
  }
  return (
    <div>
      <p>ニックネームを入力してください</p>
      <div>
        <TextInput
          setText={setNewName}
          placeholder='（例）togawa'
        />
        {validateMessage !== '' && (
          <p className='text-xs text-kirby-pink'>{validateMessage}</p>
        )}
      </div>
      <Button color="#FADA0A" className='mt-1 text-gray-900' onClick={submitForm} disabled={isSubmitting}>
        新規登録
      </Button>
    </div>
  )
}

export default NotHaveKajilabPayCard
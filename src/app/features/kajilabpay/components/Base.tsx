"use client"
import { Button, Image, SegmentedControl } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import * as QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import * as KajilabPayComponent from "@/app/features/kajilabpay/components/Index"
import { postKajilabPayQR } from '@/api';
import axios from 'axios';
import Loading from '@/app/components/Loading';

const Base = () => {
  const [haveKajilabPayCard, setHaveKajilabPayCard] = useState(false)
  const [userBarcode, setUserBarcode] = useState('')
  const [userName, setUserName] = useState('')
  const [userQRCodeURL, setUserQRCodeURL] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  if (typeof window === "undefined") return;
  
  // LocalStorageから復元
  const saved = localStorage.getItem("kajilabpaymobile");
    if (!saved){
      setIsLoading(false)
      return
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed.userBarcode && parsed.name && parsed.qrcodeUrl) {
        setUserBarcode(parsed.userBarcode);
        setUserName(parsed.name);
        setUserQRCodeURL(parsed.qrcodeUrl);
      }
    } catch (e) {
      console.log("localStorage parse error", e);
    }
    setIsLoading(false)
  }, []);

  const handleScanKajilabPayCard =  async (barcodeText: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/kajilabpayqr`,
        {barcode: barcodeText},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': `${process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY}`,
          },
        }
      )
      console.log(res.data)
      setUserBarcode(res.data.barcode)
      setUserName(res.data.name)
      setUserQRCodeURL(`${process.env.NEXT_PUBLIC_WEB_URL}/balanceInqueryQR/${res.data.balance_qr_payload}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("エラー発生:", error.response?.status)
        console.error("レスポンス:", error.response?.data)
        setErrorMessage("未登録の梶研Payカードが読み取られました")
      } else {
        console.error("予期しないエラー:", error)
      }
    }
    console.log(barcodeText)
  }
  
  return (
    <div className='max-w-[600px] mx-auto mb-20'>
      <div className='text-2xl font-black text-center my-2'>梶研Payモバイル登録</div>
      <div className='text-1xl font-bold text-center text-white mx-auto px-10 bg-kirby-pink w-fit rounded-full'>
        Kajilab Pay Mobile
      </div>

      {isLoading ? (
        <Loading message=''/>
      ) : (
        <div className='bg-white text-sm text-center font-semibold mt-8 mb-10 rounded-lg shadow-xl pb-3'>
          <div className='flex mb-3'>
            {haveKajilabPayCard ? (
              // 梶研Payカードを持っている場合
              <>
              <button onClick={() => setHaveKajilabPayCard(false)} className='flex-1 text-slate-500 text-xs bg-slate-200 py-1'>梶研Payカードを持っていない</button>
              <button onClick={() => setHaveKajilabPayCard(true)} className='flex-1 text-black text-xs bg-white py-1'>梶研Payカードを持っている</button>
              </>
            ) : (
              // 梶研Payカードを持っていない場合
              <>
              <button onClick={() => setHaveKajilabPayCard(false)} className='flex-1 text-black text-xs bg-white py-1'>梶研Payカードを持っていない</button>
              <button onClick={() => setHaveKajilabPayCard(true)} className='flex-1 text-slate-500 text-xs bg-slate-200 py-1'>梶研Payカードを持っている</button>
              </>
            )}
          </div>

          {userBarcode != '' ? (
            // バーコードを既に生成済み
            <KajilabPayComponent.KajilabPayMobileDownload
              userBarcode={userBarcode}
              name={userName}
              qrcodeUrl={userQRCodeURL}
            />
          ) : haveKajilabPayCard ? (
            // 梶研Payカードを持っている場合
            <KajilabPayComponent.HaveKajilabPayCard
              handleScan={handleScanKajilabPayCard}
              errorMessage={errorMessage}
            />
          ) : (
            // 梶研Payカードを持っていない場合
            <KajilabPayComponent.NotHaveKajilabPayCard
              setUserBarcode={setUserBarcode}
              setName={setUserName}
              setQRcodeUrl={setUserQRCodeURL}
            />
          ) }
        </div>
      )}
      <div className='bg-white shadow rounded-md px-5 py-3'>
        <details>
          <summary className='text-xl font-bold'>梶研Payモバイルの使い方</summary>
          <div className='md:text-base text-xs font-medium'>
            <p>＜チャージ方法＞</p>
            <p>レジ端末の「梶研Pay関連」を押し，画面に従い「精算時提示用バーコード」をバーコードリーダーで読み取りお金を入れる</p>
            <Image src="/images/kajilabpaycharge.webp"/>
            {/* <div className='w- aspect-29/20 relative mx-auto'>
              <Image src="/images/kajilabpaycharge.webp" fill alt={"adsfe"} />
            </div> */}
          
            <p className='mt-5'>＜支払い方法＞</p>
            <p>「梶研Payで支払」から画面に従い「精算時提示用バーコード」をバーコードリーダーで読み取る</p>
            <Image src="/images/kajilabpaypay.webp"/>

          </div>
        </details>
        
      </div>
    </div>
  )
}

export default Base
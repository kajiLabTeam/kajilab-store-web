"use client"
import { Badge, Button, Card, Group, Image, Pagination, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import * as Admin from "@/app/features/admin/components/Index"
import { Asset, Product, Products } from '@/types/response'
import Link from 'next/link'
import Loading from '@/app/components/Loading'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageTitle } from '@/app/components/PageTitle'
import { AdminPageTitle } from '@/app/components/AdminPageTitle'
import { useGetAPI } from '@/app/hooks/useGetAPI'
import ProductsFilter from '@/app/components/ProductsFilter'

const Base = () => {
  const {data: asset, isLoading: assetLoading, error: assetError} = useGetAPI<Asset>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/assets`
  )

  if(assetLoading) return(<Loading message=''/>)
  if(assetError || !asset) return(<div>読み込み失敗</div>)
  return (
    <div className='mb-10 md:pt-5 pt-0'>
      <AdminPageTitle
        title='管理者用商品一覧'
        subtitle='Protucts'
      />
      <Link href={`/admin/asset`} className="text-end">
        <div>
          <div className="text-lg">商店残高（現金）：{asset.money}円</div>
          <div className="text-lg">商店負債（梶研Pay）：{asset.debt}円</div>
        </div>
      </Link>

      <ProductsFilter
        editable={true}
      />
    </div>
  )
}

export default Base
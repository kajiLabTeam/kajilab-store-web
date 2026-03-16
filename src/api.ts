import { Asset, AssetHistory, Product, User, PaymentProduct, Products, SalesMonth, KajilabpayLog, KajilabPayMobile } from "./types/response";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUserByKajilabPay = async (qrPayload: string): Promise<User> => {
  const res = await fetch(`${baseURL}/api/v1/users/kajilabpayqr/${qrPayload}`, {
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY ?? ""
    },
    cache: "no-store",
  })

  const user = await res.json()
  return user
}

export const getKajilabpayLogsByUserId = async (userId: number, limit: number, offset: number): Promise<KajilabpayLog[]> => {
  // const res = await fetch(`${baseURL}/api/v1/products/buy/logs/user/${userId}?limit=${limit}&&offset=${offset}`, {cache: "no-store"})
  const res = await fetch(`${baseURL}/api/v1/products/buy/logs/user/${userId}?limit=${limit}&&offset=${offset}`, {
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY ?? ""
    },
    cache: "no-store"
  })
  console.log(res)

  const payments:KajilabpayLog[] = await res.json()
  return payments
}

export const getSalesMonth = async (year: number, month: number): Promise<SalesMonth> => {
  const res = await fetch(`${baseURL}/api/v1/sales?year=${year}&&month=${month}`, {
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY ?? ""
    },
    next: {revalidate: 3600}
  })
  const salesMonth:SalesMonth = await res.json()
  return salesMonth
}

export const updateProduct = async (id: number, name: string, barcode: number, price: number, stock: number, tagId: number): Promise<number> => {
  let requestProduct: UpdateProductType = {
      id: id,
      name: name,
      barcode: barcode,
      price: price,
      stock: stock,
      tag_id: tagId, 
  }

  const res = await fetch(`${baseURL}/api/v1/products`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY ?? ""
      },
      body: JSON.stringify(requestProduct)
  })

  console.log(res.status)
  return res.status
}

export const postKajilabPayQR = async (barcode: string): Promise<KajilabPayMobile> => {
  const res = await fetch(`${baseURL}/api/v1/users/kajilabpayqr`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY ?? ""
      },
      body: JSON.stringify({
        barcode: barcode
      })
  })

  const kajilabpay = await res.json()
  return kajilabpay
}
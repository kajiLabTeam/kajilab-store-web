import { KajilabpayLog, PaymentProduct } from '@/types/response';
import React from 'react'

type PaymentLogPanelPropsType = {
  log: KajilabpayLog;
  products: PaymentProduct[];
}

export default function PaymentLogPanel({log, products}: PaymentLogPanelPropsType) {
  return (
    <div className="border-b border-gray-400">
        <div className="flex bg-gray-200" key={log.id}>
          <div>
            {new Date(log.pay_at).getFullYear()}/{new Date(log.pay_at).getMonth()+1}/{new Date(log.pay_at).getDate()}　
            {log.content}
          </div>
          <div className="ml-auto">
            {0-log.price}円 ({log.current_debt}円)
          </div>
        </div>
        <div className="bg-gray-white">
          {products.map((product) => (
            <div key={product.id} className="flex">
              <div>
                {product.name}　
              </div>
              <div>
                x　{product.quantity}
              </div>
              <div className="ml-auto">
                {product.unit_price * product.quantity}円
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

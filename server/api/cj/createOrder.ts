import { defineEventHandler, readBody } from 'h3'
import { getToken } from '@/server/utils/cjToken'
import { supabase } from '@/utils/supabaseClient'
import { sendTelegramMessage } from '@/server/utils/telegram'

type Product = {
  vid: string
  quantity: number
  name: string
  color: string
  size: string
  price: number
}

type RequestBody = {
  products: Product[]
  orderNumber: string
  email: string
  shippingCustomerName: string
  shopAmount: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  const token = await getToken()

  // Заказ в CJ
  const cjRes: any = await $fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrderV2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
      'platformToken': ''
    },
    body
  })

  const orderId = cjRes?.data?.orderId ?? null

  const orderItems = body.products.map(p => ({
    vid: p.vid,
    quantity: p.quantity,
    name: p.name,
    color: p.color,
    size: p.size,
    price: p.price
  }))

  const { error } = await supabase.from('orders').insert({
    order_number: body.orderNumber,
    email: body.email.toLowerCase(),
    name: body.shippingCustomerName,
    amount: parseFloat(body.shopAmount),
    cj_order_id: orderId,
    status: 'pending',
    order_items: orderItems
  })

  if (error) {
    console.error('Supabase insert error:', error)
  }

  if (!error) {
    const summary = orderItems.map(p => `• ${p.name} (${p.color} / ${p.size}) x${p.quantity}`).join('\n')

    const message = `🧾 *New Order Received!*

    *Name:* ${body.shippingCustomerName}
    *Email:* ${body.email}
    *Order #:* ${body.orderNumber}
    *Amount:* $${parseFloat(body.shopAmount).toFixed(2)}

    *Items:*
    ${summary}`

    await sendTelegramMessage(message)
  }

  return cjRes
})

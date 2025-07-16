import { defineEventHandler, getRouterParam, getQuery } from 'h3'
import { supabase } from '@/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const orderNumber = getRouterParam(event, 'orderNumber')
  const { email } = getQuery(event)

  if (!email || typeof email !== 'string') {
    return { error: 'Invalid email' }
  }

  const lowercasedEmail = email.toLowerCase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .eq('email', lowercasedEmail)
    .single()

  if (error || !data) {
    return { error: 'Order not found' }
  }

  return data
})

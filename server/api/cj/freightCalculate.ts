import { defineEventHandler, readBody } from 'h3'
import { getToken } from '@/server/utils/cjToken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = await getToken()

  const res = await $fetch('https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token
    },
    body
  })

  return res
})

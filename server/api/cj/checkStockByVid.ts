import { defineEventHandler, getQuery } from 'h3'
import { getToken } from '../../utils/cjToken'

export default defineEventHandler(async (event) => {
  const { vid } = getQuery(event)
  if (!vid) return { result: false, message: 'vid missing', data: null }

  const token = await getToken()

  const res = await $fetch('https://developers.cjdropshipping.com/api2.0/v1/product/stock/queryByVid', {
    method: 'GET',
    headers: { 'CJ-Access-Token': token },
    params: { vid }
  })

  return res
})

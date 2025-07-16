import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'

interface CJAuthResponse {
  code: number
  result: boolean
  message: string
  data: {
    accessToken: string
    accessTokenExpiryDate: string
    refreshToken: string
    refreshTokenExpiryDate: string
    createDate: string
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CJ_EMAIL = process.env.CJ_EMAIL!
const CJ_PASSWORD = process.env.CJ_PASSWORD!

function cleanToken(raw: string): string {
  return raw.includes('CJ:') ? raw.split('CJ:')[1] : raw
}

export async function getToken(): Promise<string> {
  const { data, error } = await supabase
    .from('cj_tokens')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error || !data) throw new Error('Token not found in Supabase')

  const now = dayjs()
  const accessExpired = now.isAfter(dayjs(data.access_token_expiry))
  const refreshExpired = now.isAfter(dayjs(data.refresh_token_expiry))

  if (!accessExpired) {
    return cleanToken(data.access_token)
  }

  if (!refreshExpired) {
    const refreshRes = await $fetch<CJAuthResponse>(
      'https://developers.cjdropshipping.com/api2.0/v1/authentication/refreshAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { refreshToken: data.refresh_token }
      }
    )

    if (refreshRes.result) {
      await supabase
        .from('cj_tokens')
        .update({
          access_token: refreshRes.data.accessToken,
          access_token_expiry: refreshRes.data.accessTokenExpiryDate,
          refresh_token: refreshRes.data.refreshToken,
          refresh_token_expiry: refreshRes.data.refreshTokenExpiryDate
        })
        .eq('id', data.id)

      return cleanToken(refreshRes.data.accessToken)
    }
  }

  const loginRes = await $fetch<CJAuthResponse>(
    'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: CJ_EMAIL,
        password: CJ_PASSWORD
      }
    }
  )

  if (loginRes.result) {
    await supabase
      .from('cj_tokens')
      .update({
        access_token: loginRes.data.accessToken,
        access_token_expiry: loginRes.data.accessTokenExpiryDate,
        refresh_token: loginRes.data.refreshToken,
        refresh_token_expiry: loginRes.data.refreshTokenExpiryDate
      })
      .eq('id', data.id)

    return cleanToken(loginRes.data.accessToken)
  }

  throw new Error('CJ login failed')
}

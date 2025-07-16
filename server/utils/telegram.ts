export const sendTelegramMessage = async (text: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  try {
    await $fetch(url, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text 
      }
    })
  } catch (err) {
    console.error('Telegram send error:', err)
  }
}

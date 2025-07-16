import axios from 'axios';

const email = 'koresh.nastya@bk.ru'; // твоя почта от CJ
const password = '188fdfb24e664f6b80b8b7d3a788842c';             // именно API Key, не пароль

async function getAccessToken() {
  try {
    const response = await axios.post('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      email,
      password
    });

    console.log('✅ Access Token:', response.data.data.accessToken);
    console.log('🌀 Refresh Token:', response.data.data.refreshToken);
  } catch (error) {
    console.error('❌ Ошибка при получении токена:', error.response?.data || error.message);
  }
}

getAccessToken();

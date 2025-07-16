import axios from 'axios';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNTE1MiIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnl1RUMwNDNBeVR5Zk0xVDdQNnBNNjVUc29DNHY1RHpCUExidE9jd0pITFIxNU5YRUszWjA4KzFWanBoSGI5cUNuenBUZThEb0ZGQlNqZTVpODBJQXhncUEwbGsxc1Q5SGpiajVhRlZhR1psRVpjRUtOZ2pEdXpscTIzUDRZY2h4d3puVlVrOFRiRGxEblNnemdUNmhKaGxXUzQrTklpc2w5Y3lVa2lkQ2xvbFpiTWc0RytuMCt0TENwZmV1c2xFekNxZ29wWWFrb0dpN1lCSHNNVXRBcGtsdjJEeVFFUVVWVDE5WjMrY1V3b0hyTGJ6ZEw5dEVXM0orWENBRnA0YzU0bzdkYlp3Q092MjlLL25HdnQ4VER1bTZFNFBRVGV0UEg5WGlXVjNLYTVmeSIsImlhdCI6MTc0OTgxNDc2OH0.invvAKJoxQxJl7fns-b3AJ4vfHWwF7cDCrIWLZKcPTc'; // Твой токен
const spu = 'CJLS2063157'; // SPU

async function getProductIdBySpu() {
  try {
    const response = await axios.get(
      'https://developers.cjdropshipping.com/api2.0/v1/product/query',
      {
        headers: {
          'CJ-Access-Token': accessToken
        },
        params: {
          productSku: spu
        }
      }
    );

    const product = response.data.data;

    if (!product) {
      console.log('❌ Не найден товар по этому SPU.');
      return;
    }

    console.log('✅ Найден товар:', product.productNameEn);
    console.log('🆔 Product ID:', product.pid);
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

getProductIdBySpu();

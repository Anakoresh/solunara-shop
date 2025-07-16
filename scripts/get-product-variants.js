import axios from 'axios';
import { supabase } from '../utils/supabaseClient.js';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNTE1MiIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnl1RUMwNDNBeVR5Zk0xVDdQNnBNNjVUc29DNHY1RHpCUExidE9jd0pITFIxNU5YRUszWjA4KzFWanBoSGI5cUNuenBUZThEb0ZGQlNqZTVpODBJQXhncUEwbGsxc1Q5SGpiajVhRlZhR1psRVpjRUtOZ2pEdXpscTIzUDRZY2h4d3puVlVrOFRiRGxEblNnemdUNmhKaGxXUzQrTklpc2w5Y3lVa2lkQ2xvbFpiTWc0RytuMCt0TENwZmV1c2xFekNxZ29wWWFrb0dpN1lCSHNNVXRBcGtsdjJEeVFFUVVWVDE5WjMrY1V3b0hyTGJ6ZEw5dEVXM0orWENBRnA0YzU0bzdkYlp3Q092MjlLL25HdnQ4VER1bTZFNFBRVGV0UEg5WGlXVjNLYTVmeSIsImlhdCI6MTc0OTgxNDc2OH0.invvAKJoxQxJl7fns-b3AJ4vfHWwF7cDCrIWLZKcPTc'; // CJ токен
const pid = '2406180803451617200'; // Product ID

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractColorAndSize(nameEn) {
  if (!nameEn) return { color: null, size: null };

  const parts = nameEn.split('-');
  if (parts.length < 2) return { color: null, size: null };

  const size = parts.pop().trim(); // последнее — размер
  const color = parts.join('-').trim().toLowerCase(); // всё остальное — цвет

  return { color, size };
}

async function fetchVariantsByPid() {
  try {
    const response = await axios.get('https://developers.cjdropshipping.com/api2.0/v1/product/variant/query', {
      headers: {
        'CJ-Access-Token': accessToken
      },
      params: { pid }
    });

    const variants = response.data?.data || [];

    const cleanedVariants = variants.map(v => {
    const { color, size } = extractColorAndSize(v.variantKey || v.variantNameEn);

    return {
        vid: v.vid,
        pid: v.pid,
        sku: v.variantSku,
        color: color.toLowerCase(),
        size,
        weight: Math.round(v.variantWeight || 0),
        length: Math.round(v.variantLength || 0),
        width: Math.round(v.variantWidth || 0),
        height: Math.round(v.variantHeight || 0),
    };
    });


    const { data, error } = await supabase
      .from('variants')
      .insert(cleanedVariants)
      .select();

    if (error) {
      console.error('❌ Ошибка при вставке в Supabase:', error.message);
    } else {
      console.log(`✅ Успешно вставлено ${data.length} вариантов`);
    }

  } catch (error) {
    console.error(`❌ Ошибка запроса для pid ${pid}:`, error.response?.status || error.message);

    if (error.response?.status === 429) {
      console.log('🔁 Слишком много запросов. Пауза 10 сек...');
      await sleep(10000);
      return fetchVariantsByPid(); // повтор
    }
  }
}

fetchVariantsByPid();

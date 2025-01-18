import axios from 'axios';

interface ExchangeRate {
  code: string;
  rate: number;
  date: string;
}

// TCMB XML servisi CORS kısıtlamaları nedeniyle doğrudan erişilemiyor
// Bu nedenle şimdilik sabit kurlar kullanacağız
// Gerçek uygulamada bir proxy server üzerinden çekilmeli
const MOCK_RATES: ExchangeRate[] = [
  {
    code: 'USD',
    rate: 31.2345,
    date: new Date().toISOString().split('T')[0]
  },
  {
    code: 'EUR',
    rate: 33.7890,
    date: new Date().toISOString().split('T')[0]
  },
  {
    code: 'GBP',
    rate: 39.4567,
    date: new Date().toISOString().split('T')[0]
  }
];

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  try {
    // Gerçek uygulamada burada TCMB'den veri çekilecek
    // Şimdilik mock data dönüyoruz
    return MOCK_RATES;
  } catch (error) {
    console.error('Döviz kurları çekilemedi:', error);
    return MOCK_RATES; // Hata durumunda da mock data dönüyoruz
  }
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-IonFlux-Token'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Yalnızca GET istekleri desteklenmektedir.'
    });
  }

  try {
    const expectedSecret = process.env.IONFLUX_APP_SECRET?.trim();
    const providedSecret = req.headers['x-ionflux-token'];

    if (expectedSecret && providedSecret !== expectedSecret) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Yetkisiz erişim isteği engellendi.'
      });
    }

    const rawApiKey = process.env.OPENWEATHER_API_KEY;

    if (!rawApiKey) {
      console.error('OPENWEATHER_API_KEY ortam değişkeni tanımlanmamış!');
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Sunucu yapılandırma hatası: API anahtarı bulunamadı.'
      });
    }

    const apiKey = rawApiKey.replace(/^\uFEFF/, '').trim();
    const city = req.query.city || req.query.q;

    if (!city || typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: "'city' parametresi zorunludur. Örnek: /api/weather?city=Istanbul"
      });
    }

    const encodedCity = encodeURIComponent(city.trim());
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=en`;

    const response = await fetch(openWeatherUrl);
    const data = await response.json();

    if (!response.ok) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(response.status).json({
        error: data.message || 'Hava durumu verisi alınamadı.',
        cod: data.cod
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=120');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Weather Proxy Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Hava durumu verisi alınırken beklenmeyen bir sunucu hatası oluştu.'
    });
  }
}

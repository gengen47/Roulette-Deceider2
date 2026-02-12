export default async function handler(req, res) {
    const { lat, lng, range = 3, count = 100, genre, budget, lunch, open_now } = req.query;
    const API_KEY = process.env.HP_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // クエリパラメータの構築
    const params = new URLSearchParams({
        key: API_KEY,
        lat: lat,
        lng: lng,
        range: range,
        count: count,
        format: 'json',
    });

    if (genre) params.append('genre', genre);
    if (budget) params.append('budget', budget);
    if (lunch) params.append('lunch', lunch);

    // 営業中フィルター（第1層: サーバーサイド時間判定）
    if (open_now === 'true') {
        // 日本時間の現在時刻を取得
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const hour = now.getHours();

        if (hour >= 11 && hour < 14 && !params.has('lunch')) params.append('lunch', 1);
        if (hour >= 23 || hour < 5) params.append('midnight', 1);
    }

    try {
        const response = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();

        // Vercel Edge Cacheの設定 (任意: 5分キャッシュ)
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        console.error('API Request Error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

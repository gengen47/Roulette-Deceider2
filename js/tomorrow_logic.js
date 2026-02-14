// tomorrow_logic.js

let map;
let centerMarker;
let shopMarkers = [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initMap();

    // 検索ボタンイベント
    document.getElementById('btn-search-area').addEventListener('click', searchShops);
});

async function initMap() {
    // デフォルト位置（東京駅）
    let lat = 35.681236;
    let lng = 139.767125;

    // 現在地取得を試みる
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            lat = position.coords.latitude;
            lng = position.coords.longitude;
        } catch (e) {
            console.log('Location access denied or failed, using default.');
        }
    }

    // マップ生成
    map = L.map('map').setView([lat, lng], 15);

    // タイルレイヤー（OpenStreetMap）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 中心点マーカー（動かない十字架の代わりに、地図中央に固定ピンを表示する演出も可だが、
    // ここではLeafletのmoveイベントで中心に追従するマーカー等は作らず、
    // ユーザーが「ここ」と決めてボタンを押すスタイルにする。
    // 分かりやすくするため、地図中央に十字アイコンをCSSで重ねるのが一般的だが、
    // 簡易的に中心マーカーを置くか、あるいは何も置かずに「地図の中心」とするか。
    // プロトタイプなので、地図の中心に十字を表示するCSSを追加する（tomorrow.html側でやるべきだが、JSで要素追加も可）

    addCrosshair();
}

function addCrosshair() {
    const crosshair = document.createElement('div');
    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.pointerEvents = 'none';
    crosshair.style.zIndex = '1000';
    crosshair.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFAB40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    `;
    document.getElementById('map').style.position = 'relative';
    document.getElementById('map').appendChild(crosshair);
}

async function searchShops() {
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;
    const range = 3; // 1000m (初期値)

    // ローディング表示
    const btn = document.getElementById('btn-search-area');
    const originalText = btn.innerText;
    btn.innerText = '検索中...';
    btn.disabled = true;

    try {
        // API呼び出し (index.htmlと同じparams構成で)
        // range=3 (1000m), count=100
        const params = new URLSearchParams({
            lat: lat,
            lng: lng,
            range: range,
            count: 100,
            start: 1,
            format: 'json'
            // 必要に応じて genre, budget 等も追加可能だが、まずは全検索
        });

        // 既存マーカー削除
        shopMarkers.forEach(m => map.removeLayer(m));
        shopMarkers = [];

        const response = await fetch(`/api/shops?${params.toString()}`);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const shops = data.results && data.results.shop ? data.results.shop : [];

        if (shops.length === 0) {
            alert('近くにお店が見つかりませんでした。場所を変えて試してください。');
        } else {
            renderShops(shops);
            alert(`${shops.length}軒のお店が見つかりました！`);
        }

    } catch (e) {
        console.error(e);
        alert('お店の取得に失敗しました。');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function renderShops(shops) {
    shops.forEach(shop => {
        if (!shop.lat || !shop.lng) return;

        const marker = L.marker([shop.lat, shop.lng]).addTo(map);

        const popupContent = `
            <div class="text-sm font-sans">
                <h3 class="font-bold text-accent mb-1">${shop.name}</h3>
                <p class="text-xs text-gray-500 mb-2">${shop.genre ? shop.genre.name : ''}</p>
                <div class="flex flex-col gap-2">
                    <a href="${shop.urls.pc}" target="_blank" rel="noopener" 
                       class="bg-primary text-white text-xs font-bold py-2 px-4 rounded text-center block shadow-sm hover:opacity-90">
                       詳細・予約 (ホットペッパー)
                    </a>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        shopMarkers.push(marker);
    });
}

# Roulette Decider (グルキメ！)

ホットペッパーグルメAPIを利用した、周辺の飲食店をランダムに決定するWebアプリケーションです。

## 特徴
- 📍 **現在地検索**: Geolocation APIで周辺のお店を自動検索
- 🎰 **ルーレット**: 視覚的に楽しい回転アニメーションで決定
- 🛠 **カスタマイズ**: 「コンビニ」「自炊」などのカスタム選択肢も追加可能
- 📱 **PWA対応**: ホーム画面に追加してアプリのように使えます

## 技術スタック
- **Frontend**: HTML5, Tailwind CSS, Vanilla JS
- **Backend**: Vercel Serverless Functions (API Proxy)
- **Deployment**: Vercel

## 開発環境のセットアップ

```bash
# Vercel CLIのインストール
npm i -g vercel

# ローカルサーバー起動
vercel dev
```

## 環境変数
`.env` ファイル（またはVercelの管理画面）に以下を設定してください。

```
HP_API_KEY=your_hotpepper_api_key
```

## 初回の位置情報利用

トップページは、ルーレット中央の「現在地から近くのお店を探す」を押したときに位置情報を要求します。ブラウザが許可済みと判定できる場合だけ自動検索します。拒否・取得失敗時は再試行または「地図から場所を選ぶ」を利用できます。店舗0件の場合は条件を変更して再検索してください。位置情報なしでもカスタム選択肢の抽選は利用できます。

GA4では `location_gate_view`、`location_request_click`、`location_granted`、`location_denied`、`location_error`、`location_fallback_click` を計測します。`location_granted` は許可ダイアログの表示ではなく位置取得成功を表します。ブラウザはダイアログの表示・無視を直接通知しないため、要求から成功・失敗までの流れで確認します。位置情報・エラー全文・ユーザー入力はイベントに送信しません。

## ディレクトリ構成
```
/
├── index.html       # メインアプリケーション
├── api/
│   └── shops.js     # ホットペッパーAPIプロキシ
├── icons/           # PWA用アイコン
├── manifest.json    # PWAマニフェスト
├── sw.js            # Service Worker
└── vercel.json      # Vercel設定
```

## ライセンス
MIT License

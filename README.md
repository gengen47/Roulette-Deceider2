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

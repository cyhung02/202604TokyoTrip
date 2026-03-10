# 東京・箱根・富士山 2026 春季旅行手冊

一個為團員打造的 PWA 旅遊手冊，可在手機上離線查看完整行程。
涵蓋東京、鎌倉、箱根、富士山河口湖四大區域，行程精心規劃，支援一鍵安裝至手機桌面。

## 行程概覽

- **日期**：2026年3月31日（二）～ 4月7日（二）
- **天數**：7晚8天
- **人數**：團體出遊
- **重點**：東京賞櫻、鎌倉江之電、箱根溫泉、富士山河口湖

| 天數 | 日期 | 地點 |
|------|------|------|
| Day 1 | 3/31（二） | 抵達東京 |
| Day 2 | 4/1（三） | 東京市區 |
| Day 3 | 4/2（四） | 鎌倉・江之電 |
| Day 4 | 4/3（五） | 箱根溫泉 |
| Day 5 | 4/4（六） | 富士山・河口湖 |
| Day 6 | 4/5（日） | 東京購物 |
| Day 7 | 4/6（一） | 東京自由活動 |
| Day 8 | 4/7（二） | 返程 |

## 功能特色

- 📱 **PWA 支援** - 可安裝至手機主畫面，像原生 App 一樣使用
- 📴 **離線使用** - Service Worker 預先快取所有資源，無網路也能查看
- 🌸 **和風美學** - 日式雜誌風格 UI 設計
- ✅ **行李清單** - 可勾選的打包清單，狀態自動儲存至 localStorage
- 📋 **日文短句** - 點擊即可複製常用旅遊語句
- 🗺️ **每日行程** - 詳細的景點資訊、交通方式、餐廳推薦

## 技術架構

- **前端**：純 HTML / CSS / JavaScript（無框架依賴）
- **PWA**：Service Worker + Web App Manifest
- **離線快取**：Cache-first 策略
- **資料層**：`data.js` 獨立管理行程資料，`app.js` 負責互動邏輯
- **樣式**：`style.css` 實作和風雜誌美學設計

## 使用方式

### 安裝至手機

1. 用手機瀏覽器開啟部署網址
2. 點選「加入主畫面」（iOS Safari / Android Chrome）
3. 即可離線使用

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動本地伺服器
npm start
```

然後在瀏覽器開啟 http://localhost:3000

### 部署

此為純靜態網站，可部署至任何靜態網站託管服務：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

只需上傳以下檔案：

```
├── index.html
├── style.css
├── app.js
├── data.js
├── sw.js
├── manifest.json
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## 重新生成圖示

如需修改 App 圖示，編輯 `icons/icon.svg` 後執行：

```bash
npm run generate-icons
```

## 專案結構

```
202604TokyoTrip/
├── index.html              # 主頁面 HTML 骨架
├── style.css               # 樣式表（和風美學設計，~55KB）
├── app.js                  # 互動邏輯（行李清單、日文短句複製等，~36KB）
├── data.js                 # 行程資料層（結構化景點、交通、餐廳資料，~24KB）
├── sw.js                   # Service Worker（離線快取）
├── manifest.json           # PWA 設定檔
├── icons/                  # App 圖示
│   ├── icon.svg            # 圖示原始檔
│   ├── icon-192.png        # 192x192 圖示
│   └── icon-512.png        # 512x512 圖示
├── generate-icons.mjs      # 圖示生成腳本（從 SVG 產生 PNG）
└── package.json            # npm 設定
```

## 授權

MIT License

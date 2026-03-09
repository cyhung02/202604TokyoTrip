# 東京・箱根・富士山 2026 春季旅行手冊

一個為團員打造的 PWA 旅遊手冊，可在手機上離線查看完整行程。

## 行程概覽

- **日期**：2026年3月31日（二）～ 4月7日（二）
- **天數**：7晚8天
- **重點**：東京賞櫻、鎌倉江之電、箱根溫泉、富士山河口湖

## 功能特色

- 📱 **PWA 支援** - 可安裝至手機主畫面
- 📴 **離線使用** - Service Worker 快取所有資源
- 🌸 **和風美學** - 日式雜誌風格設計
- ✅ **行李清單** - 可勾選的打包清單，狀態自動儲存
- 📋 **日文短句** - 點擊即可複製常用語句

## 使用方式

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
├── index.html          # 主頁面
├── style.css           # 樣式表（和風美學設計）
├── app.js              # 行程資料與互動邏輯
├── sw.js               # Service Worker（離線快取）
├── manifest.json       # PWA 設定檔
├── icons/              # App 圖示
│   ├── icon.svg        # 圖示原始檔
│   ├── icon-192.png    # 192x192 圖示
│   └── icon-512.png    # 512x512 圖示
├── generate-icons.mjs  # 圖示生成腳本
└── package.json
```

## 授權

MIT License

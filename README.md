# 東京・箱根・富士山 2026 春季旅行手冊

![Version](https://img.shields.io/badge/version-2.12.6-blue) ![PWA](https://img.shields.io/badge/PWA-ready-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green)

一個為團員打造的 PWA 旅遊手冊，可在手機上離線查看完整行程。
涵蓋東京、鎌倉、箱根、富士山河口湖四大區域，行程精心規劃，支援一鍵安裝至手機桌面。

## 功能特色

- 📱 **PWA 支援** - 可安裝至手機主畫面，像原生 App 一樣使用
- 📴 **離線使用** - Service Worker 預先快取所有資源，無網路也能查看
- 🌸 **和風美學** - 日式雜誌風格 UI 設計
- ✅ **行李清單** - 可勾選的打包清單，狀態自動儲存至 localStorage
- 📋 **日文短句** - 點擊即可複製常用旅遊語句
- 🗺️ **每日行程** - 詳細的景點資訊、交通方式、餐廳推薦
- 🌤️ **AI 天氣穿搭建議** - 根據即時天氣預報，由 AI 提供穿搭與配件建議

## 技術架構

- **前端**：純 HTML / CSS / JavaScript（無框架依賴）
- **PWA**：Service Worker + Web App Manifest
- **離線快取**：Stale-while-revalidate 策略
- **資料層**：`data.js` 管理靜態展示資料（行李清單、日文短句等），`itinerary.js` 管理每日行程資料，`app.js` 負責互動邏輯
- **樣式**：`style.css` 實作和風雜誌美學設計
- **天氣資料**：[Open-Meteo Forecast API](https://open-meteo.com/)（JMA MSM + ECMWF best_match）
- **AI 穿搭建議**：Cloudflare Worker（`outfit-advisor.cyhung02.workers.dev`）

---

## AI 天氣穿搭分析 — API 規格

前端從 Open-Meteo 取得原始天氣數據後，經 `buildDailyAIInput()` 整理成結構化 input，POST 至 Cloudflare Worker 進行 AI 分析，回傳穿搭建議渲染於 UI。

### 資料流程

```
Open-Meteo API ──→ buildDailyAIInput() ──→ POST /outfit-advisor ──→ AI 回應 ──→ renderWeatherAIAdvice()
```

### 監測地點

| Key | 名稱 | 緯度 | 經度 |
|-----|------|------|------|
| `tokyo` | 東京 | 35.6812 | 139.7671 |
| `kawaguchiko` | 河口湖 | 35.5117 | 138.7522 |
| `hakone` | 箱根 | 35.2049 | 139.0167 |

### API Endpoint

| 項目 | 值 |
|------|-----|
| **URL** | `https://outfit-advisor.cyhung02.workers.dev` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |
| **快取策略** | localStorage，key = `ai_{location_name}_{date}`，TTL = 15 分鐘 |

### Input 規格（Request Body）

```json
{
  "weather_data": { /* DailyAIInput object */ }
}
```

#### `weather_data` 欄位定義

| 欄位 | 型別 | 說明 | 範例 |
|------|------|------|------|
| `location_name` | `string` | 地點名稱 | `"東京"` |
| `location_elevation_m` | `number` | 海拔高度（公尺） | `40` |
| `date` | `string` | ISO 日期 | `"2026-04-01"` |
| `is_today` | `boolean` | 是否為今日 | `true` |
| `weather_code` | `number` | WMO 天氣代碼（0–99） | `3` |
| `weather_description` | `string` | 天氣描述（中文） | `"陰天"` |
| `actual_temp_max_c` | `number` | 最高氣溫（°C） | `18.5` |
| `actual_temp_min_c` | `number` | 最低氣溫（°C） | `11.2` |
| `apparent_temp_max_c` | `number` | 最高體感溫度（°C） | `16.8` |
| `apparent_temp_min_c` | `number` | 最低體感溫度（°C） | `8.3` |
| `precip_probability_pct` | `number` | 最高降水機率（%） | `40` |
| `precip_sum_mm` | `number` | 累計降水量（mm） | `2.1` |
| `snowfall_sum_cm` | `number` | 累計降雪量（cm） | `0` |
| `wind_speed_max_kmh` | `number` | 最大風速（km/h） | `25.3` |
| `wind_gusts_max_kmh` | `number` | 最大陣風（km/h） | `42.1` |
| `uv_index_max` | `number` | 最大紫外線指數 | `6.2` |
| `sunrise` | `string` | 日出時間（ISO） | `"2026-04-01T05:28"` |
| `sunset` | `string` | 日落時間（ISO） | `"2026-04-01T18:05"` |
| `humidity_mean_pct` | `number` | 平均相對濕度（%） | `62` |
| `vapour_pressure_deficit_max_kpa` | `number` | 最大蒸氣壓差（kPa） | `0.85` |
| `wet_bulb_temp_mean_c` | `number` | 平均濕球溫度（°C） | `12.4` |
| `hourly_forecast` | `array` | 當日逐時預報（見下表） | — |

#### `hourly_forecast[]` 欄位定義

| 欄位 | 型別 | 說明 | 範例 |
|------|------|------|------|
| `time` | `string` | ISO 時間 | `"2026-04-01T09:00"` |
| `is_day` | `number` | 是否為白天（0/1） | `1` |
| `temperature_c` | `number` | 氣溫（°C） | `15.2` |
| `apparent_temperature_c` | `number` | 體感溫度（°C） | `13.1` |
| `precip_probability_pct` | `number` | 降水機率（%） | `20` |
| `freezing_level_height_m` | `number` | 結冰高度（公尺） | `2800` |

#### Input 範例

```json
{
  "weather_data": {
    "location_name": "東京",
    "location_elevation_m": 40,
    "date": "2026-04-01",
    "is_today": true,
    "weather_code": 3,
    "weather_description": "陰天",
    "actual_temp_max_c": 18.5,
    "actual_temp_min_c": 11.2,
    "apparent_temp_max_c": 16.8,
    "apparent_temp_min_c": 8.3,
    "precip_probability_pct": 40,
    "precip_sum_mm": 2.1,
    "snowfall_sum_cm": 0,
    "wind_speed_max_kmh": 25.3,
    "wind_gusts_max_kmh": 42.1,
    "uv_index_max": 6.2,
    "sunrise": "2026-04-01T05:28",
    "sunset": "2026-04-01T18:05",
    "humidity_mean_pct": 62,
    "vapour_pressure_deficit_max_kpa": 0.85,
    "wet_bulb_temp_mean_c": 12.4,
    "hourly_forecast": [
      {
        "time": "2026-04-01T06:00",
        "is_day": 1,
        "temperature_c": 12.1,
        "apparent_temperature_c": 9.5,
        "precip_probability_pct": 10,
        "freezing_level_height_m": 2600
      },
      {
        "time": "2026-04-01T09:00",
        "is_day": 1,
        "temperature_c": 15.2,
        "apparent_temperature_c": 13.1,
        "precip_probability_pct": 20,
        "freezing_level_height_m": 2800
      }
    ]
  }
}
```

### Output 規格（Response Body）

| 欄位 | 型別 | 必填 | 說明 | 範例 |
|------|------|------|------|------|
| `summary` | `string` | ✅ | 當日天氣概要分析 | `"今日東京陰轉多雲，午後有短暫陣雨機會…"` |
| `top` | `string` | ✅ | 上身穿搭建議 | `"薄長袖加輕薄外套"` |
| `bottoms` | `string` | ✅ | 下身穿搭建議 | `"長褲或牛仔褲"` |
| `footwear` | `string` | ✅ | 鞋類建議 | `"防水運動鞋或短靴"` |
| `accessories` | `string[]` | ❌ | 配件建議清單 | `["折疊傘", "防曬乃", "墨鏡"]` |
| `warning` | `string` | ❌ | 特殊天氣警示 | `"午後雷陣雨機率高，請隨身攜帶雨具"` |

#### Output 範例

```json
{
  "summary": "今日東京陰轉多雲，最高溫 18°C、最低溫 11°C，午後有 40% 降雨機率。體感偏涼，建議多層穿搭以因應溫差。",
  "top": "薄長袖上衣搭配輕薄防風外套",
  "bottoms": "長褲或牛仔褲",
  "footwear": "防水運動鞋",
  "accessories": ["折疊傘", "薄圍巾"],
  "warning": "午後有陣雨可能，請隨身攜帶雨具"
}
```

#### 前端渲染邏輯

- `summary` → 渲染於 `#wx-ai-summary` 區塊
- `top` / `bottoms` / `footwear` → 渲染於 `#wx-ai-outfit` 穿搭格狀卡片
- `accessories` → 渲染為標籤列表；若為空或未提供則顯示 `—`
- `warning` → 若存在則於穿搭卡片後方插入警示橫幅（`.wx-detail-alert`）

### WMO 天氣代碼對照表

前端使用 `getWeatherInfo(code)` 將 WMO code 轉為圖示與中文描述後放入 `weather_description`：

| Code | 描述 | Code | 描述 |
|------|------|------|------|
| 0 | 晴空 | 51/53/55 | 毛毛雨（輕/中/重） |
| 1 | 大致晴 | 56/57 | 凍細雨（輕/重） |
| 2 | 局部多雲 | 61/63/65 | 雨（小/中/大） |
| 3 | 陰天 | 66/67 | 凍雨（輕/重） |
| 45 | 霧 | 71/73/75 | 雪（小/中/大） |
| 48 | 霧凇 | 80/81/82 | 陣雨（輕/中/大） |
| — | — | 95/96/99 | 雷暴 / 雷暴+冰雹 |

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
├── itinerary.js
├── sw.js
├── manifest.json
├── hero.jpg
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
├── app.js                  # 互動邏輯（行李清單、日文短句複製等，~43KB）
├── data.js                 # 靜態展示資料（行李清單項目、日文短句等，~12KB）
├── itinerary.js            # 行程資料（每日景點、交通、餐廳資料，~15KB）
├── sw.js                   # Service Worker（離線快取，v2.12.6）
├── manifest.json           # PWA 設定檔
├── hero.jpg                # 首頁主視覺圖
├── icons/                  # App 圖示
│   ├── icon.svg            # 圖示原始檔
│   ├── icon-192.png        # 192x192 圖示
│   └── icon-512.png        # 512x512 圖示
├── outfit-advisor-worker.js # Cloudflare Worker 來源碼（AI 穿搭建議）
├── generate-icons.mjs      # 圖示生成腳本（從 SVG 產生 PNG）
└── package.json            # npm 設定
```

## 授權

MIT License

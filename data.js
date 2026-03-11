// Tokyo Trip PWA - Trip Data
// Separated from app.js for maintainability

// ========================================
// Trip Dates Configuration
// ========================================

const TRIP_START_DATE = new Date('2026-03-31');
const TRIP_DATES =[
  '3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7'
];

// ========================================
// Hotels Data
// ========================================

const hotels =[
  {
    checkIn: '3月31日',
    checkOut: '4月4日',
    nights: 4,
    name: 'スーパーホテル Premier 東京駅八重洲中央口',
    location: '東京都中央區八重洲',
    times: '入住 15:00 / 退房 11:00',
    code: '8RAAHX2M',
    features: '鄰近東京站，交通便利，適合作為東京市區探索據點'
  },
  {
    checkIn: '4月4日',
    checkOut: '4月5日',
    nights: 1,
    name: 'Rakuten STAY FUJIMI TERRACE 箱根芦ノ湖',
    location: '神奈川縣箱根町蘆之湖周邊',
    times: '入住 15:00 / 退房 10:00',
    code: '1616327684075494',
    features: '可眺望富士山景觀，提供溫泉設施與湖畔悠閒氛圍'
  },
  {
    checkIn: '4月5日',
    checkOut: '4月6日',
    nights: 1,
    name: 'JR 九州ホテル ブラッサム新宿',
    location: '東京都新宿區新宿',
    times: '入住 15:00 / 退房 11:00',
    code: '1616327693641839',
    features: '鄰近新宿站南口，交通便利，步行可達新宿御苑與明治神宮'
  },
  {
    checkIn: '4月6日',
    checkOut: '4月7日',
    nights: 1,
    name: 'HAOSTAY 河口湖美術館前',
    location: '山梨縣富士河口湖町',
    times: '入住 15:00 / 退房 10:00',
    code: 'Hotels.com #73356653120204',
    features: '位於河口湖畔，可眺望富士山，適合拍攝湖景與晨昏景色'
  }
];

// ========================================
// Practical Info Data
// ========================================

const practicalInfo = {
  packing: {
    title: '行李清單',
    content: `
      <div class="info-card">
        <h4 class="info-card-title">證件與財務</h4>
        <ul class="checklist" data-category="documents">
          <li class="checklist-item" data-item="passport"><span class="checklist-checkbox"></span>護照（有效期至少 6 個月）</li>
          <li class="checklist-item" data-item="tickets"><span class="checklist-checkbox"></span>電子機票與飯店預訂確認</li>
          <li class="checklist-item" data-item="cards"><span class="checklist-checkbox"></span>信用卡（Visa／MasterCard）、金融卡</li>
          <li class="checklist-item" data-item="cash"><span class="checklist-checkbox"></span>日幣現金 50,000–80,000 日圓</li>
          <li class="checklist-item" data-item="insurance"><span class="checklist-checkbox"></span>旅遊保險保單或聯絡方式</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">電子設備</h4>
        <ul class="checklist" data-category="electronics">
          <li class="checklist-item" data-item="phone"><span class="checklist-checkbox"></span>手機與充電器</li>
          <li class="checklist-item" data-item="powerbank"><span class="checklist-checkbox"></span>行動電源（建議 10,000mAh 以上）</li>
          <li class="checklist-item" data-item="camera"><span class="checklist-checkbox"></span>相機、鏡頭、記憶卡與備用電池</li>
          <li class="checklist-item" data-item="sim"><span class="checklist-checkbox"></span>日本上網 SIM 卡或 Wi-Fi 分享器</li>
          <li class="checklist-item" data-item="adapter"><span class="checklist-checkbox"></span>萬國轉接頭（日本為 A 型雙平腳）</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">藥品與個人用品</h4>
        <ul class="checklist" data-category="personal">
          <li class="checklist-item" data-item="medicine"><span class="checklist-checkbox"></span>個人常備藥：腸胃藥、止痛藥、過敏藥</li>
          <li class="checklist-item" data-item="sunscreen"><span class="checklist-checkbox"></span>防曬乳、護唇膏與保濕乳液</li>
          <li class="checklist-item" data-item="mask"><span class="checklist-checkbox"></span>口罩、酒精乾洗手</li>
          <li class="checklist-item" data-item="toiletries"><span class="checklist-checkbox"></span>盥洗用具與基本保養品</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">自訂項目</h4>
        <ul class="checklist" data-category="custom" id="custom-checklist">
        </ul>
        <div class="add-item-form" id="add-item-form">
          <input type="text" id="new-item-input" class="add-item-input" placeholder="輸入新項目..." maxlength="50">
          <button type="button" id="add-item-btn" class="add-item-btn">+ 新增</button>
        </div>
      </div>
    `
  },
  apps: {
    title: '推薦 App',
    content: `
      <div class="app-grid">
        <div class="app-card">
          <div class="app-icon">🗺️</div>
          <div class="app-name">Google Maps</div>
          <div class="app-desc">路線規劃與導航</div>
        </div>
        <div class="app-card">
          <div class="app-icon">🚃</div>
          <div class="app-name">乘換案內</div>
          <div class="app-desc">電車路線查詢</div>
        </div>
        <div class="app-card">
          <div class="app-icon">🎌</div>
          <div class="app-name">NAVITIME</div>
          <div class="app-desc">中文觀光路線</div>
        </div>
        <div class="app-card">
          <div class="app-icon">💳</div>
          <div class="app-name">Suica App</div>
          <div class="app-desc">虛擬交通卡</div>
        </div>
        <div class="app-card">
          <div class="app-icon">🍜</div>
          <div class="app-name">Tabelog</div>
          <div class="app-desc">餐廳評價查詢</div>
        </div>
        <div class="app-card">
          <div class="app-icon">🌐</div>
          <div class="app-name">Google 翻譯</div>
          <div class="app-desc">即時翻譯</div>
        </div>
        <div class="app-card">
          <div class="app-icon">🌸</div>
          <div class="app-name">Tenki.jp</div>
          <div class="app-desc">天氣與櫻花前線</div>
        </div>
        <div class="app-card">
          <div class="app-icon">📱</div>
          <div class="app-name">PayPay</div>
          <div class="app-desc">日本行動支付</div>
        </div>
      </div>
    `
  },
  etiquette: {
    title: '旅遊禮儀',
    content: `
      <div class="info-card">
        <h4 class="info-card-title">電車禮儀</h4>
        <ul class="info-list">
          <li>搭乘電車時請保持安靜，不講電話，手機調為震動</li>
          <li>排隊上下車，遵守月台標線，先讓乘客下車再上車</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">溫泉禮儀</h4>
        <ul class="info-list">
          <li>進入溫泉池前需先於淋浴區徹底清洗身體</li>
          <li>毛巾勿浸入浴池</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">神社參拜</h4>
        <ul class="info-list">
          <li>洗手 → 投幣 → 鈴 → 二拜二拍一拜</li>
          <li>部分寺院與神社內部禁止拍照，拍攝前請先確認標示</li>
        </ul>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">其他注意事項</h4>
        <ul class="info-list">
          <li>公共垃圾桶較少，建議自備小垃圾袋</li>
          <li>必要時可在便利商店丟棄垃圾</li>
        </ul>
      </div>
    `
  },
  emergency: {
    title: '緊急聯絡',
    content: `
      <div class="emergency-card">
        <div class="emergency-title">日本警察</div>
        <a href="tel:110" class="emergency-number emergency-link">110</a>
        <div class="emergency-desc">報案、交通事故</div>
      </div>
      <div class="emergency-card">
        <div class="emergency-title">日本消防與救護</div>
        <a href="tel:119" class="emergency-number emergency-link">119</a>
        <div class="emergency-desc">火災、急救、救護車</div>
      </div>
      <div class="emergency-card">
        <div class="emergency-title">駐日本台北經濟文化代表處</div>
        <a href="tel:+81-3-3280-7811" class="emergency-number emergency-link">+81-3-3280-7811</a>
        <div class="emergency-desc">24 小時急難救助</div>
      </div>
      <div class="emergency-card" style="background: linear-gradient(135deg, #d69e2e 0%, #ecc94b 100%);">
        <div class="emergency-title">外交部旅外國人急難救助專線</div>
        <a href="tel:+886-800-085-095" class="emergency-number emergency-link">+886-800-085-095</a>
        <div class="emergency-desc">海外急難救助</div>
      </div>
    `
  },
  sakura: {
    title: '櫻花前線',
    content: `
      <div class="info-card sakura-info-card">
        <h4 class="info-card-title">🌸 2026 櫻花開花預測</h4>
        <p class="sakura-intro">3月底至4月初是東京與富士山周邊的櫻花盛開時期。以下為即時查詢櫻花前線的推薦網站：</p>
        <div class="sakura-links">
          <a href="https://tenki.jp/sakura/" target="_blank" rel="noopener noreferrer" class="sakura-link">
            <span class="sakura-link-icon">🌸</span>
            <span class="sakura-link-text">
              <span class="sakura-link-name">Tenki.jp 櫻花前線</span>
              <span class="sakura-link-desc">日本氣象協會提供的開花預測與滿開情報</span>
            </span>
            <span class="sakura-link-arrow">→</span>
          </a>
          <a href="https://weathernews.jp/s/sakura/" target="_blank" rel="noopener noreferrer" class="sakura-link">
            <span class="sakura-link-icon">🌸</span>
            <span class="sakura-link-text">
              <span class="sakura-link-name">Weathernews 櫻花情報</span>
              <span class="sakura-link-desc">即時更新各地開花狀態與最佳賞櫻時機</span>
            </span>
            <span class="sakura-link-arrow">→</span>
          </a>
          <a href="https://www.jma.go.jp/bosai/map.html" target="_blank" rel="noopener noreferrer" class="sakura-link">
            <span class="sakura-link-icon">🗾</span>
            <span class="sakura-link-text">
              <span class="sakura-link-name">日本氣象廳</span>
              <span class="sakura-link-desc">官方氣象資料與生物季節觀測情報</span>
            </span>
            <span class="sakura-link-arrow">→</span>
          </a>
        </div>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">如何查詢開花狀況</h4>
        <ul class="info-list">
          <li>出發前一週：確認預計造訪地點的開花預測日期</li>
          <li>出發前幾天：查看「開花」或「滿開」狀態</li>
          <li>抵達日本後：查詢當地即時開花情報與推薦賞櫻地點</li>
        </ul>
      </div>
      <div class="weather-tip">
        <span class="weather-tip-icon">💡</span>
        <span>2026年預測：東京約 3/24 開花、4/1 滿開；河口湖約 4/5-4/10 滿開</span>
      </div>
    `
  }
};

// ========================================
// Japanese Phrases Data
// ========================================

const phrases =[
  { jp: 'こんにちは', romaji: 'Konnichiwa', meaning: '你好' },
  { jp: 'ありがとうございます', romaji: 'Arigatou gozaimasu', meaning: '謝謝' },
  { jp: 'すみません', romaji: 'Sumimasen', meaning: '不好意思、對不起' },
  { jp: 'いくらですか？', romaji: 'Ikura desuka?', meaning: '多少錢？' },
  { jp: 'これをください', romaji: 'Kore wo kudasai', meaning: '請給我這個' },
  { jp: 'トイレはどこですか？', romaji: 'Toire wa doko desuka?', meaning: '洗手間在哪裡？' },
  { jp: '写真を撮ってもいいですか？', romaji: 'Shashin wo totte mo ii desuka?', meaning: '可以拍照嗎？' },
  { jp: '英語を話せますか？', romaji: 'Eigo wo hanasemasu ka?', meaning: '你會說英文嗎？' },
  { jp: '助けてください', romaji: 'Tasukete kudasai', meaning: '請幫助我' },
  { jp: '美味しい', romaji: 'Oishii', meaning: '好吃' }
];

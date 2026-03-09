// Tokyo Trip PWA - Application Logic

const APP_VERSION = '1.5.1';

// ========================================
// Trip Dates Configuration
// ========================================

const TRIP_START_DATE = new Date('2026-03-31');
const TRIP_DATES = [
  '3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7'
];

// ========================================
// Data
// ========================================

const hotels = [
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

const itinerary = [
  {
    day: 1,
    date: '3月31日（二）',
    title: '東京初日',
    flow: ['抵達成田機場', '入境領取行李', '購買 Suica/PASMO', '搭車前往東京站', '辦理入住'],
    spots: [
      {
        name: '交通建議',
        hours: '',
        desc: 'JR Narita Express（成田特快）：成田機場直達東京站，車程約 60 分鐘。京成 Skyliner + 地鐵：成田機場 → 日暮里 → 東京站，車程約 70 分鐘。JR 東日本自 2026 年 3 月 14 日起調整票價，建議出發前確認最新票價。'
      }
    ],
    food: [
      { place: '東京站', name: 'GRANSTA TOKYO 地下街或八重洲地下街，日式便當與甜點選擇多樣' }
    ],
    transport: [],
    accommodation: 'スーパーホテル Premier 東京駅八重洲中央口'
  },
  {
    day: 2,
    date: '4月1日（三）',
    title: '千鳥之淵與目黑川夜櫻',
    flow: ['千鳥之淵划船賞櫻', '靖國神社參觀', '自由活動（皇居東御苑或銀座）', '目黑川夜櫻散策'],
    spots: [
      {
        name: '千鳥之淵',
        hours: '全天開放',
        desc: '皇居外苑西側護城河一帶的賞櫻名所，可租船於水面近距離欣賞櫻花。'
      },
      {
        name: '靖國神社',
        hours: '06:00–18:00（免費參觀）',
        desc: '重要的歷史性神社，境內種植約 500 株染井吉野櫻，春季櫻花盛開。'
      },
      {
        name: '目黑川',
        hours: '夜櫻點燈 18:00–21:00',
        desc: '沿河兩側種滿櫻花樹，中目黑一帶為人氣賞櫻與散步區域。'
      }
    ],
    food: [
      { place: '九段下', name: 'Iidabashi Saryo 日式定食' },
      { place: '目黑川沿岸', name: '章魚燒、炒麵與串燒等攤販小吃' },
      { place: '中目黑', name: '車站周邊居酒屋與特色餐廳' }
    ],
    transport: [],
    accommodation: 'スーパーホテル Premier 東京駅八重洲中央口'
  },
  {
    day: 3,
    date: '4月2日（四）',
    title: '淺草與上野散策',
    flow: ['隅田公園賞櫻', '晴空塔拍照', '淺草寺與仲見世通', '上野恩賜公園賞櫻', '阿美橫丁購物'],
    spots: [
      {
        name: '隅田公園',
        hours: '全天開放',
        desc: '沿隅田川兩岸設有櫻花步道，約 640 株櫻花樹，可同時眺望晴空塔與河景。'
      },
      {
        name: '淺草寺',
        hours: '06:00–17:00',
        desc: '東京最具代表性的古剎之一，雷門大燈籠、五重塔、本堂皆為拍照重點，仲見世通聚集許多傳統點心與伴手禮店舖。'
      },
      {
        name: '上野恩賜公園',
        hours: '全天開放',
        desc: '東京歷史悠久的公園與賞櫻名所，中央大路兩側櫻花形成壯觀花道，周邊有多座博物館與上野動物園。'
      },
      {
        name: '阿美橫丁',
        hours: '多數店家 10:00–20:00',
        desc: '位於上野與御徒町間的熱鬧商店街，販售藥妝、零食、海產與服飾等。'
      }
    ],
    food: [
      { place: '淺草', name: '「尾張屋」天婦羅蕎麥麵、「色川」鰻魚飯' },
      { place: '阿美橫丁', name: '「大統領」燒肉與串烤店' }
    ],
    transport: [],
    accommodation: 'スーパーホテル Premier 東京駅八重洲中央口'
  },
  {
    day: 4,
    date: '4月3日（五）',
    title: '鎌倉江之電與江之島',
    flow: ['小町通散策', '鶴岡八幡宮', '御靈神社', '鎌倉大佛', '長谷寺', '鎌倉高校前', '江之島'],
    spots: [
      {
        name: '小町通商店街',
        hours: '',
        desc: '鎌倉站附近最熱鬧的商店街，約 360 公尺長，聚集甜點、土產與小物店家。'
      },
      {
        name: '段葛參道與鶴岡八幡宮',
        hours: '06:00–20:30',
        desc: '段葛為通往鶴岡八幡宮的櫻花參道，兩側種植染井吉野櫻；鶴岡八幡宮是鎌倉的象徵性神社，境內有舞殿與源平池。'
      },
      {
        name: '御靈神社',
        hours: '',
        desc: '以江之電列車從鳥居前通過的畫面聞名，可拍攝電車與鳥居同框的特色照片。'
      },
      {
        name: '鎌倉大佛（高德院）',
        hours: '08:00–17:30',
        desc: '日本第二大青銅佛像，坐落於露天環境，是鎌倉的重要地標之一。'
      },
      {
        name: '長谷寺',
        hours: '08:00–17:00',
        desc: '位於山坡上的觀景寺院，園內可眺望湘南海岸與鎌倉市景，春季可欣賞櫻花與庭園景致。'
      },
      {
        name: '鎌倉高校前站',
        hours: '',
        desc: '因動畫《灌籃高手》片頭平交道場景而知名，站前就是面海的平交道，拍照時請注意電車與車輛安全。'
      },
      {
        name: '江之島',
        hours: '江島神社全天開放',
        desc: '小島上集合神社、展望台與海岸線景觀，稚兒之淵為欣賞夕陽與海景的熱門地點。'
      }
    ],
    food: [
      { place: '小町通', name: '「鎌倉五郎本店」半月燒、「茶房雲母」抹茶甜點' },
      { place: '長谷站附近', name: '「鎌倉松原庵」吻仔魚天婦羅蕎麥麵' },
      { place: '江之島', name: '「海鮮料理江之島亭」吻仔魚丼、「あさひ本店」章魚煎餅' }
    ],
    transport: [
      { name: '江之電一日券', desc: '約 800 日圓，當日可無限次搭乘江之電全線，適合多站途中下車遊覽' }
    ],
    accommodation: 'スーパーホテル Premier 東京駅八重洲中央口'
  },
  {
    day: 5,
    date: '4月4日（六）',
    title: '箱根溫泉鄉',
    flow: ['退房前往新宿', '購買箱根周遊券', '浪漫特快至箱根湯本', '登山電車與纜車', '大湧谷', '蘆之湖海盜船', '飯店溫泉'],
    spots: [
      {
        name: '箱根登山電車與登山纜車',
        hours: '',
        desc: '日本少見的登山鐵路，採之字形前進穿梭山谷與森林；早雲山至大湧谷之間則搭乘登山纜車。'
      },
      {
        name: '大湧谷',
        hours: '09:00–17:00',
        desc: '火山活動形成的地熱景觀，可見蒸氣孔與硫磺地形，當地名物黑玉子據說有延壽寓意。'
      },
      {
        name: '蘆之湖海盜船',
        hours: '',
        desc: '仿古歐風觀光船，往返桃源台港、元箱根港與箱根町港，天氣良好時可在湖面遠眺富士山。'
      }
    ],
    food: [
      { place: '大湧谷', name: '「玉子茶屋」烏龍麵、咖哩飯與黑玉子' },
      { place: '飯店內', name: '可選擇附晚餐方案，享用懷石料理或會席料理' }
    ],
    transport: [
      { name: '箱根周遊券', desc: '2 日券，新宿出發版約 6,100–6,500 日圓。包含箱根登山電車、登山纜車、空中纜車、海盜船與多條巴士路線無限次搭乘' }
    ],
    accommodation: 'Rakuten STAY FUJIMI TERRACE 箱根芦ノ湖'
  },
  {
    day: 6,
    date: '4月5日（日）',
    title: '箱根神社與新宿巡禮',
    flow: ['箱根神社', '箱根湯本商店街', '返回新宿', '新宿御苑賞櫻', '明治神宮參拜', '新宿購物'],
    spots: [
      {
        name: '箱根神社',
        hours: '全天開放（寶物殿 09:00–16:00）',
        desc: '位於蘆之湖畔的古老神社，以湖中平和鳥居與山林包圍的神域氛圍聞名。'
      },
      {
        name: '箱根湯本商店街',
        hours: '多數店家 09:00–18:00',
        desc: '沿溪谷展開的溫泉商店街，販售溫泉饅頭、箱根寄木細工與各式伴手禮。'
      },
      {
        name: '新宿御苑',
        hours: '09:00–18:00｜門票約 500 日圓',
        desc: '大型都市公園，結合日式庭園、法式幾何庭園與英式風景庭園，是市中心重要賞櫻地點。'
      },
      {
        name: '明治神宮',
        hours: '日出至日落',
        desc: '位於原宿・代代木一帶的廣大森林神社，從大鳥居至本殿的參道綠蔭盎然，氣氛莊嚴寧靜。'
      }
    ],
    food: [
      { place: '箱根湯本', name: '「田むら銀かつ亭」豆腐豬排、「はつ花」山藥蕎麥麵' },
      { place: '新宿', name: '「思い出橫丁」串燒與居酒屋、新宿拉麵街' }
    ],
    transport: [],
    accommodation: 'JR 九州ホテル ブラッサム新宿'
  },
  {
    day: 7,
    date: '4月6日（一）',
    title: '富士山與河口湖',
    flow: ['退房搭乘高速巴士', '新倉富士淺間神社', '河口湖飯店', '湖畔散策', '夜櫻點燈'],
    spots: [
      {
        name: '新倉山淺間公園（新倉富士淺間神社）',
        hours: '全天開放',
        desc: '位於富士吉田市山坡上的公園，從參道入口爬約 398 階即可抵達忠靈塔周邊觀景點，可同時拍攝五重塔、富士山與櫻花，是日本代表性的經典風景。'
      },
      {
        name: '河口湖',
        hours: '全天開放',
        desc: '富士五湖中交通最便利、觀光設施最完善的一座湖泊，湖畔有眾多飯店、咖啡廳與散步路線。'
      },
      {
        name: '河口湖手作市集',
        hours: '不定期，多選在週末與假日',
        desc: '當地工藝師與小店家擺攤，販售手工藝品、農產品與輕食，地點多在河口湖北岸大池公園一帶。'
      },
      {
        name: '河口湖夜櫻點燈',
        hours: '約 18:30–22:00',
        desc: '河口湖北岸產屋崎區域會對櫻花樹進行夜間點燈，天氣良好時可見富士山剪影與湖面倒影。'
      }
    ],
    food: [
      { place: '富士吉田', name: '「美也樂」吉田烏龍麵（偏硬麵體，搭配蔬菜與配料）' },
      { place: '河口湖', name: '「ほうとう不動」甲州味噌煮麵' },
      { place: '湖畔餐廳', name: '「LAKE BAKE」披薩與甜點、「シルバンズ」西式餐點' }
    ],
    transport: [
      { name: '富士急行高速巴士', desc: '由 Busta 新宿直達富士山站或河口湖站，班次多，需提前於官網預約座位' },
      { name: 'JR + 富士急行線', desc: '新宿 → 大月（JR 中央線）→ 富士山／河口湖（富士急行線），班次頻繁' }
    ],
    accommodation: 'HAOSTAY 河口湖美術館前'
  },
  {
    day: 8,
    date: '4月7日（二）',
    title: '逆富士與歸途',
    flow: ['逆富士拍攝', '回飯店休息', '退房', '搭乘巴士前往成田機場', '機場購物', '返台'],
    spots: [
      {
        name: '逆富士（河口湖倒影）',
        hours: '黃金時段 04:55–07:00｜日出 05:25',
        desc: '建議 05:00 前到達湖畔定位，此時湖面氣溫最低、風速最弱，倒影最清晰。日出前後 05:10–05:40 光線最具戲劇性，可拍到富士山被朝霞染紅的倒影畫面。日出後約 1.5 小時（約 06:55）水面開始出現光斑，倒影效果逐漸減弱。'
      },
      {
        name: '河口湖 → 成田機場直達巴士',
        hours: '',
        desc: '營運公司：富士急行與京成巴士。建議搭乘 09:00–10:00 班次，以確保中午前抵達機場。航班起飛前約 2 小時完成報到與行李托運。'
      },
      {
        name: '成田機場購物',
        hours: '',
        desc: '第二航廈設有 NARITA NAKAMISE（江戶小路）商店街、免稅店與多樣餐廳。伴手禮：東京香蕉蛋糕、白色戀人、ROYCE 巧克力等人氣甜點。'
      }
    ],
    food: [],
    transport: [
      { name: '河口湖 → 成田直達巴士', desc: '路線：河口湖站 → 成田機場第二航廈 → 成田機場第三航廈。提前於富士急行官網或河口湖站預約。' }
    ],
    accommodation: ''
  }
];

const practicalInfo = {
  weather: {
    title: '天氣與服裝',
    content: `
      <div class="weather-forecast-section" id="weather-forecast">
        <div class="weather-forecast-header">
          <h4 class="info-card-title">未來 3 天天氣預報</h4>
        </div>
        <div class="weather-forecast-grid" id="weather-forecast-grid">
          <div class="weather-loading">
            <span class="loading-spinner"></span>
            <span>載入天氣資料中...</span>
          </div>
        </div>
        <div class="weather-location-tabs" id="weather-location-tabs">
          <button class="weather-loc-tab active" data-city="tokyo">🗼 東京</button>
          <button class="weather-loc-tab" data-city="hakone">♨️ 箱根</button>
          <button class="weather-loc-tab" data-city="kawaguchiko">🗻 河口湖</button>
        </div>
        <div class="weather-data-source">
          資料來源：日本氣象廳 (JMA)
        </div>
      </div>
      <div class="weather-tip">
        <span class="weather-tip-icon">💡</span>
        <span>日夜溫差較大，清晨與夜間偏涼，白天溫度舒適</span>
      </div>
      <div class="info-card">
        <h4 class="info-card-title">建議服裝</h4>
        <div class="clothing-grid">
          <div class="clothing-item">
            <span class="clothing-icon">👕</span>
            <span class="clothing-label">上身</span>
            <span class="clothing-desc">發熱衣＋薄毛衣＋輕薄羽絨外套</span>
          </div>
          <div class="clothing-item">
            <span class="clothing-icon">👖</span>
            <span class="clothing-label">下身</span>
            <span class="clothing-desc">牛仔褲或長褲，可搭配薄發熱褲</span>
          </div>
          <div class="clothing-item">
            <span class="clothing-icon">👟</span>
            <span class="clothing-label">鞋子</span>
            <span class="clothing-desc">舒適好走的運動鞋或健走鞋</span>
          </div>
          <div class="clothing-item">
            <span class="clothing-icon">🧣</span>
            <span class="clothing-label">配件</span>
            <span class="clothing-desc">圍巾、折疊傘、薄手套</span>
          </div>
        </div>
      </div>
    `
  },
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

const phrases = [
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

// ========================================
// DOM Elements
// ========================================

const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const hotelTimeline = document.getElementById('hotel-timeline');
const dayTabs = document.getElementById('day-tabs');
const dayContent = document.getElementById('day-content');
const infoTabs = document.getElementById('info-tabs');
const infoContent = document.getElementById('info-content');
const phraseGrid = document.getElementById('phrase-grid');
const toast = document.getElementById('toast');
const installPrompt = document.getElementById('install-prompt');
const installBtn = document.getElementById('install-btn');
const installDismiss = document.getElementById('install-dismiss');
const sakuraContainer = document.getElementById('sakura-container');

// ========================================
// State
// ========================================

let currentDay = 1;
let currentInfo = 'weather';
let deferredPrompt = null;
let checkedItems = JSON.parse(localStorage.getItem('checkedItems') || '{}');
let customItems = JSON.parse(localStorage.getItem('customItems') || '[]');
let weatherCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
let currentWeatherCity = 'tokyo';

// Weather API configuration (Open-Meteo JMA API)
const WEATHER_LOCATIONS = {
  tokyo: { lat: 35.680312, lon: 139.769212, name: '東京', icon: '🗼', elevation: null },
  hakone: { lat: 35.244488, lon: 139.019704, name: '箱根', icon: '♨️', elevation: 700 },
  kawaguchiko: { lat: 35.521813, lon: 138.770037, name: '河口湖', icon: '🗻', elevation: 830 }
};

// WMO Weather Code mapping
const WMO_WEATHER_ICONS = {
  0: { icon: '☀️', desc: '晴天' },
  1: { icon: '🌤️', desc: '大致晴' },
  2: { icon: '⛅', desc: '局部多雲' },
  3: { icon: '☁️', desc: '多雲' },
  45: { icon: '🌫️', desc: '霧' },
  48: { icon: '🌫️', desc: '凍霧' },
  51: { icon: '🌦️', desc: '毛毛雨' },
  53: { icon: '🌦️', desc: '毛毛雨' },
  55: { icon: '🌦️', desc: '毛毛雨' },
  56: { icon: '🌧️', desc: '凍雨' },
  57: { icon: '🌧️', desc: '凍雨' },
  61: { icon: '🌧️', desc: '小雨' },
  63: { icon: '🌧️', desc: '中雨' },
  65: { icon: '🌧️', desc: '大雨' },
  66: { icon: '🌧️', desc: '凍雨' },
  67: { icon: '🌧️', desc: '凍雨' },
  71: { icon: '🌨️', desc: '小雪' },
  73: { icon: '🌨️', desc: '中雪' },
  75: { icon: '❄️', desc: '大雪' },
  77: { icon: '🌨️', desc: '冰粒' },
  80: { icon: '🌦️', desc: '小陣雨' },
  81: { icon: '🌧️', desc: '陣雨' },
  82: { icon: '🌧️', desc: '大陣雨' },
  85: { icon: '🌨️', desc: '小陣雪' },
  86: { icon: '❄️', desc: '大陣雪' },
  95: { icon: '⛈️', desc: '雷雨' },
  96: { icon: '⛈️', desc: '雷雨冰雹' },
  99: { icon: '⛈️', desc: '雷雨冰雹' }
};

// ========================================
// Functions
// ========================================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ========================================
// Weather Functions (Open-Meteo JMA API)
// ========================================

function getWeatherIcon(code) {
  return WMO_WEATHER_ICONS[code] || { icon: '🌤️', desc: '晴時多雲' };
}

async function fetchWeatherData(city) {
  const location = WEATHER_LOCATIONS[city];
  
  // Show loading state
  const grid = document.getElementById('weather-forecast-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="weather-loading">
        <span class="loading-spinner"></span>
        <span>載入 ${location.name} 天氣資料中...</span>
      </div>
    `;
  }
  
  try {
    // Build API URL with Open-Meteo JMA
    let url = `https://api.open-meteo.com/v1/jma?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours&timezone=Asia/Tokyo&forecast_days=3`;
    
    // Add elevation for mountain areas (more accurate temperature)
    if (location.elevation) {
      url += `&elevation=${location.elevation}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    const processed = processJMAWeatherData(data);
    
    // Cache the data
    weatherCache[city] = {
      data: processed,
      timestamp: Date.now()
    };
    localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
    
    renderWeatherForecast(processed, city);
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Try to use cached data
    if (weatherCache[city]) {
      renderWeatherForecast(weatherCache[city].data, city, true);
    } else {
      renderWeatherFallback(city);
    }
  }
}

function processJMAWeatherData(data) {
  const daily = data.daily;
  
  return daily.time.map((dateStr, index) => {
    const date = new Date(dateStr);
    return {
      date: date,
      tempMax: Math.round(daily.temperature_2m_max[index]),
      tempMin: Math.round(daily.temperature_2m_min[index]),
      weatherCode: daily.weather_code[index],
      precipitation: daily.precipitation_sum[index],
      precipHours: daily.precipitation_hours[index]
    };
  });
}

function renderWeatherForecast(forecast, city, isCached = false) {
  const grid = document.getElementById('weather-forecast-grid');
  const location = WEATHER_LOCATIONS[city];
  
  if (!grid) return;
  
  grid.innerHTML = forecast.map(day => {
    const dateStr = `${day.date.getMonth() + 1}/${day.date.getDate()}`;
    const weather = getWeatherIcon(day.weatherCode);
    const hasRain = day.precipitation > 0;
    
    return `
      <div class="weather-day-card ${hasRain ? 'has-rain' : ''}">
        <div class="weather-day-date">${dateStr}</div>
        <div class="weather-day-icon" title="${weather.desc}">${weather.icon}</div>
        <div class="weather-day-info">
          <div class="weather-day-temps">
            <span class="temp-high">${day.tempMax}°</span>
            <span class="temp-low">${day.tempMin}°</span>
          </div>
          ${hasRain ? `<div class="weather-day-rain">${day.precipitation.toFixed(0)}mm</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderWeatherFallback(city) {
  const grid = document.getElementById('weather-forecast-grid');
  const location = WEATHER_LOCATIONS[city];
  
  if (!grid) return;
  
  const fallbackTemps = {
    tokyo: { min: 12, max: 18 },
    hakone: { min: 8, max: 15 },
    kawaguchiko: { min: 5, max: 15 }
  };
  
  const temps = fallbackTemps[city];
  
  grid.innerHTML = `
    <div class="weather-fallback">
      <div class="weather-fallback-icon">${location.icon}</div>
      <div class="weather-fallback-location">${location.name}</div>
      <div class="weather-fallback-temp">${temps.min}–${temps.max}°C</div>
      <div class="weather-fallback-note">預估溫度範圍（無法取得即時資料）</div>
      <button class="weather-retry-btn" onclick="fetchWeatherData('${city}')">重新載入</button>
    </div>
  `;
}

// ========================================
// Custom Checklist Functions
// ========================================

function renderCustomItems() {
  const container = document.getElementById('custom-checklist');
  if (!container) return;
  
  container.innerHTML = customItems.map((item, index) => `
    <li class="checklist-item ${checkedItems['custom_' + index] ? 'checked' : ''}" data-item="custom_${index}">
      <span class="checklist-checkbox"></span>
      <span class="custom-item-text">${item}</span>
      <button class="delete-item-btn" data-index="${index}" aria-label="刪除項目">×</button>
    </li>
  `).join('');
}

function addCustomItem(text) {
  if (!text.trim()) return;
  customItems.push(text.trim());
  localStorage.setItem('customItems', JSON.stringify(customItems));
  renderCustomItems();
  showToast('已新增項目');
}

function deleteCustomItem(index) {
  customItems.splice(index, 1);
  localStorage.setItem('customItems', JSON.stringify(customItems));
  delete checkedItems['custom_' + index];
  localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  renderCustomItems();
  showToast('已刪除項目');
}

// ========================================
// Speech Synthesis Functions
// ========================================

function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    showToast('您的瀏覽器不支援語音功能');
    return;
  }
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.8;
  
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find(v => v.lang.startsWith('ja'));
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }
  
  window.speechSynthesis.speak(utterance);
}

// ========================================
// Auto Day Selection
// ========================================

function getTodayDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tripStart = new Date(TRIP_START_DATE);
  tripStart.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - tripStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 0 && diffDays < 8) {
    return diffDays + 1;
  }
  return 1;
}

function scrollToHighlights() {
  const highlights = document.querySelector('.highlights');
  if (highlights) {
    highlights.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderHotels() {
  hotelTimeline.innerHTML = hotels.map(hotel => `
    <div class="hotel-card-wrapper">
      <div class="hotel-card" onclick="this.classList.toggle('expanded')">
        <div class="hotel-dates">
          <span>${hotel.checkIn} → ${hotel.checkOut}</span>
          <span class="hotel-nights">${hotel.nights} 晚</span>
        </div>
        <div class="hotel-name">${hotel.name}</div>
        <div class="hotel-location">${hotel.location}</div>
        <div class="hotel-details">
          <div class="hotel-detail-item">
            <span class="hotel-detail-label">入退房</span>
            <span class="hotel-detail-value">${hotel.times}</span>
          </div>
          <div class="hotel-detail-item">
            <span class="hotel-detail-label">確認碼</span>
            <span class="hotel-detail-value">${hotel.code}</span>
          </div>
          <div class="hotel-detail-item">
            <span class="hotel-detail-label">特色</span>
            <span class="hotel-detail-value">${hotel.features}</span>
          </div>
          <a href="https://www.google.com/maps/search/${encodeURIComponent(hotel.name)}" target="_blank" rel="noopener noreferrer" class="maps-btn maps-btn-full" onclick="event.stopPropagation()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>在 Google Maps 開啟</span>
          </a>
        </div>
        <div class="hotel-expand-hint">點擊查看詳情</div>
      </div>
    </div>
  `).join('');
}

function renderDayContent(day) {
  const data = itinerary.find(d => d.day === day);
  if (!data) return;

  const flowHtml = data.flow.map((item, i) => 
    `<span class="flow-item">${item}</span>${i < data.flow.length - 1 ? '<span class="flow-arrow">→</span>' : ''}`
  ).join('');

  const spotsHtml = data.spots.length ? `
    <div class="spot-section">
      <h3 class="spot-section-title">景點資訊</h3>
      ${data.spots.map(spot => `
        <div class="spot-card">
          <div class="spot-header">
            <div class="spot-name">${spot.name}</div>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(spot.name)}" target="_blank" rel="noopener noreferrer" class="maps-btn" title="在 Google Maps 開啟">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </a>
          </div>
          ${spot.hours ? `<div class="spot-hours">${spot.hours}</div>` : ''}
          <div class="spot-desc">${spot.desc}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const foodHtml = data.food.length ? `
    <div class="spot-section">
      <h3 class="spot-section-title">餐飲建議</h3>
      <div class="food-list">
        ${data.food.map(f => `
          <div class="food-item">
            <span class="food-place">${f.place}</span>
            <span class="food-name">${f.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const transportHtml = data.transport.length ? `
    <div class="spot-section">
      <h3 class="spot-section-title">交通資訊</h3>
      <div class="transport-list">
        ${data.transport.map(t => `
          <div class="transport-item">
            <span class="transport-name">${t.name}</span>
            <span class="transport-desc">${t.desc}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const accommodationHtml = data.accommodation ? `
    <div class="accommodation-note">
      <span class="accommodation-icon">🏨</span>
      <span>住宿：${data.accommodation}</span>
    </div>
  ` : '';

  dayContent.innerHTML = `
    <div class="day-header">
      <div class="day-date">${data.date}</div>
      <h3 class="day-title">${data.title}</h3>
    </div>
    <div class="day-flow">${flowHtml}</div>
    ${spotsHtml}
    ${foodHtml}
    ${transportHtml}
    ${accommodationHtml}
  `;
}

function renderInfoContent(infoKey) {
  const data = practicalInfo[infoKey];
  if (!data) return;
  infoContent.innerHTML = data.content;

  // Restore checked state
  if (infoKey === 'packing') {
    document.querySelectorAll('.checklist-item').forEach(item => {
      const key = item.dataset.item;
      if (checkedItems[key]) {
        item.classList.add('checked');
      }
    });
    
    renderCustomItems();
    
    const addBtn = document.getElementById('add-item-btn');
    const input = document.getElementById('new-item-input');
    if (addBtn && input) {
      addBtn.addEventListener('click', () => {
        addCustomItem(input.value);
        input.value = '';
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addCustomItem(input.value);
          input.value = '';
        }
      });
    }
    
    const customChecklist = document.getElementById('custom-checklist');
    if (customChecklist) {
      customChecklist.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-item-btn');
        if (deleteBtn) {
          e.stopPropagation();
          const index = parseInt(deleteBtn.dataset.index);
          deleteCustomItem(index);
        }
      });
    }
  }
  
  if (infoKey === 'weather') {
    fetchWeatherData(currentWeatherCity);
    
    const locationTabs = document.getElementById('weather-location-tabs');
    if (locationTabs) {
      locationTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.weather-loc-tab');
        if (tab) {
          const city = tab.dataset.city;
          currentWeatherCity = city;
          locationTabs.querySelectorAll('.weather-loc-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          fetchWeatherData(city);
        }
      });
    }
  }
}

function renderPhrases() {
  phraseGrid.innerHTML = phrases.map(phrase => `
    <div class="phrase-card" data-jp="${phrase.jp.replace(/"/g, '&quot;')}">
      <div class="phrase-header">
        <div class="phrase-jp">${phrase.jp}</div>
        <button class="phrase-speak-btn" data-text="${phrase.jp.replace(/"/g, '&quot;')}" aria-label="播放發音">
          🔊
        </button>
      </div>
      <div class="phrase-romaji">${phrase.romaji}</div>
      <div class="phrase-meaning">${phrase.meaning}</div>
    </div>
  `).join('');
}

function handlePhraseCopy(el) {
  const text = el.dataset.jp;
  if (!text) return;
  
  navigator.clipboard.writeText(text)
    .then(() => {
      el.classList.add('copied');
      showToast('已複製到剪貼簿');
      setTimeout(() => el.classList.remove('copied'), 1000);
    })
    .catch(() => {
      showToast('複製失敗，請手動選取複製');
    });
}

function createSakuraPetals() {
  const petalCount = 15;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
    petal.style.animationDelay = (Math.random() * 10) + 's';
    petal.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
    sakuraContainer.appendChild(petal);
  }
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function setupNavVisibility() {
  const heroHeight = document.querySelector('.hero').offsetHeight;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > heroHeight * 0.5) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  });
}

// ========================================
// Event Listeners
// ========================================

// Navigation toggle
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Navigation links
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// Day tabs
dayTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('day-tab')) {
    const day = parseInt(e.target.dataset.day);
    if (day !== currentDay) {
      currentDay = day;
      dayTabs.querySelectorAll('.day-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      renderDayContent(day);
      
      // Scroll to day content with offset for sticky header
      setTimeout(() => {
        const dayHeader = document.querySelector('.day-header');
        if (dayHeader) {
          const offsetTop = dayHeader.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }, 50);
    }
  }
});

// Info tabs
infoTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-tab')) {
    const info = e.target.dataset.info;
    if (info !== currentInfo) {
      currentInfo = info;
      infoTabs.querySelectorAll('.info-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      renderInfoContent(info);
    }
  }
});

// Checklist items
infoContent.addEventListener('click', (e) => {
  const item = e.target.closest('.checklist-item');
  if (item) {
    item.classList.toggle('checked');
    const key = item.dataset.item;
    checkedItems[key] = item.classList.contains('checked');
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }
});

// Phrase cards - event delegation
phraseGrid.addEventListener('click', (e) => {
  const speakBtn = e.target.closest('.phrase-speak-btn');
  if (speakBtn) {
    e.stopPropagation();
    const text = speakBtn.dataset.text;
    speakJapanese(text);
    return;
  }
  
  const card = e.target.closest('.phrase-card');
  if (card) {
    handlePhraseCopy(card);
  }
});

// PWA Install
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    installPrompt.classList.add('show');
  }, 3000);
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installPrompt.classList.remove('show');
  }
});

installDismiss.addEventListener('click', () => {
  installPrompt.classList.remove('show');
});

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Auto-select today's day if within trip dates
  currentDay = getTodayDay();
  
  // Update day tabs to show dates instead of "Day X"
  updateDayTabsWithDates();
  
  renderHotels();
  renderDayContent(currentDay);
  renderInfoContent(currentInfo);
  renderPhrases();
  createSakuraPetals();
  setupNavVisibility();
  setupScrollAnimations();
  setupHeroScroll();
  
  // Pre-load speech synthesis voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
  
  // Update footer version
  const footerAuthor = document.querySelector('.footer-author');
  if (footerAuthor) {
    footerAuthor.innerHTML = `Chung-Yao 編製 <span class="footer-version">v${APP_VERSION}</span>`;
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed', err));
  }
});

function updateDayTabsWithDates() {
  const tabs = dayTabs.querySelectorAll('.day-tab');
  tabs.forEach((tab, index) => {
    const day = index + 1;
    tab.textContent = TRIP_DATES[index];
    tab.dataset.day = day;
    if (day === currentDay) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

function setupHeroScroll() {
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.style.cursor = 'pointer';
    heroScroll.addEventListener('click', scrollToHighlights);
  }
}

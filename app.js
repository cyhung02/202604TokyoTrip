// Tokyo Trip PWA - Application Logic
// APP_VERSION is fetched from sw.js to keep version in one place
// Trip data is loaded from data.js

// Configure marked
marked.use({ breaks: true });

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

// ========================================
// State
// ========================================

let currentDay = 1;
let currentInfo = 'sakura';
let deferredPrompt = null;
let checkedItems = JSON.parse(localStorage.getItem('checkedItems') || '{}');
let customItems = JSON.parse(localStorage.getItem('customItems') || '[]');
let weatherCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
let currentWeatherLocation = 'tokyo';
let selectedWeatherDate = null;
let allWeatherData = {};

// Weather API configuration (Open-Meteo Forecast API)
// Uses best_match model which combines JMA MSM (short-term) and ECMWF (medium-term)
const WEATHER_LOCATIONS = {
  tokyo:       { lat: 35.6812, lon: 139.7671, name: '東京',       icon: '🗼' },
  kawaguchiko: { lat: 35.5117, lon: 138.7522, name: '河口湖',     icon: '🗻' },
  hakone:      { lat: 35.2049, lon: 139.0167, name: '箱根', icon: '♨️' }
};

// WMO Weather Code mapping (complete spec from API documentation)
const WMO_WEATHER_CODES = {
  0:  { icon: '☀️', desc: '晴空' },
  1:  { icon: '🌤️', desc: '大致晴' },
  2:  { icon: '⛅', desc: '局部多雲' },
  3:  { icon: '☁️', desc: '陰天' },
  45: { icon: '🌫️', desc: '霧' },
  48: { icon: '🌫️', desc: '霧凇' },
  51: { icon: '🌦️', desc: '毛毛雨（輕）' },
  53: { icon: '🌦️', desc: '毛毛雨（中）' },
  55: { icon: '🌦️', desc: '毛毛雨（重）' },
  56: { icon: '🌨️', desc: '凍細雨（輕）' },
  57: { icon: '🌨️', desc: '凍細雨（重）' },
  61: { icon: '🌧️', desc: '雨（小）' },
  63: { icon: '🌧️', desc: '雨（中）' },
  65: { icon: '🌧️', desc: '雨（大）' },
  66: { icon: '🌨️', desc: '凍雨（輕）' },
  67: { icon: '🌨️', desc: '凍雨（重）' },
  71: { icon: '❄️', desc: '雪（小）' },
  73: { icon: '❄️', desc: '雪（中）' },
  75: { icon: '❄️', desc: '雪（大）' },
  77: { icon: '❄️', desc: '米雪' },
  80: { icon: '🌦️', desc: '陣雨（小）' },
  81: { icon: '🌦️', desc: '陣雨（中）' },
  82: { icon: '🌦️', desc: '陣雨（大）' },
  85: { icon: '🌨️', desc: '陣雪（小）' },
  86: { icon: '🌨️', desc: '陣雪（大）' },
  95: { icon: '⛈️', desc: '雷陣雨' },
  96: { icon: '⛈️', desc: '雷雨夾冰雹' },
  99: { icon: '⛈️', desc: '雷雨夾冰雹' }
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
// Weather Functions (Open-Meteo Forecast API)
// ========================================

function getWeatherInfo(code) {
  return WMO_WEATHER_CODES[code] || { icon: '🌤️', desc: '晴' };
}

/**
 * Fetch weather data for a location using Open-Meteo API
 * Uses best_match model (JMA MSM for short-term, ECMWF for medium-term)
 */
async function fetchWeatherForLocation(locationKey) {
  const location = WEATHER_LOCATIONS[locationKey];
  
  // Build API URL per the spec
  const params = new URLSearchParams({
    latitude: location.lat,
    longitude: location.lon,
    models: 'best_match',
    timezone: 'Asia/Tokyo',
    temporal_resolution: 'hourly_6',
    current: 'temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,precipitation,is_day',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,freezing_level_height,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,snowfall_sum,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max,relative_humidity_2m_mean,vapour_pressure_deficit_max,wet_bulb_temperature_2m_mean'
  });
  
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  data.location_name = location.name;
  data.location_icon = location.icon;
  
  return data;
}

/**
 * Process raw API data into structured format for a specific date
 */
function buildDailyAIInput(rawData, dateStr) {
  const daily = rawData.daily;
  const hourly = rawData.hourly;
  
  const dateIndex = daily.time.indexOf(dateStr);
  if (dateIndex === -1) return null;
  
  // Get hourly data for this date
  const dayHourly = hourly.time
    .map((t, j) => ({ time: t, index: j }))
    .filter(item => item.time.startsWith(dateStr))
    .map(item => ({
      time: hourly.time[item.index],
      is_day: hourly.is_day[item.index],
      temperature_c: hourly.temperature_2m[item.index],
      apparent_temperature_c: hourly.apparent_temperature[item.index],
      precip_probability_pct: hourly.precipitation_probability[item.index],
      freezing_level_height_m: hourly.freezing_level_height[item.index]
    }));
  
  const weatherCode = daily.weather_code[dateIndex];
  
  return {
    location_name: rawData.location_name,
    location_elevation_m: rawData.elevation,
    date: daily.time[dateIndex],
    weather_code: weatherCode,
    weather_description: getWeatherInfo(weatherCode).desc,
    actual_temp_max_c: daily.temperature_2m_max[dateIndex],
    actual_temp_min_c: daily.temperature_2m_min[dateIndex],
    apparent_temp_max_c: daily.apparent_temperature_max[dateIndex],
    apparent_temp_min_c: daily.apparent_temperature_min[dateIndex],
    precip_probability_pct: daily.precipitation_probability_max[dateIndex],
    precip_sum_mm: daily.precipitation_sum[dateIndex],
    snowfall_sum_cm: daily.snowfall_sum[dateIndex],
    wind_speed_max_kmh: daily.wind_speed_10m_max[dateIndex],
    wind_gusts_max_kmh: daily.wind_gusts_10m_max[dateIndex],
    uv_index_max: daily.uv_index_max[dateIndex],
    sunrise: daily.sunrise[dateIndex],
    sunset: daily.sunset[dateIndex],
    humidity_mean_pct: daily.relative_humidity_2m_mean[dateIndex],
    vapour_pressure_deficit_max_kpa: daily.vapour_pressure_deficit_max[dateIndex],
    wet_bulb_temp_mean_c: daily.wet_bulb_temperature_2m_mean[dateIndex],
    hourly_forecast: dayHourly
  };
}

/**
 * Initialize the weather section
 */
async function initWeatherSection() {
  const currentCard = document.getElementById('weather-current-card');
  const grid = document.getElementById('weather-7day-grid');
  
  if (!currentCard || !grid) return;
  
  try {
    await loadWeatherData(currentWeatherLocation);
  } catch (error) {
    console.error('Weather init error:', error);
    showWeatherError();
  }
}

/**
 * Load weather data for a specific location
 */
async function loadWeatherData(locationKey) {
  const currentCard = document.getElementById('weather-current-card');
  const grid = document.getElementById('weather-7day-grid');
  const location = WEATHER_LOCATIONS[locationKey];
  
  // Show loading
  currentCard.innerHTML = `<div class="wx-hero-loader"><div class="wx-spinner"></div></div>`;
  grid.innerHTML = `<div class="wx-days-loader"><div class="wx-spinner"></div></div>`;
  
  // Reset AI section
  resetWeatherAI();
  selectedWeatherDate = null;
  
  try {
    // Check cache first (valid for 15 minutes)
    const cacheKey = `weather_${locationKey}`;
    const cached = weatherCache[cacheKey];
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < 15 * 60 * 1000) {
      allWeatherData[locationKey] = cached.data;
      renderCurrentWeather(cached.data);
      render7DayForecast(cached.data, locationKey);
      return;
    }
    
    // Fetch fresh data
    const data = await fetchWeatherForLocation(locationKey);
    
    // Cache it
    weatherCache[cacheKey] = {
      data: data,
      timestamp: now
    };
    localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
    
    allWeatherData[locationKey] = data;
    renderCurrentWeather(data);
    render7DayForecast(data, locationKey);
    
  } catch (error) {
    console.error('Weather load error:', error);
    showWeatherError();
  }
}

/**
 * Render current weather card - Bold editorial design
 */
function renderCurrentWeather(data) {
  const card = document.getElementById('weather-current-card');
  if (!card || !data.current) return;
  
  const current = data.current;
  const weather = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;
  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  
  card.innerHTML = `
    <div class="wx-hero-content" data-theme="${isDay ? 'day' : 'night'}">
      <div class="wx-hero-bg-text">${weather.icon}</div>
      <div class="wx-hero-main">
        <div class="wx-hero-temp">
          <span class="wx-hero-temp-num">${temp}</span>
          <span class="wx-hero-temp-unit">°</span>
        </div>
        <div class="wx-hero-meta">
          <div class="wx-hero-location">${data.location_name}</div>
          <div class="wx-hero-desc">${weather.desc}</div>
        </div>
      </div>
      <div class="wx-hero-stats">
        <div class="wx-stat">
          <span class="wx-stat-val">${feelsLike}°</span>
          <span class="wx-stat-lbl">體感</span>
        </div>
        <div class="wx-stat">
          <span class="wx-stat-val">${current.relative_humidity_2m}%</span>
          <span class="wx-stat-lbl">濕度</span>
        </div>
        <div class="wx-stat">
          <span class="wx-stat-val">${Math.round(current.wind_speed_10m)}</span>
          <span class="wx-stat-lbl">km/h</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render 7-day forecast - Horizontal strip design
 */
function render7DayForecast(data, locationKey) {
  const grid = document.getElementById('weather-7day-grid');
  if (!grid || !data.daily) return;
  
  const daily = data.daily;
  const jpDays = ['日', '月', '火', '水', '木', '金', '土'];
  
  grid.innerHTML = daily.time.map((dateStr, index) => {
    const date = new Date(dateStr);
    const dayChar = jpDays[date.getDay()];
    const dateNum = date.getDate();
    const weather = getWeatherInfo(daily.weather_code[index]);
    const tempMax = Math.round(daily.temperature_2m_max[index]);
    const tempMin = Math.round(daily.temperature_2m_min[index]);
    const precipProb = daily.precipitation_probability_max[index];
    const isSelected = selectedWeatherDate === dateStr;
    const isToday = index === 0;
    
    return `
      <button class="wx-day ${isSelected ? 'is-active' : ''} ${isToday ? 'is-today' : ''}"
              data-date="${dateStr}"
              data-location="${locationKey}"
              type="button">
        <span class="wx-day-date">
          <em>${dateNum}</em>
          <small>${dayChar}</small>
        </span>
        <span class="wx-day-icon">${weather.icon}</span>
        <span class="wx-day-temps">
          <span class="wx-day-hi">${tempMax}</span>
          <span class="wx-day-lo">${tempMin}</span>
        </span>
        ${precipProb > 0 ? `<span class="wx-day-rain">${precipProb}%</span>` : ''}
      </button>
    `;
  }).join('');
  
  // Add click handlers
  grid.querySelectorAll('.wx-day').forEach(card => {
    card.addEventListener('click', handleWeather7DayClick);
  });
}

/**
 * Handle click on 7-day forecast card
 */
function handleWeather7DayClick(e) {
  const card = e.currentTarget;
  const dateStr = card.dataset.date;
  const locationKey = card.dataset.location;
  
  // Update selection
  selectedWeatherDate = dateStr;
  document.querySelectorAll('.wx-day').forEach(c => {
    c.classList.toggle('is-active', c.dataset.date === dateStr);
  });
  
  // Get data and call AI
  const rawData = allWeatherData[locationKey];
  if (!rawData) return;
  
  const dayInput = buildDailyAIInput(rawData, dateStr);
  if (dayInput) {
    fetchWeatherAIAdvice(dayInput);
  }
}

/**
 * Show weather error state
 */
function showWeatherError() {
  const currentCard = document.getElementById('weather-current-card');
  const grid = document.getElementById('weather-7day-grid');
  
  if (currentCard) {
    currentCard.innerHTML = `
      <div class="wx-error">
        <p>無法載入天氣</p>
        <button onclick="loadWeatherData('${currentWeatherLocation}')">重試</button>
      </div>
    `;
  }
  
  if (grid) {
    grid.innerHTML = '';
  }
}

// ========================================
// Weather AI Advisor Functions
// ========================================

/**
 * Fetch AI weather advice for a specific day
 */
async function fetchWeatherAIAdvice(dayInput) {
  const section = document.getElementById('weather-ai-section');
  if (!section) return;
  
  const date = new Date(dayInput.date);
  const dateNum = date.getDate();
  const weather = getWeatherInfo(dayInput.weather_code);
  
  // Show loading state
  section.innerHTML = `
    <div class="wx-ai-card is-loading">
      <div class="wx-ai-loader">
        <div class="wx-spinner"></div>
        <span>AI分析中...</span>
      </div>
    </div>
  `;
  
  try {
    const response = await fetch('https://outfit-advisor.cyhung02.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weather_data: dayInput })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const advice = await response.json();
    renderWeatherAIAdvice(advice, dayInput);
    
  } catch (error) {
    console.error('Weather AI advice error:', error);
    showWeatherAIError(dayInput);
  }
}

/**
 * Render AI weather advice - Magazine editorial style
 */
function renderWeatherAIAdvice(advice, dayInput) {
  const section = document.getElementById('weather-ai-section');
  if (!section) return;
  
  const date = new Date(dayInput.date);
  const dateNum = date.getDate();
  const month = date.getMonth() + 1;
  const weather = getWeatherInfo(dayInput.weather_code);
  const jpDays = ['日', '月', '火', '水', '木', '金', '土'];
  const dayChar = jpDays[date.getDay()];
  
  // Build accessories
  const accessories = advice.accessories && advice.accessories.length > 0
    ? advice.accessories.map(a => `<span>${a}</span>`).join('')
    : '<span>—</span>';
  
  // Warning
  const warning = advice.warning
    ? `<div class="wx-ai-alert"><span>!</span>${advice.warning}</div>`
    : '';
  
  section.innerHTML = `
    <article class="wx-ai-card">
      <header class="wx-ai-head">
        <div class="wx-ai-date">
          <span class="wx-ai-date-num">${dateNum}</span>
          <span class="wx-ai-date-meta">
            <em>${month}月</em>
            <em>${dayChar}曜日</em>
          </span>
        </div>
        <div class="wx-ai-condition">
          <span class="wx-ai-icon">${weather.icon}</span>
          <span class="wx-ai-temps">${Math.round(dayInput.actual_temp_min_c)}° / ${Math.round(dayInput.actual_temp_max_c)}°</span>
        </div>
      </header>
      
      <blockquote class="wx-ai-quote">
        <p>${advice.summary}</p>
      </blockquote>
      
      <div class="wx-ai-metrics">
        <div class="wx-ai-metric">
          <span class="wx-ai-metric-val">${Math.round(dayInput.apparent_temp_min_c)}°~${Math.round(dayInput.apparent_temp_max_c)}°</span>
          <span class="wx-ai-metric-lbl">體感溫度</span>
        </div>
        <div class="wx-ai-metric">
          <span class="wx-ai-metric-val">${dayInput.precip_probability_pct}%</span>
          <span class="wx-ai-metric-lbl">降雨機率</span>
        </div>
        <div class="wx-ai-metric">
          <span class="wx-ai-metric-val">${dayInput.uv_index_max.toFixed(0)}</span>
          <span class="wx-ai-metric-lbl">UV指數</span>
        </div>
        <div class="wx-ai-metric">
          <span class="wx-ai-metric-val">${Math.round(dayInput.wind_speed_max_kmh)}</span>
          <span class="wx-ai-metric-lbl">風速 km/h</span>
        </div>
      </div>
      
      <section class="wx-ai-outfit">
        <h3>穿搭建議</h3>
        <div class="wx-ai-outfit-grid">
          <div class="wx-ai-outfit-item">
            <label>上身</label>
            <p>${advice.top}</p>
          </div>
          <div class="wx-ai-outfit-item">
            <label>下身</label>
            <p>${advice.bottoms}</p>
          </div>
          <div class="wx-ai-outfit-item">
            <label>鞋類</label>
            <p>${advice.footwear}</p>
          </div>
          <div class="wx-ai-outfit-item wx-ai-outfit-acc">
            <label>配件</label>
            <div class="wx-ai-tags">${accessories}</div>
          </div>
        </div>
      </section>
      
      ${warning}
    </article>
  `;
}

/**
 * Show AI error state
 */
function showWeatherAIError(dayInput) {
  const section = document.getElementById('weather-ai-section');
  if (!section) return;
  
  section.innerHTML = `
    <div class="wx-ai-error">
      <p>讀取失敗</p>
      <button onclick="retryWeatherAI()">重試</button>
    </div>
  `;
}

/**
 * Reset AI section to placeholder
 */
function resetWeatherAI() {
  const section = document.getElementById('weather-ai-section');
  if (!section) return;
  
  section.innerHTML = `
    <div class="wx-ai-empty">
      <div class="wx-ai-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
      <p>點選上方日期<br/>查看 AI 穿搭建議</p>
    </div>
  `;
}

/**
 * Retry AI advice
 */
function retryWeatherAI() {
  if (selectedWeatherDate && allWeatherData[currentWeatherLocation]) {
    const dayInput = buildDailyAIInput(allWeatherData[currentWeatherLocation], selectedWeatherDate);
    if (dayInput) {
      fetchWeatherAIAdvice(dayInput);
    }
  }
}

/**
 * Setup weather location selector
 */
function setupWeatherLocationSelector() {
  const selector = document.getElementById('weather-location-selector');
  if (!selector) return;
  
  selector.addEventListener('click', (e) => {
    const btn = e.target.closest('.wx-nav-btn');
    if (!btn) return;
    
    const locationKey = btn.dataset.location;
    if (locationKey === currentWeatherLocation) return;
    
    // Update active state
    selector.querySelectorAll('.wx-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Load new location data
    currentWeatherLocation = locationKey;
    loadWeatherData(locationKey);
  });
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
          <div class="spot-desc markdown-content">${marked.parse(spot.desc)}</div>
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
            <span class="food-name markdown-content">${marked.parse(f.name)}</span>
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
            <span class="transport-desc markdown-content">${marked.parse(t.desc)}</span>
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

function updateNavHeightVar() {
  const navHeight = nav.offsetHeight;
  document.documentElement.style.setProperty('--nav-actual-height', `${navHeight}px`);
}

/**
 * Robust scroll positioning - works in both web and PWA modes
 * Uses actual DOM measurements instead of CSS variables
 */
function scrollToElementWithOffset(element, additionalOffset = 0) {
  // Get actual nav height from DOM (includes safe-area-inset padding in PWA)
  const navHeight = nav.offsetHeight;
  
  // Calculate absolute position of element in document
  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  
  // Calculate target scroll position
  const targetPosition = elementTop - navHeight - additionalOffset;
  
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth'
  });
}

/**
 * Scroll to day content with offset for both nav and sticky tabs
 */
function scrollToDayContent() {
  const dayHeader = document.querySelector('.day-header');
  if (!dayHeader) return;
  
  // Get actual heights from DOM
  const navHeight = nav.offsetHeight;
  const tabsWrapper = document.querySelector('.day-tabs-wrapper');
  const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
  const padding = 8;
  
  // Calculate absolute position
  const elementTop = dayHeader.getBoundingClientRect().top + window.scrollY;
  const targetPosition = elementTop - navHeight - tabsHeight - padding;
  
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth'
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

// Navigation links - robust scroll with DOM-based offset calculation
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    
    const targetId = link.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      // Scroll to section title instead of section itself to avoid padding offset issues
      // Different sections have different title selectors
      const scrollTarget = targetEl.querySelector('.section-title') 
                        || targetEl.querySelector('.wx-header') 
                        || targetEl;
      scrollToElementWithOffset(scrollTarget, 16);
    }
  });
});

// Day tabs - robust scroll with DOM-based offset calculation
dayTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('day-tab')) {
    const day = parseInt(e.target.dataset.day);
    if (day !== currentDay) {
      currentDay = day;
      dayTabs.querySelectorAll('.day-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      renderDayContent(day);
      
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        scrollToDayContent();
      });
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
  setupNavVisibility();
  setupScrollAnimations();
  setupHeroScroll();
  
  // Set nav height CSS variable for scroll-padding-top
  updateNavHeightVar();
  window.addEventListener('resize', updateNavHeightVar);
  
  // Initialize weather section
  setupWeatherLocationSelector();
  initWeatherSection();
  
  // Pre-load speech synthesis voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
  
  // Register Service Worker and update footer version from sw.js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed', err));
  }
  
  // Fetch version from sw.js (single source of truth)
  fetch('sw.js')
    .then(res => res.text())
    .then(text => {
      const match = text.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
      const version = match ? match[1] : '?';
      const footerAuthor = document.querySelector('.footer-author');
      if (footerAuthor) {
        footerAuthor.innerHTML = `Chung-Yao 編製 <span class="footer-version">v${version}</span>`;
      }
    })
    .catch(() => {
      const footerAuthor = document.querySelector('.footer-author');
      if (footerAuthor) {
        footerAuthor.innerHTML = `Chung-Yao 編製`;
      }
    });
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

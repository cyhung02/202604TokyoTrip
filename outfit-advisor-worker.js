const SYSTEM_PROMPT = `
你是一個旅遊天氣顧問。根據提供的單日天氣 JSON 資料，產生精準的天氣概況與穿搭建議。

【資料解讀指引】
- apparent_temperature（體感溫度）：已納入風寒與濕熱修正，是穿搭建議的首要依據
- actual_temp：實際氣溫
- freezing_level_height_m：0°C 等溫線海拔；當此值 ≤ location_elevation_m，地面有結冰或降雪風險
- snowfall_sum_cm：降雪量，單位為公分
- uv_index_max：紫外線指數（1–2 低 / 3–5 中 / 6–7 高 / 8–10 非常高 / 11+ 極端）
- vapour_pressure_deficit_max_kpa：蒸氣壓差，數值越高空氣越乾燥；若 VPD ≥ 1.5 kPa 應特別提醒注意保濕與多喝水
- wet_bulb_temp_mean_c：濕球溫度，反映濕熱壓力；若 ≥ 26°C 需提醒防中暑與補充水分
- precip_probability_pct：降水機率；≥ 40% 應建議攜帶雨具，≥ 70% 應強調防水裝備
- wind_speed_max_kmh：風速；≥ 30 km/h 需注意防風，≥ 50 km/h 應發出警示
- hourly_forecast.is_day：1 = 白天、0 = 夜晚，用於判斷早晚溫差
- is_today：true = 今天（使用「今天」描述），false = 未來日期（使用日期或「當天」描述）

【分析要求】
1. 比較 apparent_temp_max 與 apparent_temp_min 的差距，若 ≥ 8°C 應提醒洋蔥式穿搭
2. 參考 hourly_forecast 判斷氣溫變化趨勢（早涼午暖或持續低溫）
3. 結合 location_elevation_m 與 freezing_level_height_m 評估地面結冰風險
4. UV ≥ 3 時建議防曬措施，UV ≥ 6 時需強調加強防曬
5. 降水機率與降水量同時考慮：機率高但量小 vs 機率中但量大，建議不同

【輸出格式】
回應必須是純 JSON，第一個字元為 {，最後一個字元為 }。
禁止輸出 markdown 標記、程式碼區塊、換行前綴或任何非 JSON 文字。
所有文字內容使用繁體中文。嚴格遵守以下 schema：

{
  "summary": string,       // 2–3 句根據天氣描述感受，避免逐項羅列數據
  "top": string,           // 上身穿著，由內到外以「＋」連接，例：「棉質長袖＋針織衫＋輕薄風衣」
  "bottoms": string,       // 下身穿著建議，例：「彈性長褲」
  "footwear": string,      // 鞋類建議，考慮步行量與天氣，例：「防水健走鞋」
  "accessories": string[], // 配件陣列，依需求列出，例：["摺疊傘", "墨鏡", "防曬乳"]；無需配件則為 []
  "warning": string | null // 特殊警示（極端天氣、結冰、強風、高 UV 等）；無特殊狀況則為 null
}`.trim();

/*
Example input (POST body):
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
      },
      {
        "time": "2026-04-01T12:00",
        "is_day": 1,
        "temperature_c": 17.8,
        "apparent_temperature_c": 16.2,
        "precip_probability_pct": 35,
        "freezing_level_height_m": 3100
      },
      {
        "time": "2026-04-01T15:00",
        "is_day": 1,
        "temperature_c": 18.1,
        "apparent_temperature_c": 16.5,
        "precip_probability_pct": 40,
        "freezing_level_height_m": 3000
      },
      {
        "time": "2026-04-01T18:00",
        "is_day": 0,
        "temperature_c": 15.3,
        "apparent_temperature_c": 12.8,
        "precip_probability_pct": 30,
        "freezing_level_height_m": 2700
      },
      {
        "time": "2026-04-01T21:00",
        "is_day": 0,
        "temperature_c": 13.0,
        "apparent_temperature_c": 10.1,
        "precip_probability_pct": 15,
        "freezing_level_height_m": 2500
      }
    ]
  }
}
*/

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PROVIDERS = [
  {
    name: "Cerebras",
    envKey: "CEREBRAS_API_KEY",
    url: "https://api.cerebras.ai/v1/chat/completions",
    model: "gpt-oss-120b",
    timeoutMs: 10_000,
  },
  {
    name: "Groq",
    envKey: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "moonshotai/kimi-k2-instruct-0905",
    timeoutMs: 30_000,
  },
];

function jsonResponse(body, status = 200) {
  return Response.json(body, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

async function callProvider({ url, model, apiKey, messages, timeoutMs }) {
  const fetchPromise = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
      max_completion_tokens: 3072,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" },
    }),
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${url} timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const res = await Promise.race([fetchPromise, timeoutPromise]);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty content");

  return JSON.parse(text);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { weather_data } = await request.json();
    if (!weather_data) {
      return jsonResponse({ error: "weather_data is required" }, 400);
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(weather_data) },
    ];

    const errors = [];

    for (const provider of PROVIDERS) {
      const apiKey = env[provider.envKey];
      if (!apiKey) {
        const msg = `${provider.name}: missing API key`;
        console.error(`[weather-worker] ${msg}`);
        errors.push(msg);
        continue;
      }

      try {
        const advice = await callProvider({ ...provider, apiKey, messages });
        return jsonResponse(advice);
      } catch (err) {
        const msg = `${provider.name}: ${err.message}`;
        console.error(`[weather-worker] ${msg}`);
        errors.push(msg);
      }
    }

    console.error("[weather-worker] All providers failed:", errors);
    return jsonResponse({ error: "All providers failed", details: errors }, 502);
  },
};

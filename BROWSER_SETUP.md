# Browser Control Setup

讓 Claude Code 在此沙箱環境中具備瀏覽器控制能力的完整設定說明。

## 架構概覽

```
Claude Code (agent-browser CLI)
    │  CDP (Chrome DevTools Protocol)
    ▼
Google Chrome 146 (headless)
    │  HTTP CONNECT tunnel
    ▼
proxy-relay.js (localhost:8888)      ← 補上 JWT 認證
    │  Proxy-Authorization: Basic <base64(user:jwt)>
    ▼
Anthropic Egress Gateway (21.0.0.157:15004)
    │  TLS Inspection
    ▼
Internet
```

## 環境背景

此沙箱環境的對外網路需透過 Anthropic Egress Gateway，使用 JWT 認證的 HTTP proxy：

- 環境變數 `https_proxy` / `HTTPS_PROXY` 已自動設定（含 user:jwt_token@host:port）
- JWT token 每次 session 不同，有效期約 4 小時
- `*.googleapis.com`、`*.google.com` 在 `no_proxy` 清單（繞過 proxy 直連，但環境無直接外網）

**Chrome 的限制**：Chrome 的 `--proxy-server` flag 不支援 URL 內嵌認證（`user:pass@host:port`），
收到 407 後無法自動提供憑證，導致 `ERR_INVALID_AUTH_CREDENTIALS`。

**解決方式**：在本地啟動 proxy-relay.js，讓 Chrome 連無認證的 `localhost:8888`，
由 relay 負責加上認證後轉發至真實 proxy。

---

## 安裝步驟

### 1. 安裝 agent-browser

```bash
npm install -g agent-browser
```

### 2. 安裝 Chrome

agent-browser 內建的 `agent-browser install` 因環境無法直接連 Google 伺服器而失敗，
需手動透過 proxy 下載：

```bash
# 取得最新 stable 版本的下載 URL
curl -s "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
stable = data['channels']['Stable']
print('Version:', stable['version'])
for item in stable['downloads']['chrome']:
    if item['platform'] == 'linux64':
        print('URL:', item['url'])
        break
"

# 下載 Chrome（覆蓋 no_proxy 讓 googleapis 也走 proxy）
no_proxy="" NO_PROXY="" curl \
  "https://storage.googleapis.com/chrome-for-testing-public/<VERSION>/linux64/chrome-linux64.zip" \
  -o /tmp/chrome-linux64.zip

# 解壓縮
unzip -q /tmp/chrome-linux64.zip -d /tmp/

# 建立 symlink（讓 agent-browser 自動找到）
ln -sf /tmp/chrome-linux64/chrome /usr/local/bin/google-chrome

# 驗證
google-chrome --version --no-sandbox
```

### 3. 安裝 agent-browser skills

```bash
npx skills add vercel-labs/agent-browser --yes
```

安裝後 skills 位於 `.agents/skills/`，並 symlink 到 `.claude/skills/`。

### 4. 建立 proxy-relay.js

建立 `/tmp/proxy-relay.js`：

```javascript
#!/usr/bin/env node
// Local proxy relay: Chrome -> localhost:8888 -> authenticated upstream proxy

const net = require('net');
const http = require('http');
const { URL } = require('url');

const upstreamUrl = new URL(process.env.https_proxy);
const UPSTREAM_HOST = upstreamUrl.hostname;
const UPSTREAM_PORT = parseInt(upstreamUrl.port);
const PROXY_AUTH = Buffer.from(`${upstreamUrl.username}:${upstreamUrl.password}`).toString('base64');

const server = http.createServer((req, res) => {
  const options = {
    host: UPSTREAM_HOST,
    port: UPSTREAM_PORT,
    method: req.method,
    path: req.url,
    headers: { ...req.headers, 'Proxy-Authorization': `Basic ${PROXY_AUTH}` }
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => res.end());
  req.pipe(proxyReq);
});

server.on('connect', (req, clientSocket, head) => {
  const socket = net.connect(UPSTREAM_PORT, UPSTREAM_HOST, () => {
    socket.write(
      `CONNECT ${req.url} HTTP/1.1\r\n` +
      `Proxy-Authorization: Basic ${PROXY_AUTH}\r\n` +
      `Host: ${req.url}\r\n` +
      `Proxy-Connection: Keep-Alive\r\n\r\n`
    );
    socket.once('data', (data) => {
      if (data.toString().includes('200')) {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        if (head && head.length) socket.write(head);
        socket.pipe(clientSocket);
        clientSocket.pipe(socket);
      } else {
        console.error('Upstream proxy rejected:', data.toString().split('\n')[0]);
        clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        socket.destroy();
      }
    });
  });
  socket.on('error', (e) => { console.error('Socket error:', e.message); clientSocket.end(); });
  clientSocket.on('error', () => socket.destroy());
});

server.listen(8888, '127.0.0.1', () => {
  console.log(`Proxy relay: localhost:8888 -> ${UPSTREAM_HOST}:${UPSTREAM_PORT}`);
});
```

### 5. 啟動 proxy-relay

```bash
node /tmp/proxy-relay.js &

# 驗證 relay 正常
curl -s --proxy "http://127.0.0.1:8888" "https://example.com" -o /dev/null -w "HTTP %{http_code}\n"
```

### 6. 設定 agent-browser.json（project-level）

在 repo 根目錄建立 `agent-browser.json`：

```json
{
  "proxy": "http://127.0.0.1:8888",
  "proxyBypass": "localhost,127.0.0.1"
}
```

---

## 使用方式

每次使用前需確認 relay 在執行中：

```bash
ps aux | grep proxy-relay | grep -v grep || node /tmp/proxy-relay.js &
```

### 基本指令

```bash
# 開啟網頁
agent-browser --args "--ignore-certificate-errors" open https://example.com

# 等待頁面載入完成
agent-browser wait --load networkidle

# 取得頁面元素（含 ref）
agent-browser snapshot -i

# 截圖
agent-browser screenshot /tmp/screenshot.png

# 點擊元素
agent-browser click @e1

# 填寫表單
agent-browser fill @e1 "text"

# 執行 JavaScript
agent-browser eval "document.title"

# 關閉瀏覽器
agent-browser close
```

### 注意事項

- **`--ignore-certificate-errors`**：必須加，因 Egress Gateway 做 TLS Inspection，
  使用自簽憑證，Chrome 預設不信任。
- **首次啟動較慢**：Chrome daemon 需幾秒初始化。
- **JWT 過期**：JWT token 約 4 小時後過期，relay 需重啟（會自動讀取新的 `$https_proxy`）。
- **`*.googleapis.com` 問題**：若需存取 googleapis 的資源（如下載 Chrome），
  需加 `no_proxy="" NO_PROXY=""` 強制走 proxy。

---

## 版本資訊

| 套件 | 版本 |
|------|------|
| agent-browser | 0.20.13 |
| Chrome for Testing | 146.0.7680.80 |
| Node.js | 22.22.0 |

## 已安裝 Skills

| Skill | 路徑 | 說明 |
|-------|------|------|
| agent-browser | `.agents/skills/agent-browser/` | 瀏覽器自動化 |
| dogfood | `.agents/skills/dogfood/` | QA 測試 |
| electron | `.agents/skills/electron/` | Electron 桌面 App 自動化 |
| slack | `.agents/skills/slack/` | Slack 自動化 |
| vercel-sandbox | `.agents/skills/vercel-sandbox/` | Vercel Sandbox 瀏覽器 |

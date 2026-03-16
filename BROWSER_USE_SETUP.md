# Browser-Use Setup Guide

## 1. 安裝 browser-use

```bash
uv init && uv add browser-use && uv sync
```

## 2. 安裝 Chromium

```bash
uvx browser-use install
```

## 3. 驗證安裝

```bash
browser-use --help
```

看到指令列表即代表安裝成功。

## 4. 安裝 SKILL.md 到 Claude Code

```bash
mkdir -p ~/.claude/skills/browser-use
curl -o ~/.claude/skills/browser-use/SKILL.md \
  https://raw.githubusercontent.com/browser-use/browser-use/main/skills/browser-use/SKILL.md
```

## 5. 取得 JWT Proxy

向 proxy provider 取得以下資訊：
- Proxy URL（`http://...`）
- Username
- Password

## 6. 啟動時帶上 Env Vars

```bash
BROWSER_USE_PROXY_URL=http://... \
BROWSER_USE_PROXY_USERNAME=... \
BROWSER_USE_PROXY_PASSWORD=... \
browser-use <your-command>
```

設好這三個 env vars 後，所有 CLI 指令都能透過 proxy 正常運作。

> **注意**：`session.py` **不需要手動修改**。browser-use 的 `config.py` 已內建讀取這三個 env vars 的邏輯，會自動套用到 Playwright 的 proxy 設定。

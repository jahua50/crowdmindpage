# 眾智科技 CrowdMind — 形象網站

純靜態網站（HTML / CSS / JavaScript），不需任何建置流程，可直接部署於 GitHub Pages。

```
index.html            首頁・中文（願景、使命、核心價值、未來藍圖、產品、聯絡）
en/index.html         首頁・英文（English version，網址為 /en/）
404.html              找不到頁面
assets/css/style.css  樣式
assets/js/main.js     互動效果（Hero 像素動畫、捲動淡入、行動版選單）
assets/favicon.svg    網站圖示
.nojekyll             讓 GitHub Pages 略過 Jekyll 處理
```

## 多語系

中英文各為獨立頁面，導覽列右上角的 `EN` / `中文` 按鈕互相切換。
修改內容時，請記得 **`index.html` 與 `en/index.html` 兩邊同步更新**。
兩頁共用同一份 CSS 與 JS；英文版的字級微調在 `style.css` 的 `html[lang="en"]` 區段。

## 本機預覽

```bash
python -m http.server 8000
# 開啟 http://localhost:8000
```

## 部署到 GitHub Pages

1. 建立 GitHub repository，將此資料夾推上 `main` 分支。
2. Repository → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 `main` / `(root)`。

## 連接自有網域

1. 在專案根目錄新增 `CNAME` 檔，內容只有一行網域，例如：
   ```
   www.your-domain.com.tw
   ```
2. 到網域 DNS 設定：
   - **www 子網域**：新增 `CNAME` 紀錄 `www` → `<你的 GitHub 帳號>.github.io`
   - **根網域（apex）**：新增 4 筆 `A` 紀錄指向
     `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
3. 回到 **Settings → Pages**，填入 Custom domain，DNS 生效後勾選 **Enforce HTTPS**。

## 上線前待辦

- [ ] `index.html` 與 `en/index.html` 聯絡區塊的 `mailto:contact@example.com` 改為公司正式信箱
- [ ] 確定網域後，將兩頁 `<link rel="alternate" hreflang=...>` 的 href 改為完整網址（例如 `https://www.your-domain.com.tw/en/`），Google 建議使用絕對網址
- [ ] 確認 PixelTrend、PixWeb 的產品描述與實際功能相符
- [ ] 確認公司英文名稱 `CrowdMind Technology Co., Ltd.` 是否正確
- [ ] 新增 `CNAME` 檔案

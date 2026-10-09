# 眾智科技 CrowdMind — 形象網站

純靜態網站（HTML / CSS / JavaScript），不需任何建置流程，部署於 Vercel。

```
index.html            首頁・英文（預設語言，網址為 /）
zh/index.html         首頁・中文（網址為 /zh/）
404.html              找不到頁面（英文為主，附中文）
assets/css/style.css  樣式
assets/js/main.js     互動效果（Hero 像素動畫、捲動淡入、行動版選單）
assets/favicon.svg    網站圖示
robots.txt            允許所有爬蟲（含 ClaudeBot）
vercel.json           Vercel 設定（/en/ 舊網址轉址至 /、安全標頭）
sitemap.xml           網站地圖（crowdmindtech.com）
```

## 多語系

網站預設為英文，中文版位於 `/zh/`。導覽列右上角的 `中文` / `EN` 按鈕互相切換。
修改內容時，請記得 **`index.html` 與 `zh/index.html` 兩邊同步更新**。
兩頁共用同一份 CSS 與 JS；英文版的字級微調在 `style.css` 的 `html[lang="en"]` 區段。

## 本機預覽

```bash
python -m http.server 8000
# 開啟 http://localhost:8000
```

## 部署到 Vercel

1. 在 [vercel.com](https://vercel.com) → **Add New → Project**，匯入此 GitHub repository。
2. Framework Preset 選 **Other**，Build Command 與 Output Directory 留空，按 Deploy。
3. **Settings → Domains** 加入自有網域，依畫面指示到 DNS 設定：
   - **根網域（apex）**：`A` 紀錄 `@` → `76.76.21.21`
   - **www 子網域**：`CNAME` 紀錄 `www` → `cname.vercel-dns.com`
   （以 Vercel 後台顯示的值為準）
4. 若原本使用 GitHub Pages，請到 GitHub repository **Settings → Pages** 關閉，並移除舊的 GitHub Pages DNS 紀錄（`185.199.108–111.153`）。

## 上線前待辦

- [x] 網域 crowdmindtech.com：canonical、hreflang、sitemap.xml 已設定
- [ ] 確認 PixelTrend、PixWeb 的產品描述與實際功能相符
- [ ] 確認公司英文名稱 `CrowdMind Technology Co., Ltd.` 是否正確
- [ ] 網域郵件設定 SPF、DKIM、DMARC

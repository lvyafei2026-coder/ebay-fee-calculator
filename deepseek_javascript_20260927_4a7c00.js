const fs = require('fs');
const path = require('path');

// ============================================================
// HTML 模板
// ============================================================
function buildIndexHtml(forceLang, htmlLang, canonicalPath) {
  const forceLine = forceLang
    ? `<script>window.__FORCE_LANG__ = '${forceLang}';<\/script>\n`
    : '';
  const canonical = `https://toolara.dev${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>eBay Fee Calculator — Calculate Your eBay Profit After Fees (2026)</title>
<meta name="description" content="Free eBay fee calculator. Enter your sale price, shipping, and item cost to see exactly how much you keep after eBay's final value fee and payment processing.">
<meta name="keywords" content="ebay fee calculator, ebay profit calculator, ebay fees 2026, how much does ebay take, ebay seller fees, ebay final value fee">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#0064D2">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="https://toolara.dev/ebay-fee-calculator/">
<link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/ebay-fee-calculator/zh/">
<link rel="alternate" hreflang="x-default" href="https://toolara.dev/ebay-fee-calculator/">

<meta property="og:type" content="website">
<meta property="og:title" content="eBay Fee Calculator — Calculate Your eBay Profit After Fees">
<meta property="og:description" content="See exactly how much you keep after eBay's final value fee and payment processing.">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "eBay Fee Calculator",
  "url": "${canonical}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "description": "Free calculator that shows exactly how much an eBay seller keeps after all fees.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
<\/script>

${forceLine}<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="hero">
  <div class="lang-switch">
    <select id="langSelect" onchange="setLang(this.value)" aria-label="Language">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
    </select>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">🛒 eBay Seller Tool</div>
    <h1 data-i18n="title">eBay Fee Calculator</h1>
    <p data-i18n="subtitle">See exactly how much you keep after eBay's final value fee, insertion fee, and payment processing.</p>
  </div>
</header>

<main class="wrap">
  <section class="card">
    <h2 class="visually-hidden" data-i18n="calcHeading">Calculator</h2>

    <div class="row">
      <div>
        <label for="price" data-i18n="priceLabel">Sale price ($)</label>
        <input type="number" id="price" min="0" step="0.01" placeholder="50.00" value="50" inputmode="decimal">
      </div>
      <div>
        <label for="shipping" data-i18n="shippingLabel">Shipping charged ($)</label>
        <input type="number" id="shipping" min="0" step="0.01" placeholder="8.00" value="8" inputmode="decimal">
      </div>
    </div>

    <div class="row">
      <div>
        <label for="itemCost" data-i18n="itemCostLabel">Item cost ($)</label>
        <input type="number" id="itemCost" min="0" step="0.01" placeholder="20.00" value="20" inputmode="decimal">
      </div>
      <div>
        <label for="shipCost" data-i18n="shipCostLabel">Your shipping cost ($)</label>
        <input type="number" id="shipCost" min="0" step="0.01" placeholder="7.00" value="7" inputmode="decimal">
      </div>
    </div>

    <label for="category" data-i18n="categoryLabel">Category</label>
    <select id="category">
      <option value="most" selected data-i18n="catMost">Most categories (13.6%)</option>
      <option value="books" data-i18n="catBooks">Books, DVDs, Music (14.6%)</option>
      <option value="clothing" data-i18n="catClothing">Clothing &amp; Accessories (13.6%)</option>
      <option value="electronics" data-i18n="catElectronics">Consumer Electronics (13.6%)</option>
      <option value="collectibles" data-i18n="catCollectibles">Collectibles (13.6%)</option>
      <option value="jewelry" data-i18n="catJewelry">Jewelry &amp; Watches (15.0%)</option>
      <option value="heavy" data-i18n="catHeavy">Heavy Equipment (9.0%)</option>
    </select>

    <details class="advanced">
      <summary data-i18n="advancedLabel">Advanced fee settings</summary>
      <div class="row">
        <div>
          <label for="insertionFee" data-i18n="insertionLabel">Insertion fee ($)</label>
          <input type="number" id="insertionFee" min="0" step="0.01" value="0.00" inputmode="decimal">
        </div>
        <div>
          <label for="promotedPct" data-i18n="promotedLabel">Promoted listings (%)</label>
          <input type="number" id="promotedPct" min="0" step="0.1" value="0" inputmode="decimal">
        </div>
      </div>
      <div class="row">
        <div>
          <label for="storeFee" data-i18n="storeLabel">Store subscription ($)</label>
          <input type="number" id="storeFee" min="0" step="0.01" value="0" inputmode="decimal">
        </div>
        <div>
          <label for="payPct" data-i18n="payPctLabel">Payment processing (%)</label>
          <input type="number" id="payPct" min="0" step="0.1" value="0" inputmode="decimal">
        </div>
      </div>
      <p class="hint" data-i18n="advancedHint">eBay's final value fee already includes payment processing in most markets. Leave payment processing at 0 unless you're on a legacy managed payments plan.</p>
    </details>

    <button class="calc" type="button" onclick="calculate()" data-i18n="calcBtn">Calculate profit</button>

    <div id="result" role="region" aria-live="polite">
      <div class="result-label" data-i18n="resultLabel">Net profit</div>
      <div class="net-profit" id="netProfit">—</div>
      <div class="margin-note" id="marginNote"></div>

      <div class="breakdown">
        <div class="bd-row"><span data-i18n="bdRevenue">Total revenue</span><strong id="bdRevenue">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdInsertion">Insertion fee</span><strong id="bdInsertion">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdFvf">Final value fee</span><strong id="bdFvf">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdPromoted">Promoted listings</span><strong id="bdPromoted">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdPay">Payment processing</span><strong id="bdPay">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdStore">Store subscription</span><strong id="bdStore">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdTotalFees">Total eBay fees</span><strong id="bdTotalFees">—</strong></div>
        <div class="bd-divider"></div>
        <div class="bd-row"><span data-i18n="bdItemCost">Item cost</span><strong id="bdItemCost">—</strong></div>
        <div class="bd-row"><span data-i18n="bdShipCost">Your shipping cost</span><strong id="bdShipCost">—</strong></div>
        <div class="bd-divider"></div>
        <div class="bd-row bd-total"><span data-i18n="bdNet">Net profit</span><strong id="bdNet">—</strong></div>
      </div>

      <div class="share-row">
        <button class="share-btn" type="button" onclick="copyShareLink()" data-i18n="shareBtn">Copy shareable link</button>
        <span class="share-copied" id="shareCopied" data-i18n="shareCopied">Copied!</span>
      </div>

      <div class="result-disclaimer" data-i18n="resultDisclaimer">Estimate only. eBay fees may vary by category, seller level, and market. Verify current fees on eBay's official Seller Center.</div>
    </div>
  </section>

  <section>
    <h2 data-i18n="whatIsTitle">How eBay fees work</h2>
    <p data-i18n="whatIsText">eBay charges sellers a final value fee on every sale, which is a percentage of the total sale amount including shipping and taxes. Most categories use a flat rate (around 13.6%), but some have different rates or tiered structures. Optional fees include insertion fees for listings beyond your free allotment, promoted listings, and store subscriptions.</p>
  </section>

  <section>
    <h2 data-i18n="feesTitle">Current eBay fees (2026)</h2>
    <table>
      <thead>
        <tr><th data-i18n="thFee">Fee</th><th data-i18n="thAmount">Amount</th></tr>
      </thead>
      <tbody>
        <tr><td data-i18n="feeInsertion">Insertion fee</td><td data-i18n="feeInsertionAmt">First 250 listings/month free, then $0.35 per listing</td></tr>
        <tr><td data-i18n="feeFvf">Final value fee</td><td data-i18n="feeFvfAmt">~13.6% of total sale (most categories)</td></tr>
        <tr><td data-i18n="feeBooks">Books, DVDs, Music</td><td data-i18n="feeBooksAmt">~14.6%</td></tr>
        <tr><td data-i18n="feeJewelry">Jewelry &amp; Watches</td><td data-i18n="feeJewelryAmt">~15.0%</td></tr>
        <tr><td data-i18n="feeHeavy">Heavy Equipment</td><td data-i18n="feeHeavyAmt">~9.0%</td></tr>
        <tr><td data-i18n="feePromoted">Promoted listings</td><td data-i18n="feePromotedAmt">Your chosen ad rate (typically 2-20%)</td></tr>
      </tbody>
    </table>
    <p data-i18n="feesNote">The final value fee includes payment processing in most markets. Sellers with a store subscription pay lower final value fees but a monthly store fee.</p>
  </section>

  <section>
    <h2 data-i18n="howToTitle">How to use this calculator</h2>
    <ol>
      <li data-i18n="howTo1">Enter your sale price — what the buyer pays for the item.</li>
      <li data-i18n="howTo2">Enter shipping charged — what the buyer pays for shipping (enter 0 if free shipping).</li>
      <li data-i18n="howTo3">Enter your item cost — what you paid for the item or materials.</li>
      <li data-i18n="howTo4">Enter your shipping cost — what you actually pay the carrier.</li>
      <li data-i18n="howTo5">Select your category to apply the correct final value fee rate.</li>
      <li data-i18n="howTo6">Click "Calculate profit" to see your true take-home amount.</li>
    </ol>
  </section>

  <section>
    <h2 data-i18n="faqTitle">Frequently asked questions</h2>
    <h3 data-i18n="faq1q">How much does eBay take per sale?</h3>
    <p data-i18n="faq1a">On a typical $50 sale with $8 shipping (most categories), eBay takes approximately: $6.80 final value fee (13.6% of $50) + $1.09 final value fee on shipping (13.6% of $8) = <strong>$7.89 total</strong>. You keep $50.11 before your own costs.</p>

    <h3 data-i18n="faq2q">Does eBay charge fees on shipping?</h3>
    <p data-i18n="faq2a">Yes. eBay's final value fee applies to the total sale amount including shipping charges and sales tax. If you charge $8 for shipping, eBay takes approximately 13.6% of that $8 too.</p>

    <h3 data-i18n="faq3q">What is the difference between insertion fee and final value fee?</h3>
    <p data-i18n="faq3a">The insertion fee is charged when you create a listing (first 250/month are free). The final value fee is charged only when the item sells. Both are deducted from your payout.</p>

    <h3 data-i18n="faq4q">Is it worth having an eBay store subscription?</h3>
    <p data-i18n="faq4a">If you sell more than 50 items per month or want lower final value fees, a Basic Store subscription ($21.95/month) usually pays for itself. Store subscribers get 1,000 free listings/month and slightly lower final value fees in some categories.</p>

    <h3 data-i18n="faq5q">How do I price my eBay items to make a profit?</h3>
    <p data-i18n="faq5a">A common formula: (Item cost + Shipping cost) ÷ (1 - 0.14) × 1.5. This assumes eBay takes about 14% in fees and you want a 33% profit margin. For an item costing $20 with $7 shipping: ($27 ÷ 0.86) × 1.5 = <strong>$47.09 minimum sale price</strong>.</p>

    <div class="disclaimer" data-i18n="disclaimer"><strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. eBay's fee structure varies by category, seller level, and market. Always verify current fees in eBay's official Seller Center before making pricing decisions.</div>
  </section>

  <section>
    <h2 data-i18n="moreToolsTitle">More seller fee calculators</h2>
    <p data-i18n="moreToolsText">Try our Etsy Fee Calculator and PayPal Fee Calculator, or check back for Amazon FBA and Depop fee calculators.</p>
  </section>
</main>

<footer class="footer" data-i18n="footer">Runs entirely in your browser. No data is collected or stored.</footer>

<script src="js/i18n.js"><\/script>
<script src="js/calculator.js"><\/script>
</body>
</html>`;
}

// ============================================================
// CSS — eBay 品牌蓝
// ============================================================
const STYLE_CSS = `:root {
  --bg: #f5f9fd; --card: #ffffff; --text: #0f1c2e; --muted: #64748b;
  --accent: #0064D2; --accent-dark: #0050a8; --red: #E53238; --yellow: #F5AF02;
  --border: #d8e8f5; --radius: 14px;
  --shadow: 0 1px 3px rgba(15,28,46,0.05), 0 8px 24px rgba(0,100,210,0.08);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  padding: 64px 20px 96px;
  background:
    radial-gradient(circle at 20% 20%, rgba(229,50,56,0.30) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(245,175,2,0.28) 0%, transparent 55%),
    linear-gradient(135deg, #003b7a 0%, #0050a8 50%, #0064D2 100%);
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  opacity: 0.6;
  pointer-events: none;
}
.hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; text-align: center; }
.hero-badge {
  display: inline-block;
  background: rgba(245,175,2,0.20);
  border: 1px solid rgba(245,175,2,0.50);
  color: #F5AF02;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
}
.hero h1 { font-size: 2.1rem; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.02em; }
.hero p { margin: 0 auto; opacity: 0.92; font-size: 1rem; max-width: 560px; }

/* Lang switcher */
.lang-switch { position: absolute; top: 16px; right: 16px; z-index: 3; }
.lang-switch select {
  appearance: none; -webkit-appearance: none;
  background-color: rgba(255,255,255,0.15);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; padding: 7px 32px 7px 12px; border-radius: 8px;
  font-size: 0.85rem; font-family: inherit; cursor: pointer;
}
.lang-switch select:hover { background-color: rgba(255,255,255,0.28); }
.lang-switch select option { color: #0f1c2e; background: #fff; }

/* Layout */
.wrap { max-width: 720px; margin: -56px auto 0; padding: 0 20px 64px; position: relative; z-index: 2; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 22px; box-shadow: var(--shadow); }

label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
input, select { width: 100%; padding: 11px 13px; border: 1px solid #cbd5e1; border-radius: 9px; font-size: 1rem; margin-bottom: 18px; background: #fff; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,100,210,0.15); }
.row { display: flex; gap: 14px; }
.row > div { flex: 1; }
button.calc { width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit; }
button.calc:hover { background: var(--accent-dark); }
button.calc:active { transform: scale(0.99); }

.advanced { margin-bottom: 18px; }
.advanced summary { cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--accent); padding: 8px 0; user-select: none; }
.advanced summary:hover { color: var(--accent-dark); }
.advanced[open] summary { margin-bottom: 8px; }
.hint { font-size: 0.8rem; color: var(--muted); margin: -12px 0 16px; }

/* Result */
#result { margin-top: 24px; padding: 24px; border-radius: 14px; background: linear-gradient(135deg, #eaf4fd 0%, #f5f9fd 100%); border: 2px solid var(--accent); display: none; animation: fadeIn 0.35s ease; }
#result.show { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.result-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
.net-profit { font-size: 3rem; font-weight: 800; color: #003b7a; line-height: 1; letter-spacing: -0.02em; }
.net-profit.negative { color: var(--red); }
.margin-note { font-size: 0.9rem; color: var(--accent-dark); margin-top: 8px; font-weight: 600; }
.breakdown { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(0,100,210,0.20); }
.bd-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 0.9rem; color: #0f1c2e; }
.bd-row strong { color: #003b7a; font-weight: 600; }
.bd-sub { padding-left: 14px; font-size: 0.85rem; color: var(--muted); }
.bd-sub strong { color: var(--muted); font-weight: 500; }
.bd-divider { height: 1px; background: rgba(0,100,210,0.18); margin: 10px 0; }
.bd-total { font-size: 1rem; padding-top: 6px; }
.bd-total strong { color: var(--accent); font-size: 1.15rem; }

/* Share */
.share-row { margin-top: 18px; display: flex; align-items: center; gap: 12px; }
.share-btn { padding: 9px 16px; background: #fff; border: 1px solid var(--accent); color: var(--accent); border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.share-btn:hover { background: #eaf4fd; }
.share-copied { font-size: 0.85rem; color: #059669; font-weight: 600; opacity: 0; transition: opacity 0.25s; }
.share-copied.show { opacity: 1; }

.result-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,100,210,0.15); font-size: 0.78rem; color: var(--muted); }

/* Content */
h2 { font-size: 1.25rem; margin: 36px 0 12px; letter-spacing: -0.01em; }
h3 { font-size: 1rem; margin: 22px 0 6px; }
p { margin: 0 0 14px; }
ul, ol { margin: 0 0 16px; padding-left: 22px; }
li { margin-bottom: 8px; line-height: 1.65; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 14px 0; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); }
th { background: #eaf4fd; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent); }
tr:last-child td { border-bottom: none; }
.disclaimer { font-size: 0.85rem; color: var(--muted); border-left: 3px solid var(--accent); padding: 4px 0 4px 14px; margin-top: 18px; }
.footer { text-align: center; font-size: 0.8rem; color: var(--muted); padding: 24px 20px 48px; }

@media (max-width: 560px) {
  .hero { padding: 48px 16px 80px; }
  .hero h1 { font-size: 1.5rem; }
  .lang-switch { position: static; display: flex; justify-content: center; margin-bottom: 16px; }
  .wrap { padding: 0 14px 48px; }
  .card { padding: 20px; }
  .row { flex-direction: column; gap: 0; }
  .net-profit { font-size: 2.3rem; }
}`;

// ============================================================
// i18n.js
// ============================================================
const I18N_JS = `const SUPPORTED_LANGS = ['en','zh'];
const DEFAULT_LANG = 'en';
const MARKER = '/ebay-fee-calculator';

const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/' };
const SEG_TO_LANG = { 'zh':'zh' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function getBase() {
  const p = window.location.pathname;
  const idx = p.indexOf(MARKER);
  if (idx !== -1) return p.slice(0, idx + MARKER.length);
  return '';
}

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const p = window.location.pathname;
  const base = getBase();
  const rest = base ? p.slice(base.length) : p;
  const segs = rest.split('/').filter(Boolean);
  if (segs.length > 0) {
    const first = segs[0].toLowerCase();
    if (SEG_TO_LANG[first]) return SEG_TO_LANG[first];
  }
  return DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const base = getBase();
  const res = await fetch(base + '/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed to load locale: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (key === 'disclaimer') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

async function initPage() {
  const lang = detectPageLang();
  try { translations = await loadLocale(lang); }
  catch (err) { console.error(err); return; }
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
  applyTranslations(translations);
  const select = document.getElementById('langSelect');
  if (select) select.value = lang;
  window.__i18n = { t: translations, lang: currentLang };
  if (typeof readUrlParams === 'function') readUrlParams();
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const base = getBase();
  window.location.href = base + (LANG_TO_PATH[lang] || '/');
}

document.addEventListener('DOMContentLoaded', initPage);`;

// ============================================================
// calculator.js
// ============================================================
const CALCULATOR_JS = `function t() { return (window.__i18n && window.__i18n.t) || {}; }

const CATEGORY_RATES = {
  most: 0.136,
  books: 0.146,
  clothing: 0.136,
  electronics: 0.136,
  collectibles: 0.136,
  jewelry: 0.150,
  heavy: 0.090
};

function fmt(n) {
  if (!isFinite(n)) return '—';
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toFixed(2);
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  ['price','shipping','itemCost','shipCost'].forEach(id => {
    if (params.has(id)) {
      const el = document.getElementById(id);
      if (el) el.value = params.get(id);
    }
  });
  if (params.has('category')) document.getElementById('category').value = params.get('category');
  if (params.has('price') || params.has('shipping') || params.has('itemCost')) calculate();
}

function buildShareUrl() {
  const params = new URLSearchParams();
  ['price','shipping','itemCost','shipCost'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value) params.set(id, el.value);
  });
  const cat = document.getElementById('category').value;
  if (cat !== 'most') params.set('category', cat);
  const base = window.location.origin + window.location.pathname;
  return base + '?' + params.toString();
}

function copyShareLink() {
  const url = buildShareUrl();
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }).catch(() => { prompt('Copy this link:', url); });
}

function calculate() {
  const tr = t();
  const price = parseFloat(document.getElementById('price').value) || 0;
  const shipping = parseFloat(document.getElementById('shipping').value) || 0;
  const itemCost = parseFloat(document.getElementById('itemCost').value) || 0;
  const shipCost = parseFloat(document.getElementById('shipCost').value) || 0;
  const category = document.getElementById('category').value;

  const insertionFee = parseFloat(document.getElementById('insertionFee').value) || 0;
  const promotedPct = parseFloat(document.getElementById('promotedPct').value) || 0;
  const storeFee = parseFloat(document.getElementById('storeFee').value) || 0;
  const payPct = parseFloat(document.getElementById('payPct').value) || 0;

  const rate = CATEGORY_RATES[category] || 0.136;
  const revenue = price + shipping;

  const fvfFee = revenue * rate;
  const promotedFee = revenue * (promotedPct / 100);
  const payFee = revenue * (payPct / 100);
  const totalFees = insertionFee + fvfFee + promotedFee + payFee + storeFee;

  const net = revenue - totalFees - itemCost - shipCost;
  const margin = revenue > 0 ? (net / revenue * 100) : 0;

  const netEl = document.getElementById('netProfit');
  netEl.textContent = fmt(net);
  netEl.classList.toggle('negative', net < 0);

  const marginNote = document.getElementById('marginNote');
  if (net < 0) {
    marginNote.textContent = (tr.marginLoss || 'You are losing money on this sale.') + ' (' + margin.toFixed(1) + '%)';
    marginNote.style.color = '#E53238';
  } else {
    marginNote.textContent = (tr.marginProfit || 'Profit margin:') + ' ' + margin.toFixed(1) + '%';
    marginNote.style.color = '';
  }

  document.getElementById('bdRevenue').textContent = fmt(revenue);
  document.getElementById('bdInsertion').textContent = '-' + fmt(insertionFee);
  document.getElementById('bdFvf').textContent = '-' + fmt(fvfFee);
  document.getElementById('bdPromoted').textContent = '-' + fmt(promotedFee);
  document.getElementById('bdPay').textContent = '-' + fmt(payFee);
  document.getElementById('bdStore').textContent = '-' + fmt(storeFee);
  document.getElementById('bdTotalFees').textContent = '-' + fmt(totalFees);
  document.getElementById('bdItemCost').textContent = '-' + fmt(itemCost);
  document.getElementById('bdShipCost').textContent = '-' + fmt(shipCost);
  document.getElementById('bdNet').textContent = fmt(net);

  document.getElementById('result').classList.add('show');
}

window.calculate = calculate;
window.copyShareLink = copyShareLink;
window.readUrlParams = readUrlParams;

document.addEventListener('DOMContentLoaded', function() {
  ['price','shipping','itemCost','shipCost','insertionFee','promotedPct','storeFee','payPct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculate);
  });
  const cat = document.getElementById('category');
  if (cat) cat.addEventListener('change', calculate);
});`;

// ============================================================
// Locales
// ============================================================
const LOCALES = {
  'en': {
    title: "eBay Fee Calculator",
    subtitle: "See exactly how much you keep after eBay's final value fee, insertion fee, and payment processing.",
    calcHeading: "Calculator",
    priceLabel: "Sale price ($)",
    shippingLabel: "Shipping charged ($)",
    itemCostLabel: "Item cost ($)",
    shipCostLabel: "Your shipping cost ($)",
    categoryLabel: "Category",
    catMost: "Most categories (13.6%)",
    catBooks: "Books, DVDs, Music (14.6%)",
    catClothing: "Clothing & Accessories (13.6%)",
    catElectronics: "Consumer Electronics (13.6%)",
    catCollectibles: "Collectibles (13.6%)",
    catJewelry: "Jewelry & Watches (15.0%)",
    catHeavy: "Heavy Equipment (9.0%)",
    advancedLabel: "Advanced fee settings",
    insertionLabel: "Insertion fee ($)",
    promotedLabel: "Promoted listings (%)",
    storeLabel: "Store subscription ($)",
    payPctLabel: "Payment processing (%)",
    advancedHint: "eBay's final value fee already includes payment processing in most markets. Leave payment processing at 0 unless you're on a legacy managed payments plan.",
    calcBtn: "Calculate profit",
    resultLabel: "Net profit",
    marginProfit: "Profit margin:",
    marginLoss: "You are losing money on this sale.",
    bdRevenue: "Total revenue",
    bdInsertion: "Insertion fee",
    bdFvf: "Final value fee",
    bdPromoted: "Promoted listings",
    bdPay: "Payment processing",
    bdStore: "Store subscription",
    bdTotalFees: "Total eBay fees",
    bdItemCost: "Item cost",
    bdShipCost: "Your shipping cost",
    bdNet: "Net profit",
    shareBtn: "Copy shareable link",
    shareCopied: "Copied!",
    resultDisclaimer: "Estimate only. eBay fees may vary by category, seller level, and market. Verify current fees on eBay's official Seller Center.",
    whatIsTitle: "How eBay fees work",
    whatIsText: "eBay charges sellers a final value fee on every sale, which is a percentage of the total sale amount including shipping and taxes. Most categories use a flat rate (around 13.6%), but some have different rates or tiered structures. Optional fees include insertion fees for listings beyond your free allotment, promoted listings, and store subscriptions.",
    feesTitle: "Current eBay fees (2026)",
    thFee: "Fee", thAmount: "Amount",
    feeInsertion: "Insertion fee", feeInsertionAmt: "First 250 listings/month free, then $0.35 per listing",
    feeFvf: "Final value fee", feeFvfAmt: "~13.6% of total sale (most categories)",
    feeBooks: "Books, DVDs, Music", feeBooksAmt: "~14.6%",
    feeJewelry: "Jewelry & Watches", feeJewelryAmt: "~15.0%",
    feeHeavy: "Heavy Equipment", feeHeavyAmt: "~9.0%",
    feePromoted: "Promoted listings", feePromotedAmt: "Your chosen ad rate (typically 2-20%)",
    feesNote: "The final value fee includes payment processing in most markets. Sellers with a store subscription pay lower final value fees but a monthly store fee.",
    howToTitle: "How to use this calculator",
    howTo1: "Enter your sale price — what the buyer pays for the item.",
    howTo2: "Enter shipping charged — what the buyer pays for shipping (enter 0 if free shipping).",
    howTo3: "Enter your item cost — what you paid for the item or materials.",
    howTo4: "Enter your shipping cost — what you actually pay the carrier.",
    howTo5: "Select your category to apply the correct final value fee rate.",
    howTo6: "Click \"Calculate profit\" to see your true take-home amount.",
    faqTitle: "Frequently asked questions",
    faq1q: "How much does eBay take per sale?",
    faq1a: "On a typical $50 sale with $8 shipping (most categories), eBay takes approximately: $6.80 final value fee (13.6% of $50) + $1.09 final value fee on shipping (13.6% of $8) = $7.89 total. You keep $50.11 before your own costs.",
    faq2q: "Does eBay charge fees on shipping?",
    faq2a: "Yes. eBay's final value fee applies to the total sale amount including shipping charges and sales tax. If you charge $8 for shipping, eBay takes approximately 13.6% of that $8 too.",
    faq3q: "What is the difference between insertion fee and final value fee?",
    faq3a: "The insertion fee is charged when you create a listing (first 250/month are free). The final value fee is charged only when the item sells. Both are deducted from your payout.",
    faq4q: "Is it worth having an eBay store subscription?",
    faq4a: "If you sell more than 50 items per month or want lower final value fees, a Basic Store subscription ($21.95/month) usually pays for itself. Store subscribers get 1,000 free listings/month and slightly lower final value fees in some categories.",
    faq5q: "How do I price my eBay items to make a profit?",
    faq5a: "A common formula: (Item cost + Shipping cost) ÷ (1 - 0.14) × 1.5. This assumes eBay takes about 14% in fees and you want a 33% profit margin. For an item costing $20 with $7 shipping: ($27 ÷ 0.86) × 1.5 = $47.09 minimum sale price.",
    disclaimer: "<strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. eBay's fee structure varies by category, seller level, and market. Always verify current fees in eBay's official Seller Center before making pricing decisions.",
    moreToolsTitle: "More seller fee calculators",
    moreToolsText: "Try our Etsy Fee Calculator and PayPal Fee Calculator, or check back for Amazon FBA and Depop fee calculators.",
    footer: "Runs entirely in your browser. No data is collected or stored."
  },
  'zh': {
    title: "eBay 费用计算器",
    subtitle: "看看扣除 eBay 的最终价值费、刊登费和支付处理费之后，你实际到手多少钱。",
    calcHeading: "计算器",
    priceLabel: "商品售价（美元）",
    shippingLabel: "向买家收取的运费（美元）",
    itemCostLabel: "商品成本（美元）",
    shipCostLabel: "你的实际运费成本（美元）",
    categoryLabel: "商品分类",
    catMost: "大部分分类（13.6%）",
    catBooks: "图书、DVD、音乐（14.6%）",
    catClothing: "服装配饰（13.6%）",
    catElectronics: "消费电子（13.6%）",
    catCollectibles: "收藏品（13.6%）",
    catJewelry: "珠宝腕表（15.0%）",
    catHeavy: "重型设备（9.0%）",
    advancedLabel: "高级费用设置",
    insertionLabel: "刊登费（美元）",
    promotedLabel: "推广刊登（%）",
    storeLabel: "店铺订阅费（美元）",
    payPctLabel: "支付处理费（%）",
    advancedHint: "在多数市场，eBay 的最终价值费已包含支付处理费。除非你使用的是旧版管理支付方案，否则支付处理费保持为 0。",
    calcBtn: "计算利润",
    resultLabel: "净利润",
    marginProfit: "利润率：",
    marginLoss: "这笔交易你正在亏钱。",
    bdRevenue: "总收入",
    bdInsertion: "刊登费",
    bdFvf: "最终价值费",
    bdPromoted: "推广刊登费",
    bdPay: "支付处理费",
    bdStore: "店铺订阅费",
    bdTotalFees: "eBay 总费用",
    bdItemCost: "商品成本",
    bdShipCost: "你的运费成本",
    bdNet: "净利润",
    shareBtn: "复制分享链接",
    shareCopied: "已复制！",
    resultDisclaimer: "仅为估算值。eBay 费用因分类、卖家等级和市场而异。请在 eBay 官方卖家中心确认当前费用。",
    whatIsTitle: "eBay 费用如何构成",
    whatIsText: "eBay 对每笔交易收取最终价值费，按包含运费和税费在内的总销售额百分比计算。大部分分类采用固定费率（约 13.6%），部分分类费率不同或采用阶梯结构。可选费用包括超出免费额度的刊登费、推广刊登费和店铺订阅费。",
    feesTitle: "当前 eBay 费用（2026 年）",
    thFee: "费用", thAmount: "金额",
    feeInsertion: "刊登费", feeInsertionAmt: "每月前 250 个刊登免费，之后每个 0.35 美元",
    feeFvf: "最终价值费", feeFvfAmt: "总销售额的约 13.6%（大部分分类）",
    feeBooks: "图书、DVD、音乐", feeBooksAmt: "约 14.6%",
    feeJewelry: "珠宝腕表", feeJewelryAmt: "约 15.0%",
    feeHeavy: "重型设备", feeHeavyAmt: "约 9.0%",
    feePromoted: "推广刊登", feePromotedAmt: "你设定的广告费率（通常 2-20%）",
    feesNote: "在多数市场，最终价值费已包含支付处理费。有店铺订阅的卖家享受更低的最终价值费，但需支付月费。",
    howToTitle: "如何使用本计算器",
    howTo1: "输入商品售价——买家为商品支付的价格。",
    howTo2: "输入向买家收取的运费（免运费填 0）。",
    howTo3: "输入商品成本——你为商品或材料支付的费用。",
    howTo4: "输入你的实际运费成本——你实际支付给承运商的费用。",
    howTo5: "选择商品分类，应用正确的最终价值费率。",
    howTo6: "点击“计算利润”，查看你真正到手的金额。",
    faqTitle: "常见问题",
    faq1q: "eBay 每笔交易收取多少费用？",
    faq1a: "以一笔 50 美元商品 + 8 美元运费的典型交易（大部分分类）为例，eBay 大约收取：6.80 美元最终价值费（50 美元的 13.6%）+ 1.09 美元运费最终价值费（8 美元的 13.6%）= 总计 7.89 美元。在扣除你自己的成本前，你到手 50.11 美元。",
    faq2q: "eBay 对运费也收费吗？",
    faq2a: "是的。eBay 的最终价值费按总销售额计算，包含运费和销售税。如果你收取 8 美元运费，eBay 也会从这 8 美元中抽走约 13.6%。",
    faq3q: "刊登费和最终价值费有什么区别？",
    faq3q2: "",
    faq3a: "刊登费在你创建刊登时收取（每月前 250 个免费）。最终价值费仅在商品售出时收取。两者都会从你的收款中扣除。",
    faq4q: "开通 eBay 店铺订阅值得吗？",
    faq4a: "如果你每月销售超过 50 件商品，或希望享受更低的最终价值费，基础店铺订阅（每月 21.95 美元）通常能回本。店铺订阅者每月可享受 1,000 个免费刊登，部分分类的最终价值费也略低。",
    faq5q: "如何定价才能保证 eBay 有利润？",
    faq5a: "常用公式：（商品成本 + 运费成本）÷ (1 - 0.14) × 1.5。这假设 eBay 收取约 14% 的费用，而你想要 33% 的利润率。对于成本 20 美元、运费 7 美元的商品：（27 ÷ 0.86）× 1.5 = 最低售价 47.09 美元。",
    disclaimer: "<strong>免责声明：</strong>本计算器仅供教育目的提供估算。eBay 的费用结构因分类、卖家等级和市场而异。在做定价决策前，请务必在 eBay 官方卖家中心确认当前费用。",
    moreToolsTitle: "更多卖家费用计算器",
    moreToolsText: "试试我们的 Etsy 费用计算器和 PayPal 费用计算器，或等待 Amazon FBA 和 Depop 费用计算器上线。",
    footer: "完全在您的浏览器中运行。不收集、不存储任何数据。"
  }
};

// ============================================================
// 生成文件
// ============================================================
const files = {};

files['index.html'] = buildIndexHtml(null, 'en', '/ebay-fee-calculator/');
files['zh/index.html'] = buildIndexHtml('zh', 'zh-Hans', '/ebay-fee-calculator/zh/');

files['css/style.css'] = STYLE_CSS;
files['js/i18n.js'] = I18N_JS;
files['js/calculator.js'] = CALCULATOR_JS;

for (const [lang, data] of Object.entries(LOCALES)) {
  files[`locales/${lang}.json`] = JSON.stringify(data, null, 2);
}

files['.gitignore'] = `node_modules/
.wrangler/
.dev.vars
.DS_Store
*.log
.vscode/
.idea/
dist/
build/
`;

// ============================================================
// 写入
// ============================================================
const root = '.';
let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created: ' + filePath);
  count++;
}
console.log(`\nDone. ${count} files generated.`);
console.log('\nNext steps:');
console.log('  1. git init && git add . && git commit -m "Initial: eBay fee calculator"');
console.log('  2. Push to a new GitHub repo "ebay-fee-calculator"');
console.log('  3. Deploy as a new Cloudflare Worker');
console.log('  4. In tool-proxy/src/index.js PROXY_MAP, add:');
console.log('     \'/ebay-fee-calculator\': \'https://ebay-fee-calculator.lvyafei2026.workers.dev\'');
console.log('  5. In tool-proxy/wrangler.toml run_worker_first, add:');
console.log('     "/ebay-fee-calculator/*"');
console.log('  6. In Cloudflare tool-proxy Domains & Routes, add:');
console.log('     toolara.dev/ebay-fee-calculator/*');
console.log('     www.toolara.dev/ebay-fee-calculator/*');
console.log('  7. Update tool-proxy/public/sitemap.xml and index.html');
function t() { return (window.__i18n && window.__i18n.t) || {}; }

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
});
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node generate.js <data.json> <output.pdf>');
  process.exit(1);
}
const [dataPath, outPath] = args;
const data = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf8'));
let template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf8');

// Helper functions for new sections
// Weekly Sales Report
function renderWeeklyReport(data) {
  if (!data.weekly) return '';
  const week = data.weekly;
  const dailyRows = week.dailyBreakdown.map(d => `<tr><td>${d.date}</td><td>${d.orders}</td><td>${formatCurrency(d.revenue)}</td><td>${d.topProduct}</td></tr>`).join('');
  const topRows = week.topProducts.map(p => `<tr><td>${p.rank}</td><td>${p.name}</td><td>${p.quantity}</td><td>${formatCurrency(p.revenue)}</td></tr>`).join('');
  return `
    <section style='margin-top:18px'>
      <h2 style='font-size:15px;margin-bottom:8px'>WEEKLY SALES PERFORMANCE REPORT</h2>
      <div><strong>Week:</strong> ${week.period}</div>
      <div class='summary'>
        <div class='item'>Total Orders<br><strong>${week.totalOrders}</strong></div>
        <div class='item'>Total Revenue<br><strong>${formatCurrency(week.totalRevenue)}</strong></div>
        <div class='item'>Total Profit<br><strong>${formatCurrency(week.totalProfit)}</strong></div>
      </div>
      <h3>DAILY BREAKDOWN</h3>
      <table><thead><tr><th>Date</th><th>Orders</th><th>Revenue</th><th>Top Product</th></tr></thead><tbody>${dailyRows}</tbody></table>
      <h3>WEEKLY TOP PRODUCTS</h3>
      <table><thead><tr><th>Rank</th><th>Product Name</th><th>Quantity</th><th>Revenue</th></tr></thead><tbody>${topRows}</tbody></table>
      <h3>PAYMENT TREND THIS WEEK</h3>
      <div>UPI Orders: <strong>${week.upiOrders}</strong> | COD Orders: <strong>${week.codOrders}</strong> | UPI Revenue: <strong>${formatCurrency(week.upiRevenue)}</strong> | COD Revenue: <strong>${formatCurrency(week.codRevenue)}</strong></div>
      <h3>WEEKLY OBSERVATIONS</h3>
      <ul><li>Highest Sales Day: <strong>${week.highestSalesDay}</strong></li><li>Lowest Sales Day: <strong>${week.lowestSalesDay}</strong></li><li>Performance Status: <strong>${week.performanceStatus}</strong></li></ul>
    </section>
  `;
}

// Yearly Sales Report
function renderYearlyReport(data) {
  if (!data.yearly) return '';
  const year = data.yearly;
  const quarterRows = year.quarterlyBreakdown.map(q => `<tr><td>${q.quarter}</td><td>${formatCurrency(q.revenue)}</td><td>${q.orders}</td><td>${q.growth}</td></tr>`).join('');
  const topRows = year.topProducts.map(p => `<tr><td>${p.rank}</td><td>${p.name}</td><td>${formatCurrency(p.revenue)}</td><td>${p.quantity}</td></tr>`).join('');
  const catRows = year.categoryPerformance.map(c => `<tr><td>${c.name}</td><td>${formatCurrency(c.revenue)}</td></tr>`).join('');
  return `
    <section style='margin-top:18px'>
      <h2 style='font-size:15px;margin-bottom:8px'>ANNUAL SALES & GROWTH REPORT</h2>
      <div><strong>Year:</strong> ${year.year}</div>
      <div class='summary'>
        <div class='item'>Total Annual Revenue<br><strong>${formatCurrency(year.totalRevenue)}</strong></div>
        <div class='item'>Total Annual Orders<br><strong>${year.totalOrders}</strong></div>
        <div class='item'>Total Annual Profit<br><strong>${formatCurrency(year.totalProfit)}</strong></div>
        <div class='item'>Overall Margin<br><strong>${year.overallMargin}</strong></div>
      </div>
      <h3>QUARTERLY BREAKDOWN</h3>
      <table><thead><tr><th>Quarter</th><th>Revenue</th><th>Orders</th><th>Growth %</th></tr></thead><tbody>${quarterRows}</tbody></table>
      <h3>TOP PRODUCTS OF THE YEAR</h3>
      <table><thead><tr><th>Rank</th><th>Product</th><th>Revenue</th><th>Quantity Sold</th></tr></thead><tbody>${topRows}</tbody></table>
      <h3>CATEGORY PERFORMANCE</h3>
      <table><thead><tr><th>Category</th><th>Revenue</th></tr></thead><tbody>${catRows}</tbody></table>
      <h3>YEARLY PAYMENT ANALYSIS</h3>
      <div>Total UPI Revenue: <strong>${formatCurrency(year.totalUpiRevenue)}</strong> | Total COD Revenue: <strong>${formatCurrency(year.totalCodRevenue)}</strong> | UPI %: <strong>${year.upiPercent}</strong> | COD %: <strong>${year.codPercent}</strong></div>
      <h3>STRATEGIC INSIGHTS</h3>
      <ul><li>Best Performing Product: <strong>${year.bestProduct}</strong></li><li>Highest Growth Quarter: <strong>${year.highestGrowthQuarter}</strong></li><li>Business Outlook: <strong>${year.businessOutlook}</strong></li></ul>
    </section>
  `;
}

// Custom Date Sales Report
function renderCustomDateReport(data) {
  if (!data.customDate) return '';
  const custom = data.customDate;
  const prodRows = custom.productPerformance.map(p => `<tr><td>${p.name}</td><td>${p.quantity}</td><td>${formatCurrency(p.revenue)}</td><td>${formatCurrency(p.profit)}</td></tr>`).join('');
  return `
    <section style='margin-top:18px'>
      <h2 style='font-size:15px;margin-bottom:8px'>CUSTOM DATE SALES REPORT</h2>
      <div><strong>Selected Date Range:</strong> ${custom.dateRange}</div>
      <div class='summary'>
        <div class='item'>Total Orders<br><strong>${custom.totalOrders}</strong></div>
        <div class='item'>Total Revenue<br><strong>${formatCurrency(custom.totalRevenue)}</strong></div>
        <div class='item'>Total Profit<br><strong>${formatCurrency(custom.totalProfit)}</strong></div>
        <div class='item'>Margin %<br><strong>${custom.margin}</strong></div>
      </div>
      <h3>PRODUCT PERFORMANCE</h3>
      <table><thead><tr><th>Product</th><th>Quantity</th><th>Revenue</th><th>Profit</th></tr></thead><tbody>${prodRows}</tbody></table>
      <h3>PAYMENT DISTRIBUTION</h3>
      <div>UPI Orders: <strong>${custom.upiOrders}</strong> | UPI Revenue: <strong>${formatCurrency(custom.upiRevenue)}</strong> | COD Orders: <strong>${custom.codOrders}</strong> | COD Revenue: <strong>${formatCurrency(custom.codRevenue)}</strong></div>
      <h3>PERFORMANCE ANALYSIS</h3>
      <ul><li>Peak Sales Date: <strong>${custom.peakSalesDate}</strong></li><li>Revenue Trend: <strong>${custom.revenueTrend}</strong></li><li>Risk Level: <strong>${custom.riskLevel}</strong></li></ul>
    </section>
  `;
}

// Particular Product Sales Report
function renderProductReport(data) {
  if (!data.productReport) return '';
  const prod = data.productReport;
  const dailyRows = prod.dailySalesTrend.map(d => `<tr><td>${d.date}</td><td>${d.quantity}</td><td>${formatCurrency(d.revenue)}</td><td>${d.paymentMode}</td></tr>`).join('');
  return `
    <section style='margin-top:18px'>
      <h2 style='font-size:15px;margin-bottom:8px'>PRODUCT SALES ANALYSIS REPORT</h2>
      <div><strong>Product Name:</strong> ${prod.productName}</div>
      <div><strong>Selected Date Range:</strong> ${prod.dateRange}</div>
      <div class='summary'>
        <div class='item'>Total Units Sold<br><strong>${prod.totalUnitsSold}</strong></div>
        <div class='item'>Total Revenue<br><strong>${formatCurrency(prod.totalRevenue)}</strong></div>
        <div class='item'>Total Cost<br><strong>${formatCurrency(prod.totalCost)}</strong></div>
        <div class='item'>Total Profit<br><strong>${formatCurrency(prod.totalProfit)}</strong></div>
        <div class='item'>Profit Margin %<br><strong>${prod.profitMargin}</strong></div>
      </div>
      <h3>DAILY SALES TREND</h3>
      <table><thead><tr><th>Date</th><th>Quantity Sold</th><th>Revenue</th><th>Payment Mode</th></tr></thead><tbody>${dailyRows}</tbody></table>
      <h3>PAYMENT SPLIT FOR THIS PRODUCT</h3>
      <div>UPI Sales: <strong>${formatCurrency(prod.upiSales)}</strong> | COD Sales: <strong>${formatCurrency(prod.codSales)}</strong></div>
      <h3>PRODUCT INSIGHTS</h3>
      <ul><li>Peak Demand Date: <strong>${prod.peakDemandDate}</strong></li><li>Demand Trend: <strong>${prod.demandTrend}</strong></li><li>Stock Recommendation: <strong>${prod.stockRecommendation}</strong></li></ul>
    </section>
  `;
}
function renderCategoryContribution(categories) {
  if (!categories || !categories.length) return '';
  return `<table style='width:100%;margin-bottom:8px'><thead><tr><th>Category</th><th>Revenue</th><th>% Contribution</th></tr></thead><tbody>` +
    categories.map(c => `<tr><td>${c.name}</td><td style='text-align:right'>${formatCurrency(c.revenue)}</td><td style='text-align:right'>${c.percent}</td></tr>`).join('') +
    `</tbody></table>`;
}

function renderProductPerformance(products) {
  if (!products || !products.length) return '';
  return products.map(p => `<tr><td>${p.name}</td><td style='text-align:right'>${p.quantity}</td><td style='text-align:right'>${formatCurrency(p.revenue)}</td><td style='text-align:right'>${formatCurrency(p.profit)}</td><td style='text-align:right'>${p.margin}</td></tr>`).join('');
}

function renderPaymentAnalysis(payment) {
  if (!payment) return '';
  return `<div style='display:flex;gap:16px'><div>UPI Orders: <strong>${payment.upiOrders}</strong></div><div>UPI Revenue: <strong>${formatCurrency(payment.upiRevenue)}</strong></div><div>UPI % Share: <strong>${payment.upiPercent}</strong></div><div>COD Orders: <strong>${payment.codOrders}</strong></div><div>COD Revenue: <strong>${formatCurrency(payment.codRevenue)}</strong></div><div>COD % Share: <strong>${payment.codPercent}</strong></div></div>
  <div style='margin-top:8px'>Average Order Value (UPI): <strong>${formatCurrency(payment.avgOrderValueUpi)}</strong> | Average Order Value (COD): <strong>${formatCurrency(payment.avgOrderValueCod)}</strong></div>
  <div style='margin-top:8px'>COD Cancellation Rate: <strong>${payment.codCancelRate}</strong> | COD Return Rate: <strong>${payment.codReturnRate}</strong></div>`;
}

function renderMonthlyInsights(insights) {
  if (!insights) return '';
  return `<ul style='margin:0;padding-left:18px'><li>Best Selling Product: <strong>${insights.bestSellingProduct}</strong></li><li>Top Revenue Category: <strong>${insights.topRevenueCategory}</strong></li><li>Revenue Growth Compared to Last Month: <strong>${insights.revenueGrowth}</strong></li><li>Risk Status: <strong>${insights.riskStatus}</strong></li></ul>`;
}

function formatCurrency(n, symbol='₹') {
  return symbol + Number(n).toLocaleString('en-IN');
}

const rows = (data.sales || []).map(s => {
  return `<tr>
    <td>${s.date}</td>
    <td>${s.productName}</td>
    <td style="text-align:right">${s.quantity}</td>
    <td style="text-align:right">${formatCurrency(s.unitPrice)}</td>
    <td style="text-align:right">${formatCurrency(s.totalAmount)}</td>
  </tr>`;
}).join('\n');

const totals = (data.sales || []).reduce((acc, s) => {
  acc.quantity += Number(s.quantity || 0);
  acc.total += Number(s.totalAmount || 0);
  return acc;
}, {quantity:0, total:0});


// Fill new placeholders for Monthly Sales Report
template = template.replace('{{companyLogo}}', data.companyLogo || '')
  .replace('{{reportMonth}}', data.reportMonth || '')
  .replace('{{generatedDate}}', data.generatedDate || new Date().toLocaleDateString('en-IN'))
  .replace('{{generatedBy}}', data.generatedBy || 'Admin')
  .replace('{{totalOrders}}', data.summary ? data.summary.totalOrders : '')
  .replace('{{totalRevenue}}', formatCurrency(data.summary ? data.summary.totalRevenue : totals.total))
  .replace('{{totalCost}}', formatCurrency(data.summary ? data.summary.totalCost : 0))
  .replace('{{totalProfit}}', formatCurrency(data.summary ? data.summary.totalProfit : 0))
  .replace('{{profitMargin}}', data.summary ? data.summary.profitMargin : '')
  .replace('{{avgOrderValue}}', formatCurrency(data.summary ? data.summary.avgOrderValue : 0))
  .replace('{{categoryContribution}}', renderCategoryContribution(data.categoryContribution))
  .replace('{{productPerformanceRows}}', renderProductPerformance(data.productPerformance))
  .replace('{{grandTotalQuantity}}', data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.quantity||0),0) : 0)
  .replace('{{grandTotalRevenue}}', formatCurrency(data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.revenue||0),0) : 0))
  .replace('{{grandTotalProfit}}', formatCurrency(data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.profit||0),0) : 0))
  .replace('{{grandTotalMargin}}', data.productPerformance ? (data.productPerformance.length ? (data.productPerformance.reduce((a,b)=>a+Number(b.margin||0),0)/data.productPerformance.length).toFixed(2) : 0) : 0)
  .replace('{{paymentAnalysis}}', renderPaymentAnalysis(data.paymentAnalysis))
  .replace('{{monthlyInsights}}', renderMonthlyInsights(data.monthlyInsights))
  .replace('{{pageNumber}}', '1')
  .replace('{{totalPages}}', '1');


// Fill report sections
template = template.replace('{{headerMeta}}', data.headerMeta || '')
  .replace('{{monthlyReportSection}}', data.reportType === 'monthly' ? (
    '<section>' +
      '<h2 style="font-size:15px;margin-bottom:8px">MONTHLY SALES REPORT</h2>' +
      '<div><strong>Month:</strong> ' + (data.reportMonth || '') + '</div>' +
      '<div><strong>Generated On:</strong> ' + (data.generatedDate || '') + '</div>' +
      '<div><strong>Generated By:</strong> ' + (data.generatedBy || 'Admin') + '</div>' +
      '<div class="summary">' +
        '<div class="item">Total Orders<br><strong>' + (data.summary ? data.summary.totalOrders : '') + '</strong></div>' +
        '<div class="item">Total Revenue<br><strong>' + formatCurrency(data.summary ? data.summary.totalRevenue : 0) + '</strong></div>' +
        '<div class="item">Total Cost<br><strong>' + formatCurrency(data.summary ? data.summary.totalCost : 0) + '</strong></div>' +
        '<div class="item">Total Profit<br><strong>' + formatCurrency(data.summary ? data.summary.totalProfit : 0) + '</strong></div>' +
        '<div class="item">Profit Margin (%)<br><strong>' + (data.summary ? data.summary.profitMargin : '') + '</strong></div>' +
        '<div class="item">Average Order Value<br><strong>' + formatCurrency(data.summary ? data.summary.avgOrderValue : 0) + '</strong></div>' +
      '</div>' +
      '<h3>CATEGORY CONTRIBUTION</h3>' + renderCategoryContribution(data.categoryContribution) +
      '<h3>PRODUCT PERFORMANCE</h3>' +
      '<table><thead><tr><th>Product Name</th><th>Quantity Sold</th><th>Revenue</th><th>Profit</th><th>Margin %</th></tr></thead><tbody>' + renderProductPerformance(data.productPerformance) + '</tbody><tfoot><tr><td colspan="1"><strong>Grand Total</strong></td><td style="text-align:right">' + (data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.quantity||0),0) : 0) + '</td><td style="text-align:right">' + formatCurrency(data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.revenue||0),0) : 0) + '</td><td style="text-align:right">' + formatCurrency(data.productPerformance ? data.productPerformance.reduce((a,b)=>a+Number(b.profit||0),0) : 0) + '</td><td style="text-align:right">' + (data.productPerformance ? (data.productPerformance.length ? (data.productPerformance.reduce((a,b)=>a+Number(b.margin||0),0)/data.productPerformance.length).toFixed(2) : 0) : 0) + '</td></tr></tfoot></table>' +
      '<h3>PAYMENT ANALYSIS</h3>' + renderPaymentAnalysis(data.paymentAnalysis) +
      '<h3>MONTHLY INSIGHTS</h3>' + renderMonthlyInsights(data.monthlyInsights) +
    '</section>'
  ) : '')
  .replace('{{weeklyReportSection}}', renderWeeklyReport(data))
  .replace('{{yearlyReportSection}}', renderYearlyReport(data))
  .replace('{{customDateReportSection}}', renderCustomDateReport(data))
  .replace('{{productReportSection}}', renderProductReport(data))
  .replace('{{pageNumber}}', '1')
  .replace('{{totalPages}}', '1');

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const html = template;
  await page.setContent(html, {waitUntil: 'networkidle0'});
  await page.pdf({path: outPath, format: 'A4', printBackground: true, margin: {top:'20mm', right:'15mm', bottom:'20mm', left:'15mm'}});
  await browser.close();
  console.log('PDF generated at', outPath);
})().catch(err => { console.error(err); process.exit(1); });

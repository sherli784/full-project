import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  ProductSalesReportItem,
  DailySalesReportItem,
  PaymentAnalyticsItem,
  ReportFilters,
  TopSellingProductItem,
  SlowMovingProductItem,
  ComparisonData,
  Insights,
} from '../lib/reportCalculations';

interface ExportOptions {
  fileName: string;
  title: string;
  dateRange: { start: string; end: string };
  filters: ReportFilters;
  generatedAt: string;
  productName?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ============================================================================
// PDF EXPORT FUNCTIONS
// ============================================================================

export const exportProductSalesReportPDF = (
  data: ProductSalesReportItem[],
  options: ExportOptions
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text('Product Sales Report', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Company Name: Your Company`, 15, 25);
  doc.text(`Report Type: Product Sales Report`, 15, 31);
  doc.text(`Date Range: ${options.dateRange.start} to ${options.dateRange.end}`, 15, 37);
  doc.text(`Generated: ${options.generatedAt}`, 15, 43);

  if (options.filters.productFilter !== 'all') {
    doc.text(`Product Filter: ${options.filters.productFilter}`, 15, 49);
  }

  // Table
  const tableColumns = [
    'Product Name',
    'Category',
    'Quantity',
    'Revenue (₹)',
    'Avg Price (₹)',
    'Cost (₹)',
    'Profit (₹)',
    'Margin %',
  ];
  const tableData = data.map((item) => [
    item.productName,
    item.category,
    item.totalQuantityUnit.toString(),
    item.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.averageSellingPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    (item.costPrice * item.totalQuantityUnit).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.profit.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.profitMarginPercent.toFixed(2),
  ]);

  autoTable(doc, {
    head: [tableColumns],
    body: tableData,
    startY: 55,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
  });

  // Totals
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const avgMargin = data.length > 0 ? data.reduce((sum, item) => sum + item.profitMarginPercent, 0) / data.length : 0;

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, 15, finalY);
  doc.text(`Total Profit: ${formatCurrency(totalProfit)}`, 15, finalY + 6);
  doc.text(`Average Margin: ${avgMargin.toFixed(2)}%`, 15, finalY + 12);

  // Page numbers
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`ProductSalesReport_${options.dateRange.start}.pdf`);
};

export const exportDailySalesReportPDF = (
  data: DailySalesReportItem[],
  options: ExportOptions
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text('Daily Sales Report', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Company Name: Your Company`, 15, 25);
  doc.text(`Report Type: Daily Sales Report`, 15, 31);
  doc.text(`Date Range: ${options.dateRange.start} to ${options.dateRange.end}`, 15, 37);
  doc.text(`Generated: ${options.generatedAt}`, 15, 43);

  // Table
  const tableColumns = ['Date', 'Orders', 'Revenue (₹)', 'Products Sold', 'Top Product', 'UPI | COD'];
  const tableData = data.map((item) => [
    item.date,
    item.totalOrders.toString(),
    item.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.productsSoldCount.toString(),
    item.topSellingProduct,
    `${item.upiCount} | ${item.codCount}`,
  ]);

  autoTable(doc, {
    head: [tableColumns],
    body: tableData,
    startY: 50,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
  });

  // Summary
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);
  const totalProductsSold = data.reduce((sum, item) => sum + item.productsSoldCount, 0);

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Total Orders: ${totalOrders}`, 15, finalY);
  doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, 15, finalY + 6);
  doc.text(`Total Products Sold: ${totalProductsSold}`, 15, finalY + 12);

  // Page numbers
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`DailySalesReport_${options.dateRange.start}.pdf`);
};

export const exportPaymentAnalyticsPDF = (
  analytics: PaymentAnalyticsItem,
  options: ExportOptions
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text('Payment Analytics Report', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Company Name: Your Company`, 15, 25);
  doc.text(`Report Type: Payment Analytics Report`, 15, 31);
  doc.text(`Date Range: ${options.dateRange.start} to ${options.dateRange.end}`, 15, 37);
  doc.text(`Generated: ${options.generatedAt}`, 15, 43);

  // Content
  const content = [
    ['Metric', 'Value'],
    ['Total UPI Orders', analytics.totalUpiOrders.toString()],
    ['Total COD Orders', analytics.totalCodOrders.toString()],
    ['UPI Revenue', formatCurrency(analytics.upiRevenue)],
    ['COD Revenue', formatCurrency(analytics.codRevenue)],
    ['UPI Percentage', `${analytics.upiPercentage.toFixed(2)}%`],
    ['COD Percentage', `${analytics.codPercentage.toFixed(2)}%`],
    ['Average Order Value (UPI)', formatCurrency(analytics.averageOrderValueUpi)],
    ['Average Order Value (COD)', formatCurrency(analytics.averageOrderValueCod)],
    ['COD Cancellation Rate', `${analytics.codCancellationRate.toFixed(2)}%`],
    ['COD Return Percentage', `${analytics.codReturnPercentage.toFixed(2)}%`],
  ];

  autoTable(doc, {
    head: [['Metric', 'Value']],
    body: content.slice(1),
    startY: 50,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    columnStyles: { 0: { halign: 'left', minCellWidth: 80 }, 1: { halign: 'right' } },
  });

  // Page numbers
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`PaymentAnalyticsReport_${options.dateRange.start}.pdf`);
};

// ============================================================================
// CSV EXPORT FUNCTIONS
// ============================================================================

export const exportProductSalesReportCSV = (
  data: ProductSalesReportItem[],
  fileName: string
) => {
  const csvContent = [
    ['Product Name', 'Category', 'Quantity', 'Revenue', 'Avg Price', 'Cost', 'Profit', 'Margin %'],
    ...data.map((item) => [
      item.productName,
      item.category,
      item.totalQuantityUnit,
      item.totalRevenue,
      item.averageSellingPrice,
      item.costPrice,
      item.profit,
      item.profitMarginPercent,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvContent);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Product Sales');
  XLSX.writeFile(wb, `ProductSalesReport_${fileName}.xlsx`);
};

export const exportDailySalesReportCSV = (
  data: DailySalesReportItem[],
  fileName: string
) => {
  const csvContent = [
    ['Date', 'Orders', 'Revenue', 'Products Sold', 'Top Product', 'UPI Count', 'COD Count'],
    ...data.map((item) => [
      item.date,
      item.totalOrders,
      item.totalRevenue,
      item.productsSoldCount,
      item.topSellingProduct,
      item.upiCount,
      item.codCount,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvContent);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Sales');
  XLSX.writeFile(wb, `DailySalesReport_${fileName}.xlsx`);
};

export const exportPaymentAnalyticsCSV = (
  analytics: PaymentAnalyticsItem,
  fileName: string
) => {
  const csvContent = [
    ['Metric', 'Value'],
    ['Total UPI Orders', analytics.totalUpiOrders],
    ['Total COD Orders', analytics.totalCodOrders],
    ['UPI Revenue', analytics.upiRevenue],
    ['COD Revenue', analytics.codRevenue],
    ['UPI Percentage', analytics.upiPercentage],
    ['COD Percentage', analytics.codPercentage],
    ['Average Order Value (UPI)', analytics.averageOrderValueUpi],
    ['Average Order Value (COD)', analytics.averageOrderValueCod],
    ['COD Cancellation Rate', analytics.codCancellationRate],
    ['COD Return Percentage', analytics.codReturnPercentage],
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvContent);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payment Analytics');
  XLSX.writeFile(wb, `PaymentAnalyticsReport_${fileName}.xlsx`);
};

// ============================================================================
// COMPREHENSIVE SALES REPORT PDF
// ============================================================================

export const exportComprehensiveSalesReportPDF = (
  productSalesData: ProductSalesReportItem[],
  paymentAnalytics: PaymentAnalyticsItem,
  topProducts: TopSellingProductItem[],
  slowMovingProducts: SlowMovingProductItem[],
  comparisonData: ComparisonData,
  insights: Insights,
  options: ExportOptions
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;

  const addPageIfNeeded = (neededSpace: number) => {
    if (currentY + neededSpace > pageHeight - 20) {
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      currentY = 15;
    }
  };

  // ============================================================================
  // HEADER SECTION
  // ============================================================================
  
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('KM Fashion Clothing Co', pageWidth / 2, currentY, { align: 'center' });

  currentY += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Premium Mens Wear Collection', pageWidth / 2, currentY, { align: 'center' });

  currentY += 5;
  doc.setFontSize(9);
  doc.text('Komarapalayam, Namakkal, Tamil Nadu', pageWidth / 2, currentY, { align: 'center' });

  // Separator line
  currentY += 7;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(15, currentY, pageWidth - 15, currentY);

  // Report Title
  currentY += 6;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SALES REPORT', 15, currentY);

  // Report Details
  currentY += 8;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  // Determine report type based on date range
  const startDate = new Date(options.dateRange.start);
  const endDate = new Date(options.dateRange.end);
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const reportType = diffDays >= 30 ? 'Monthly Sales Report' : diffDays >= 7 ? 'Weekly Sales Report' : 'Daily Sales Report';

  doc.text(`Report Type: ${reportType}`, 15, currentY);
  currentY += 4;

  const formatDateForReport = (dateStr: string) => {
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  doc.text(`Report Period: ${formatDateForReport(options.dateRange.start)} to ${formatDateForReport(options.dateRange.end)}`, 15, currentY);
  currentY += 4;

  doc.text(`Generated On: ${options.generatedAt}`, 15, currentY);
  currentY += 4;

  doc.text('Generated By: Admin', 15, currentY);

  // ============================================================================
  // APPLIED FILTERS SECTION
  // ============================================================================
  currentY += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('APPLIED FILTERS', 15, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  doc.text(`Date Range: ${formatDateForReport(options.dateRange.start)} to ${formatDateForReport(options.dateRange.end)}`, 15, currentY);
  currentY += 4;

  const productFilterText = options.filters.productFilter === 'all' ? 'All Products' : options.filters.productFilter;
  doc.text(`Product Filter: ${productFilterText}`, 15, currentY);
  currentY += 4;

  const paymentFilterText = options.filters.paymentFilter === 'all' ? 'All (UPI and COD)' : options.filters.paymentFilter;
  doc.text(`Payment Method: ${paymentFilterText}`, 15, currentY);

  // ============================================================================
  // EXECUTIVE SUMMARY SECTION
  // ============================================================================
  addPageIfNeeded(35);
  currentY += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('EXECUTIVE SUMMARY', 15, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  const totalRevenue = productSalesData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = productSalesData.reduce((sum, item) => sum + item.profit, 0);
  const totalOrders = paymentAnalytics.totalUpiOrders + paymentAnalytics.totalCodOrders;
  const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const summaryData = [
    `Total Orders: ${totalOrders}`,
    `Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `Total Profit: Rs. ${totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `Profit Margin: ${profitMarginPercent.toFixed(2)}%`,
    `UPI Orders: ${paymentAnalytics.totalUpiOrders}`,
    `COD Orders: ${paymentAnalytics.totalCodOrders}`,
  ];

  const colWidth = (pageWidth - 30) / 2;
  for (let i = 0; i < summaryData.length; i += 2) {
    doc.text(summaryData[i], 15, currentY);
    if (i + 1 < summaryData.length) {
      doc.text(summaryData[i + 1], 15 + colWidth, currentY);
    }
    currentY += 4;
  }

  // ============================================================================
  // PRODUCT SALES PERFORMANCE TABLE
  // ============================================================================
  addPageIfNeeded(50);
  currentY += 4;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('PRODUCT SALES PERFORMANCE', 15, currentY);
  currentY += 5;

  const tableColumns = ['Product Name', 'Qty', 'Revenue (Rs.)', 'Cost (Rs.)', 'Profit (Rs.)', 'Margin %'];
  const tableData = productSalesData.map((item) => [
    item.productName,
    item.totalQuantityUnit.toString(),
    item.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    (item.costPrice * item.totalQuantityUnit).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.profit.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.profitMarginPercent.toFixed(2) + '%',
  ]);

  // Add grand total row
  const totalQuantity = productSalesData.reduce((sum, item) => sum + item.totalQuantityUnit, 0);
  const totalCost = productSalesData.reduce((sum, item) => sum + item.costPrice * item.totalQuantityUnit, 0);
  
  tableData.push([
    'GRAND TOTAL',
    totalQuantity.toString(),
    totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    profitMarginPercent.toFixed(2) + '%',
  ]);

  autoTable(doc, {
    head: [tableColumns],
    body: tableData,
    startY: currentY,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [0, 0, 0],
      lineColor: [150, 150, 150],
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    bodyStyles: {
      lineWidth: 0.3,
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // ============================================================================
  // PAYMENT ANALYTICS SECTION
  // ============================================================================
  addPageIfNeeded(40);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('PAYMENT ANALYTICS', 15, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  const paymentMetrics = [
    `UPI Orders: ${paymentAnalytics.totalUpiOrders}`,
    `COD Orders: ${paymentAnalytics.totalCodOrders}`,
    `UPI Revenue: Rs. ${paymentAnalytics.upiRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `COD Revenue: Rs. ${paymentAnalytics.codRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `UPI Share: ${paymentAnalytics.upiPercentage.toFixed(2)}%`,
    `COD Share: ${paymentAnalytics.codPercentage.toFixed(2)}%`,
    `Average Order Value (UPI): Rs. ${paymentAnalytics.averageOrderValueUpi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `Average Order Value (COD): Rs. ${paymentAnalytics.averageOrderValueCod.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `COD Cancellation Rate: ${paymentAnalytics.codCancellationRate.toFixed(2)}%`,
    `COD Return Rate: ${paymentAnalytics.codReturnPercentage.toFixed(2)}%`,
  ];

  for (let i = 0; i < paymentMetrics.length; i += 2) {
    doc.text(paymentMetrics[i], 15, currentY);
    if (i + 1 < paymentMetrics.length) {
      doc.text(paymentMetrics[i + 1], 15 + colWidth, currentY);
    }
    currentY += 4;
  }

  // ============================================================================
  // GROWTH COMPARISON SECTION
  // ============================================================================
  addPageIfNeeded(25);
  currentY += 4;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('GROWTH COMPARISON', 15, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  const growthMetrics = [
    `Current Period Revenue: Rs. ${comparisonData.currentPeriodRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `Previous Period Revenue: Rs. ${comparisonData.previousPeriodRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    `Revenue Growth: ${comparisonData.revenueGrowthPercent.toFixed(2)}%`,
    '',
    `Current Period Orders: ${comparisonData.currentPeriodOrders}`,
    `Previous Period Orders: ${comparisonData.previousPeriodOrders}`,
    `Orders Growth: ${comparisonData.ordersGrowthPercent.toFixed(2)}%`,
  ];

  for (const metric of growthMetrics) {
    if (metric) {
      doc.text(metric, 15, currentY);
      currentY += 4;
    } else {
      currentY += 2;
    }
  }

  // ============================================================================
  // TOP 5 BEST SELLING PRODUCTS
  // ============================================================================
  addPageIfNeeded(45);
  currentY += 4;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('TOP 5 BEST SELLING PRODUCTS', 15, currentY);
  currentY += 5;

  const topProductsData = topProducts.slice(0, 5).map((item) => [
    item.rank.toString(),
    item.productName,
    item.totalQuantityUnit.toString(),
    item.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
  ]);

  if (topProductsData.length > 0) {
    autoTable(doc, {
      head: [['Rank', 'Product Name', 'Quantity Sold', 'Revenue (Rs.)']],
      body: topProductsData,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [0, 0, 0],
        lineColor: [150, 150, 150],
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
    currentY = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('No data available', 15, currentY);
    currentY += 5;
  }

  // ============================================================================
  // SLOW MOVING PRODUCTS
  // ============================================================================
  addPageIfNeeded(45);
  currentY += 4;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('SLOW MOVING PRODUCTS', 15, currentY);
  currentY += 5;

  const slowMovingData = slowMovingProducts.slice(0, 10).map((item) => [
    item.productName,
    item.quantitySold.toString(),
    item.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    item.lastSoldDate || 'Never',
  ]);

  if (slowMovingData.length > 0) {
    autoTable(doc, {
      head: [['Product Name', 'Quantity Sold', 'Revenue (Rs.)', 'Last Sold Date']],
      body: slowMovingData,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [0, 0, 0],
        lineColor: [150, 150, 150],
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
    currentY = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('No slow moving products', 15, currentY);
    currentY += 5;
  }

  // ============================================================================
  // BUSINESS INSIGHTS SECTION
  // ============================================================================
  addPageIfNeeded(30);
  currentY += 4;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('BUSINESS INSIGHTS', 15, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  const insightLines = [
    `Most Preferred Payment Method: ${insights.mostUsedPaymentMethod} (${insights.mostUsedPaymentMethodPercentage.toFixed(1)}%)`,
    `Best Selling Product: ${insights.bestSellingProduct}`,
    `Highest Revenue Category: ${insights.bestSellingProduct}`,
    `Revenue Growth Status: ${comparisonData.revenueGrowthPercent >= 0 ? 'Positive' : 'Negative'}`,
    `COD Risk Status: ${insights.codRiskAlert ? 'High' : 'Low'}`,
  ];

  for (const insight of insightLines) {
    doc.text(insight, 15, currentY);
    currentY += 4;
  }

  // Add footer
  addFooter(doc, pageWidth, pageHeight);

  // Generate filename with date and product name if available
  const reportDate = new Date().toISOString().split('T')[0];
  const productSuffix = options.productName && options.productName !== 'All Products' ? `_${options.productName.replace(/\s+/g, '_')}` : '';
  doc.save(`KM_Fashion_Sales_Report_${reportDate}${productSuffix}.pdf`);
};

// Helper function to add footer
const addFooter = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  const pageCount = (doc as any).internal.pages.length - 1;
  const currentPageNum = (doc as any).internal.getNumberOfPages();

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

  // Footer text
  doc.text('KM Fashion Clothing Co', 15, pageHeight - 10);
  doc.text('Komarapalayam, Namakkal', 15, pageHeight - 6);
  doc.text('Confidential – Internal Use Only', pageWidth - 15 - doc.getTextWidth('Confidential – Internal Use Only'), pageHeight - 10);
  doc.text(`Page ${currentPageNum} of ${pageCount}`, pageWidth - 15 - doc.getTextWidth('Page 1 of 1'), pageHeight - 6);
};


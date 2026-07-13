import { Order, Product } from '../types';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface ReportFilters {
  dateRange: 'today' | 'last7days' | 'last30days' | 'custom' | 'single' | 'monthly' | 'yearly';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  productFilter: 'all' | string; // 'all' or productId
  paymentFilter: 'all' | 'UPI' | 'COD';
}

export interface ProductSalesReportItem {
  productId: string;
  productName: string;
  category: string;
  totalQuantityUnit: number;
  totalRevenue: number;
  averageSellingPrice: number;
  sizeBreakdown: Record<string, number>;
  costPrice: number;
  profit: number;
  profitMarginPercent: number;
  totalOrders: number;
}

export interface DailySalesReportItem {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  productsSoldCount: number;
  topSellingProduct: string;
  topSellingProductRevenue: number;
  upiCount: number;
  codCount: number;
}

export interface PaymentAnalyticsItem {
  totalUpiOrders: number;
  totalCodOrders: number;
  upiRevenue: number;
  codRevenue: number;
  upiPercentage: number;
  codPercentage: number;
  averageOrderValueUpi: number;
  averageOrderValueCod: number;
  codCancellationRate: number;
  codReturnPercentage: number;
}

export interface ProfitMarginReportItem {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  profitMarginPercent: number;
  quantitySold: number;
  averageProfitPerUnit: number;
}

export interface TopSellingProductItem {
  rank: number;
  productId: string;
  productName: string;
  category: string;
  totalQuantityUnit: number;
  totalRevenue: number;
  averagePrice: number;
  profit: number;
  orders: number;
}

export interface SlowMovingProductItem {
  productId: string;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  lastSoldDate: string | null;
  daysWithoutSale: number;
}

export interface ComparisonData {
  currentPeriodRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowthPercent: number;
  currentPeriodOrders: number;
  previousPeriodOrders: number;
  ordersGrowthPercent: number;
  isPositiveRevenueGrowth: boolean;
  isPositiveOrdersGrowth: boolean;
}

export interface Insights {
  bestSellingProduct: string;
  bestSellingProductRevenue: number;
  mostUsedPaymentMethod: string;
  mostUsedPaymentMethodPercentage: number;
  peakSalesDay: string;
  peakSalesDayRevenue: number;
  revenueGrowthPercent: number;
  codRiskAlert: boolean;
  codCancellationRate: number;
  averageOrderValue: number;
  totalCustomers: number;
}

// ============================================================================
// DATE FILTERING UTILITIES
// ============================================================================

export const getDateRangeForFilter = (
  filter: ReportFilters['dateRange'],
  startDate: string,
  endDate: string
): { start: Date; end: Date } => {
  const now = new Date();

  switch (filter) {
    case 'today': {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setSeconds(tomorrowStart.getSeconds() - 1); // 23:59:59
      return { start: today, end: tomorrowStart };
    }

    case 'last7days': {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'last30days': {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'monthly': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'yearly': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'single': {
      const date = parseISO(startDate);
      const start = startOfDay(date);
      const end = endOfDay(date);
      return { start, end };
    }

    case 'custom':
    default: {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return {
        start: startOfDay(start),
        end: endOfDay(end),
      };
    }
  }
};

export const filterOrdersByDateAndFilters = (
  orders: Order[],
  filters: ReportFilters
): Order[] => {
  const { start, end } = getDateRangeForFilter(
    filters.dateRange,
    filters.startDate,
    filters.endDate
  );

  return orders.filter((order) => {
    const orderDate = parseISO(order.date);

    // Date filter
    if (orderDate < start || orderDate > end) {
      return false;
    }

    // Payment filter
    if (filters.paymentFilter !== 'all' && order.paymentMethod !== filters.paymentFilter) {
      return false;
    }

    // Product filter
    if (filters.productFilter !== 'all') {
      const hasProduct = order.items.some((item) => item.productId === filters.productFilter);
      if (!hasProduct) {
        return false;
      }
    }

    return true;
  });
};

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

export const getCostPrice = (product: Product | undefined): number => {
  if (!product) return 0;
  // Assuming cost price is 60% of base price (can be made configurable)
  return product.basePrice * 0.6;
};

export const calculateProductSalesReport = (
  orders: Order[],
  products: Product[],
  filters: ReportFilters
): ProductSalesReportItem[] => {
  const filteredOrders = filterOrdersByDateAndFilters(orders, filters);
  const productMap = new Map(products.map((p) => [p.id, p]));
  const reportMap = new Map<
    string,
    {
      name: string;
      category: string;
      quantity: number;
      revenue: number;
      sizeBreakdown: Record<string, number>;
      prices: number[];
      costPrice: number;
    }
  >();

  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const product = productMap.get(item.productId);
      if (!product) return;

      if (!reportMap.has(item.productId)) {
        reportMap.set(item.productId, {
          name: item.productName,
          category: product.category,
          quantity: 0,
          revenue: 0,
          sizeBreakdown: {},
          prices: [],
          costPrice: getCostPrice(product),
        });
      }

      const entry = reportMap.get(item.productId)!;
      entry.quantity += item.quantity;
      entry.revenue += item.quantity * item.priceAtPurchase;
      entry.prices.push(item.priceAtPurchase);
      entry.sizeBreakdown[item.size] = (entry.sizeBreakdown[item.size] || 0) + item.quantity;
    });
  });

  return Array.from(reportMap.entries()).map(([productId, data]) => {
    const averagePrice = data.prices.length > 0 ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length : 0;
    const totalCost = data.quantity * data.costPrice;
    const profit = data.revenue - totalCost;
    const profitMargin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;

    return {
      productId,
      productName: data.name,
      category: data.category,
      totalQuantityUnit: data.quantity,
      totalRevenue: data.revenue,
      averageSellingPrice: averagePrice,
      sizeBreakdown: data.sizeBreakdown,
      costPrice: data.costPrice,
      profit,
      profitMarginPercent: profitMargin,
      totalOrders: filteredOrders.filter((o) =>
        o.items.some((item) => item.productId === productId)
      ).length,
    };
  });
};

export const calculateDailySalesReport = (
  orders: Order[],
  filters: ReportFilters
): DailySalesReportItem[] => {
  const filteredOrders = filterOrdersByDateAndFilters(orders, filters);
  const dailyMap = new Map<string, DailySalesReportItem>();

  filteredOrders.forEach((order) => {
    const dateStr = order.date.split('T')[0];

    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, {
        date: dateStr,
        totalOrders: 0,
        totalRevenue: 0,
        productsSoldCount: 0,
        topSellingProduct: '',
        topSellingProductRevenue: 0,
        upiCount: 0,
        codCount: 0,
      });
    }

    const entry = dailyMap.get(dateStr)!;
    entry.totalOrders += 1;
    entry.totalRevenue += order.totalAmount;
    entry.productsSoldCount += order.items.reduce((sum, item) => sum + item.quantity, 0);

    if (order.paymentMethod === 'UPI') {
      entry.upiCount += 1;
    } else if (order.paymentMethod === 'COD') {
      entry.codCount += 1;
    }
  });

  // Calculate top selling product per day
  const dailyProductMap = new Map<string, Map<string, { name: string; revenue: number }>>();
  filteredOrders.forEach((order) => {
    const dateStr = order.date.split('T')[0];
    if (!dailyProductMap.has(dateStr)) {
      dailyProductMap.set(dateStr, new Map());
    }

    const dayProducts = dailyProductMap.get(dateStr)!;
    order.items.forEach((item) => {
      if (!dayProducts.has(item.productId)) {
        dayProducts.set(item.productId, { name: item.productName, revenue: 0 });
      }
      const prod = dayProducts.get(item.productId)!;
      prod.revenue += item.quantity * item.priceAtPurchase;
    });
  });

  // Update top products in daily report
  dailyProductMap.forEach((products, dateStr) => {
    const entry = dailyMap.get(dateStr)!;
    let topProduct = '';
    let topRevenue = 0;

    products.forEach((prod) => {
      if (prod.revenue > topRevenue) {
        topRevenue = prod.revenue;
        topProduct = prod.name;
      }
    });

    entry.topSellingProduct = topProduct;
    entry.topSellingProductRevenue = topRevenue;
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const calculatePaymentAnalytics = (orders: Order[], filters: ReportFilters): PaymentAnalyticsItem => {
  const filteredOrders = filterOrdersByDateAndFilters(orders, filters);

  const upiOrders = filteredOrders.filter((o) => o.paymentMethod === 'UPI');
  const codOrders = filteredOrders.filter((o) => o.paymentMethod === 'COD');

  const totalUpiRevenue = upiOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCodRevenue = codOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = filteredOrders.length;
  const upiPercentage = totalOrders > 0 ? (upiOrders.length / totalOrders) * 100 : 0;
  const codPercentage = totalOrders > 0 ? (codOrders.length / totalOrders) * 100 : 0;

  const avgUpi = upiOrders.length > 0 ? totalUpiRevenue / upiOrders.length : 0;
  const avgCod = codOrders.length > 0 ? totalCodRevenue / codOrders.length : 0;

  // Assuming 10% default cancellation and return rate for COD (can be fetched from actual data)
  const codCancellationRate = 10;
  const codReturnPercentage = 5;

  return {
    totalUpiOrders: upiOrders.length,
    totalCodOrders: codOrders.length,
    upiRevenue: totalUpiRevenue,
    codRevenue: totalCodRevenue,
    upiPercentage,
    codPercentage,
    averageOrderValueUpi: avgUpi,
    averageOrderValueCod: avgCod,
    codCancellationRate,
    codReturnPercentage,
  };
};

export const calculateProfitMarginReport = (
  orders: Order[],
  products: Product[],
  filters: ReportFilters
): ProfitMarginReportItem[] => {
  const productSalesReport = calculateProductSalesReport(orders, products, filters);

  return productSalesReport.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    totalRevenue: item.totalRevenue,
    totalCost: item.totalQuantityUnit * item.costPrice,
    profit: item.profit,
    profitMarginPercent: item.profitMarginPercent,
    quantitySold: item.totalQuantityUnit,
    averageProfitPerUnit: item.profitMarginPercent > 0 ? item.profit / item.totalQuantityUnit : 0,
  }));
};

export const calculateTopSellingProducts = (
  orders: Order[],
  products: Product[],
  filters: ReportFilters,
  limit: number = 5
): TopSellingProductItem[] => {
  const salesReport = calculateProductSalesReport(orders, products, filters);

  return salesReport
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit)
    .map((item, index) => ({
      rank: index + 1,
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      totalQuantityUnit: item.totalQuantityUnit,
      totalRevenue: item.totalRevenue,
      averagePrice: item.averageSellingPrice,
      profit: item.profit,
      orders: item.totalOrders,
    }));
};

export const calculateSlowMovingProducts = (
  orders: Order[],
  products: Product[],
  filters: ReportFilters
): SlowMovingProductItem[] => {
  const salesReport = calculateProductSalesReport(orders, products, filters);

  // Find products with low sales or zero sales
  const slowMoving: SlowMovingProductItem[] = [];

  products.forEach((product) => {
    const report = salesReport.find((r) => r.productId === product.id);

    if (!report || report.totalQuantityUnit === 0) {
      // Find last sale date
      const lastSale = orders
        .filter((o) => o.items.some((item) => item.productId === product.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      const lastSoldDate = lastSale ? lastSale.date.split('T')[0] : null;
      const daysWithoutSale = lastSoldDate
        ? Math.floor((new Date().getTime() - new Date(lastSoldDate).getTime()) / (1000 * 60 * 60 * 24))
        : -1;

      slowMoving.push({
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantitySold: report?.totalQuantityUnit || 0,
        revenue: report?.totalRevenue || 0,
        lastSoldDate,
        daysWithoutSale: daysWithoutSale >= 0 ? daysWithoutSale : 999,
      });
    }
  });

  return slowMoving.sort((a, b) => b.daysWithoutSale - a.daysWithoutSale);
};

export const calculateComparison = (
  orders: Order[],
  _products: Product[],
  currentFilters: ReportFilters,
  previousPeriodDays: number
): ComparisonData => {
  const currentAnalytics = calculatePaymentAnalytics(orders, currentFilters);
  const currentRevenue = currentAnalytics.upiRevenue + currentAnalytics.codRevenue;
  const currentOrders = currentAnalytics.totalUpiOrders + currentAnalytics.totalCodOrders;

  // Calculate previous period
  const now = new Date();
  const previousStart = new Date(now);
  previousStart.setDate(previousStart.getDate() - previousPeriodDays);

  const previousFilters: ReportFilters = {
    ...currentFilters,
    dateRange: 'custom',
    startDate: previousStart.toISOString().split('T')[0],
    endDate: new Date(now.getTime() - previousPeriodDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  };

  const previousAnalytics = calculatePaymentAnalytics(orders, previousFilters);
  const previousRevenue = previousAnalytics.upiRevenue + previousAnalytics.codRevenue;
  const previousOrders = previousAnalytics.totalUpiOrders + previousAnalytics.totalCodOrders;

  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const ordersGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

  return {
    currentPeriodRevenue: currentRevenue,
    previousPeriodRevenue: previousRevenue,
    revenueGrowthPercent: revenueGrowth,
    currentPeriodOrders: currentOrders,
    previousPeriodOrders: previousOrders,
    ordersGrowthPercent: ordersGrowth,
    isPositiveRevenueGrowth: revenueGrowth >= 0,
    isPositiveOrdersGrowth: ordersGrowth >= 0,
  };
};

export const generateInsights = (
  orders: Order[],
  products: Product[],
  filters: ReportFilters
): Insights => {
  const filteredOrders = filterOrdersByDateAndFilters(orders, filters);
  const analytics = calculatePaymentAnalytics(orders, filters);
  const topProducts = calculateTopSellingProducts(orders, products, filters, 1);
  const dailyReport = calculateDailySalesReport(orders, filters);

  const bestProduct = topProducts[0];
  
  // Handle empty daily report
  const peakDay = dailyReport.length > 0 
    ? dailyReport.reduce((max, day) => (day.totalRevenue > max.totalRevenue ? day : max))
    : {
        date: 'N/A',
        totalOrders: 0,
        totalRevenue: 0,
        productsSoldCount: 0,
        topSellingProduct: '',
        topSellingProductRevenue: 0,
        upiCount: 0,
        codCount: 0,
      };

  const uniqueUsers = new Set(filteredOrders.map((o) => o.userId)).size;
  const totalRevenue = analytics.upiRevenue + analytics.codRevenue;
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  return {
    bestSellingProduct: bestProduct?.productName || 'N/A',
    bestSellingProductRevenue: bestProduct?.totalRevenue || 0,
    mostUsedPaymentMethod: analytics.upiPercentage >= analytics.codPercentage ? 'UPI' : 'COD',
    mostUsedPaymentMethodPercentage: Math.max(analytics.upiPercentage, analytics.codPercentage),
    peakSalesDay: peakDay.date,
    peakSalesDayRevenue: peakDay.totalRevenue,
    revenueGrowthPercent: 0, // Will be calculated from comparison
    codRiskAlert: analytics.codCancellationRate > 15,
    codCancellationRate: analytics.codCancellationRate,
    averageOrderValue: avgOrderValue,
    totalCustomers: uniqueUsers,
  };
};

import { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DateRangeFilter } from '../../components/pm/DateRangeFilter';
import { FilterPanel } from '../../components/pm/FilterPanel';
import { ReportTable } from '../../components/pm/ReportTable';
import { ReportCharts } from '../../components/pm/ReportCharts';
import { InsightsPanel } from '../../components/pm/InsightsPanel';
import {
  ReportFilters,
  calculateProductSalesReport,
  calculateDailySalesReport,
  calculatePaymentAnalytics,
  calculateTopSellingProducts,
  calculateSlowMovingProducts,
  generateInsights,
  calculateComparison,
} from '../../lib/reportCalculations';
import {
  exportProductSalesReportPDF,
  exportDailySalesReportPDF,
  exportPaymentAnalyticsPDF,
  exportProductSalesReportCSV,
  exportDailySalesReportCSV,
  exportPaymentAnalyticsCSV,
  exportComprehensiveSalesReportPDF,
} from '../../lib/exportUtils';
import { Button } from '../../components/ui/Button';
import { Download, FileText, Loader, TrendingUp } from 'lucide-react';

type ReportType = 'product-sales' | 'daily-sales' | 'payment-analytics' | 'profit-margin' | 'top-products' | 'slow-moving';

export const Reports = () => {
  try {
    const context = useStore();
    const orders = context?.orders || [];
    const products = context?.products || [];

    console.log('Reports component - Orders:', orders.length, 'Products:', products.length);

    const today = new Date();
    const defaultStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEnd = today.toISOString().split('T')[0];

    const [reportType, setReportType] = useState<ReportType>('product-sales');
    const [isGenerating, setIsGenerating] = useState(false);
    const [filters, setFilters] = useState<ReportFilters>({
      dateRange: 'last30days',
      startDate: defaultStart,
      endDate: defaultEnd,
      productFilter: 'all',
      paymentFilter: 'all',
    });

    const calculatedData = useMemo(() => {
      return {
        productSales: calculateProductSalesReport(orders, products, filters),
        dailySales: calculateDailySalesReport(orders, filters),
        paymentAnalytics: calculatePaymentAnalytics(orders, filters),
        topProducts: calculateTopSellingProducts(orders, products, filters, 10),
        slowMoving: calculateSlowMovingProducts(orders, products, filters),
        insights: generateInsights(orders, products, filters),
        comparison: calculateComparison(orders, products, filters, 7),
      };
    }, [orders, products, filters]);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const generatePDF = () => {
      const now = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const exportOptions = {
        fileName: filters.startDate,
        title: getReportTitle(reportType),
        dateRange: { start: filters.startDate, end: filters.endDate },
        filters,
        generatedAt: now,
      };

      switch (reportType) {
        case 'product-sales':
          exportProductSalesReportPDF(calculatedData.productSales, exportOptions);
          break;
        case 'daily-sales':
          exportDailySalesReportPDF(calculatedData.dailySales, exportOptions);
          break;
        case 'payment-analytics':
          exportPaymentAnalyticsPDF(calculatedData.paymentAnalytics, exportOptions);
          break;
        default:
          alert('PDF export not available for this report type');
      }
    };

    const generateCSV = () => {
      const fileName = filters.startDate;

      switch (reportType) {
        case 'product-sales':
          exportProductSalesReportCSV(calculatedData.productSales, fileName);
          break;
        case 'daily-sales':
          exportDailySalesReportCSV(calculatedData.dailySales, fileName);
          break;
        case 'payment-analytics':
          exportPaymentAnalyticsCSV(calculatedData.paymentAnalytics, fileName);
          break;
        default:
          alert('CSV export not available for this report type');
      }
    };

    const generateComprehensiveReport = () => {
      setIsGenerating(true);
      try {
        const now = new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        // Get product name if a specific product is selected
        let productName = 'All Products';
        if (filters.productFilter !== 'all') {
          const selectedProduct = products.find(p => p.id === filters.productFilter);
          productName = selectedProduct ? selectedProduct.name : filters.productFilter;
        }

        const exportOptions = {
          fileName: filters.startDate,
          title: 'KM Fashion Sales Report',
          dateRange: { start: filters.startDate, end: filters.endDate },
          filters,
          generatedAt: now,
          productName,
        };

        exportComprehensiveSalesReportPDF(
          calculatedData.productSales,
          calculatedData.paymentAnalytics,
          calculatedData.topProducts,
          calculatedData.slowMoving,
          calculatedData.comparison,
          calculatedData.insights,
          exportOptions
        );
      } catch (error) {
        console.error('Error generating comprehensive report:', error);
        alert('Error generating report. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    const getReportTitle = (type: ReportType): string => {
      const titles: Record<ReportType, string> = {
        'product-sales': 'Product Sales Report',
        'daily-sales': 'Daily Sales Report',
        'payment-analytics': 'Payment Analytics Report',
        'profit-margin': 'Profit & Margin Report',
        'top-products': 'Top Selling Products',
        'slow-moving': 'Slow Moving Products',
      };
      return titles[type];
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Sales Reports</h1>
              <p className="text-gray-600 mt-2">Comprehensive analytics and business insights</p>
            </div>
            <div className="hidden lg:block">
              <TrendingUp size={48} className="text-blue-600" />
            </div>
          </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Report Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'product-sales', label: 'Product Sales' },
              { id: 'daily-sales', label: 'Daily Sales' },
              { id: 'payment-analytics', label: 'Payment Analytics' },
              { id: 'profit-margin', label: 'Profit & Margin' },
              { id: 'top-products', label: 'Top Products' },
              { id: 'slow-moving', label: 'Slow Moving' },
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setReportType(report.id as ReportType)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all text-sm ${
                  reportType === report.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {report.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <DateRangeFilter filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Product & Payment Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <FilterPanel filters={filters} products={products} onFiltersChange={setFilters} />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={generateComprehensiveReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <FileText size={18} />
            Generate Full Report (KM Fashion)
          </Button>
          <Button
            onClick={generateCSV}
            disabled={isGenerating || ['top-products', 'slow-moving', 'profit-margin'].includes(reportType)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            <Download size={18} />
            Export Excel/CSV
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 flex items-center gap-3">
            <Loader size={24} className="text-blue-600 animate-spin" />
            <span className="text-blue-700">Generating report...</span>
          </div>
        )}

        {/* Main Report Content */}
        <div className="space-y-6">
          {/* Product Sales Report */}
          {reportType === 'product-sales' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Sales Report</h2>
                  <p className="text-gray-600">
                    {filters.startDate} to {filters.endDate}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculatedData.productSales.reduce((sum, item) => sum + item.totalRevenue, 0))}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Total Profit</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculatedData.productSales.reduce((sum, item) => sum + item.profit, 0))}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Products Sold</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {calculatedData.productSales.reduce((sum, item) => sum + item.totalQuantityUnit, 0)}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Unique Products</p>
                    <p className="text-2xl font-bold text-orange-600">{calculatedData.productSales.length}</p>
                  </div>
                </div>

                <ReportTable type="product-sales" data={calculatedData.productSales} />
              </div>
              <ReportCharts
                productSalesData={calculatedData.productSales}
                dailySalesData={calculatedData.dailySales}
                paymentAnalytics={calculatedData.paymentAnalytics}
              />
              <InsightsPanel insights={calculatedData.insights} />
            </>
          )}

          {/* Daily Sales Report */}
          {reportType === 'daily-sales' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Sales Report</h2>
                  <p className="text-gray-600">
                    {filters.startDate} to {filters.endDate}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {calculatedData.dailySales.reduce((sum, item) => sum + item.totalOrders, 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculatedData.dailySales.reduce((sum, item) => sum + item.totalRevenue, 0))}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Avg Revenue/Day</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(
                        calculatedData.dailySales.length > 0
                          ? calculatedData.dailySales.reduce((sum, item) => sum + item.totalRevenue, 0) /
                              calculatedData.dailySales.length
                          : 0
                      )}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Days Recorded</p>
                    <p className="text-2xl font-bold text-orange-600">{calculatedData.dailySales.length}</p>
                  </div>
                </div>

                <ReportTable type="daily-sales" data={calculatedData.dailySales} />
              </div>
              <ReportCharts
                productSalesData={calculatedData.productSales}
                dailySalesData={calculatedData.dailySales}
                paymentAnalytics={calculatedData.paymentAnalytics}
              />
              <InsightsPanel insights={calculatedData.insights} />
            </>
          )}

          {/* Payment Analytics Report */}
          {reportType === 'payment-analytics' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Analytics Report</h2>
                  <p className="text-gray-600">
                    {filters.startDate} to {filters.endDate}
                  </p>
                </div>

                <ReportTable type="payment-analytics" analytics={calculatedData.paymentAnalytics} />
              </div>
              <ReportCharts paymentAnalytics={calculatedData.paymentAnalytics} />
              <InsightsPanel insights={calculatedData.insights} />
            </>
          )}

          {/* Profit & Margin Report */}
          {reportType === 'profit-margin' && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profit & Margin Report</h2>
                <p className="text-gray-600">
                  {filters.startDate} to {filters.endDate}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Cost</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Profit</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Margin %</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Qty Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {calculatedData.productSales.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                        <td className="px-4 py-3 text-right text-gray-800">
                          {formatCurrency(item.totalRevenue)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatCurrency(item.costPrice * item.totalQuantityUnit)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          {formatCurrency(item.profit)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{item.profitMarginPercent.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.totalQuantityUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Selling Products */}
          {reportType === 'top-products' && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Top 10 Selling Products</h2>
                <p className="text-gray-600">
                  {filters.startDate} to {filters.endDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculatedData.topProducts.map((item) => (
                  <div key={item.productId} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">#{item.rank}</p>
                        <p className="text-lg font-bold text-gray-900">{item.productName}</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">★</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(item.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold text-gray-900">{item.totalQuantityUnit} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(item.profit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-semibold text-gray-900">{item.orders}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slow Moving Products */}
          {reportType === 'slow-moving' && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Slow Moving Products</h2>
                <p className="text-gray-600">
                  {filters.startDate} to {filters.endDate}
                </p>
              </div>

              {calculatedData.slowMoving.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-yellow-50 border-b-2 border-yellow-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Qty Sold</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Last Sold</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {calculatedData.slowMoving.slice(0, 20).map((item, index) => (
                        <tr key={index} className="hover:bg-yellow-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{item.quantitySold}</td>
                          <td className="px-4 py-3 text-right text-gray-800">
                            {formatCurrency(item.revenue)}
                          </td>
                          <td className="px-4 py-3 text-left text-gray-600">
                            {item.lastSoldDate || 'Never'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-semibold ${item.daysWithoutSale > 30 ? 'text-red-600' : 'text-orange-600'}`}>
                              {item.daysWithoutSale > 900 ? '∞' : item.daysWithoutSale}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No slow moving products found in this period</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error rendering Reports:', error);
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Reports</h1>
          <p className="text-gray-700">{(error as Error).message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Reload
          </button>
        </div>
      </div>
    );
  }
};

export default Reports;

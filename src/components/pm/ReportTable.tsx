import { ProductSalesReportItem, DailySalesReportItem, PaymentAnalyticsItem } from '../../lib/reportCalculations';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface ReportTableProps {
  type: 'product-sales' | 'daily-sales' | 'payment-analytics';
  data?: any[];
  analytics?: PaymentAnalyticsItem;
}

const ProductSalesTable = ({ data }: { data: ProductSalesReportItem[] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for this period</p>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-blue-50 border-b-2 border-blue-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Product Name</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Qty</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Avg Price</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Profit</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Margin %</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Orders</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.totalQuantityUnit}</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{formatCurrency(item.totalRevenue)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.averageSellingPrice)}</td>
              <td className="px-4 py-3 text-right">
                <span className={item.profit > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {formatCurrency(item.profit)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={item.profitMarginPercent > 30 ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                  {item.profitMarginPercent.toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-600">{item.totalOrders}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
          <tr>
            <td className="px-4 py-3 text-gray-800">TOTAL</td>
            <td className="px-4 py-3 text-center text-gray-800">
              {data.reduce((sum, item) => sum + item.totalQuantityUnit, 0)}
            </td>
            <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(totalRevenue)}</td>
            <td className="px-4 py-3 text-right text-gray-600">-</td>
            <td className="px-4 py-3 text-right text-green-600">{formatCurrency(totalProfit)}</td>
            <td className="px-4 py-3 text-right text-gray-800">
              {data.length > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0}%
            </td>
            <td className="px-4 py-3 text-center text-gray-800">{data.reduce((sum, item) => sum + item.totalOrders, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const DailySalesTable = ({ data }: { data: DailySalesReportItem[] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for this period</p>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-blue-50 border-b-2 border-blue-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Orders</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Products Sold</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Top Product</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">UPI / COD</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{item.date}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.totalOrders}</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{formatCurrency(item.totalRevenue)}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.productsSoldCount}</td>
              <td className="px-4 py-3 text-left text-gray-600">{item.topSellingProduct}</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  {item.upiCount}
                </span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                  {item.codCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
          <tr>
            <td className="px-4 py-3 text-gray-800">TOTAL</td>
            <td className="px-4 py-3 text-center text-gray-800">{totalOrders}</td>
            <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(totalRevenue)}</td>
            <td className="px-4 py-3 text-center text-gray-800">
              {data.reduce((sum, item) => sum + item.productsSoldCount, 0)}
            </td>
            <td colSpan={2} className="px-4 py-3 text-gray-600">
              -
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const PaymentAnalyticsTable = ({ analytics }: { analytics: PaymentAnalyticsItem }) => {
  const totalRevenue = analytics.upiRevenue + analytics.codRevenue;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Total UPI Orders</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.totalUpiOrders}</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.upiPercentage.toFixed(1)}% of total</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-xs text-gray-600 mb-1">Total COD Orders</p>
          <p className="text-2xl font-bold text-red-600">{analytics.totalCodOrders}</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.codPercentage.toFixed(1)}% of total</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-gray-600 mb-1">UPI Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.upiRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalRevenue > 0 ? ((analytics.upiRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-xs text-gray-600 mb-1">COD Revenue</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.codRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalRevenue > 0 ? ((analytics.codRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Metric</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">UPI</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">COD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">Total Orders</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{analytics.totalUpiOrders}</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{analytics.totalCodOrders}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">Total Revenue</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{formatCurrency(analytics.upiRevenue)}</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">{formatCurrency(analytics.codRevenue)}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">Percentage of Total</td>
              <td className="px-4 py-3 text-right text-gray-600">{analytics.upiPercentage.toFixed(2)}%</td>
              <td className="px-4 py-3 text-right text-gray-600">{analytics.codPercentage.toFixed(2)}%</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">Average Order Value</td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                {formatCurrency(analytics.averageOrderValueUpi)}
              </td>
              <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                {formatCurrency(analytics.averageOrderValueCod)}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 bg-yellow-50">
              <td className="px-4 py-3 font-medium text-gray-800">Cancellation/Return Rate</td>
              <td className="px-4 py-3 text-right text-gray-600">-</td>
              <td className="px-4 py-3 text-right">
                <span className="text-red-600 font-semibold">{analytics.codCancellationRate.toFixed(2)}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ReportTable = ({ type, data, analytics }: ReportTableProps) => {
  const renderContent = () => {
    switch (type) {
      case 'product-sales':
        return <ProductSalesTable data={data || []} />;
      case 'daily-sales':
        return <DailySalesTable data={data || []} />;
      case 'payment-analytics':
        return <PaymentAnalyticsTable analytics={analytics!} />;
      default:
        return <div>Unknown report type</div>;
    }
  };

  return <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">{renderContent()}</div>;
};

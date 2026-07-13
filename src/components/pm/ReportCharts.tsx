import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ProductSalesReportItem, DailySalesReportItem, PaymentAnalyticsItem } from '../../lib/reportCalculations';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface ReportChartsProps {
  productSalesData?: ProductSalesReportItem[];
  dailySalesData?: DailySalesReportItem[];
  paymentAnalytics?: PaymentAnalyticsItem;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ReportCharts = ({
  productSalesData = [],
  dailySalesData = [],
  paymentAnalytics,
}: ReportChartsProps) => {
  // Prepare data for charts
  const topProductsData = productSalesData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 8)
    .map((item) => ({
      name: item.productName.substring(0, 15),
      revenue: item.totalRevenue,
      quantity: item.totalQuantityUnit,
      profit: item.profit,
    }));

  const dailyRevenueData = dailySalesData.map((item) => ({
    date: item.date,
    revenue: item.totalRevenue,
    orders: item.totalOrders,
  }));

  const paymentData = paymentAnalytics
    ? [
        { name: 'UPI', value: paymentAnalytics.upiRevenue, count: paymentAnalytics.totalUpiOrders },
        { name: 'COD', value: paymentAnalytics.codRevenue, count: paymentAnalytics.totalCodOrders },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Revenue by Product - Bar Chart */}
      {topProductsData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
              <Bar dataKey="profit" fill="#10b981" name="Profit (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Revenue Trend - Line Chart */}
      {dailyRevenueData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Daily Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                name="Revenue (₹)"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Payment Method Distribution - Pie Chart */}
      {paymentData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Payment Method Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${(value as number).toLocaleString('en-IN')}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Payment Methods Comparison */}
      {paymentAnalytics && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Payment Methods Comparison</h3>
          <div className="space-y-4">
            {/* UPI */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">UPI Orders</span>
                <span className="text-sm font-bold text-blue-600">{paymentAnalytics.totalUpiOrders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(paymentAnalytics.totalUpiOrders / (paymentAnalytics.totalUpiOrders + paymentAnalytics.totalCodOrders)) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Avg Order Value: ₹{paymentAnalytics.averageOrderValueUpi.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            {/* COD */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">COD Orders</span>
                <span className="text-sm font-bold text-red-600">{paymentAnalytics.totalCodOrders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(paymentAnalytics.totalCodOrders / (paymentAnalytics.totalUpiOrders + paymentAnalytics.totalCodOrders)) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Avg Order Value: ₹{paymentAnalytics.averageOrderValueCod.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            {/* Total Revenue */}
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total Revenue</span>
                <span className="font-bold text-gray-800">
                  ₹{(paymentAnalytics.upiRevenue + paymentAnalytics.codRevenue).toLocaleString('en-IN', {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

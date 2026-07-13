import { Insights } from '../../lib/reportCalculations';
import { TrendingUp, AlertCircle, DollarSign, User, Calendar } from 'lucide-react';

interface InsightsPanelProps {
  insights: Insights;
}

export const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-600" size={24} />
        Smart Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Best Selling Product */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">★</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Best Selling Product</p>
          </div>
          <p className="text-lg font-bold text-gray-800">{insights.bestSellingProduct}</p>
          <p className="text-sm text-gray-500 mt-1">{formatCurrency(insights.bestSellingProductRevenue)}</p>
        </div>

        {/* Payment Method Preference */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">💳</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Preferred Payment</p>
          </div>
          <p className="text-lg font-bold text-gray-800">{insights.mostUsedPaymentMethod}</p>
          <p className="text-sm text-gray-500 mt-1">
            {insights.mostUsedPaymentMethodPercentage.toFixed(1)}% of customers
          </p>
        </div>

        {/* Peak Sales Day */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-purple-600" />
            <p className="text-sm text-gray-600 font-medium">Peak Sales Day</p>
          </div>
          <p className="text-lg font-bold text-gray-800">{insights.peakSalesDay}</p>
          <p className="text-sm text-gray-500 mt-1">{formatCurrency(insights.peakSalesDayRevenue)}</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-orange-600" />
            <p className="text-sm text-gray-600 font-medium">Avg Order Value</p>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(insights.averageOrderValue)}</p>
          <p className="text-sm text-gray-500 mt-1">Per transaction</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-cyan-500">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-cyan-600" />
            <p className="text-sm text-gray-600 font-medium">Total Customers</p>
          </div>
          <p className="text-lg font-bold text-gray-800">{insights.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-1">Unique buyers</p>
        </div>

        {/* COD Risk Alert */}
        {insights.codRiskAlert && (
          <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-sm text-gray-600 font-medium">COD Alert</p>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {insights.codCancellationRate.toFixed(1)}% Cancellation
            </p>
            <p className="text-sm text-gray-500 mt-1">High cancellation rate</p>
          </div>
        )}
      </div>

      {/* Summary Text */}
      <div className="mt-6 p-4 bg-white rounded-lg text-sm text-gray-700 space-y-2">
        <p>
          • <span className="font-semibold">{insights.mostUsedPaymentMethod}</span> is preferred by{' '}
          <span className="font-semibold">{insights.mostUsedPaymentMethodPercentage.toFixed(0)}%</span> of
          customers
        </p>
        <p>
          • Best selling product: <span className="font-semibold">{insights.bestSellingProduct}</span>
        </p>
        <p>
          • Peak sales day: <span className="font-semibold">{insights.peakSalesDay}</span> with revenue of{' '}
          {formatCurrency(insights.peakSalesDayRevenue)}
        </p>
        {insights.codRiskAlert && (
          <p className="text-red-600">
            • ⚠️ COD return rate is <span className="font-semibold">{insights.codCancellationRate.toFixed(1)}%</span> -
            Consider COD optimization strategies
          </p>
        )}
      </div>
    </div>
  );
};

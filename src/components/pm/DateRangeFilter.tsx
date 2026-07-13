import { useState } from 'react';
import { ReportFilters } from '../../lib/reportCalculations';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
}

export const DateRangeFilter = ({ filters, onFiltersChange }: DateRangeFilterProps) => {
  const [showCustom, setShowCustom] = useState(filters.dateRange === 'custom');

  const handleDateRangeChange = (range: ReportFilters['dateRange']) => {
    let updatedFilters: ReportFilters = {
      ...filters,
      dateRange: range,
    };

    // Auto-set dates for monthly and yearly
    const now = new Date();
    if (range === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      updatedFilters.startDate = monthStart.toISOString().split('T')[0];
      updatedFilters.endDate = monthEnd.toISOString().split('T')[0];
    } else if (range === 'yearly') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      updatedFilters.startDate = yearStart.toISOString().split('T')[0];
      updatedFilters.endDate = yearEnd.toISOString().split('T')[0];
    }

    onFiltersChange(updatedFilters);
    setShowCustom(range === 'custom');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      startDate: e.target.value,
      dateRange: 'custom',
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      endDate: e.target.value,
      dateRange: 'custom',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">Date Range</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
        <button
          onClick={() => handleDateRangeChange('today')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'today'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handleDateRangeChange('last7days')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'last7days'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => handleDateRangeChange('last30days')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'last30days'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => handleDateRangeChange('monthly')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'monthly'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleDateRangeChange('yearly')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'yearly'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Yearly
        </button>
        <button
          onClick={() => handleDateRangeChange('single')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'single'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Single Date
        </button>
        <button
          onClick={() => handleDateRangeChange('custom')}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            filters.dateRange === 'custom'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Custom
        </button>
      </div>

      {(showCustom || filters.dateRange === 'single') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filters.dateRange === 'single' ? 'Select Date' : 'Start Date'}
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filters.dateRange === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

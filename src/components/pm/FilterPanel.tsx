import { Product } from '../../types';
import { ReportFilters } from '../../lib/reportCalculations';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: ReportFilters;
  products: Product[];
  onFiltersChange: (filters: ReportFilters) => void;
}

export const FilterPanel = ({ filters, products, onFiltersChange }: FilterPanelProps) => {
  const handleProductFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      productFilter: e.target.value,
    });
  };

  const handlePaymentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      paymentFilter: e.target.value as 'all' | 'UPI' | 'COD',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter size={20} className="text-green-600" />
        <h3 className="font-semibold text-gray-800">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
          <select
            value={filters.productFilter}
            onChange={handleProductFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select
            value={filters.paymentFilter}
            onChange={handlePaymentFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Payment Methods</option>
            <option value="UPI">UPI Only</option>
            <option value="COD">COD Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

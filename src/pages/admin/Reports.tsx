import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Download, Filter, FileText } from 'lucide-react';

interface SalesReport {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
  sizes: Record<string, number>;
}

interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  productsSold: number;
  topProduct: string;
}

export const Reports = () => {
  const { orders, products } = useStore();
  console.log('=== REPORTS COMPONENT ===');
  console.log('Orders loaded:', orders.length);
  console.log('Products loaded:', products.length);
  
  const [startDate, setStartDate] = useState('2024-12-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [reportType, setReportType] = useState<'sales' | 'daily'>('sales');
  const [salesReport, setSalesReport] = useState<SalesReport[]>([]);
  const [dailyReport, setDailyReport] = useState<DailySales[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Sales Report
  const generateSalesReport = () => {
    setIsGenerating(true);
    
    console.log('=== GENERATING SALES REPORT ===');
    console.log('Total orders:', orders.length);
    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    console.log('Selected product:', selectedProduct);
    
    if (!startDate || !endDate) {
      console.log('Missing dates - cannot generate report');
      setIsGenerating(false);
      return;
    }
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      console.log('--- Filtering Order ---');
      console.log('Order date string:', order.date);
      console.log('Order date object:', orderDate);
      console.log('Start date:', start);
      console.log('End date:', end);
      console.log('Order date >= start:', orderDate >= start);
      console.log('Order date <= end:', orderDate <= end);
      console.log('Include order:', orderDate >= start && orderDate <= end);
      
      return orderDate >= start && orderDate <= end;
    });
    
    console.log('Filtered orders count:', filteredOrders.length);
    console.log('Filtered orders:', filteredOrders);

    const productSales: Record<string, SalesReport> = {};

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (selectedProduct !== 'all' && item.productId !== selectedProduct) return;
        
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            totalSold: 0,
            totalRevenue: 0,
            averagePrice: 0,
            sizes: {}
          };
        }

        const report = productSales[item.productId];
        report.totalSold += item.quantity;
        report.totalRevenue += item.priceAtPurchase * item.quantity;
        
        // Track size sales
        if (!report.sizes[item.size]) {
          report.sizes[item.size] = 0;
        }
        report.sizes[item.size] += item.quantity;
      });
    });

    // Calculate average prices
    Object.values(productSales).forEach(report => {
      report.averagePrice = report.totalSold > 0 ? report.totalRevenue / report.totalSold : 0;
    });

    setSalesReport(Object.values(productSales));
    setIsGenerating(false);
  };

  // Generate Daily Sales Report
  const generateDailyReport = () => {
    setIsGenerating(true);
    
    console.log('=== GENERATING DAILY REPORT ===');
    console.log('Total orders:', orders.length);
    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    
    if (!startDate || !endDate) {
      console.log('Missing dates - cannot generate report');
      setIsGenerating(false);
      return;
    }
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      console.log('--- Filtering Order ---');
      console.log('Order date string:', order.date);
      console.log('Order date object:', orderDate);
      console.log('Start date:', start);
      console.log('End date:', end);
      console.log('Include order:', orderDate >= start && orderDate <= end);
      
      return orderDate >= start && orderDate <= end;
    });
    
    console.log('Filtered daily orders count:', filteredOrders.length);

    const dailySales: Record<string, DailySales> = {};

    filteredOrders.forEach(order => {
      const dateKey = new Date(order.date).toISOString().split('T')[0];
      
      if (!dailySales[dateKey]) {
        dailySales[dateKey] = {
          date: dateKey,
          totalOrders: 0,
          totalRevenue: 0,
          productsSold: 0,
          topProduct: ''
        };
      }

      const dayReport = dailySales[dateKey];
      dayReport.totalOrders += 1;
      dayReport.totalRevenue += order.totalAmount;
      
      // Track products sold and find top product
      const productCounts: Record<string, number> = {};
      order.items.forEach(item => {
        dayReport.productsSold += item.quantity;
        productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
      });
      
      // Find top product for the day
      dayReport.topProduct = Object.entries(productCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    });

    setDailyReport(Object.values(dailySales).sort((a, b) => b.date.localeCompare(a.date)));
    setIsGenerating(false);
  };

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    if (reportType === 'sales') {
      generateSalesReport();
    } else {
      generateDailyReport();
    }
  };

  const currentReport = reportType === 'sales' ? salesReport : dailyReport;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Reports</h1>
      
      {/* Report Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Product Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Filter</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'sales' | 'daily')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="sales">Product Sales Report</option>
              <option value="daily">Daily Sales Report</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating || !startDate || !endDate}
            isLoading={isGenerating}
          >
            <Filter className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          
          {currentReport.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => exportToCSV(currentReport, `${reportType}-report-${new Date().toISOString().split('T')[0]}`)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Report Results */}
      {currentReport.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              {reportType === 'sales' ? 'Product Sales Report' : 'Daily Sales Report'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {startDate} to {endDate} • {currentReport.length} records
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {reportType === 'sales' ? (
              // Sales Report Table
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Total Sold</th>
                    <th className="px-4 py-3 text-left">Total Revenue</th>
                    <th className="px-4 py-3 text-left">Avg Price</th>
                    <th className="px-4 py-3 text-left">Size Breakdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesReport.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.productName}</td>
                      <td className="px-4 py-3">{item.totalSold}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(item.totalRevenue)}</td>
                      <td className="px-4 py-3">{formatCurrency(item.averagePrice)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {Object.entries(item.sizes).map(([size, count]) => (
                            <span key={size} className="inline-block mr-3">
                              {size}: {count}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Daily Sales Report Table
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Orders</th>
                    <th className="px-4 py-3 text-left">Revenue</th>
                    <th className="px-4 py-3 text-left">Products Sold</th>
                    <th className="px-4 py-3 text-left">Top Product</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailyReport.map((day, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{day.date}</td>
                      <td className="px-4 py-3">{day.totalOrders}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(day.totalRevenue)}</td>
                      <td className="px-4 py-3">{day.productsSold}</td>
                      <td className="px-4 py-3">{day.topProduct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Data</h3>
            <p className="text-sm text-gray-600">
              {startDate && endDate 
                ? `No orders found between ${startDate} and ${endDate}. Try adjusting the date range.`
                : 'Select a date range and click "Generate Report" to view sales data.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

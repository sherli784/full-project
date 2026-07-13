import { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Download, Filter, FileText, BarChart3, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface SalesData {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
  sizes: Record<string, number>;
}

interface DailySalesData {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  productsSold: number;
  topProduct: string;
}

export const SalesReport = () => {
  const { orders, products } = useStore();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = today.toISOString().split('T')[0];
  
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dailyData, setDailyData] = useState<DailySalesData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const getDateRange = (filter: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (filter) {
      case 'daily':
        return { start: today, end: today };
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: weekAgo.toISOString().split('T')[0], end: today };
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { start: monthAgo.toISOString().split('T')[0], end: today };
      case 'yearly':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return { start: yearAgo.toISOString().split('T')[0], end: today };
      default:
        return { start: '', end: '' };
    }
  };

  const handleTimeFilterChange = (filter: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') => {
    setTimeFilter(filter);
    if (filter !== 'custom') {
      const range = getDateRange(filter);
      setStartDate(range.start);
      setEndDate(range.end);
    }
  };

  const generateReport = () => {
    console.log('=== GENERATING SALES REPORT ===');
    console.log('Time filter:', timeFilter);
    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    console.log('Selected product:', selectedProduct);
    console.log('Total orders available:', orders.length);
    
    if (!startDate || !endDate) {
      alert('Please select valid start and end dates.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        console.log('Filtering order:', order.id, order.date, '>=', start, '<=', end, 'Result:', orderDate >= start && orderDate <= end);
        
        return orderDate >= start && orderDate <= end;
      });

      console.log('Filtered orders count:', filteredOrders.length);
      console.log('Filtered orders:', filteredOrders);

      const productSales: Record<string, SalesData> = {};
      const dailySales: Record<string, DailySalesData> = {};

      filteredOrders.forEach(order => {
        const dateKey = new Date(order.date).toISOString().split('T')[0];
        
        // Initialize daily sales
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

        order.items.forEach(item => {
          dayReport.productsSold += item.quantity;
          
          // Filter by product if specified
          if (selectedProduct !== 'all' && item.productId !== selectedProduct) {
            return;
          }
          
          // Initialize product sales
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

      // Find top products for each day
      Object.values(dailySales).forEach(dayReport => {
        const productCounts: Record<string, number> = {};
        
        filteredOrders
          .filter(order => new Date(order.date).toISOString().split('T')[0] === dayReport.date)
          .forEach(order => {
            order.items.forEach(item => {
              if (selectedProduct === 'all' || item.productId === selectedProduct) {
                productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
              }
            });
          });
        
        dayReport.topProduct = Object.entries(productCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
      });

      const finalSalesData = Object.values(productSales);
      const finalDailyData = Object.values(dailySales).sort((a, b) => b.date.localeCompare(a.date));
      
      console.log('Final sales data:', finalSalesData);
      console.log('Final daily data:', finalDailyData);

      setSalesData(finalSalesData);
      setDailyData(finalDailyData);
      
      alert('Report generated successfully!');
      
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = () => {
    console.log('=== ALTERNATIVE PDF EXPORT ===');
    console.log('Sales data:', salesData);
    console.log('Daily data:', dailyData);
    
    if (salesData.length === 0 && dailyData.length === 0) {
      alert('No report data to export. Please generate a report first.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create PDF with different approach
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('SALES REPORT', 105, 20, { align: 'center' });
      
      // Add basic info
      pdf.setFontSize(10);
      pdf.text(`Period: ${timeFilter}`, 20, 35);
      pdf.text(`Date Range: ${startDate} to ${endDate}`, 20, 45);
      pdf.text(`Product: ${selectedProduct === 'all' ? 'All Products' : products.find(p => p.id === selectedProduct)?.name || 'Unknown'}`, 20, 55);
      
      // Add summary
      const totalQuantity = salesData.reduce((sum, item) => sum + item.totalSold, 0);
      const totalRevenue = salesData.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalOrders = dailyData.reduce((sum, item) => sum + item.totalOrders, 0);
      
      pdf.setFontSize(12);
      pdf.text('SUMMARY', 20, 75);
      pdf.setFontSize(10);
      pdf.text(`Total Quantity Sold: ${totalQuantity}`, 20, 85);
      pdf.text(`Total Revenue: ${totalRevenue}`, 20, 95);
      pdf.text(`Total Orders: ${totalOrders}`, 20, 105);
      
      // Add product data
      if (salesData.length > 0) {
        pdf.addPage();
        pdf.setFontSize(12);
        pdf.text('PRODUCT DATA', 20, 20);
        pdf.setFontSize(9);
        
        let y = 35;
        salesData.forEach((item, index) => {
          if (y > 250) {
            pdf.addPage();
            y = 20;
          }
          pdf.text(`${index + 1}. ${item.productName}`, 20, y);
          pdf.text(`   Quantity: ${item.totalSold}`, 25, y + 8);
          pdf.text(`   Revenue: ${item.totalRevenue}`, 25, y + 16);
          y += 30;
        });
      }
      
      // Create blob and download
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SalesReport_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('PDF downloaded successfully!');
      alert('PDF exported successfully!');
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF export failed. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToExcel = () => {
    if (salesData.length === 0 && dailyData.length === 0) {
      alert('No report data to export. Please generate a report first.');
      return;
    }
    
    try {
      const wb = XLSX.utils.book_new();
      
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Quantity Sold', salesData.reduce((sum, item) => sum + item.totalSold, 0)],
        ['Total Revenue', salesData.reduce((sum, item) => sum + item.totalRevenue, 0)],
        ['Total Orders', dailyData.reduce((sum, item) => sum + item.totalOrders, 0)],
        ['Period', timeFilter],
        ['Date Range', `${startDate} to ${endDate}`],
        ['Product Filter', selectedProduct === 'all' ? 'All Products' : products.find(p => p.id === selectedProduct)?.name || 'Unknown']
      ];
      
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      
      if (selectedProduct === 'all' && salesData.length > 0) {
        const productData = [
          ['Product', 'Quantity Sold', 'Revenue', 'Average Price', 'Size Breakdown']
        ];
        
        salesData.forEach(item => {
          const sizeBreakdown = Object.entries(item.sizes)
            .map(([size, count]) => `${size}: ${count}`)
            .join(', ');
          
          productData.push([
            item.productName,
            item.totalSold.toString(),
            item.totalRevenue.toString(),
            formatCurrency(item.averagePrice),
            sizeBreakdown
          ]);
        });
        
        const wsProducts = XLSX.utils.aoa_to_sheet(productData);
        XLSX.utils.book_append_sheet(wb, wsProducts, 'Product-wise');
      }
      
      if (dailyData.length > 0) {
        const dailySheetData = [
          ['Date', 'Orders', 'Revenue', 'Products Sold', 'Top Product']
        ];
        
        dailyData.forEach(day => {
          dailySheetData.push([
            day.date,
            day.totalOrders.toString(),
            day.totalRevenue.toString(),
            day.productsSold.toString(),
            day.topProduct
          ]);
        });
        
        const wsDaily = XLSX.utils.aoa_to_sheet(dailySheetData);
        XLSX.utils.book_append_sheet(wb, wsDaily, 'Daily');
      }
      
      XLSX.writeFile(wb, `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert('Excel exported successfully!');
    } catch (error: any) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={timeFilter !== 'custom'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={timeFilter !== 'custom'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>
          
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
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={generateReport}
            disabled={isGenerating || !startDate || !endDate}
            isLoading={isGenerating}
          >
            <Filter className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          
          {(salesData.length > 0 || dailyData.length > 0) && (
            <>
              <Button 
                variant="outline"
                onClick={exportToPDF}
                disabled={isGenerating}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  console.log('Test PDF generation...');
                  const pdf = new jsPDF();
                  pdf.text('Test PDF', 20, 20);
                  pdf.save('test.pdf');
                }}
                disabled={isGenerating}
              >
                <FileText className="w-4 h-4 mr-2" />
                Test PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // HTML-based PDF export as backup
                  const printContent = document.getElementById('pdf-content');
                  if (printContent) {
                    const printWindow = window.open('', '', 'width=800,height=600');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Sales Report</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              h1 { color: #333; }
                              table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                              th { background-color: #f2f2f2; }
                            </style>
                          </head>
                          <body>
                            <h1>Sales Report</h1>
                            <p><strong>Period:</strong> ${timeFilter}</p>
                            <p><strong>Date Range:</strong> ${startDate} to ${endDate}</p>
                            <p><strong>Product:</strong> ${selectedProduct === 'all' ? 'All Products' : products.find(p => p.id === selectedProduct)?.name || 'Unknown'}</p>
                            <h2>Summary</h2>
                            <p><strong>Total Quantity Sold:</strong> ${salesData.reduce((sum, item) => sum + item.totalSold, 0)}</p>
                            <p><strong>Total Revenue:</strong> ${salesData.reduce((sum, item) => sum + item.totalRevenue, 0)}</p>
                            <p><strong>Total Orders:</strong> ${dailyData.reduce((sum, item) => sum + item.totalOrders, 0)}</p>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}
                disabled={isGenerating}
              >
                <FileText className="w-4 h-4 mr-2" />
                Print PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={exportToExcel}
                disabled={isGenerating}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </>
          )}
        </div>
      </div>

      {(salesData.length > 0 || dailyData.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quantity Sold</p>
                <p className="text-xl font-bold text-gray-900">
                  {salesData.reduce((sum, item) => sum + item.totalSold, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(salesData.reduce((sum, item) => sum + item.totalRevenue, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {dailyData.reduce((sum, item) => sum + item.totalOrders, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    dailyData.length > 0 
                      ? dailyData.reduce((sum, item) => sum + item.totalRevenue, 0) / dailyData.reduce((sum, item) => sum + item.totalOrders, 0)
                      : 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100" ref={reportRef} id="pdf-content">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            {selectedProduct === 'all' ? 'All Products Sales Report' : `${products.find(p => p.id === selectedProduct)?.name || 'Unknown'} Sales Report`}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} • {startDate} to {endDate} • 
            {selectedProduct === 'all' ? `${salesData.length} products` : '1 product'}
          </p>
        </div>
        
        {selectedProduct === 'all' && salesData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Quantity Sold</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Average Price</th>
                  <th className="px-4 py-3 text-left">Size Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map((item, idx) => (
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
          </div>
        )}
        
        {selectedProduct !== 'all' && salesData.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Daily Sales</h4>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(salesData[0]?.totalSold / 30 || 0)}
                </p>
                <p className="text-sm text-gray-600">Average per day</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Weekly Sales</h4>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(salesData[0]?.totalSold / 4 || 0)}
                </p>
                <p className="text-sm text-gray-600">Average per week</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Monthly Sales</h4>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(salesData[0]?.totalSold / 1 || 0)}
                </p>
                <p className="text-sm text-gray-600">Average per month</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-bold text-gray-800 mb-4">Size Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(salesData[0]?.sizes || {}).map(([size, count]) => (
                  <div key={size} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{size}</p>
                      <p className="text-lg font-medium text-blue-600">{count}</p>
                      <p className="text-sm text-gray-600">units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {dailyData.length > 0 && (
          <div className="overflow-x-auto">
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
                {dailyData.map((day, idx) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

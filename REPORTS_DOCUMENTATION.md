# Sales Reports Module - Documentation

## Overview

The Sales Reports Module is a comprehensive reporting and analytics system for the Product Manager (PM) sub-module of the E-commerce Admin Dashboard. It provides detailed insights into sales performance, payment analytics, product trends, and business metrics.

## Features Implemented

### 1️⃣ Report Types

#### Product Sales Report
- **Columns:**
  - Product Name
  - Category
  - Total Quantity Sold
  - Total Revenue
  - Average Selling Price
  - Size Breakdown
  - Cost Price
  - Profit
  - Profit Margin %
  - Total Orders

- **Calculations:**
  - Revenue = Quantity × Selling Price
  - Profit = Revenue – Cost Price
  - Profit % = (Profit / Revenue) × 100

#### Daily Sales Report
- **Columns:**
  - Date
  - Total Orders
  - Total Revenue
  - Products Sold Count
  - Top Selling Product
  - UPI Count / COD Count

#### Payment Analytics Report (UPI & COD)
- **Metrics:**
  - Total UPI Orders
  - Total COD Orders
  - UPI Revenue
  - COD Revenue
  - UPI Percentage
  - COD Percentage
  - Average Order Value (UPI vs COD)
  - COD Cancellation Rate
  - COD Return Percentage

#### Profit & Margin Report
- **Columns:**
  - Product Name
  - Total Revenue
  - Total Cost
  - Profit
  - Profit Margin %
  - Quantity Sold
  - Average Profit Per Unit

#### Top Selling Products
- **Features:**
  - Sort by Revenue (Descending)
  - Top 10 Products Display
  - Rank, Product Name, Revenue, Quantity, Profit, Orders

#### Slow Moving Products
- **Features:**
  - Shows products with low or zero sales
  - Displays last sold date
  - Days without sale calculation
  - Sorted by inactivity

### 2️⃣ Date Filtering System

#### Predefined Filters
- **Today (Daily):** Current date only
- **Last 7 Days (Weekly):** Last 7 days including today
- **Last 30 Days (Monthly):** Last 30 days including today
- **Single Date:** Select a specific date
- **Custom Date Range:** Select start and end dates

#### Features
- End date includes full day logic (23:59:59)
- Timezone-safe date calculations
- Works across all report types
- End date must be >= Start date

### 3️⃣ Filters Section

#### Product Filter
- **Items:**
  - All Products (default)
  - Individual Product Selection
  - Automatically updates all reports

#### Payment Method Filter
- **Items:**
  - All (default)
  - UPI Only
  - COD Only
  - Dynamically updates reports and charts

#### Dynamic Updates
- All reports update automatically when filters change
- Charts reflect filter changes in real-time
- Export functionality respects current filters

### 4️⃣ Charts Integration

#### Chart Types Included
1. **Bar Chart - Revenue by Product**
   - Shows top 8 products by revenue
   - Displays both Revenue and Profit
   - Sortable data

2. **Line Chart - Daily Revenue Trend**
   - Shows revenue trend over selected date range
   - Smooth curve visualization
   - Interactive tooltips

3. **Pie Chart - UPI vs COD Revenue Distribution**
   - Payment method breakdown
   - Percentage labels
   - Interactive legend

4. **Comparison Chart - Payment Methods**
   - UPI Orders vs COD Orders
   - Progress bars for visual comparison
   - Average Order Value comparison

#### Features
- Auto-updates when filters change
- Interactive tooltips with formatted currency
- Responsive design
- Legend support

### 5️⃣ Export Functionality

#### PDF Export
- **Includes:**
  - Company Name
  - Report Title
  - Selected Date Range
  - Selected Filters (Product, Payment Method)
  - Tabular Data
  - Grand Totals
  - Payment Breakdown
  - Summary Section
  - Page Numbers
  - Generated Date & Time

- **File Format:** `ReportType_YYYY-MM-DD.pdf`
- **Supported Reports:** Product Sales, Daily Sales, Payment Analytics

#### CSV/Excel Export
- **Includes:**
  - All visible filtered data
  - Column headers
  - Formatted data rows
  - Maintains spreadsheet compatibility

- **File Format:** `ReportType_YYYY-MM-DD.xlsx`
- **Supported Reports:** Product Sales, Daily Sales, Payment Analytics

### 6️⃣ Smart Insights Section

#### Auto-Generated Insights
The system automatically generates valuable business insights:

1. **Best Selling Product**
   - Product name
   - Revenue amount

2. **Preferred Payment Method**
   - UPI or COD
   - Percentage of usage

3. **Peak Sales Day**
   - Date with highest revenue
   - Revenue amount

4. **Average Order Value**
   - Overall average
   - Per transaction

5. **Total Customers**
   - Unique buyer count in period

6. **COD Risk Alert**
   - Cancellation rate alert
   - Triggers if > 15%
   - Suggests optimization

#### Summary Text
Automatically generated summary with bullet points:
- Payment method preferences
- Best selling product
- Peak sales information
- Risk alerts

### 7️⃣ UI/UX Features

#### Design
- Clean, professional admin dashboard
- Modern gradient cards
- Color-coded sections
- Responsive grid layout

#### Sections
- Header with title and icon
- Report type selector (6 types)
- Filtters section (2-column layout)
- Export buttons (PDF & CSV)
- Loading state indicator
- Summary KPI cards
- Data tables with sorting
- Charts visualization
- Smart insights panel
- Empty state messages

#### Responsiveness
- Mobile-friendly design
- Tablet optimized
- Desktop-first approach
- Flexible grids

### 8️⃣ Technical Implementation

#### Architecture
- **Frontend:** React + TypeScript
- **State Management:** React hooks (useState, useMemo)
- **Data Calculations:** Dedicated utility functions
- **Chart Library:** Recharts
- **PDF Export:** jsPDF + jsPDF-autotable
- **Excel Export:** XLSX (SheetJS)
- **Date Handling:** date-fns

#### File Structure
```
src/
├── lib/
│   ├── reportCalculations.ts (All calculations & logic)
│   └── exportUtils.ts (PDF & CSV export functions)
├── components/
│   └── pm/
│       ├── DateRangeFilter.tsx (Date filter component)
│       ├── FilterPanel.tsx (Product & payment filters)
│       ├── ReportCharts.tsx (Chart visualizations)
│       ├── ReportTable.tsx (Table components)
│       └── InsightsPanel.tsx (Insights display)
└── pages/
    └── pm/
        └── Reports.tsx (Main Reports page)
```

#### Key Functions
- `calculateProductSalesReport()` - Product sales calculations
- `calculateDailySalesReport()` - Daily aggregation
- `calculatePaymentAnalytics()` - Payment metrics
- `calculateTopSellingProducts()` - Top products ranking
- `calculateSlowMovingProducts()` - Slow movers detection
- `generateInsights()` - Business insights generation
- `exportProductSalesReportPDF()` - PDF generation
- `exportProductSalesReportCSV()` - CSV export

### 9️⃣ Data Accuracy

#### Calculations Ensure
- Timezone-safe date filtering
- Accurate profit calculations (Revenue - Cost)
- Correct margin percentages
- Proper payment method categorization
- Size breakdown accuracy
- Full-day end date logic (23:59:59)

#### Cost Price Calculation
- Assumed at 60% of base price
- Can be made configurable
- Used in profit calculations

#### Currency Formatting
- Indian Rupee (INR) formatting
- Locale-aware number formatting
- 0 decimal places for display

### 🔟 Performance Optimization

#### Techniques Used
- `useMemo()` for expensive calculations
- Report data computed once per filter change
- Lazy chart rendering
- Efficient table pagination
- No infinite loops

#### Scalability
- Handles large datasets effectively
- Date range filtering reduces data size
- Incremental calculations

## Usage Guide

### Quick Start

1. **Select Report Type**
   - Click one of 6 report type buttons at the top

2. **Set Date Range**
   - Choose preset (Today, Last 7 Days, Last 30 Days)
   - Or select Custom for date range
   - Or Single Date for specific date

3. **Apply Filters (Optional)**
   - Filter by specific product
   - Filter by payment method (UPI/COD)

4. **View Results**
   - Tables auto-populate
   - Charts auto-update
   - Insights auto-generate

5. **Export Data (Optional)**
   - Click "Export PDF" or "Export Excel/CSV"
   - Files download immediately

### Advanced Features

#### Compare Performance
- Use date range filters to compare periods
- Check growth metrics in insights

#### Identify Problems
- Check "Slow Moving Products" for inventory issues
- Monitor "COD Cancellation Rate" for payment issues
- Review "Daily Sales Report" for trend analysis

#### Optimize Business
- Use "Top Products" to focus marketing
- Analyze "Payment Analytics" for payment optimization
- Track "Daily Sales Trend" for seasonal patterns

## API Integration

### Orders Data Required
- `order.id` - Unique identifier
- `order.date` - ISO date string (e.g., "2024-01-15T14:30:00Z")
- `order.items[]` - Array of ordered items
- `order.items[].productId` - Product identifier
- `order.items[].productName` - Product name
- `order.items[].quantity` - Quantity ordered
- `order.items[].priceAtPurchase` - Price at time of order
- `order.items[].size` - Product size (S, M, L, XL)
- `order.totalAmount` - Order total
- `order.paymentMethod` - 'UPI' or 'COD'

### Products Data Required
- `product.id` - Unique identifier
- `product.name` - Product name
- `product.category` - Category
- `product.basePrice` - Base price
- All other product fields

## Future Enhancements

### Potential Features
1. Comparison Period Analysis (Current vs Previous Period)
2. Custom metric definitions
3. Scheduled report generation
4. Email report delivery
5. Advanced filtering (category, price range)
6. Custom date range presets
7. Data export to multiple formats
8. Real-time dashboard updates
9. Predictive analytics
10. Custom report builder

## Notes

- Cost price is currently fixed at 60% of base price (configurable)
- COD cancellation/return rates are estimated at 10%/5% (should be loaded from actual data)
- Reports are generated client-side for real-time updates
- Large datasets may require pagination at scale
- All dates use full-day logic (00:00:00 to 23:59:59)

## Support

For issues or feature requests, contact the development team with:
- Report type affected
- Date range used
- Filters applied
- Expected vs actual behavior
- Screenshot or error message

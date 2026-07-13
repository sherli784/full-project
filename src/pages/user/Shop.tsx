import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product, ProductSize } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { RatingDisplay } from '../../components/ui/RatingDisplay';

export const Shop = () => {
  const { products, addToCart, addToWishlist, wishlist } = useStore();
  const { t } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(cat => cat !== 'Dress')))];
  
  const getCategoryTranslation = (category: string) => {
    if (!t.categories) return category;
    
    const categoryKey = category.toLowerCase().replace(/[^a-z]/g, '');
    switch (categoryKey) {
      case 'all': return t.categories.all || category;
      case 'dress': return t.categories.dress || category;
      case 'tshirt': return t.categories.tShirt || category;
      case 'shirt': return t.categories.shirt || category;
      case 'shirts': return t.categories.shirts || category;
      case 'pants': return t.categories.pants || category;
      case 'shorts': return t.categories.shorts || category;
      case 'jacket': return t.categories.jacket || category;
      case 'sweater': return t.categories.sweater || category;
      case 'jeans': return t.categories.jeans || category;
      case 'tshirts': return t.categories.tshirts || category;
      case 'partywear': return t.categories.partyWear || category;
      default: return category;
    }
  };
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const productMinPrice = Math.min(...Object.values(p.sizes).map((size: any) => size.price));
    const matchesPrice = productMinPrice >= priceRange.min && productMinPrice <= priceRange.max;
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 text-shadow">
              KM Fashion Collection
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover the latest trends in fashion
            </p>
            <div className="flex justify-center gap-4">
              <div className="animate-bounce">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-sm font-medium">New Arrivals</span>
                </div>
              </div>
              <div className="animate-pulse">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-sm font-medium">Limited Offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 animate-slideInLeft">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-gradient">
                Filters
              </h2>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover-scale ${
                        categoryFilter === category
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getCategoryTranslation(category)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Min Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Max Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow animate-slideInRight">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Showing{' '}
                    <span className="text-gradient">{filteredProducts.length}</span>{' '}
                    products found
                  </h2>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || categoryFilter !== 'All') && (
              <div className="mb-8 flex flex-wrap gap-3 animate-fadeIn">
                {searchQuery && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover-scale">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-white/80 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {categoryFilter !== 'All' && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover-scale">
                    Category: {getCategoryTranslation(categoryFilter)}
                    <button
                      onClick={() => setCategoryFilter('All')}
                      className="ml-2 text-white/80 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 animate-fadeIn">
                <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">No Results</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">No products found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover-scale btn-gradient"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-scaleIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <ShopProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onWishlist={() => addToWishlist(product.id)}
                      isWishlisted={wishlist.includes(product.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const ShopProductCard = ({ 
  product, 
  onAddToCart, 
  onWishlist,
  isWishlisted 
}: { 
  product: Product; 
  onAddToCart: (productId: string, size: ProductSize, quantity: number) => void;
  onWishlist: (productId: string) => void;
  isWishlisted: boolean;
}) => {
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    try {
      await onAddToCart(product.id, selectedSize, 1);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'limited-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return t.home?.inStock || 'In Stock';
      case 'limited-stock':
        return t.home?.limitedStock || 'Limited Stock';
      case 'out-of-stock':
        return t.home?.outOfStock || 'Out of Stock';
      default:
        return t.home?.unknown || 'Unknown';
    }
  };

  const getProductTranslation = (productName: string) => {
    if (!t.product?.names) return productName;
    return t.product.names[productName] || productName;
  };

  const getDescriptionTranslation = (description: string) => {
    if (!t.product?.descriptions) return description;
    return t.product.descriptions[description] || description;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden card-elevated hover-lift group">
      {/* Product Image */}
      <div className="relative overflow-hidden h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <img 
          src={product.image || '/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Wishlist Button */}
        <button
          onClick={() => onWishlist(product.id)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover-scale"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-200 ${
              isWishlisted ? 'fill text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
        
        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
            NEW
          </div>
        )}
        {product.availability && (
          <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${getAvailabilityBadge(product.availability)}`}>
            {getAvailabilityText(product.availability)}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {getProductTranslation(product.name)}
        </h3>
        
        {/* Rating */}
        <div className="mb-4">
          <RatingDisplay 
            productId={product.id} 
            averageRating={product.averageRating || 0}
            totalRatings={product.totalRatings || 0}
            showRatingForm={true}
          />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {getDescriptionTranslation(product.description)}
        </p>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gradient">
              {selectedSize 
                ? formatCurrency(product.sizes[selectedSize].price)
                : formatCurrency(Math.min(...Object.values(product.sizes).map((size: any) => size.price)))
              }
            </span>
            {!selectedSize && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(Math.max(...Object.values(product.sizes).map((size: any) => size.price)))}
              </span>
            )}
          </div>
          {!selectedSize && (
            <p className="text-xs text-gray-500 mt-1">Select size to see price</p>
          )}
        </div>
        
        {/* Sizes */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select Size
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(product.sizes).map(([size, data]) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size as ProductSize)}
                disabled={data.stock === 0}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover-scale ${
                  selectedSize === size
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
                    : data.stock === 0
                    ? 'border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500'
                }`}
              >
                {size}
                {data.stock === 0 && (
                  <span className="text-xs">Out of Stock</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || isAddingToCart}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200 hover-scale disabled:opacity-50 disabled:cursor-not-allowed btn-gradient"
        >
          {isAddingToCart ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              <span className="ml-2">Adding...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </span>
          )}
        </button>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn z-50">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010-1.414 0l-8 8a1 1 0 01-1.414 0l8-8a1 1 0 01-1.414 0z"/>
              </svg>
            </div>
            <span className="font-medium">Added to cart!</span>
          </div>
        </div>
      )}
    </div>
  );
};

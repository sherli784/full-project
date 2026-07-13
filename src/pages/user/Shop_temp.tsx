import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product, ProductSize } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { RatingDisplay } from '../../components/ui/RatingDisplay';

export const Shop = () => {
  const { products, addToCart, addToWishlist, wishlist } = useStore();
  const { t, language } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(cat => cat !== 'Dress')))];
  
  const getProductTranslation = (productName: string) => {
    if (!t.product?.names) return productName; // Fallback if translations not loaded
    return t.product.names[productName] || productName;
  };

  const getCategoryTranslation = (category: string) => {
    if (!t.categories) return category; // Fallback if translations not loaded
    
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
      'case 'sweater': return t.categories.sweater || category;
      'jeans': return t.categories.jeans || category;
      'tshirts': return t.categories.tshirts || category;
      'partywear': return t.categories.partyWear || category;
      default: return category;
    }
  };
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const productMinPrice = Math.min(...Object.values(p.sizes).map(size => size.price));
    const matchesPrice = productMinPrice >= priceRange.min && productMinPrice <= priceRange.max;
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
          <h3 className="font-bold text-lg mb-4 text-gray-900">{t.common.categories}</h3>
          <ul className="space-y-2 mb-6">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {cat === 'All' ? t.categories.all : getCategoryTranslation(cat)}
                </button>
              </li>
            ))}
          </ul>

          {/* Price Range Filter */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">{t.common.priceRange}</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">{t.common.minPrice}</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">{t.common.maxPrice}</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t.common.showing} {filteredProducts.length} {t.common.found} {t.common.products.toLowerCase()}
              </h2>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || categoryFilter !== 'All') && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                {t.common.search}: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                {t.common.categories}: {getCategoryTranslation(categoryFilter)}
                <button
                  onClick={() => setCategoryFilter('All')}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
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
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {t.common.clearAllFilters}
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.common.noResults}</h2>
            <p className="text-gray-500 mb-8">{t.common.noResultsMessage}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setPriceRange({ min: 0, max: 10000 });
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t.common.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onWishlist={() => addToWishlist(product.id)}
                isWishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>
        )}
      </main>
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
  const [selectedSize, setSelectedSize] = useState<ProductSize>('S');
  const [quantity, setQuantity] = useState(1);

  const getProductTranslation = (productName: string) => {
    if (!t.product?.names) return productName; // Fallback if translations not loaded
    return t.product.names[productName] || productName;
  };

  const getCategoryTranslation = (category: string) => {
    if (!t.categories) return category; // Fallback if translations not loaded
    
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
      'case 'sweater': return t.categories.sweater || category;
      'jeans': return t.categories.jeans || category;
      'tshirts': return t.categories.tshirts || category;
      'partywear': return t.categories.partyWear || category;
      default: return category;
    }
  };

  const sizeData = product.sizes[selectedSize];
  const hasStock = sizeData.stock > 0;

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > sizeData.stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (quantity > sizeData.stock) return;
    onAddToCart(product.id, selectedSize, quantity);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <div className="relative aspect-[4/5] bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <button 
          onClick={() => onWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <Heart className={cn("w-5 h-5", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{getProductTranslation(product.name)}</h3>
        <p className="text-sm text-gray-500 mb-3">{getCategoryTranslation(product.category)}</p>
        
        <RatingDisplay 
          productId={product.id}
          averageRating={product.averageRating}
          totalRatings={product.totalRatings}
          showRatingForm={false}
        />
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              hasStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              {hasStock ? `${sizeData.stock} ${t.common.inStock}` : t.common.outOfStock}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">{t.common.size}</label>
          <div className="flex gap-2 mb-4">
            {Object.entries(product.sizes).map(([size, data]) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size as ProductSize)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200",
                  selectedSize === size
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                )}
                disabled={data.stock === 0}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">{t.common.quantity}</label>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              disabled={quantity >= sizeData.stock}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(sizeData.price)}</span>
            {!hasStock && <span className="block text-xs text-red-500 font-medium">{t.common.outOfStock}</span>}
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!hasStock || quantity > sizeData.stock}
          >
            <ShoppingCart className="w-4 h-4 mr-1" /> {t.common.addToCart}
          </Button>
        </div>
      </div>
    </div>
  );
};

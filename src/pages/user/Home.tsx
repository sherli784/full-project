import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { RatingDisplay } from '../../components/ui/RatingDisplay';

export const UserHome = () => {
  console.log('UserHome component rendered');
  const { products, offers } = useStore();
  const { t, language } = useLanguage();
  
  // Debug: Check if translations are loaded
  console.log('Home - language:', language);
  console.log('Home - t.home:', t?.home);
  console.log('Home - t.home.specialOffer:', t?.home?.specialOffer);

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero / Offers Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 border dark:border-gray-700 text-white min-h-[400px] flex items-center">
        {offers.length > 0 ? (
          <>
            <img
              src={offers[0].image}
              alt="Offer"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 px-8 md:px-16 max-w-2xl">
              <span className="inline-block bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                {t.home.specialOffer}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{offers[0].title}</h1>
              <p className="text-xl text-gray-200 mb-6">{offers[0].description}</p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded border border-white/20">
                  <span className="text-sm text-gray-300 block">{t.home.useCode}</span>
                  <span className="font-mono font-bold text-lg">{offers[0].discountCode}</span>
                </div>
                <Link to="/user/shop">
                  <Button size="lg">{t.home.shopNow} <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="relative z-10 px-8 md:px-16">
            <h1 className="text-5xl font-bold mb-4">{t.home.elevateYourStyle}</h1>
            <p className="text-xl text-gray-300 mb-8">{t.home.discoverLatestTrends}</p>
            <Link to="/user/shop">
              <Button size="lg">{t.home.exploreCollection}</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Trending Collections */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" />
            {t.home.trendingCollections}
          </h2>
          <Link to="/user/shop" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
            {t.home.viewAll} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Tag className="w-6 h-6 text-emerald-500 mr-2" />
            {t.home.newArrivals}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const { t } = useLanguage();
  
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
      case 'sweater': return t.categories.sweater || category;
      case 'jeans': return t.categories.jeans || category;
      case 'tshirts': return t.categories.tshirts || category;
      case 'partywear': return t.categories.partyWear || category;
      default: return category;
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
        return t.home.inStock;
      case 'limited-stock':
        return t.home.limitedStock;
      case 'out-of-stock':
        return t.home.outOfStock;
      default:
        return t.home.unknown;
    }
  };

  const getStockInfo = (sizes: any) => {
    const stockInfo = [];
    if (sizes.S) stockInfo.push(`S: ${sizes.S.stock}`);
    if (sizes.M) stockInfo.push(`M: ${sizes.M.stock}`);
    if (sizes.L) stockInfo.push(`L: ${sizes.L.stock}`);
    if (sizes.XL) stockInfo.push(`XL: ${sizes.XL.stock}`);
    return stockInfo.join(' | ');
  };

  return (
    <Link to={`/user/shop`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">
              {t.home.new}
            </span>
          )}
          <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded ${getAvailabilityBadge(product.availability)}`}>
            {getAvailabilityText(product.availability)}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{getProductTranslation(product.name)}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{getCategoryTranslation(product.category)}</p>

          <RatingDisplay
            productId={product.id}
            averageRating={product.averageRating}
            totalRatings={product.totalRatings}
            showRatingForm={false}
          />

          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-mono mt-2">
            {getStockInfo(product.sizes)}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(product.basePrice)}</span>
            <span className="text-xs text-gray-400">{t.home.viewDetails}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

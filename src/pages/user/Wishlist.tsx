import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductSize } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Heart, ShoppingCart, X, Search } from 'lucide-react';
import { RatingDisplay } from '../../components/ui/RatingDisplay';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { products, wishlist, addToCart, removeFromWishlist } = useStore();

  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20 animate-fadeIn">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Start adding items you love to your wishlist</p>
            <Link to="/user/shop">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale">
                <Search className="w-5 h-5 mr-2" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-gradient">My Wishlist</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{wishlistProducts.length} items in your wishlist</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistProducts.map((product, index) => (
            <div key={product.id} className="animate-scaleIn" style={{ animationDelay: `${index * 100}ms` }}>
              <WishlistProductCard
                product={product}
                onAddToCart={addToCart}
                onRemoveFromWishlist={removeFromWishlist}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WishlistProductCard = ({
  product,
  onAddToCart,
  onRemoveFromWishlist
}: {
  product: Product;
  onAddToCart: (id: string, size: ProductSize, qty: number) => void;
  onRemoveFromWishlist: (id: string) => void;
}) => {
  const [selectedSize, setSelectedSize] = React.useState<ProductSize>('M');
  const sizeData = product.sizes[selectedSize];
  const hasStock = sizeData.stock > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group card-elevated hover-lift flex flex-col h-full relative">
      {/* Remove Button */}
      <button
        onClick={() => onRemoveFromWishlist(product.id)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover-scale"
      >
        <X className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
            NEW
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>

        {/* Rating */}
        <div className="mb-4">
          <RatingDisplay
            productId={product.id}
            averageRating={product.averageRating}
            totalRatings={product.totalRatings}
            showRatingForm={false}
          />
        </div>

        {/* Size Selector */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Select Size</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(product.sizes) as ProductSize[]).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover-scale",
                  selectedSize === size
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
                    : product.sizes[size].stock === 0
                    ? 'border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500'
                )}
                disabled={product.sizes[size].stock === 0}
              >
                {size}
                {product.sizes[size].stock === 0 && (
                  <span className="text-xs">Out of Stock</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gradient">{formatCurrency(sizeData.price)}</span>
              {!hasStock && <span className="block text-xs text-red-500 font-medium mt-1">Out of Stock</span>}
            </div>
          </div>
          
          <Button
            onClick={() => onAddToCart(product.id, selectedSize, 1)}
            disabled={!hasStock}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

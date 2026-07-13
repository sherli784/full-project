import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface RatingDisplayProps {
  productId: string;
  averageRating?: number;
  totalRatings?: number;
  showRatingForm?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ 
  productId, 
  averageRating = 0, 
  totalRatings = 0,
  showRatingForm = false 
}) => {
  const { addRating } = useStore();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleSubmitRating = async () => {
    if (!user) {
      alert('Please log in to rate products');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRating(productId, rating, comment);
      setComment('');
      setRating(5);
      setShowForm(false);
      alert('Rating submitted successfully!');
    } catch (error: any) {
      alert('Failed to submit rating: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Rating Display - Compact Format */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {renderStars(averageRating)}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Rating Form */}
      {showRatingForm && user && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Rate this product</h4>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-600">Your Rating:</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                  disabled={isSubmitting}
                >
                  <Star 
                    className={`w-5 h-5 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-2">
              {rating}/5
            </span>
          </div>

          <div className="mb-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product (optional)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSubmitRating}
              disabled={isSubmitting}
              size="sm"
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Rate Product Button */}
      {showRatingForm && !user && (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">
            Please log in to rate this product
          </p>
          <Button size="sm" disabled>
            Login to Rate
          </Button>
        </div>
      )}

      {!showRatingForm && showRatingForm !== undefined && (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          size="sm"
        >
          Rate Product
        </Button>
      )}
    </div>
  );
};

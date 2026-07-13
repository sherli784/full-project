export type Language = 'en' | 'ta';

export interface Translations {
  common: {
    search: string;
    searchPlaceholder: string;
    categories: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    clearFilter: string;
    clearAllFilters: string;
    noResults: string;
    noResultsMessage: string;
    clearSearch: string;
    showing: string;
    found: string;
    products: string;
    addToCart: string;
    addToWishlist: string;
    viewDetails: string;
    outOfStock: string;
    inStock: string;
    quantity: string;
    size: string;
    currency: string;
  };
  categories: {
    all: string;
    dress: string;
    tShirt: string;
    shirt: string;
    shirts: string;
    pants: string;
    shorts: string;
    jacket: string;
    sweater: string;
    skirt: string;
    jeans: string;
    tshirts: string;
    partyWear: string;
  };
  navigation: {
    home: string;
    shop: string;
    orders: string;
    wishlist: string;
    profile: string;
    logout: string;
    login: string;
    cart: string;
    about: string;
    help: string;
  };
  shop: {
    title: string;
    collection: string;
    searchResults: string;
    priceFilter: string;
    rating: string;
    reviews: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyMessage: string;
    total: string;
    checkout: string;
    continueShopping: string;
    quantity: string;
    size: string;
    remove: string;
  };
  checkout: {
    title: string;
    shippingAddress: string;
    paymentMethod: string;
    placeOrder: string;
    confirmOrder: string;
    orderSummary: string;
    cod: string;
    upi: string;
  };
  orders: {
    title: string;
    noOrders: string;
    noOrdersMessage: string;
    orderPlaced: string;
    totalAmount: string;
    shippingTo: string;
    paymentMethod: string;
    status: string;
    pending: string;
    cancelled: string;
    delivered: string;
    cancelOrder: string;
    cancelConfirm: string;
    orderCancelled: string;
    orderPlacedSuccess: string;
    startShopping: string;
    shop: string;
  };
  product: {
    selectSize: string;
    selectQuantity: string;
    addToCart: string;
    addedToCart: string;
    addToWishlist: string;
    addedToWishlist: string;
    removeFromWishlist: string;
    description: string;
    specifications: string;
    reviews: string;
    writeReview: string;
    names: Record<string, string>;
    descriptions: Record<string, string>;
  };
  about: {
    title: string;
    subtitle: string;
    ourStory: string;
    story1: string;
    story2: string;
    whyChooseUs: string;
    premiumQuality: string;
    premiumQualityDesc: string;
    fastDelivery: string;
    fastDeliveryDesc: string;
    securePayments: string;
    securePaymentsDesc: string;
  };
  help: {
    title: string;
    subtitle: string;
    stillNeedHelp: string;
    supportTeam: string;
    contactSupport: string;
    faqs: {
      trackOrderQuestion: string;
      trackOrderAnswer: string;
      paymentMethodsQuestion: string;
      paymentMethodsAnswer: string;
      returnPolicyQuestion: string;
      returnPolicyAnswer: string;
      internationalShippingQuestion: string;
      internationalShippingAnswer: string;
      contactSupportQuestion: string;
      contactSupportAnswer: string;
    };
  };
  home: {
    specialOffer: string;
    useCode: string;
    shopNow: string;
    elevateYourStyle: string;
    discoverLatestTrends: string;
    exploreCollection: string;
    trendingCollections: string;
    viewAll: string;
    newArrivals: string;
    new: string;
    inStock: string;
    limitedStock: string;
    outOfStock: string;
    unknown: string;
    viewDetails: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      search: 'Search',
      searchPlaceholder: 'Search products by name, category, or description...',
      categories: 'Categories',
      priceRange: 'Price Range',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      clearFilter: 'Clear filter',
      clearAllFilters: 'Clear all filters',
      noResults: 'No products found',
      noResultsMessage: 'No products match your search. Try different keywords.',
      clearSearch: 'Clear search',
      showing: 'Showing',
      found: 'Found',
      products: 'products',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      viewDetails: 'View Details',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      quantity: 'Quantity',
      size: 'Size',
      currency: '₹',
    },
    categories: {
      all: 'All',
      dress: 'Dress',
      tShirt: 'T-Shirt',
      shirt: 'Shirt',
      shirts: 'Shirts',
      pants: 'Pants',
      shorts: 'Shorts',
      jacket: 'Jacket',
      sweater: 'Sweater',
      skirt: 'Skirt',
      jeans: 'Jeans',
      tshirts: 'T-Shirts',
      partyWear: 'Party Wear',
    },
    navigation: {
      home: 'Home',
      shop: 'Shop',
      orders: 'Orders',
      wishlist: 'Wishlist',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      cart: 'Cart',
      about: 'About',
      help: 'Help',
    },
    shop: {
      title: 'Shop',
      collection: 'Collection',
      searchResults: 'Search Results',
      priceFilter: 'Price Filter',
      rating: 'Rating',
      reviews: 'Reviews',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptyMessage: 'Add some products to your cart to see them here',
      total: 'Total',
      checkout: 'Checkout',
      continueShopping: 'Continue Shopping',
      quantity: 'Quantity',
      size: 'Size',
      remove: 'Remove',
    },
    checkout: {
      title: 'Checkout',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      placeOrder: 'Place Order',
      confirmOrder: 'Confirm Order',
      orderSummary: 'Order Summary',
      cod: 'Cash on Delivery',
      upi: 'UPI Payment',
    },
    orders: {
      title: 'My Orders',
      noOrders: 'No Orders Yet',
      noOrdersMessage: 'You haven\'t placed any orders yet. Start shopping to see your orders here.',
      orderPlaced: 'Order Placed',
      totalAmount: 'Total Amount',
      shippingTo: 'Shipping To',
      paymentMethod: 'Payment Method',
      status: 'Status',
      pending: 'Pending',
      cancelled: 'Cancelled',
      delivered: 'Delivered',
      cancelOrder: 'Cancel Order',
      cancelConfirm: 'Are you sure you want to cancel this order? This action cannot be undone.',
      orderCancelled: 'Order cancelled successfully',
      orderPlacedSuccess: 'Order placed successfully',
      startShopping: 'Start shopping to see your orders here.',
      shop: 'Shop',
    },
    product: {
      selectSize: 'Select Size',
      selectQuantity: 'Select Quantity',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      addToWishlist: 'Add to Wishlist',
      addedToWishlist: 'Added to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      description: 'Description',
      specifications: 'Specifications',
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      names: {
        'Classic White Linen Shirt': 'Classic White Linen Shirt',
        'Classic Navy Linen Shirt': 'Classic Navy Linen Shirt',
        'Classic Pink Linen Shirt': 'Classic Pink Linen Shirt',
        'Classic Purple Linen Shirt': 'Classic Purple Linen Shirt',
        'Classic blue Linen Shirt': 'Classic Blue Linen Shirt',
        'Slim Fit Denim Jeans': 'Slim Fit Denim Jeans',
        'Mom Fit Jeans': 'Mom Fit Jeans',
        'Baggy Fit Jeans': 'Baggy Fit Jeans',
        'Black Baggy Jeans': 'Black Baggy Jeans',
        'Black Mom Fit Jeans': 'Black Mom Fit Jeans',
        'Urban Graphic T-Shirt': 'Urban Graphic T-Shirt',
        'Orange Graphic T-Shirt': 'Orange Graphic T-Shirt',
        'Blue Graphic T-Shirt': 'Blue Graphic T-Shirt',
        'White Graphic T-Shirt': 'White Graphic T-Shirt',
        'Black Graphic T-Shirt': 'Black Graphic T-Shirt',
        'Midnight Blue Party Blazer': 'Midnight Blue Party Blazer',
        'Midnight Grey Party Blazer': 'Midnight Grey Party Blazer',
        'Midnight Black Party Blazer': 'Midnight Black Party Blazer',
      },
      descriptions: {
        'Premium linen shirt perfect for summer.': 'Premium linen shirt perfect for summer.',
        'Rugged and stylish denim for everyday wear.': 'Rugged and stylish denim for everyday wear.',
        'Soft cotton tee with modern graphic print.': 'Soft cotton tee with modern graphic print.',
        'Elegant blazer for evening events.': 'Elegant blazer for evening events.',
      },
    },
    about: {
      title: 'About KM Fashion Clothing Co',
      subtitle: 'Redefining Men\'s Fashion Since 2025',
      ourStory: 'Our Story',
      story1: 'KM Fashion Clothing Co was founded with a simple mission: to make premium men\'s fashion accessible to everyone. We believe that style shouldn\'t come with a compromise on comfort or quality.',
      story2: 'From our humble beginnings as a small boutique, we have grown into a comprehensive e-commerce platform serving customers across the country. Our curated collections range from sharp formal wear to relaxed casuals, ensuring you look your best for every occasion.',
      whyChooseUs: 'Why Choose Us?',
      premiumQuality: 'Premium Quality',
      premiumQualityDesc: 'Hand-picked fabrics and expert craftsmanship in every stitch.',
      fastDelivery: 'Fast Delivery',
      fastDeliveryDesc: 'Quick and reliable shipping to your doorstep.',
      securePayments: 'Secure Payments',
      securePaymentsDesc: '100% secure transactions with multiple payment options.',
    },
    help: {
      title: 'Help & FAQ',
      subtitle: 'Have questions? We\'re here to help.',
      stillNeedHelp: 'Still need help?',
      supportTeam: 'Our support team is just a click away.',
      contactSupport: 'Contact Support',
      faqs: {
        trackOrderQuestion: 'How do I track my order?',
        trackOrderAnswer: 'Once your order is shipped, you can track it in the \'My Orders\' section. We will also send you SMS and email updates.',
        paymentMethodsQuestion: 'What payment methods do you accept?',
        paymentMethodsAnswer: 'We accept Cash on Delivery (COD) and UPI payments for a seamless checkout experience.',
        returnPolicyQuestion: 'What is your return policy?',
        returnPolicyAnswer: 'We offer a 7-day hassle-free return policy for all unworn items with original tags attached.',
        internationalShippingQuestion: 'Do you ship internationally?',
        internationalShippingAnswer: 'Currently, we only ship within India. We plan to expand globally soon!',
        contactSupportQuestion: 'How can I contact customer support?',
        contactSupportAnswer: 'You can reach us at support@kmfashion.com or call our toll-free number 1800-123-4567 (9 AM - 6 PM).',
      },
    },
    home: {
      specialOffer: 'SPECIAL OFFER',
      useCode: 'Use Code',
      shopNow: 'Shop Now',
      elevateYourStyle: 'Elevate Your Style',
      discoverLatestTrends: 'Discover the latest trends in men\'s fashion.',
      exploreCollection: 'Explore Collection',
      trendingCollections: 'Trending Collections',
      viewAll: 'View All',
      newArrivals: 'New Arrivals',
      new: 'NEW',
      inStock: 'In Stock',
      limitedStock: 'Limited Stock',
      outOfStock: 'Out of Stock',
      unknown: 'Unknown',
      viewDetails: 'View Details',
    },
  },
  ta: {
    common: {
      search: 'தேடு',
      searchPlaceholder: 'பெயர், வகை, அல்லது விளக்கத்தின் படி தயாரிப்புகளைத் தேடவும்...',
      categories: 'வகைகள்',
      priceRange: 'விலை வரம்பு',
      minPrice: 'குறைந்த விலை',
      maxPrice: 'அதிகபட்ச விலை',
      clearFilter: 'வடிகட்டியை அழி',
      clearAllFilters: 'அனைத்து வடிகட்டிகளையும் அழி',
      noResults: 'தயாரிப்புகள் எதுவும் கிடைக்கவில்லை',
      noResultsMessage: 'உங்கள் தேடலுக்கு பொருந்தும் தயாரிப்புகள் இல்லை. வேறு முக்கிய வார்த்தைகளை முயற்சிக்கவும்.',
      clearSearch: 'தேடலை அழி',
      showing: 'காட்டப்படுகிறது',
      found: 'கண்டறியப்பட்டது',
      products: 'தயாரிப்புகள்',
      addToCart: 'வண்டியில் சேர்',
      addToWishlist: 'விருப்பப்பட்டியலில் சேர்',
      viewDetails: 'விவரங்களைப் பார்',
      outOfStock: 'பங்கு இல்லை',
      inStock: 'பங்கு உள்ளது',
      quantity: 'அளவு',
      size: 'அளவு',
      currency: '₹',
    },
    categories: {
      all: 'அனைத்தும்',
      dress: 'உடை',
      tShirt: 'டி-ஷர்ட்',
      shirt: 'ஷர்ட்',
      shirts: 'ஷர்ட்கள்',
      pants: 'பேண்ட்',
      shorts: 'ஷார்ட்ஸ்',
      jacket: 'ஜாக்கெட்',
      sweater: 'ஸ்வெட்டர்',
      skirt: 'ஸ்கர்ட்',
      jeans: 'ஜீன்ஸ்',
      tshirts: 'டி-ஷர்ட்கள்',
      partyWear: 'கட்சி உடை',
    },
    navigation: {
      home: 'முகப்பு',
      shop: 'கடை',
      orders: 'ஆர்டர்கள்',
      wishlist: 'விருப்பப்பட்டியல்',
      profile: 'சுயவிவரம்',
      logout: 'வெளியேறு',
      login: 'உள்நுழைய',
      cart: 'வண்டி',
      about: 'பற்றி',
      help: 'உதவி',
    },
    shop: {
      title: 'கடை',
      collection: 'தொகுப்பு',
      searchResults: 'தேடல் முடிவுகள்',
      priceFilter: 'விலை வடிகட்டி',
      rating: 'மதிப்பீடு',
      reviews: 'மதிப்புரைகள்',
    },
    cart: {
      title: 'ஷாப்பிங் வண்டி',
      empty: 'உங்கள் வண்டி காலியாக உள்ளது',
      emptyMessage: 'இங்கே பார்க்க உங்கள் வண்டியில் சில தயாரிப்புகளைச் சேர்க்கவும்',
      total: 'மொத்தம்',
      checkout: 'செக்கவுட்',
      continueShopping: 'ஷாப்பிங் தொடர்க',
      quantity: 'அளவு',
      size: 'அளவு',
      remove: 'அகற்று',
    },
    checkout: {
      title: 'செக்கவுட்',
      shippingAddress: 'ஷிப்பிங் முகவரி',
      paymentMethod: 'கட்டண முறை',
      placeOrder: 'ஆர்டர் வைக்க',
      confirmOrder: 'ஆர்டரை உறுதிப்படுத்து',
      orderSummary: 'ஆர்டர் சுருக்கம்',
      cod: 'டெலிவரியில் பணம்',
      upi: 'UPI கட்டணம்',
    },
    orders: {
      title: 'எனது ஆர்டர்கள்',
      noOrders: 'இதுவரை ஆர்டர்கள் இல்லை',
      noOrdersMessage: 'இதுவரை நீங்கள் எந்த ஆர்டர்களையும் வைக்கவில்லை. உங்கள் ஆர்டர்களை இங்கே பார்க்க ஷாப்பிங் செய்யவும்.',
      orderPlaced: 'ஆர்டர் வைக்கப்பட்டது',
      totalAmount: 'மொத்த தொகை',
      shippingTo: 'இங்கே ஷிப் செய்',
      paymentMethod: 'கட்டண முறை',
      status: 'நிலை',
      pending: 'நிலுவையில் உள்ளது',
      cancelled: 'ரத்து செய்யப்பட்டது',
      delivered: 'டெலிவரி செய்யப்பட்டது',
      cancelOrder: 'ஆர்டரை ரத்து செய்',
      cancelConfirm: 'இந்த ஆர்டரை ரத்து செய்ய விரும்புகிறீர்களா? இந்த செயலை முடிக்க முடியாது.',
      orderCancelled: 'ஆர்டர் வெற்றிகரமாக ரத்து செய்யப்பட்டது',
      orderPlacedSuccess: 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது',
      startShopping: 'உங்கள் ஆர்டர்களை இங்கே பார்க்க ஷாப்பிங் செய்யவும்.',
      shop: 'கடை',
    },
    product: {
      selectSize: 'அளவைத் தேர்ந்தெடுக்கவும்',
      selectQuantity: 'அளவைத் தேர்ந்தெடுக்கவும்',
      addToCart: 'வண்டியில் சேர்',
      addedToCart: 'வண்டியில் சேர்கப்பட்டது',
      addToWishlist: 'விருப்பப்பட்டியலில் சேர்',
      addedToWishlist: 'விருப்பப்பட்டியலில் சேர்கப்பட்டது',
      removeFromWishlist: 'விருப்பப்பட்டியலிலிருந்து அகற்று',
      description: 'விளக்கம்',
      specifications: 'விவரக்குறிப்புகள்',
      reviews: 'மதிப்புரைகள்',
      writeReview: 'மதிப்புரை எழுது',
      names: {
        'Classic White Linen Shirt': 'கிளாசிக் வெள்ளை லினன் ஷர்ட்',
        'Classic Navy Linen Shirt': 'கிளாசிக் கடல் நீல லினன் ஷர்ட்',
        'Classic Pink Linen Shirt': 'கிளாசிக் இளஞ லினன் ஷர்ட்',
        'Classic Purple Linen Shirt': 'கிளாசிக் ஊதா லினன் ஷர்ட்',
        'Classic blue Linen Shirt': 'கிளாசிக் நீல லினன் ஷர்ட்',
        'Slim Fit Denim Jeans': 'ஸ்லிம் ஃபிட் டெனிம் ஜீன்ஸ்',
        'Mom Fit Jeans': 'மாம் ஃபிட் ஜீன்ஸ்',
        'Baggy Fit Jeans': 'பேகி ஃபிட் ஜீன்ஸ்',
        'Black Baggy Jeans': 'கருப்பு பேகி ஃபிட் ஜீன்ஸ்',
        'Black Mom Fit Jeans': 'கருப்பு மாம் ஃபிட் ஜீன்ஸ்',
        'Urban Graphic T-Shirt': 'அர்பன் கிராபிக் டி-ஷர்ட்',
        'Orange Graphic T-Shirt': 'ஆரஞ்சு கிராபிக் டி-ஷர்ட்',
        'Blue Graphic T-Shirt': 'நீல கிராபிக் டி-ஷர்ட்',
        'White Graphic T-Shirt': 'வெள்ளை கிராபிக் டி-ஷர்ட்',
        'Black Graphic T-Shirt': 'கருப்பு கிராபிக் டி-ஷர்ட்',
        'Midnight Blue Party Blazer': 'நடுவர நீல கட்சி பிளேசர்',
        'Midnight Grey Party Blazer': 'நடுவர சிலை கட்சி பிளேசர்',
        'Midnight Black Party Blazer': 'நடுவர கருப்பு கட்சி பிளேசர்',
      },
      descriptions: {
        'Premium linen shirt perfect for summer.': 'கோடமியான லினன் ஷர்ட் கோடைக்காக பயண்டிக்கு ஏற்றதக்கு.',
        'Rugged and stylish denim for everyday wear.': 'தின்றமானமாக டெனிம் ஜீன்ஸ் தின்றமான பயன்றுக்கு பயண்டிக்கு.',
        'Soft cotton tee with modern graphic print.': 'நவீன காட்டன் டீ-ஷர்ட் நவீன கிராபிக் அச்சமனுடன்.',
        'Elegant blazer for evening events.': 'மாலை நிகழ்வுகளுக்கு அழகமான பிளேசர்.',
      },
    },
    about: {
      title: 'KM ஃபேஷன் கிளாத்திங் கோ பற்றி',
      subtitle: '2025 முதல் ஆண்களின் ஃபேஷனை மறுவரைப்படுத்துகிறோம்',
      ourStory: 'எங்கள் கதை',
      story1: 'KM ஃபேஷன் கிளாத்திங் கோ ஒரு எளிய பணியுடன் நிறுவப்பட்டது: அனைவருக்கும் கோடமியான ஆண்களின் ஃபேஷனை அணுகச் செய்வது. நாங்கள் நம்பிக்கிறோம் பாணியில் ஆறுதல் அல்லது தரத்தில் தயாரிப்பு இருக்கக்கூடாது.',
      story2: 'ஒரு சிறிய பூட்டிக்காக எங்கள் தொடக்கத்திலிருந்து, நாங்கள் நாடு முழுவதும் வாடிகர்களுக்கு சேவை செய்யும் ஒரு முழுமையான மின்-வணிகரி தளமாக வளர்ந்துள்ளோம். எங்களின் தேர்ந்தெடுக்கப்பட்ட தொகுப்புகள் கூர்மையான உத்தியோகப் போர்வை முதல் தளர்ந்த விடுமுறை ஆடைகள் வரை, ஒவ்வொரு சந்தர்விலும் நீங்கள் சிறந்து காட்டுவதை உறுதிப்படுத்துகின்றன.',
      whyChooseUs: 'எங்களை ஏன் தேர்வு செய்ய வேண்டும்?',
      premiumQuality: 'கோடமியான தரம்',
      premiumQualityDesc: 'ஒவ்வொரு தையிலிலும் கையால் தேர்ந்தெடுக்கப்பட்ட துணிகள் மற்றும் நிபுணத்துவம் மிகுந்த தொழில்நுட்பம்.',
      fastDelivery: 'வேகமான டெலிவரி',
      fastDeliveryDesc: 'உங்கள் வீட்டிற்கு விரைவான மற்றும் நம்பக்கமான ஷிப்பிங்.',
      securePayments: 'பாதுகாப்பான கட்டணங்கள்',
      securePaymentsDesc: 'பல கட்டண விருப்பங்களுடன் 100% பாதுகாப்பான பரிவர்த்தனைகள்.',
    },
    help: {
      title: 'உதவி & கேள்விகள்',
      subtitle: 'கேள்விகள் உள்ளதா? உங்களுக்கு உதவி செய்ய நாங்கள் இங்கே உள்ளோம்.',
      stillNeedHelp: 'இன்னும் உதவி தேவையா?',
      supportTeam: 'எங்களின் ஆதரவு குழு ஒரு கிளிக் தொலைவில் உள்ளது.',
      contactSupport: 'ஆதரவு தொடர்பு',
      faqs: {
        trackOrderQuestion: 'நான் எனது ஆர்டரை எப்படி கண்காணிப்பது?',
        trackOrderAnswer: 'உங்களின்ர்டர் அனுப்பப்பட்டதும், நீங்கள் \'எனது ஆர்டர்கள்\' பகுதியில் அதைக் கண்காணியலாம். நாங்கள் உங்களுக்கு SMS மற்றும் மின்னஞ்சல் புதுப்பங்களையும் அனுப்புவோம்.',
        paymentMethodsQuestion: 'நீங்கள் எந்த கட்டண முறைகளை ஏற்றுகிறீர்கள்?',
        paymentMethodsAnswer: 'சீரமையான செக்கவுட் அனுபவிற்க்கு (COD) மற்றும் UPI கட்டணங்களை சீரமமற்றமான செக்கவுட் அனுபவிற்க்கு ஏற்றுகிறோம்.',
        returnPolicyQuestion: 'உங்களின் திருப்பி கொள்கை என்ன?',
        returnPolicyAnswer: 'அசலாத டேக்குகளுக்கு அசலாத டேக்குகளுக்கு 7-நாள் சிரமமற்றமான திருப்பி கொள்கையை நாங்கள் வழங்குகிறோம், அசலாத டேக்குகள் அசலாத குறிப்புகளுடன் இருக்கப்பட்டிருக்க வேண்டும்.',
        internationalShippingQuestion: 'நீங்கள் சர்வதேச அனுப்பு செய்கிறீர்களா?',
        internationalShippingAnswer: 'தற்போதி, நாங்கள் இந்தியாவுக்குள் மட்டும் அனுப்பு செய்கிறோம். விரைவில் உலகளாவிய விரிவார்ப்படுத்தத் திட்டமிட்டுகிறோம்!',
        contactSupportQuestion: 'நான் வாடிகர் ஆதரவுடன் எப்படி தொடர்பது?',
        contactSupportAnswer: 'நீங்கள் support@kmfashion.com மூலம் எங்களை அணுகலாம் அல்லது எங்களின் இலவச-செலவு எண் 1800-123-4567 (காலை 9 முறை - 6 முறை) அழைக்கலாம்.',
      },
    },
    home: {
      specialOffer: 'சிறப்பு சலுகை',
      useCode: 'குறியீட்டை பயன்படுத்து',
      shopNow: 'ஷாப் செய்',
      elevateYourStyle: 'உங்கள் பாணியை உயர்த்து',
      discoverLatestTrends: 'ஆண்களின் ஃபேஷன் போக்குகளைக் கண்டறியவும்',
      exploreCollection: 'தொகுப்பை ஆராய்ந்து பார்',
      trendingCollections: 'பிரபலமான தொகுப்புகள்',
      viewAll: 'அனைத்தையும் காட்டு',
      newArrivals: 'புதிய வரவுகள்',
      new: 'புதியது',
      inStock: 'பங்கு உள்ளது',
      limitedStock: 'வரையறுக்கப்பட்ட பங்கு',
      outOfStock: 'பங்கு இல்லை',
      unknown: 'தெரியாத',
      viewDetails: 'விவரங்களைக் காட்டு',
    },
  },
};

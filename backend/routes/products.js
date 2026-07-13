import express from 'express';
import { Product } from '../models/Product.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Add a rating to a product
router.post('/:id/ratings', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ message: 'userId and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Prevent duplicate rating by same user
    const existing = product.ratings.find(r => r.userId === userId);
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      product.ratings.push({ userId, rating, comment });
    }
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a rating to a product (singular endpoint)
router.post('/:id/rating', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ message: 'userId and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Prevent duplicate rating by same user
    const existing = product.ratings.find(r => r.userId === userId);
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      product.ratings.push({ userId, rating, comment });
    }
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Use mock data with ratings instead of database
    const mockProducts = [
      {
        id: 'p1',
        name: 'Classic White Linen Shirt',
        category: 'Shirts',
        description: 'Premium linen shirt perfect for summer.',
        image: 'https://www.aspiga.com/cdn/shop/products/mens-nehru-collar-linen-shirt-white-6.jpg?v=1683894068',
        basePrice: 1299,
        sizes: {
          S: { price: 1299, stock: 8 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 0 },
          XL: { price: 1599, stock: 2 },
        },
        isNew: true,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user1', rating: 5, comment: 'Excellent quality shirt!' },
          { userId: 'user2', rating: 4, comment: 'Good fit and material' },
          { userId: 'user3', rating: 4, comment: 'Very comfortable' }
        ],
        averageRating: 4.3,
        totalRatings: 3
      },
      {
        id: 'p2',
        name: 'Classic Navy Linen Shirt',
        category: 'Shirts',
        description: 'Premium linen shirt perfect for summer.',
        image: 'https://shop.anderson-sheppard.co.uk/cdn/shop/files/2025-navy-1.jpg?v=1719864004',
        basePrice: 1299,
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        },
        isNew: true,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user4', rating: 5, comment: 'Perfect navy color!' },
          { userId: 'user5', rating: 3, comment: 'Good but runs small' }
        ],
        averageRating: 4.0,
        totalRatings: 2
      },
      {
        id: 'p3',
        name: 'Classic Pink Linen Shirt',
        category: 'Shirts',
        description: 'Premium linen shirt perfect for summer.',
        image: 'https://i.pinimg.com/originals/ad/ba/4a/adba4aaddfbd54922beb2100cef23ab3.jpg',
        basePrice: 1299,
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user6', rating: 4, comment: 'Nice pink color!' },
          { userId: 'user7', rating: 5, comment: 'Perfect fit and quality' },
          { userId: 'user8', rating: 3, comment: 'Good but a bit expensive' }
        ],
        averageRating: 4.0,
        totalRatings: 3
      },
      {
        id: 'p4',
        name: 'Classic Purple Linen Shirt',
        category: 'Shirts',
        description: 'Premium linen shirt perfect for summer.',
        image: 'https://tse1.mm.bing.net/th/id/OIP.RyqMVMnmGbqlcjboW66QUgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3',
        basePrice: 1299,
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        },
        isNew: true,
        isTrending: false,
        availability: 'in-stock',
        ratings: [
          { userId: 'user9', rating: 5, comment: 'Love the purple color!' },
          { userId: 'user10', rating: 4, comment: 'Great quality fabric' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p5',
        name: 'Classic blue Linen Shirt',
        category: 'Shirts',
        description: 'Premium linen shirt perfect for summer.',
        image: 'https://tse4.mm.bing.net/th/id/OIP.GWi5D8Ukc1MXSKIoao2r9QHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
        basePrice: 1299,
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        },
        isNew: true,
        isTrending: false,
        availability: 'in-stock',
        ratings: [
          { userId: 'user11', rating: 4, comment: 'Classic blue color' },
          { userId: 'user12', rating: 3, comment: 'Good but sizing runs small' },
          { userId: 'user13', rating: 5, comment: 'Perfect summer shirt!' }
        ],
        averageRating: 4.0,
        totalRatings: 3
      },
      {
        id: 'p6',
        name: 'Slim Fit Denim Jeans',
        category: 'Jeans',
        description: 'Rugged and stylish denim for everyday wear.',
        image: 'https://tse3.mm.bing.net/th/id/OIP.1piiXRj_QA2ef5gthnz10QHaKG?rs=1&pid=ImgDetMain&o=7&rm=3',
        basePrice: 1999,
        sizes: {
          S: { price: 999, stock: 20 },
          M: { price: 1099, stock: 18 },
          L: { price: 1499, stock: 12 },
          XL: { price: 2000, stock: 8 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user14', rating: 5, comment: 'Perfect fit!' },
          { userId: 'user15', rating: 4, comment: 'Great quality denim' },
          { userId: 'user16', rating: 4, comment: 'Comfortable and stylish' },
          { userId: 'user17', rating: 3, comment: 'Good but a bit pricey' }
        ],
        averageRating: 4.0,
        totalRatings: 4
      },
      {
        id: 'p7',
        name: 'Mom Fit Jeans',
        category: 'Jeans',
        description: 'Rugged and stylish denim for everyday wear.',
        image: 'https://www.alcott.eu/dw/image/v2/BDJZ_PRD/on/demandware.static/-/Sites-catalog-alcott-master/default/dw2596103a/hi-res/5T3591DO_C241_004.jpg?sw=1000&sh=1350&q=90&strip=false',
        basePrice: 1999,
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user18', rating: 4, comment: 'Comfortable mom fit' },
          { userId: 'user19', rating: 5, comment: 'Perfect for casual wear' },
          { userId: 'user20', rating: 3, comment: 'Good but fabric could be better' }
        ],
        averageRating: 4.0,
        totalRatings: 3
      },
      {
        id: 'p8',
        name: 'Baggy Fit Jeans',
        category: 'Jeans',
        description: 'Rugged and stylish denim for everyday wear.',
        image: 'https://th.bing.com/th/id/OIP.k8BbLDFht0RQAsIMcPP8pwHaJQ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
        basePrice: 1999,
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user21', rating: 5, comment: 'Love the baggy style!' },
          { userId: 'user22', rating: 4, comment: 'Very comfortable' },
          { userId: 'user23', rating: 4, comment: 'Great for casual days' }
        ],
        averageRating: 4.3,
        totalRatings: 3
      },
      {
        id: 'p9',
        name: 'Black Baggy Jeans',
        category: 'Jeans',
        description: 'Rugged and stylish denim for everyday wear.',
        image: 'https://image.hm.com/assets/hm/11/50/1150f8ad5b5ae8c828862b19044abed043352c51.jpg?imwidth=2160',
        basePrice: 1999,
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user24', rating: 4, comment: 'Good black jeans' },
          { userId: 'user25', rating: 5, comment: 'Perfect baggy fit!' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p10',
        name: 'Black Mom Fit Jeans',
        category: 'Jeans',
        description: 'Rugged and stylish denim for everyday wear.',
        image: 'https://th.bing.com/th/id/OIP.rLVBQaFCnHFwIIiCIvH3VQAAAA?w=208&h=277&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        basePrice: 1999,
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        },
        isNew: true,
        isTrending: false,
        availability: 'in-stock',
        ratings: [
          { userId: 'user26', rating: 4, comment: 'Good mom fit' },
          { userId: 'user27', rating: 3, comment: 'Average quality' }
        ],
        averageRating: 3.5,
        totalRatings: 2
      },
      {
        id: 'p11',
        name: 'Urban Graphic T-Shirt',
        category: 'T-Shirts',
        description: 'Soft cotton tee with modern graphic print.',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
        basePrice: 699,
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        },
        isNew: true,
        isTrending: false,
        availability: 'in-stock',
        ratings: [
          { userId: 'user28', rating: 5, comment: 'Awesome graphic design!' },
          { userId: 'user29', rating: 4, comment: 'Soft and comfortable' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p12',
        name: 'Orange Graphic T-Shirt',
        category: 'T-Shirts',
        description: 'Soft cotton tee with modern graphic print.',
        image: 'https://i5.walmartimages.com/asr/4157cd44-1dda-44e4-8973-a49a482425c9_1.79a3c179916e263a8b975595bdf04952.jpeg',
        basePrice: 699,
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user30', rating: 4, comment: 'Nice orange color' },
          { userId: 'user31', rating: 3, comment: 'Good but graphic fades' }
        ],
        averageRating: 3.5,
        totalRatings: 2
      },
      {
        id: 'p13',
        name: 'Blue Graphic T-Shirt',
        category: 'T-Shirts',
        description: 'Soft cotton tee with modern graphic print.',
        image: 'https://xyxxcrew.com/cdn/shop/files/iconique-supima-cotton-t-shirt-midnight-blue-front.jpg?v=1713966123',
        basePrice: 699,
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user32', rating: 4, comment: 'Cool blue design' },
          { userId: 'user33', rating: 5, comment: 'Perfect fit!' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p14',
        name: 'White Graphic T-Shirt',
        category: 'T-Shirts',
        description: 'Soft cotton tee with modern graphic print.',
        image: 'https://i.pinimg.com/736x/78/fa/25/78fa25edabb59b3dee2d4a709ac0c2e2.jpg',
        basePrice: 699,
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        },
        isNew: true,
        isTrending: false,
        availability: 'in-stock',
        ratings: [
          { userId: 'user34', rating: 4, comment: 'Clean white design' },
          { userId: 'user35', rating: 5, comment: 'Love the graphic!' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p15',
        name: 'Black Graphic T-Shirt',
        category: 'T-Shirts',
        description: 'Soft cotton tee with modern graphic print.',
        image: 'https://onemile.in/cdn/shop/files/Black_T-shirt.jpg?v=1727950376&width=400',
        basePrice: 699,
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        },
        isNew: false,
        isTrending: true,
        availability: 'in-stock',
        ratings: [
          { userId: 'user36', rating: 5, comment: 'Classic black tee!' },
          { userId: 'user37', rating: 4, comment: 'Good quality' },
          { userId: 'user38', rating: 3, comment: 'Runs a bit small' }
        ],
        averageRating: 4.0,
        totalRatings: 3
      },
      {
        id: 'p16',
        name: 'Midnight Blue Party Blazer',
        category: 'Party Wear',
        description: 'Elegant blazer for evening events.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
        basePrice: 4999,
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        },
        isNew: false,
        isTrending: true,
        availability: 'limited-stock',
        ratings: [
          { userId: 'user39', rating: 5, comment: 'Elegant and stylish!' },
          { userId: 'user40', rating: 4, comment: 'Perfect for events' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p17',
        name: 'Midnight Grey Party Blazer',
        category: 'Party Wear',
        description: 'Elegant blazer for evening events.',
        image: 'https://blackberrys.com/cdn/shop/files/Luxe_Formal_Grey_Textured_Blazer_Baleno-LJ002432G1-image3_900x900.jpg?v=1733473416',
        basePrice: 4999,
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        },
        isNew: false,
        isTrending: true,
        availability: 'limited-stock',
        ratings: [
          { userId: 'user41', rating: 4, comment: 'Good grey blazer' },
          { userId: 'user42', rating: 5, comment: 'Premium quality!' }
        ],
        averageRating: 4.5,
        totalRatings: 2
      },
      {
        id: 'p18',
        name: 'Midnight Black Party Blazer',
        category: 'Party Wear',
        description: 'Elegant blazer for evening events.',
        image: 'https://boldsir.com/wp-content/uploads/2024/07/6.png',
        basePrice: 4999,
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        },
        isNew: false,
        isTrending: true,
        availability: 'limited-stock',
        ratings: [
          { userId: 'user43', rating: 5, comment: 'Classic black blazer!' },
          { userId: 'user44', rating: 4, comment: 'Excellent quality' },
          { userId: 'user45', rating: 5, comment: 'Worth every penny' }
        ],
        averageRating: 4.7,
        totalRatings: 3
      }
    ];
    
    let products = mockProducts;
    
    if (category && category !== 'All') {
      products = mockProducts.filter(product => product.category === category);
    }
    
    // Calculate average rating and total ratings for each product (already done in mock data)
    const productsWithRatings = products.map(product => {
      const ratings = product.ratings || [];
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;
      
      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalRatings
      };
    });
    
    res.json(productsWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate average rating and total ratings
    const ratings = product.ratings || [];
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;
    
    const productWithRatings = {
      ...product.toObject(),
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings
    };
    
    res.json(productWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin/pm only)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('basePrice').isNumeric().withMessage('Base price must be numeric'),
  body('sizes').isObject().withMessage('Sizes must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (admin/pm only)
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  body('basePrice').optional().isNumeric().withMessage('Base price must be numeric'),
  body('sizes').optional().isObject().withMessage('Sizes must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (admin/pm only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

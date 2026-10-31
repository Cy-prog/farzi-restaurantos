import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Strict Production JWT Secret Validation & Dev Safe Fallback
const rawJwtSecret = process.env.JWT_SECRET;
if (isProduction) {
  if (!rawJwtSecret || rawJwtSecret.length < 32 || rawJwtSecret.includes('CHANGE_ME')) {
    console.error('FATAL APPLICATION SECURITY ERROR: In production mode, JWT_SECRET must be set to a secure, randomly generated string of at least 32 characters. Cannot start server.');
    process.exit(1);
  }
}
const JWT_SECRET = rawJwtSecret || 'dev_placeholder_farzi_restaurantos_secret_key_32_bytes_min';

// Strict Production CORS Configuration
const allowedOriginsStr = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5000,http://127.0.0.1:5173';
const allowedOrigins = allowedOriginsStr.split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || (!isProduction && (origin.includes('localhost') || origin.includes('127.0.0.1')))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin '${origin}' is not permitted by Farzi RestaurantOS security policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key']
}));

// Body parser with explicit size limit (1MB max to prevent memory exhaustion)
app.use(express.json({ limit: '1mb' }));

// Enhanced Enterprise Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' data: blob:; connect-src 'self' http://localhost:* ws://localhost:*; frame-ancestors 'none';"
  );
  next();
});

// Input Sanitization Helper: trims and neutralizes direct script injection tags
export const sanitizeInput = (val) => {
  if (typeof val === 'string') {
    return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }
  return val;
};

// Sliding-window in-memory rate limiter factory
const createRateLimiter = ({ windowMs, max, message }) => {
  const requests = new Map();
  const middleware = (req, res, next) => {
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ip = String(rawIp).split(',')[0].trim();
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = requests.get(ip) || [];
    timestamps = timestamps.filter(t => t > windowStart);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please wait and try again later.'
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);

    if (requests.size > 2000) {
      for (const [key, times] of requests.entries()) {
        const valid = times.filter(t => t > windowStart);
        if (valid.length === 0) requests.delete(key);
        else requests.set(key, valid);
      }
    }

    next();
  };

  middleware.reset = (ip) => {
    if (ip) requests.delete(ip);
    else requests.clear();
  };

  return middleware;
};

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

const publicOrderRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Order submission rate limit exceeded. Please wait a moment before sending another order.'
});

// Order Idempotency Cache
const orderIdempotencyMap = new Map();
setInterval(() => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [k, v] of orderIdempotencyMap.entries()) {
    if (v.timestamp < tenMinutesAgo) orderIdempotencyMap.delete(k);
  }
}, 60 * 1000);

// Database file setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'restaurantos.json');
const BACKUP_FILE = path.join(DATA_DIR, 'restaurantos.backup.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data for Farzi Progressive Indian Dining
const getInitialData = () => {
  const adminPasswordHash = bcrypt.hashSync('Admin@12345', 10);

  return {
    users: [
      {
        id: 1,
        name: 'Executive Chef Admin',
        email: 'admin@restaurantos.local',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        isActive: !isProduction,
        createdAt: new Date().toISOString()
      }
    ],
    categories: [
      { id: 1, name: 'Starters & Molecular Tapas', slug: 'starters-tapas', description: 'Avant-garde appetizers fusing street delicacies with modern culinary science', displayOrder: 1, isVisible: true },
      { id: 2, name: 'Progressive Small Plates', slug: 'small-plates', description: 'Intricate sharing dishes with playful textures and layered aromatics', displayOrder: 2, isVisible: true },
      { id: 3, name: 'Main Course Curations', slug: 'main-course', description: 'Slow-simmered gravies and charcoal-roasted specialties reimagined', displayOrder: 3, isVisible: true },
      { id: 4, name: 'Artisanal Breads & Fragrant Rice', slug: 'breads-rice', description: 'Tandoor leavened breads and dum-cooked aged basmati', displayOrder: 4, isVisible: true },
      { id: 5, name: 'Sweet Illusions & Desserts', slug: 'desserts', description: 'Theatrical post-meal spectacles crafted with liquid nitrogen and traditional confections', displayOrder: 5, isVisible: true },
      { id: 6, name: 'Alchemical Mixology & Botanicals', slug: 'beverages', description: 'Smoked distillations, ayurvedic infusions, and signature mocktails', displayOrder: 6, isVisible: true },
      { id: 7, name: "Chef's Signature Tasting", slug: 'chefs-specials', description: 'Limited-edition seasonal creations by our culinary laboratory', displayOrder: 7, isVisible: true },
    ],
    menuItems: [
      {
        id: 1,
        categoryId: 1,
        categoryName: 'Starters & Molecular Tapas',
        name: 'Dal Chawal Arancini',
        slug: 'dal-chawal-arancini',
        description: 'Crispy lentil & arborio rice spheres topped with tomato punch chutney, dehydrated poppadum tuile, and mint emulsion.',
        price: 495,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Yellow Moong Dal, Arborio Rice, Cumin, Ghee, Papadum, Mint, Mustard Seed Emulsion',
        allergens: 'Dairy, Gluten',
        spiceLevel: 'MILD',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 1,
        calories: 320,
        preparationTimeMinutes: 15
      },
      {
        id: 2,
        categoryId: 1,
        categoryName: 'Starters & Molecular Tapas',
        name: 'Deconstructed Pani Puri Sphere',
        slug: 'deconstructed-pani-puri',
        description: 'Molecular alginate spheres enclosing spiced spiced mint-coriander water, served over sweet tamarind dust and micro sev crisps.',
        price: 445,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Mint Extract, Coriander, Black Salt, Tamarind Pulp, Calcium Lactate, Semolina Flakes',
        allergens: 'Gluten',
        spiceLevel: 'MEDIUM',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 180,
        preparationTimeMinutes: 10
      },
      {
        id: 3,
        categoryId: 2,
        categoryName: 'Progressive Small Plates',
        name: 'Smoked Butter Chicken Bao',
        slug: 'smoked-butter-chicken-bao',
        description: 'Steamed lotus-leaf lotus bao buns stuffed with pulled tandoori chicken, makhani glaze, kasuri fenugreek foam, and pickled shallots.',
        price: 595,
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Chicken Tikka, Steamed Bao Dough, Tomato Cream Reduction, Kasuri Methi, Pickled Red Onions',
        allergens: 'Dairy, Gluten',
        spiceLevel: 'MILD',
        isVeg: false,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 1,
        calories: 450,
        preparationTimeMinutes: 18
      },
      {
        id: 4,
        categoryId: 2,
        categoryName: 'Progressive Small Plates',
        name: 'Galouti Kebab Pâté on Ulta Tawa Crisp',
        slug: 'galouti-kebab-pate',
        description: 'Melt-in-mouth smoked lamb pâté delicately spiced with 18 awadhi herbs, served on saffron inverted-griddle crisps with cardamom gel.',
        price: 675,
        imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Minced Lamb, Raw Papaya, Rose Petal Powder, Brown Onions, Ghee, Ulta Tawa Paratha',
        allergens: 'Gluten, Dairy',
        spiceLevel: 'MEDIUM',
        isVeg: false,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 520,
        preparationTimeMinutes: 20
      },
      {
        id: 5,
        categoryId: 2,
        categoryName: 'Progressive Small Plates',
        name: 'Tempura Dynamite Prawns',
        slug: 'tempura-dynamite-prawns',
        description: 'Golden fried tiger prawns tossed in sriracha-curry leaf aioli with toasted black sesame and compressed cucumber ribbon.',
        price: 745,
        imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Tiger Prawns, Rice Flour Tempura, Sriracha, Fresh Curry Leaves, Sesame, Lemon Zest',
        allergens: 'Crustaceans, Egg, Sesame',
        spiceLevel: 'HOT',
        isVeg: false,
        isAvailable: true,
        isChefSpecial: false,
        isRecommended: true,
        isPopular: true,
        displayOrder: 3,
        calories: 410,
        preparationTimeMinutes: 14
      },
      {
        id: 6,
        categoryId: 3,
        categoryName: 'Main Course Curations',
        name: 'Wild Mushroom & Black Truffle Khichdi',
        slug: 'wild-mushroom-truffle-khichdi',
        description: 'Slow-tempered arborio & moong comfort risotto infused with porcini broth, shaved winter truffles, and aged parmesan papad crisp.',
        price: 695,
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Shiitake & Porcini Mushrooms, Black Truffle Oil, Moong Dal, Arborio Rice, Parmesan Crust',
        allergens: 'Dairy',
        spiceLevel: 'MILD',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 1,
        calories: 480,
        preparationTimeMinutes: 22
      },
      {
        id: 7,
        categoryId: 3,
        categoryName: 'Main Course Curations',
        name: 'Braised Lamb Shank Rogan Josh',
        slug: 'braised-lamb-shank-rogan-josh',
        description: '8-hour slow cooked tender lamb shank in Kashmiri rattan jyot & dried ginger reduction, topped with saffron bone marrow glaze.',
        price: 895,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Prime Lamb Shank, Kashmiri Chili, Rattan Jyot, Fennel Powder, Dry Ginger, Mustard Oil',
        allergens: 'Dairy',
        spiceLevel: 'MEDIUM',
        isVeg: false,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 740,
        preparationTimeMinutes: 25
      },
      {
        id: 8,
        categoryId: 3,
        categoryName: 'Main Course Curations',
        name: 'Paneer Pinwheel Makhani Dome',
        slug: 'paneer-pinwheel-makhani',
        description: 'Hand-rolled cottage cheese spirals filled with dried fruit duxelles, served under a glass smoke dome with velvet makhani silk.',
        price: 625,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Artisanal Paneer, Pistachio-Fig Farce, San Marzano Tomato Reduction, White Butter, Fenugreek Smoke',
        allergens: 'Dairy, Tree Nuts',
        spiceLevel: 'MILD',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: false,
        isRecommended: true,
        isPopular: true,
        displayOrder: 3,
        calories: 560,
        preparationTimeMinutes: 18
      },
      {
        id: 9,
        categoryId: 4,
        categoryName: 'Artisanal Breads & Fragrant Rice',
        name: 'Truffle & Roasted Garlic Naan Basket',
        slug: 'truffle-garlic-naan-basket',
        description: 'Tandoor baked sourdough flatbreads brushed with clarified white butter, roasted confit garlic, and white truffle essence.',
        price: 245,
        imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Refined Wheat Flour, Confit Garlic, Desi Ghee, Truffle Glaze, Nigella Seeds',
        allergens: 'Gluten, Dairy',
        spiceLevel: 'NONE',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: false,
        isRecommended: false,
        isPopular: true,
        displayOrder: 1,
        calories: 280,
        preparationTimeMinutes: 8
      },
      {
        id: 10,
        categoryId: 4,
        categoryName: 'Artisanal Breads & Fragrant Rice',
        name: 'Awadhi Dum Saffron Biryani',
        slug: 'awadhi-dum-saffron-biryani',
        description: 'Long grain aged basmati sealed in clay handi with kewra attar, caramelised onions, saffron curd, and served with burrani raita.',
        price: 645,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Daawat Aged Basmati, Saffron, Rose Water, Fried Onion Crisp, Mint, Whole Spices',
        allergens: 'Dairy',
        spiceLevel: 'MEDIUM',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: false,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 580,
        preparationTimeMinutes: 20
      },
      {
        id: 11,
        categoryId: 5,
        categoryName: 'Sweet Illusions & Desserts',
        name: 'Rasmalai Tres Leches',
        slug: 'rasmalai-tres-leches',
        description: 'Cardamom infused genoise sponge soaked in condensed saffron rabdi, crowned with caramelized milk wafer and crushed Iranian pistachio.',
        price: 495,
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Chenna Discs, Condensed Milk, Evaporated Milk, Saffron Strands, Rose Water, Pistachios',
        allergens: 'Dairy, Gluten, Tree Nuts',
        spiceLevel: 'NONE',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 1,
        calories: 420,
        preparationTimeMinutes: 12
      },
      {
        id: 12,
        categoryId: 5,
        categoryName: 'Sweet Illusions & Desserts',
        name: "Bailey's & Jalebi Molecular Caviar",
        slug: 'baileys-jalebi-caviar',
        description: 'Miniature saffron spiral crisps served over liquid nitrogen rabdi foam and spheres of Irish cream liqueur pearls.',
        price: 545,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Flour Crisps, Saffron Syrup, Bailey’s Reduction, Rabdi Foam, Edible Gold Leaf',
        allergens: 'Dairy, Gluten',
        spiceLevel: 'NONE',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 460,
        preparationTimeMinutes: 14
      },
      {
        id: 13,
        categoryId: 6,
        categoryName: 'Alchemical Mixology & Botanicals',
        name: 'Farzi Illusion: Chuski Margarita',
        slug: 'farzi-chuski-margarita',
        description: 'Interactive tequila craft cocktail with crushed kala-khatta ice lollipop, triple sec vapor, black salt rim, and dry-ice mist.',
        price: 645,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Agave Tequila, Kala Khatta Reduction, Fresh Lime, Cointreau, Himalayan Pink Rock Salt',
        allergens: 'None',
        spiceLevel: 'MILD',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 1,
        calories: 190,
        preparationTimeMinutes: 8
      },
      {
        id: 14,
        categoryId: 6,
        categoryName: 'Alchemical Mixology & Botanicals',
        name: 'The Alchemist Smoked Old Fashioned',
        slug: 'smoked-old-fashioned',
        description: 'Bourbon stirred with jaggery syrup and aromatic bitters, presented inside an oak wood smoke bell jar with dehydrated orange wheel.',
        price: 725,
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Single Barrel Bourbon, Palm Jaggery, Angostura Bitters, Cinnamon Smoke, Maraschino Cherry',
        allergens: 'None',
        spiceLevel: 'NONE',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        displayOrder: 2,
        calories: 210,
        preparationTimeMinutes: 10
      },
      {
        id: 15,
        categoryId: 6,
        categoryName: 'Alchemical Mixology & Botanicals',
        name: 'Kokum & Tamarind Botanical Spritz',
        slug: 'kokum-tamarind-spritz',
        description: 'Zero-proof artisanal refresher crafted from Goan kokum berries, sweet tamarind water, cumin soda, and sparkling mineral water.',
        price: 375,
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
        ingredients: 'Wild Kokum Extract, Tamarind Reduction, Roasted Cumin, Mint Sprig, Sparkling Water',
        allergens: 'None',
        spiceLevel: 'NONE',
        isVeg: true,
        isAvailable: true,
        isChefSpecial: false,
        isRecommended: true,
        isPopular: true,
        displayOrder: 3,
        calories: 95,
        preparationTimeMinutes: 6
      }
    ],
    tables: [
      { id: 1, tableNumber: 'T01', capacity: 2, section: 'Main Dining', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T01' },
      { id: 2, tableNumber: 'T02', capacity: 2, section: 'Main Dining', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T02' },
      { id: 3, tableNumber: 'T03', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T03' },
      { id: 4, tableNumber: 'T04', capacity: 4, section: 'Main Dining', status: 'OCCUPIED', qrCodeUrl: '/menu?table=T04' },
      { id: 5, tableNumber: 'T05', capacity: 6, section: 'Terrace Garden', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T05' },
      { id: 6, tableNumber: 'T06', capacity: 4, section: 'Terrace Garden', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T06' },
      { id: 7, tableNumber: 'T07', capacity: 8, section: "Chef's Table", status: 'RESERVED', qrCodeUrl: '/menu?table=T07' },
      { id: 8, tableNumber: 'T08', capacity: 2, section: 'Cocktail Lounge', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T08' },
      { id: 9, tableNumber: 'T09', capacity: 4, section: 'Cocktail Lounge', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T09' },
      { id: 10, tableNumber: 'T10', capacity: 6, section: 'Private Dining Room', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T10' },
      { id: 11, tableNumber: 'T11', capacity: 4, section: 'Main Dining', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T11' },
      { id: 12, tableNumber: 'T12', capacity: 2, section: 'Terrace Garden', status: 'AVAILABLE', qrCodeUrl: '/menu?table=T12' },
    ],
    reservations: [
      {
        id: 1,
        name: 'Vikram Malhotra',
        phone: '+91 98112 34567',
        email: 'vikram.malhotra@demo.com',
        reservationDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        reservationTime: '20:00',
        guests: 4,
        specialRequest: 'Anniversary celebration, prefer quiet corner table with tasting pairing.',
        status: 'CONFIRMED',
        tableNumber: 'T07',
        adminNote: 'Complimentary dessert sparkler arranged.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Aanya Sen',
        phone: '+91 98200 87654',
        email: 'aanya.sen@demo.com',
        reservationDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        reservationTime: '13:30',
        guests: 2,
        specialRequest: 'Vegetarian tasting menu requested.',
        status: 'PENDING',
        tableNumber: '',
        adminNote: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 1,
        orderNumber: 'FZ-1082',
        tableNumber: 'T04',
        customerName: 'Rohit Verma',
        customerPhone: '+91 99887 76655',
        items: [
          { id: 1, menuItemId: 1, name: 'Dal Chawal Arancini', price: 495, quantity: 2, specialInstructions: 'Extra crisp papadum', isVeg: true },
          { id: 2, menuItemId: 3, name: 'Smoked Butter Chicken Bao', price: 595, quantity: 1, specialInstructions: '', isVeg: false },
          { id: 3, menuItemId: 13, name: 'Farzi Illusion: Chuski Margarita', price: 645, quantity: 2, specialInstructions: 'Light on rock salt', isVeg: true }
        ],
        subtotal: 2875,
        tax: 143.75,
        total: 3018.75,
        status: 'IN_KITCHEN',
        notes: 'Table seated at 19:45, priority service.',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    galleryImages: [
      { id: 1, title: 'Grand Dining Chamber & Amber Illumination', categoryName: 'Ambience', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 1 },
      { id: 2, title: 'Molecular Plating by Master Chef', categoryName: 'Culinary Art', imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 2 },
      { id: 3, title: 'The Mixology Laboratory & Smoke Bar', categoryName: 'Mixology', imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 3 },
      { id: 4, title: "Private Chef's Reserve Dining Table", categoryName: 'Ambience', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 4 },
      { id: 5, title: 'Artisanal Starters Plated with Precision', categoryName: 'Culinary Art', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 5 },
      { id: 6, title: 'Evening Exterior & Grand Welcome', categoryName: 'Ambience', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop', isVideo: false, displayOrder: 6 }
    ],
    reviews: [
      { id: 1, customerName: 'Devika Singhania', rating: 5, comment: 'An unbelievable gastronomic spectacle. The Dal Chawal Arancini and Chuski Margarita redefine Indian cuisine without losing its soul.', source: 'GOOGLE', status: 'APPROVED', isFeatured: true, createdAt: '2026-09-12' },
      { id: 2, customerName: 'Marcus Vance', rating: 5, comment: 'World-class progressive cooking. The smoked lamb pate and dry-ice illusions match 3-star Michelin theater. Extraordinary experience.', source: 'TRIPADVISOR', status: 'APPROVED', isFeatured: true, createdAt: '2026-09-24' },
      { id: 3, customerName: 'Priya & Rahul Kapoor', rating: 5, comment: 'Celebrated our anniversary at the Chef’s Table. The attention to detail, warm hospitality, and the Rasmalai Tres Leches were sublime.', source: 'WEBSITE', status: 'APPROVED', isFeatured: true, createdAt: '2026-10-02' }
    ],
    settings: {
      id: 1,
      restaurantName: 'Farzi — Progressive Modern Indian',
      tagline: 'An Illusion of Indian Heritage through the Prism of Modern Molecular Gastronomy',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#0A0B0E',
      accentColor: '#D4AF37',
      phone: '+91 11 4352 8888',
      whatsappNumber: '+91 98100 12345',
      email: 'reservations@farzirestaurant.demo',
      address: 'Level 2, High Street Galleria, Connaught Place, New Delhi 110001',
      googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9961294657155!2d77.2177215!3d28.6322303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b1234567%3A0x123456789abcdef!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin',
      workingHours: [
        { days: 'Monday – Thursday', lunch: '12:00 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM' },
        { days: 'Friday – Sunday', lunch: '12:00 PM – 04:00 PM', dinner: '07:00 PM – 12:30 AM' },
      ],
      socialLinks: {
        instagram: 'https://instagram.com/farzicafe',
        facebook: 'https://facebook.com/farzicafe',
        tripadvisor: 'https://tripadvisor.com'
      },
      currencySymbol: '₹',
      taxPercentage: 5.0
    },
    qrScans: [
      { id: 1, table: 'T04', timestamp: new Date(Date.now() - 3600000).toISOString(), userAgent: 'Mobile Safari' },
      { id: 2, table: 'T01', timestamp: new Date(Date.now() - 7200000).toISOString(), userAgent: 'Mobile Chrome' }
    ]
  };
};

// Database persistence helpers with Atomic Write & Backup
const loadDatabase = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(BACKUP_FILE)) {
        console.warn('Primary database file missing. Restoring from backup...');
        const backupData = fs.readFileSync(BACKUP_FILE, 'utf-8');
        fs.writeFileSync(DATA_FILE, backupData, 'utf-8');
        return JSON.parse(backupData);
      }
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      fs.writeFileSync(BACKUP_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (isProduction && Array.isArray(parsed.users)) {
      for (const u of parsed.users) {
        if (u.email && u.email.toLowerCase().endsWith('.local')) {
          u.isActive = false;
        }
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error loading database, attempting recovery from backup:', err);
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf-8');
        return JSON.parse(backupRaw);
      }
    } catch (bErr) {
      console.error('Backup restoration failed:', bErr);
    }
    return getInitialData();
  }
};

const saveDatabase = (db) => {
  try {
    const jsonString = JSON.stringify(db, null, 2);
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}.${Math.floor(Math.random() * 10000)}`;
    fs.writeFileSync(tempFile, jsonString, 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('CRITICAL: Error writing database file atomically:', err);
    throw new Error('Database write failed');
  }
};

// Initial Backup on Startup
try {
  if (fs.existsSync(DATA_FILE)) {
    fs.copyFileSync(DATA_FILE, BACKUP_FILE);
  }
} catch (e) {
  console.warn('Initial backup snapshot skipped:', e.message);
}

// Auth Middleware: Token Verification and Active User Check
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: missing bearer token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
    }

    // Verify user is active in the database
    const db = loadDatabase();
    const user = (db.users || []).find(u => u.id === decoded.id);
    if (!user || user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Access denied: user account is deactivated' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  });
};

// Role-Based Access Control (RBAC) Middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Required permission level: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};

/* ========================================================
   PUBLIC API ENDPOINTS
   ======================================================== */

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Farzi RestaurantOS API Server',
    status: 'ONLINE',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Test helper: Reset rate limits (dev/test environments only)
if (!isProduction) {
  app.post('/api/test/reset-rate-limit', (req, res) => {
    loginRateLimiter.reset();
    publicOrderRateLimiter.reset();
    res.json({ success: true, message: 'Rate limit counters cleared.' });
  });
}

// 1. Categories
app.get('/api/public/categories', (req, res) => {
  const db = loadDatabase();
  const visibleCategories = db.categories.filter(c => c.isVisible !== false);
  res.json({ success: true, data: visibleCategories });
});

// 2. Menu Items
app.get('/api/public/menu', (req, res) => {
  const db = loadDatabase();
  const { categoryId, categorySlug, isVeg, isChefSpecial, isAvailable, availableOnly, search } = req.query;

  let items = [...db.menuItems];

  if (availableOnly === 'true' || isAvailable === 'true') {
    items = items.filter(item => item.isAvailable !== false);
  } else if (isAvailable === 'false') {
    items = items.filter(item => item.isAvailable === false);
  }

  if (categorySlug) {
    const cat = db.categories.find(c => c.slug === categorySlug);
    if (cat) {
      items = items.filter(i => i.categoryId === cat.id);
    }
  } else if (categoryId) {
    items = items.filter(i => i.categoryId === Number(categoryId));
  }

  if (isVeg !== undefined) {
    items = items.filter(i => String(i.isVeg) === String(isVeg));
  }

  if (isChefSpecial !== undefined) {
    items = items.filter(i => String(i.isChefSpecial) === String(isChefSpecial));
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.ingredients && i.ingredients.toLowerCase().includes(q))
    );
  }

  // Attach category names
  const categoryMap = new Map(db.categories.map(c => [c.id, c.name]));
  const enriched = items.map(item => ({
    ...item,
    categoryName: categoryMap.get(item.categoryId) || 'Specialties'
  }));

  res.json({ success: true, data: enriched });
});

// 3. Single Dish Detail
app.get('/api/public/menu/:id', (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const item = db.menuItems.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Dish not found' });
  }

  const cat = db.categories.find(c => c.id === item.categoryId);
  res.json({ success: true, data: { ...item, categoryName: cat ? cat.name : '' } });
});

// 4a. Check Reservation Table Availability
app.get('/api/public/reservations/availability', (req, res) => {
  const { date, time, guests } = req.query;
  const guestCount = Math.max(1, Math.min(20, Math.floor(Number(guests)) || 2));
  const db = loadDatabase();
  const tables = db.tables || [];

  // Count tables that can seat this party size
  const suitableTables = tables.filter(t => t.capacity >= guestCount && t.isActive !== false);

  // Check how many are booked for that date and overlapping time window (+/- 90 mins)
  const existing = (db.reservations || []).filter(r =>
    r.reservationDate === date &&
    r.status === 'CONFIRMED' &&
    Math.abs((parseInt(r.reservationTime?.replace(':', '')) || 0) - (parseInt(String(time)?.replace(':', '')) || 0)) < 130
  );

  const availableCount = Math.max(0, suitableTables.length - existing.length);
  const isAvailable = suitableTables.length > 0 && availableCount > 0;

  res.json({
    success: true,
    data: {
      available: isAvailable,
      suitableTablesCount: availableCount,
      totalSuitable: suitableTables.length,
      message: isAvailable
        ? `${availableCount} ${availableCount === 1 ? 'table' : 'tables'} available for ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`
        : 'All suitable tables are reserved for this time slot. Please try an alternate hour.'
    }
  });
});

// 4. Submit Reservation (Strictly Validated)
app.post('/api/public/reservations', (req, res) => {
  const { name, phone, email, reservationDate, reservationTime, guests, specialRequest, eventType, eventName, seatingPreference } = req.body;

  // 1. Customer Name Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Valid customer name is required (2 to 100 characters).'
    });
  }

  // 2. Email Address Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required for booking confirmation.'
    });
  }

  // 3. Telephone Validation (8-20 characters, minimum 8 digits)
  const phoneClean = String(phone || '').trim();
  const digitsOnly = phoneClean.replace(/\D/g, '');
  if (!phoneClean || digitsOnly.length < 8 || digitsOnly.length > 15) {
    return res.status(400).json({
      success: false,
      message: 'A valid telephone number is required (8 to 15 digits).'
    });
  }

  // 4. Date Validation (YYYY-MM-DD, today or future only)
  if (!reservationDate || !/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)) {
    return res.status(400).json({
      success: false,
      message: 'Reservation date must be provided in YYYY-MM-DD format.'
    });
  }
  const todayDateStr = new Date().toISOString().split('T')[0];
  if (reservationDate < todayDateStr) {
    return res.status(400).json({
      success: false,
      message: 'Reservation date cannot be in the past.'
    });
  }

  // 5. Time Validation (HH:mm format, standard operating window)
  if (!reservationTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(reservationTime)) {
    return res.status(400).json({
      success: false,
      message: 'Reservation time must be provided in HH:mm 24-hour format.'
    });
  }

  // 6. Guest Count Validation (1 to 20 guests)
  const guestCount = Math.floor(Number(guests));
  if (!guestCount || guestCount < 1 || guestCount > 20) {
    return res.status(400).json({
      success: false,
      message: 'Guest count must be between 1 and 20 guests.'
    });
  }

  const db = loadDatabase();
  const newReservation = {
    id: db.reservations.length > 0 ? Math.max(...db.reservations.map(r => r.id)) + 1 : 1,
    name: name.trim(),
    phone: phoneClean,
    email: email.trim().toLowerCase(),
    reservationDate,
    reservationTime,
    guests: guestCount,
    specialRequest: specialRequest ? String(specialRequest).trim().slice(0, 500) : '',
    eventType: eventType ? String(eventType).trim().slice(0, 50) : 'DINING',
    eventName: eventName ? String(eventName).trim().slice(0, 150) : null,
    seatingPreference: seatingPreference ? String(seatingPreference).trim().slice(0, 100) : 'Main Dining Chamber',
    status: 'PENDING',
    tableNumber: '',
    adminNote: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.reservations.unshift(newReservation);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Your reservation request has been received. Our concierge team will review and confirm shortly.',
    data: newReservation
  });
});

// 5. Submit Order (QR Table Ordering with Server-Authoritative Pricing & Idempotency)
app.post('/api/public/orders', publicOrderRateLimiter, (req, res) => {
  const { tableNumber, items, customerName, customerPhone, notes } = req.body;
  const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;

  // Idempotency check: prevent double charging or accidental duplicate orders
  if (idempotencyKey && orderIdempotencyMap.has(idempotencyKey)) {
    const cached = orderIdempotencyMap.get(idempotencyKey);
    return res.status(200).json({
      success: true,
      message: 'Order already processed (idempotent submission).',
      data: cached.order
    });
  }

  if (!tableNumber) {
    return res.status(400).json({ success: false, message: 'Table number identifier is required.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one menu item.' });
  }

  const db = loadDatabase();

  // Validate table against registered restaurant stations
  const cleanTable = String(tableNumber).trim().toUpperCase();
  const tbl = (db.tables || []).find(t => t.tableNumber.toUpperCase() === cleanTable);
  if (!tbl) {
    return res.status(400).json({
      success: false,
      message: `Table station "${cleanTable}" is not recognized in the restaurant system. Please verify table signage.`
    });
  }

  // Load menu items from database, enforce server pricing, check availability & validate quantities
  const validatedItems = [];
  let subtotal = 0;

  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx];
    const menuItemId = Number(it.menuItemId || it.id);
    const dish = (db.menuItems || []).find(m => m.id === menuItemId);

    if (!dish) {
      return res.status(400).json({
        success: false,
        message: `Menu item with ID ${menuItemId} does not exist in our catalog.`
      });
    }

    if (dish.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: `Dish "${dish.name}" is currently sold out and unavailable for ordering.`
      });
    }

    const rawQty = it.quantity;
    if (typeof rawQty !== 'number' || !Number.isInteger(rawQty) || rawQty < 1 || rawQty > 50) {
      return res.status(400).json({
        success: false,
        message: `Invalid quantity (${it.quantity}) for dish "${dish.name}". Quantity must be an integer between 1 and 50.`
      });
    }
    const quantity = rawQty;

    // SERVER IS THE SOLE AUTHORITY FOR UNIT PRICE
    const unitPrice = Number(dish.price);
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    subtotal += lineTotal;

    validatedItems.push({
      id: idx + 1,
      menuItemId: dish.id,
      name: dish.name,
      price: unitPrice, // Server-verified price!
      quantity: quantity,
      specialInstructions: typeof it.specialInstructions === 'string' ? it.specialInstructions.trim().slice(0, 200) : '',
      imageUrl: dish.imageUrl || '',
      isVeg: Boolean(dish.isVeg)
    });
  }

  subtotal = Number(subtotal.toFixed(2));

  // Dynamic tax calculation from verified restaurant settings
  const taxPercentage = typeof db.settings?.taxPercentage === 'number' && !isNaN(db.settings.taxPercentage)
    ? db.settings.taxPercentage
    : 5;
  const taxRate = taxPercentage / 100;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  // Stable, collision-resistant order number
  const uniqueCode = Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  const orderNumber = `FZ-${uniqueCode}`;

  const newOrder = {
    id: db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1,
    orderNumber,
    tableNumber: cleanTable,
    customerName: customerName && String(customerName).trim() ? String(customerName).trim().slice(0, 100) : `Table ${cleanTable} Guest`,
    customerPhone: customerPhone ? String(customerPhone).trim().slice(0, 25) : '',
    items: validatedItems,
    subtotal,
    tax,
    total,
    status: 'PENDING',
    notes: notes ? String(notes).trim().slice(0, 500) : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Mark table as occupied and link order
  tbl.status = 'OCCUPIED';
  tbl.activeOrderId = newOrder.id;

  saveDatabase(db);

  // Store in idempotency cache
  if (idempotencyKey) {
    orderIdempotencyMap.set(idempotencyKey, {
      order: newOrder,
      timestamp: Date.now()
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order transmitted directly to kitchen station.',
    data: newOrder
  });
});

// 6. Track Order Status
app.get('/api/public/orders/:orderNumber', (req, res) => {
  const db = loadDatabase();
  const order = db.orders.find(o => o.orderNumber.toUpperCase() === req.params.orderNumber.toUpperCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

// 7. Tables List
app.get('/api/public/tables', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.tables });
});

// 8. Log QR Scan
app.post('/api/public/qr/scan', (req, res) => {
  const { table } = req.body;
  if (!table) return res.status(400).json({ success: false });

  const db = loadDatabase();
  if (!db.qrScans) db.qrScans = [];
  db.qrScans.unshift({
    id: db.qrScans.length + 1,
    table: String(table).toUpperCase(),
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'Unknown'
  });

  saveDatabase(db);
  res.json({ success: true, message: 'Scan logged' });
});

// 9. Gallery
app.get('/api/public/gallery', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.galleryImages || [] });
});

// 10. Reviews
app.get('/api/public/reviews', (req, res) => {
  const db = loadDatabase();
  const reviews = (db.reviews || []).filter(r => r.status === 'APPROVED');
  res.json({ success: true, data: reviews });
});

app.post('/api/public/reviews', (req, res) => {
  const { customerName, rating, comment } = req.body;
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid customer name is required.' });
  }

  const numRating = Math.floor(Number(rating));
  if (!numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
  }

  const db = loadDatabase();
  if (!db.reviews) db.reviews = [];

  const newRev = {
    id: db.reviews.length > 0 ? Math.max(...db.reviews.map(r => r.id)) + 1 : 1,
    customerName: customerName.trim().slice(0, 100),
    rating: numRating,
    comment: comment ? String(comment).trim().slice(0, 1000) : '',
    source: 'WEBSITE',
    status: 'APPROVED',
    isFeatured: numRating >= 5,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newRev);
  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Review received. Thank you!', data: newRev });
});

// 11. Website Settings
app.get('/api/public/settings', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.settings });
});

// 12. Submit Contact Inquiry
app.post('/api/public/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid customer name is required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Message content of at least 5 characters is required.' });
  }

  const db = loadDatabase();
  if (!db.contactMessages) db.contactMessages = [];
  const newMsg = {
    id: db.contactMessages.length > 0 ? Math.max(...db.contactMessages.map(m => m.id)) + 1 : 1,
    name: name.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 100),
    phone: phone ? String(phone).trim().slice(0, 25) : '',
    subject: subject ? String(subject).trim().slice(0, 150) : 'General Inquiry',
    message: message.trim().slice(0, 2000),
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  db.contactMessages.unshift(newMsg);
  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Inquiry received. Our concierge will be in touch shortly.', data: newMsg });
});

/* ========================================================
   AUTH API ENDPOINTS (RATE-LIMITED & PROTECTED)
   ======================================================== */

// Login with Rate Limiting and Inactive User Checks
app.post('/api/auth/login', loginRateLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password credentials are required' });
  }

  const db = loadDatabase();
  const cleanEmail = String(email).toLowerCase().trim();
  const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
  }

  if (isProduction && cleanEmail.endsWith('.local')) {
    return res.status(403).json({
      success: false,
      message: 'Default demo credentials (.local) are disabled in production mode. Please use a provisioned administrator account.'
    });
  }

  if (user.isActive === false) {
    return res.status(403).json({ success: false, message: 'This user account is deactivated. Contact system administrator.' });
  }

  const isMatch = bcrypt.compareSync(String(password), user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveDatabase(db);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: {
      token,
      expiresIn: 86400,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    }
  });
});

// Current User (Session check with DB active validation)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const user = (db.users || []).find(u => u.id === req.user.id);
  if (!user || user.isActive === false) {
    return res.status(403).json({ success: false, message: 'User account is inactive or not found' });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    }
  });
});

/* ========================================================
   ADMIN API ENDPOINTS (PROTECTED WITH JWT & RBAC)
   ======================================================== */

// 1. Dashboard Analytics (Role: ADMIN, MANAGER)
app.get('/api/admin/analytics', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();

  const totalRevenue = (db.orders || []).reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrders = (db.orders || []).length;
  const pendingOrders = (db.orders || []).filter(o => o.status === 'PENDING' || o.status === 'IN_KITCHEN').length;
  const totalReservations = (db.reservations || []).length;
  const upcomingReservations = (db.reservations || []).filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length;
  const totalMenuItems = (db.menuItems || []).length;
  const availableMenuItems = (db.menuItems || []).filter(i => i.isAvailable !== false).length;

  // Dynamic calculation of sales by day from real orders
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = dayNames[d.getDay()];
    dayMap[key] = { date: key, sales: 0, orders: 0 };
  }

  (db.orders || []).forEach(o => {
    if (o.status !== 'CANCELLED' && o.createdAt) {
      const d = new Date(o.createdAt);
      const key = dayNames[d.getDay()];
      if (dayMap[key]) {
        dayMap[key].sales += Math.round(Number(o.total || 0));
        dayMap[key].orders += 1;
      }
    }
  });

  const salesByDay = Object.values(dayMap);

  // Popular dishes calculation
  const dishCountMap = {};
  (db.orders || []).forEach(o => {
    (o.items || []).forEach(it => {
      dishCountMap[it.name] = (dishCountMap[it.name] || 0) + it.quantity;
    });
  });

  const popularDishes = Object.keys(dishCountMap).map(name => {
    const item = (db.menuItems || []).find(m => m.name === name);
    return {
      name,
      category: item ? item.categoryName || 'Tapas' : 'Specials',
      orderCount: dishCountMap[name],
      revenue: dishCountMap[name] * (item ? item.price : 500)
    };
  }).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  // Table Scan Counts
  const scanMap = {};
  (db.qrScans || []).forEach(s => {
    scanMap[s.table] = (scanMap[s.table] || 0) + 1;
  });

  const tableScanCounts = Object.keys(scanMap).map(table => ({
    table,
    scans: scanMap[table]
  })).sort((a, b) => b.scans - a.scans);

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalReservations,
      upcomingReservations,
      totalMenuItems,
      availableMenuItems,
      recentOrders: (db.orders || []).slice(0, 10),
      recentReservations: (db.reservations || []).slice(0, 10),
      salesByDay,
      popularDishes: popularDishes.length > 0 ? popularDishes : [
        { name: 'Dal Chawal Arancini', category: 'Tapas', orderCount: 42, revenue: 20790 },
        { name: 'Smoked Butter Chicken Bao', category: 'Small Plates', orderCount: 38, revenue: 22610 },
        { name: 'Braised Lamb Shank Rogan Josh', category: 'Mains', orderCount: 31, revenue: 27745 },
        { name: 'Farzi Illusion: Chuski Margarita', category: 'Mixology', orderCount: 54, revenue: 34830 }
      ],
      tableScanCounts: tableScanCounts.length > 0 ? tableScanCounts : [
        { table: 'T04', scans: 142 },
        { table: 'T07', scans: 118 },
        { table: 'T01', scans: 95 },
        { table: 'T05', scans: 88 },
        { table: 'T08', scans: 64 }
      ]
    }
  });
});

// 2. Admin Menu Items (Role: ADMIN, MANAGER)
app.get('/api/admin/menu', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();
  const categoryMap = new Map((db.categories || []).map(c => [c.id, c.name]));
  const enriched = (db.menuItems || []).map(item => ({
    ...item,
    categoryName: categoryMap.get(item.categoryId) || 'Specialties'
  }));
  res.json({ success: true, data: enriched });
});

app.post('/api/admin/menu', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();
  const data = req.body;

  if (!data.name || !data.categoryId || data.price === undefined) {
    return res.status(400).json({ success: false, message: 'Dish name, category, and price are required.' });
  }

  const category = (db.categories || []).find(c => c.id === Number(data.categoryId));
  const newItem = {
    id: db.menuItems.length > 0 ? Math.max(...db.menuItems.map(i => i.id)) + 1 : 1,
    categoryId: Number(data.categoryId),
    categoryName: category ? category.name : 'Curations',
    name: String(data.name).trim(),
    slug: String(data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description ? String(data.description).trim() : '',
    price: Number(data.price),
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
    ingredients: data.ingredients || '',
    allergens: data.allergens || '',
    spiceLevel: data.spiceLevel || 'NONE',
    isVeg: Boolean(data.isVeg),
    isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
    isChefSpecial: Boolean(data.isChefSpecial),
    isRecommended: Boolean(data.isRecommended),
    isPopular: Boolean(data.isPopular),
    displayOrder: data.displayOrder ? Number(data.displayOrder) : db.menuItems.length + 1,
    calories: data.calories ? Number(data.calories) : 350,
    preparationTimeMinutes: data.preparationTimeMinutes ? Number(data.preparationTimeMinutes) : 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.menuItems.push(newItem);
  saveDatabase(db);

  res.status(201).json({ success: true, message: 'Dish created successfully', data: newItem });
});

app.put('/api/admin/menu/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const index = (db.menuItems || []).findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Dish not found' });
  }

  const category = (db.categories || []).find(c => c.id === Number(req.body.categoryId || db.menuItems[index].categoryId));
  const updated = {
    ...db.menuItems[index],
    ...req.body,
    id,
    categoryId: Number(req.body.categoryId || db.menuItems[index].categoryId),
    categoryName: category ? category.name : db.menuItems[index].categoryName,
    price: Number(req.body.price !== undefined ? req.body.price : db.menuItems[index].price),
    updatedAt: new Date().toISOString()
  };

  db.menuItems[index] = updated;
  saveDatabase(db);

  res.json({ success: true, message: 'Dish updated successfully', data: updated });
});

app.delete('/api/admin/menu/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const initialLength = db.menuItems.length;
  db.menuItems = (db.menuItems || []).filter(i => i.id !== id);

  if (db.menuItems.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Dish not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Dish deleted successfully' });
});

// 3. Admin Categories (Role: ADMIN)
app.get('/api/admin/categories', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.categories || [] });
});

app.post('/api/admin/categories', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const db = loadDatabase();
  const { name, description, displayOrder } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const newCat = {
    id: db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1,
    name: name.trim(),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description ? String(description).trim() : '',
    displayOrder: displayOrder ? Number(displayOrder) : db.categories.length + 1,
    isVisible: true
  };

  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newCat });
});

// 4. Admin Reservations Management (Role: ADMIN, MANAGER, STAFF)
app.get('/api/admin/reservations', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.reservations || [] });
});

app.put('/api/admin/reservations/:id', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const r = (db.reservations || []).find(res => res.id === id);

  if (!r) return res.status(404).json({ success: false, message: 'Reservation not found' });

  const { status, tableNumber, adminNote } = req.body;
  if (status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'SEATED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }
    r.status = status;
  }
  if (tableNumber !== undefined) {
    const cleanTbl = String(tableNumber).trim().toUpperCase();
    if (cleanTbl) {
      const tbl = (db.tables || []).find(t => t.tableNumber.toUpperCase() === cleanTbl);
      if (!tbl) {
        return res.status(400).json({ success: false, message: `Station "${cleanTbl}" is not a recognized table.` });
      }
      if (r.guests && tbl.capacity < r.guests) {
        return res.status(400).json({
          success: false,
          message: `Station "${cleanTbl}" capacity (${tbl.capacity} guests) is insufficient for party of ${r.guests} guests.`
        });
      }
    }
    r.tableNumber = cleanTbl;
  }
  if (adminNote !== undefined) r.adminNote = String(adminNote).trim().slice(0, 500);
  r.updatedAt = new Date().toISOString();

  saveDatabase(db);
  res.json({ success: true, message: 'Reservation updated', data: r });
});

// 5. Admin Orders Management (Kitchen Display & Status Flow, Role: ADMIN, MANAGER, STAFF)
app.get('/api/admin/orders', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.orders || [] });
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const order = (db.orders || []).find(o => o.id === id);

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_KITCHEN', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status '${status}'` });
  }

  if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: `Order #${order.orderNumber} is already in terminal state '${order.status}' and cannot be transitioned.`
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  // If order completed or cancelled, automatically free the restaurant table
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    const tbl = (db.tables || []).find(t => t.tableNumber.toUpperCase() === order.tableNumber.toUpperCase());
    if (tbl) {
      tbl.status = 'AVAILABLE';
      tbl.activeOrderId = null;
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: `Order status changed to ${status}`, data: order });
});

// 6. Admin Tables Management (Role: ADMIN, MANAGER, STAFF)
app.get('/api/admin/tables', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.tables || [] });
});

app.put('/api/admin/tables/:id/status', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const table = (db.tables || []).find(t => t.id === id);

  if (!table) return res.status(404).json({ success: false, message: 'Table not found' });

  const validTableStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];
  if (!validTableStatuses.includes(req.body.status)) {
    return res.status(400).json({ success: false, message: 'Invalid table status' });
  }

  table.status = req.body.status;
  if (req.body.status === 'AVAILABLE') {
    table.activeOrderId = null;
  }
  saveDatabase(db);
  res.json({ success: true, data: table });
});

// 7. Admin Settings Update (Role: ADMIN only)
app.put('/api/admin/settings', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body, id: 1 };
  saveDatabase(db);
  res.json({ success: true, message: 'Settings saved', data: db.settings });
});

// 8. Admin Contact Messages (Role: ADMIN, MANAGER, STAFF)
app.get('/api/admin/contact', authenticateToken, requireRole('ADMIN', 'MANAGER', 'STAFF'), (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.contactMessages || [] });
});

// 404 Handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint '${req.method} ${req.originalUrl}' not found.` });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'An unexpected internal error occurred' : err.message
  });
});

// CLI Provisioning Command Handler
const args = process.argv.slice(2);
if (args[0] === '--provision-admin') {
  const email = args[1];
  const password = args[2];
  const role = args[3] || 'ADMIN';
  if (!email || !password) {
    console.error('Usage: node server/index.js --provision-admin <email> <password> [role]');
    process.exit(1);
  }
  const db = loadDatabase();
  if (!db.users) db.users = [];
  const cleanEmail = String(email).toLowerCase().trim();
  const existingUser = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  const passwordHash = bcrypt.hashSync(password, 10);
  if (existingUser) {
    existingUser.passwordHash = passwordHash;
    existingUser.role = role;
    existingUser.isActive = true;
    existingUser.updatedAt = new Date().toISOString();
    console.log(`[Farzi Security] Successfully updated administrator account: ${cleanEmail} (Role: ${role})`);
  } else {
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      name: 'Executive Administrator',
      email: cleanEmail,
      passwordHash,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    console.log(`[Farzi Security] Successfully created administrator account: ${cleanEmail} (Role: ${role})`);
  }
  saveDatabase(db);
  process.exit(0);
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Farzi RestaurantOS Backend running on http://localhost:${PORT}`);
});


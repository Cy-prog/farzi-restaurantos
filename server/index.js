import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_this_is_a_local_dev_only_placeholder_secret_key_32bytes';

app.use(cors());
app.use(express.json());

// Database file setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'restaurantos.json');

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
        isActive: true,
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

// Database persistence helper
const loadDatabase = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading database, reverting to seed:', err);
    return getInitialData();
  }
};

const saveDatabase = (db) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error writing database:', err);
  }
};

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: missing bearer token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
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

// 4. Submit Reservation
app.post('/api/public/reservations', (req, res) => {
  const { name, phone, email, reservationDate, reservationTime, guests, specialRequest } = req.body;

  if (!name || !phone || !email || !reservationDate || !reservationTime || !guests) {
    return res.status(400).json({ success: false, message: 'All booking fields are required.' });
  }

  const db = loadDatabase();
  const newReservation = {
    id: db.reservations.length > 0 ? Math.max(...db.reservations.map(r => r.id)) + 1 : 1,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    reservationDate,
    reservationTime,
    guests: Number(guests),
    specialRequest: specialRequest ? specialRequest.trim() : '',
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
    message: 'Your reservation request has been received. Our concierge will review and confirm shortly.',
    data: newReservation
  });
});

// 5. Submit Order (QR Table Ordering)
app.post('/api/public/orders', (req, res) => {
  const { tableNumber, items, customerName, customerPhone, notes } = req.body;

  if (!tableNumber || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid table number and order items are required.' });
  }

  // Sanitize and validate table identifier
  const cleanTable = String(tableNumber).trim().toUpperCase();
  if (!/^T[0-9]{1,2}$/.test(cleanTable) && !/^TABLE\s*[0-9]{1,2}$/i.test(cleanTable)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid dining table identifier. Please use a valid station (e.g. T01 to T12).'
    });
  }

  const db = loadDatabase();

  // Validate that no ordered items are currently marked as unavailable
  for (const it of items) {
    const dish = db.menuItems.find(m => m.id === it.menuItemId || m.name === it.name);
    if (dish && dish.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: `Dish "${dish.name}" is currently sold out and unavailable for order.`
      });
    }
  }

  const subtotal = items.reduce((acc, it) => acc + (Number(it.price) * Number(it.quantity)), 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const orderNumber = `FZ-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1,
    orderNumber,
    tableNumber: cleanTable,
    customerName: customerName ? customerName.trim() : 'Guest Diners',
    customerPhone: customerPhone ? customerPhone.trim() : '',
    items,
    subtotal,
    tax,
    total,
    status: 'PENDING',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Mark table as occupied if present
  const tbl = db.tables.find(t => t.tableNumber.toUpperCase() === String(tableNumber).toUpperCase());
  if (tbl) {
    tbl.status = 'OCCUPIED';
    tbl.activeOrderId = newOrder.id;
  }

  saveDatabase(db);

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
  if (!customerName || !rating) {
    return res.status(400).json({ success: false, message: 'Name and rating are required' });
  }

  const db = loadDatabase();
  const newRev = {
    id: db.reviews.length + 1,
    customerName: customerName.trim(),
    rating: Number(rating),
    comment: comment || '',
    source: 'WEBSITE',
    status: 'APPROVED',
    isFeatured: Number(rating) >= 5,
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

/* ========================================================
   AUTH API ENDPOINTS
   ======================================================== */

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid password credentials' });
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

// Current User
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
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
   ADMIN API ENDPOINTS (PROTECTED WITH JWT)
   ======================================================== */

// 1. Dashboard Analytics
app.get('/api/admin/analytics', authenticateToken, (req, res) => {
  const db = loadDatabase();

  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.status === 'PENDING' || o.status === 'IN_KITCHEN').length;
  const totalReservations = db.reservations.length;
  const upcomingReservations = db.reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length;
  const totalMenuItems = db.menuItems.length;
  const availableMenuItems = db.menuItems.filter(i => i.isAvailable !== false).length;

  // Dynamic calculation of sales by day from real orders
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = dayNames[d.getDay()];
    dayMap[key] = { date: key, sales: 0, orders: 0 };
  }

  db.orders.forEach(o => {
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
  db.orders.forEach(o => {
    o.items.forEach(it => {
      dishCountMap[it.name] = (dishCountMap[it.name] || 0) + it.quantity;
    });
  });

  const popularDishes = Object.keys(dishCountMap).map(name => {
    const item = db.menuItems.find(m => m.name === name);
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
      recentOrders: db.orders.slice(0, 10),
      recentReservations: db.reservations.slice(0, 10),
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

// 2. Admin Menu Items (Full CRUD)
app.get('/api/admin/menu', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const categoryMap = new Map(db.categories.map(c => [c.id, c.name]));
  const enriched = db.menuItems.map(item => ({
    ...item,
    categoryName: categoryMap.get(item.categoryId) || 'Specialties'
  }));
  res.json({ success: true, data: enriched });
});

app.post('/api/admin/menu', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const data = req.body;

  if (!data.name || !data.categoryId || !data.price) {
    return res.status(400).json({ success: false, message: 'Name, Category, and Price are required.' });
  }

  const category = db.categories.find(c => c.id === Number(data.categoryId));
  const newItem = {
    id: db.menuItems.length > 0 ? Math.max(...db.menuItems.map(i => i.id)) + 1 : 1,
    categoryId: Number(data.categoryId),
    categoryName: category ? category.name : 'Curations',
    name: data.name.trim(),
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
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

app.put('/api/admin/menu/:id', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const index = db.menuItems.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Dish not found' });
  }

  const category = db.categories.find(c => c.id === Number(req.body.categoryId || db.menuItems[index].categoryId));
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

app.delete('/api/admin/menu/:id', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const initialLength = db.menuItems.length;
  db.menuItems = db.menuItems.filter(i => i.id !== id);

  if (db.menuItems.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Dish not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Dish deleted successfully' });
});

// 3. Admin Categories (Full CRUD)
app.get('/api/admin/categories', authenticateToken, (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.categories });
});

app.post('/api/admin/categories', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const { name, description, displayOrder } = req.body;

  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

  const newCat = {
    id: db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1,
    name: name.trim(),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    displayOrder: displayOrder ? Number(displayOrder) : db.categories.length + 1,
    isVisible: true
  };

  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newCat });
});

// 4. Admin Reservations Management
app.get('/api/admin/reservations', authenticateToken, (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.reservations });
});

app.put('/api/admin/reservations/:id', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const r = db.reservations.find(res => res.id === id);

  if (!r) return res.status(404).json({ success: false, message: 'Reservation not found' });

  const { status, tableNumber, adminNote } = req.body;
  if (status) r.status = status;
  if (tableNumber !== undefined) r.tableNumber = tableNumber;
  if (adminNote !== undefined) r.adminNote = adminNote;
  r.updatedAt = new Date().toISOString();

  saveDatabase(db);
  res.json({ success: true, message: 'Reservation updated', data: r });
});

// 5. Admin Orders Management (Kitchen Display & Status Flow)
app.get('/api/admin/orders', authenticateToken, (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.orders });
});

app.put('/api/admin/orders/:id/status', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const order = db.orders.find(o => o.id === id);

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_KITCHEN', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  // If order completed or cancelled, free the table
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    const tbl = db.tables.find(t => t.tableNumber.toUpperCase() === order.tableNumber.toUpperCase());
    if (tbl) {
      tbl.status = 'AVAILABLE';
      tbl.activeOrderId = null;
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: `Order status changed to ${status}`, data: order });
});

// 6. Admin Tables Management
app.get('/api/admin/tables', authenticateToken, (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.tables });
});

app.put('/api/admin/tables/:id/status', authenticateToken, (req, res) => {
  const db = loadDatabase();
  const id = Number(req.params.id);
  const table = db.tables.find(t => t.id === id);

  if (!table) return res.status(404).json({ success: false, message: 'Table not found' });

  table.status = req.body.status;
  saveDatabase(db);
  res.json({ success: true, data: table });
});

// 7. Admin Settings Update
app.put('/api/admin/settings', authenticateToken, (req, res) => {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body, id: 1 };
  saveDatabase(db);
  res.json({ success: true, message: 'Settings saved', data: db.settings });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Farzi RestaurantOS Backend running on http://localhost:${PORT}`);
});

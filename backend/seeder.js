const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life, deep bass, and crystal-clear highs. Foldable design with soft ear cushions for all-day comfort.',
    price: 2999, category: 'Electronics', stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=380&fit=crop',
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your heart rate, steps, sleep, and 15+ sport modes. 7-day battery, AMOLED display, IP68 waterproof. Compatible with Android and iOS.',
    price: 3499, category: 'Electronics', stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=380&fit=crop',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'TKL layout with Cherry MX Red switches, per-key RGB lighting, anti-ghosting, and aluminium top plate. Perfect for gaming and fast typing.',
    price: 4299, category: 'Electronics', stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=380&fit=crop',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound with 20W output, 12-hour battery, IPX7 waterproof. Compact cylinder design — ideal for outdoor use.',
    price: 1799, category: 'Electronics', stock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=380&fit=crop',
  },
  {
    name: '27" 4K IPS Monitor',
    description: '3840×2160 resolution, 99% sRGB, 144Hz refresh rate, 1ms response time, HDR400. Built-in USB-C hub and height-adjustable stand.',
    price: 24999, category: 'Electronics', stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=380&fit=crop',
  },
  {
    name: 'True Wireless Earbuds',
    description: 'Active noise cancellation, 6mm drivers, 28-hour total playtime with case, IPX4 sweat resistance, touch controls. Fits securely for workouts.',
    price: 1999, category: 'Electronics', stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=380&fit=crop',
  },
  {
    name: '3-in-1 Wireless Charging Pad',
    description: 'Simultaneously charge your phone, earbuds, and smartwatch. 15W fast charge, Qi compatible, non-slip surface, auto-detect coil alignment.',
    price: 1499, category: 'Electronics', stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=380&fit=crop',
  },
  {
    name: 'USB-C 100W Fast Charger',
    description: 'GaN technology in a compact design. Charges laptops, tablets, and phones at full speed. Includes 2m braided cable.',
    price: 999, category: 'Electronics', stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=500&h=380&fit=crop',
  },
  {
    name: "Men's Classic White T-Shirt",
    description: '100% organic cotton crew-neck tee. Pre-shrunk, breathable, and comfortable for everyday wear. Available in S, M, L, XL, XXL.',
    price: 599, category: 'Clothing', stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=380&fit=crop',
  },
  {
    name: "Women's Floral Kurti",
    description: 'Lightweight rayon fabric with vibrant floral print. A-line cut with mandarin collar and side slits. Machine washable.',
    price: 849, category: 'Clothing', stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=500&h=380&fit=crop',
  },
  {
    name: 'Slim Fit Denim Jeans',
    description: 'Stretch denim for all-day comfort. Mid-rise, tapered leg, 5-pocket styling. Available in dark blue and black wash.',
    price: 1299, category: 'Clothing', stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=380&fit=crop',
  },
  {
    name: 'Hooded Zip-Up Sweatshirt',
    description: 'Fleece-lined hoodie with kangaroo pocket, metal zipper, and ribbed cuffs. Unisex sizing, perfect for cool evenings.',
    price: 1599, category: 'Clothing', stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&h=380&fit=crop',
  },
  {
    name: "Women's Running Shoes",
    description: 'Lightweight mesh upper with responsive foam midsole. Superior grip outsole for road and trail. Available in 5 colour options.',
    price: 3499, category: 'Clothing', stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=380&fit=crop',
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'A landmark book in software development — full of practical advice on becoming a better programmer. From journeyman to master.',
    price: 799, category: 'Books', stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=380&fit=crop',
  },
  {
    name: 'Clean Code',
    description: "Robert C. Martin's definitive guide to writing readable, maintainable code. Essential reading for every professional developer.",
    price: 699, category: 'Books', stock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=380&fit=crop',
  },
  {
    name: 'Atomic Habits',
    description: 'James Clear explains how tiny changes compound into remarkable results. Packed with proven strategies for habit formation.',
    price: 499, category: 'Books', stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=380&fit=crop',
  },
  {
    name: 'The Alchemist',
    description: "Paulo Coelho's beloved fable about following your dreams. Translated into 80 languages, one of the best-selling books of all time.",
    price: 349, category: 'Books', stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500&h=380&fit=crop',
  },
  {
    name: 'Ceramic Coffee Mug Set (4-pack)',
    description: 'Handcrafted earth-tone ceramic mugs, 350ml each. Microwave and dishwasher safe. Each mug has a slightly different glaze pattern.',
    price: 1199, category: 'Home', stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=380&fit=crop',
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 premium bamboo boards in small, medium, and large. Juice grooves, non-slip feet. Eco-friendly and naturally antibacterial.',
    price: 899, category: 'Home', stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=380&fit=crop',
  },
  {
    name: 'LED Desk Lamp with USB Charging',
    description: 'Touch-dimming with 3 colour temperatures, USB-A charging port, flexible gooseneck, memory function. Eye-care certified.',
    price: 1349, category: 'Home', stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1573297627771-c2dcf82d30ef?w=500&h=380&fit=crop',
  },
  {
    name: 'Stainless Steel Water Bottle 1L',
    description: 'Double-wall vacuum insulation keeps drinks cold 24h or hot 12h. BPA-free, leak-proof lid, powder-coated finish. Fits most cup holders.',
    price: 749, category: 'Home', stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=380&fit=crop',
  },
  {
    name: 'Non-Stick Cookware Set (5-piece)',
    description: 'Granite-coated pots and pans with ergonomic handles. Induction compatible, oven safe to 200°C, PFOA-free coating.',
    price: 3999, category: 'Home', stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=380&fit=crop',
  },
  {
    name: 'Yoga Mat with Carry Strap',
    description: '6mm thick TPE foam, non-slip texture on both sides, alignment lines, and moisture resistant. 183×61cm. Comes with carry strap.',
    price: 899, category: 'Sports', stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1601925228876-7e0e5c04b69a?w=500&h=380&fit=crop',
  },
  {
    name: 'Adjustable Dumbbell Set 20kg',
    description: 'Space-saving dial-select system adjusts from 2kg to 20kg in 2kg increments. Replaces 10 pairs of dumbbells. Durable ABS housing.',
    price: 7999, category: 'Sports', stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=380&fit=crop',
  },
  {
    name: 'Jump Rope — Speed Cable',
    description: 'Ball-bearing handles with 3mm speed cable. Adjustable length, ergonomic foam grips. Great for HIIT and boxing training.',
    price: 449, category: 'Sports', stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=380&fit=crop',
  },
  {
    name: 'Resistance Bands Set (5 levels)',
    description: 'Latex-free fabric bands in 5 resistance levels from extra-light to extra-heavy. Includes carry bag and exercise guide PDF.',
    price: 599, category: 'Sports', stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=380&fit=crop',
  },
  {
    name: 'Vitamin C Brightening Serum',
    description: '15% stabilised Vitamin C with Niacinamide and Hyaluronic Acid. Brightens skin tone, fades dark spots, boosts collagen. Dermatologist tested.',
    price: 899, category: 'Beauty', stock: 95,
    imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38571?w=500&h=380&fit=crop',
  },
  {
    name: 'SPF 50 Sunscreen Gel 100ml',
    description: 'Lightweight, non-greasy gel formula with broad-spectrum UVA/UVB protection. No white cast, suitable for oily and combination skin.',
    price: 449, category: 'Beauty', stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1526758097130-bab247274f58?w=500&h=380&fit=crop',
  },
  {
    name: 'Hydrating Face Moisturiser 50ml',
    description: 'Ceramide-rich daily moisturiser with Aloe Vera and Peptides. Restores skin barrier, suitable for all skin types. Fragrance-free.',
    price: 699, category: 'Beauty', stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=380&fit=crop',
  },
  {
    name: 'LEGO Classic Creative Bricks 1500pcs',
    description: 'Bumper box of classic bricks in 33 colours with special pieces. Open-ended play for ages 4+. Fully compatible with all LEGO sets.',
    price: 4999, category: 'Toys', stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=380&fit=crop',
  },
  {
    name: 'Remote Control Monster Truck',
    description: '1:10 scale RC truck with 4WD, 2.4GHz control, rechargeable Li-ion battery, 45+ min run time, and all-terrain tyres.',
    price: 2499, category: 'Toys', stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=380&fit=crop',
  },
  {
    name: 'Wooden Building Blocks 100pcs',
    description: 'Natural beech wood blocks in 10 shapes. Smooth sanded edges, non-toxic paint, storage bag included. Develops creativity for ages 2+.',
    price: 1099, category: 'Toys', stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&h=380&fit=crop',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('🗑  Cleared existing data');

    const admin = await User.create({ name: 'Admin User', email: 'admin@shop.com', password: 'admin123', role: 'admin' });
    const user  = await User.create({ name: 'John Doe',   email: 'user@shop.com',  password: 'user123',  role: 'user'  });
    console.log('👤 Created 2 users');

    const created = await Product.insertMany(products);
    console.log(`📦 Created ${created.length} products`);

    await Order.create({
      user: user._id,
      items: [
        { product: created[0]._id, quantity: 1, price: created[0].price },
        { product: created[13]._id, quantity: 2, price: created[13].price },
      ],
      totalAmount: created[0].price + created[13].price * 2,
      shippingAddress: { name: 'John Doe', address: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' },
      status: 'delivered', paymentStatus: 'paid',
    });
    await Order.create({
      user: user._id,
      items: [
        { product: created[1]._id, quantity: 1, price: created[1].price },
        { product: created[22]._id, quantity: 1, price: created[22].price },
      ],
      totalAmount: created[1].price + created[22].price,
      shippingAddress: { name: 'John Doe', address: '456 Park Avenue', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '9876543210' },
      status: 'shipped', paymentStatus: 'paid',
    });
    console.log('🛒 Created 2 sample orders');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  Seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin : admin@shop.com / admin123');
    console.log('  User  : user@shop.com  / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const defaultCategories = [
  { id: 'laptops', name: 'Laptop', slug: 'laptops', description: 'Everyday, premium and gaming laptops' },
  { id: 'desktops', name: 'Desktop', slug: 'desktops', description: 'Tower and small form factor PCs' },
  { id: 'cctv', name: 'CCTV', slug: 'cctv', description: 'Security cameras and monitoring systems' },
  { id: 'monitors', name: 'Monitors', slug: 'monitors', description: 'Desktop monitors and displays' },
  { id: 'keyboards', name: 'Keyboards', slug: 'keyboards', description: 'Mechanical and wireless keyboards' }
];

const defaultProducts = [
  {
    id: "lp-1",
    name: "HP 15s Intel Core i3 12th Gen",
    brand: "HP",
    price: 35990,
    oldPrice: 42990,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Best Seller",
    rating: 4.3,
    categoryId: "laptops",
    category: "Laptop",
    subcategory: "Everyday",
    description: "HP 15s with Intel Core i3 12th Gen, 8GB RAM, 512GB SSD, 15.6-inch FHD display, Windows 11, and MS Office.",
    highlights: ["Intel Core i3 12th Gen", "8GB DDR4 RAM", "512GB PCIe NVMe M.2 SSD", "15.6\" FHD Micro-edge Display"],
    offers: ["No Cost EMI available", "Bank Offer: 10% instant discount"],
    warranty: "1 Year HP India Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 2,
    specs: [
      { label: "Processor", value: "Intel Core i3-1215U" },
      { label: "RAM", value: "8 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Display", value: "15.6 inch FHD (1920 x 1080)" },
      { label: "Operating System", value: "Windows 11 Home" },
      { label: "Weight", value: "1.69 kg" },
    ],
  },
  {
    id: "lp-2",
    name: "Lenovo IdeaPad Slim 3",
    brand: "Lenovo",
    price: 41990,
    oldPrice: 52990,
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Trending",
    rating: 4.4,
    categoryId: "laptops",
    category: "Laptop",
    subcategory: "Premium",
    description: "Lenovo IdeaPad Slim 3 powered by Intel Core i5 12th Gen, 8GB RAM, 512GB SSD, 15.6-inch FHD IPS display.",
    highlights: ["Intel Core i5 12th Gen", "8GB DDR4 RAM", "512GB SSD", "15.6\" FHD IPS 300nits Anti-glare"],
    offers: ["Exchange Offer: Up to ₹15,000 off"],
    warranty: "1 Year Lenovo Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 2,
    specs: [
      { label: "Processor", value: "Intel Core i5-12450H" },
      { label: "RAM", value: "8 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Display", value: "15.6 inch FHD IPS" },
      { label: "Operating System", value: "Windows 11 Home + MSO" },
      { label: "Weight", value: "1.62 kg" },
    ],
  },
  {
    id: "lp-3",
    name: "Dell Inspiron 15 3520",
    brand: "Dell",
    price: 46990,
    oldPrice: 57990,
    image: "https://images.unsplash.com/photo-1587831990611-6c65c5dab162?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587831990611-6c65c5dab162?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Special Offer",
    rating: 4.2,
    categoryId: "laptops",
    category: "Laptop",
    subcategory: "Everyday",
    description: "Dell Inspiron 15 with Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, 15.6-inch FHD 120Hz display.",
    highlights: ["Intel Core i5 12th Gen", "16GB DDR4 RAM", "512GB SSD", "15.6\" FHD 120Hz"],
    offers: ["No Cost EMI", "Bank Offer: Flat ₹2,000 off on HDFC cards"],
    warranty: "1 Year Dell India Warranty + 1 Year ADP",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 3,
    specs: [
      { label: "Processor", value: "Intel Core i5-1235U" },
      { label: "RAM", value: "16 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Display", value: "15.6 inch FHD 120Hz" },
      { label: "Operating System", value: "Windows 11 Home" },
      { label: "Weight", value: "1.65 kg" },
    ],
  },
  {
    id: "lp-4",
    name: "ASUS TUF Gaming F15",
    brand: "ASUS",
    price: 72990,
    oldPrice: 89990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Gaming Beast",
    rating: 4.5,
    categoryId: "laptops",
    category: "Laptop",
    subcategory: "Gaming",
    description: "ASUS TUF Gaming F15 with Intel Core i7 12th Gen, RTX 3050, 16GB RAM, 512GB SSD, 144Hz FHD display.",
    highlights: ["Intel Core i7 12th Gen", "NVIDIA RTX 3050 4GB", "16GB DDR4 RAM", "144Hz FHD Display"],
    offers: ["No Cost EMI", "Exchange Offer: Up to ₹20,000 off"],
    warranty: "2 Years ASUS India Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 2,
    specs: [
      { label: "Processor", value: "Intel Core i7-12700H" },
      { label: "RAM", value: "16 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Display", value: "15.6 inch FHD 144Hz" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 3050 4GB" },
      { label: "Weight", value: "2.2 kg" },
    ],
  },
  {
    id: "lp-5",
    name: "Acer Aspire 3 Slim",
    brand: "Acer",
    price: 29990,
    oldPrice: 36990,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Budget Pick",
    rating: 4.1,
    categoryId: "laptops",
    category: "Laptop",
    subcategory: "Entry",
    description: "Acer Aspire 3 with AMD Ryzen 3 3250U, 8GB RAM, 256GB SSD, 15.6-inch HD display, Windows 11.",
    highlights: ["AMD Ryzen 3 3250U", "8GB DDR4 RAM", "256GB SSD", "15.6\" HD Display"],
    offers: ["Bank Offer: 5% instant discount"],
    warranty: "1 Year Acer India Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 3,
    specs: [
      { label: "Processor", value: "AMD Ryzen 3 3250U" },
      { label: "RAM", value: "8 GB DDR4" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Display", value: "15.6 inch HD (1366 x 768)" },
      { label: "Operating System", value: "Windows 11 Home" },
      { label: "Weight", value: "1.78 kg" },
    ],
  },
  {
    id: "dt-1",
    name: "HP Desktop M01-F3000in",
    brand: "HP",
    price: 28990,
    oldPrice: 33990,
    image: "https://images.unsplash.com/photo-1587831990611-6c65c5dab162?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587831990611-6c65c5dab162?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Value Desktop",
    rating: 4.2,
    categoryId: "desktops",
    category: "Desktop",
    subcategory: "Tower PC",
    description: "HP Desktop M01 with Intel Core i3 12th Gen, 8GB RAM, 512GB SSD, DOS, and compact tower design.",
    highlights: ["Intel Core i3 12th Gen", "8GB DDR4 RAM", "512GB SSD", "Compact Tower"],
    offers: ["No Cost EMI available"],
    warranty: "1 Year HP India Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 3,
    specs: [
      { label: "Processor", value: "Intel Core i3-12100" },
      { label: "RAM", value: "8 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Operating System", value: "DOS" },
      { label: "Form Factor", value: "Mini Tower" },
      { label: "Weight", value: "4.5 kg" },
    ],
  },
  {
    id: "dt-2",
    name: "Lenovo V50t Tower Desktop",
    brand: "Lenovo",
    price: 44990,
    oldPrice: 52990,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Business Ready",
    rating: 4.3,
    categoryId: "desktops",
    category: "Desktop",
    subcategory: "Tower PC",
    description: "Lenovo V50t Tower with Intel Core i5 12th Gen, 8GB RAM, 1TB HDD + 256GB SSD, DOS.",
    highlights: ["Intel Core i5 12th Gen", "8GB DDR4 RAM", "1TB HDD + 256GB SSD", "Business Tower"],
    offers: ["Bank Offer: 10% instant discount"],
    warranty: "1 Year Lenovo India Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 3,
    specs: [
      { label: "Processor", value: "Intel Core i5-12400" },
      { label: "RAM", value: "8 GB DDR4" },
      { label: "Storage", value: "1TB HDD + 256GB SSD" },
      { label: "Operating System", value: "DOS" },
      { label: "Form Factor", value: "Tower" },
      { label: "Weight", value: "5.4 kg" },
    ],
  },
  {
    id: "dt-3",
    name: "Dell OptiPlex 7010 SFF",
    brand: "Dell",
    price: 51990,
    oldPrice: 62990,
    image: "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Enterprise Grade",
    rating: 4.5,
    categoryId: "desktops",
    category: "Desktop",
    subcategory: "SFF",
    description: "Dell OptiPlex 7010 Small Form Factor with Intel Core i5 13th Gen, 16GB RAM, 512GB SSD, Windows 11 Pro.",
    highlights: ["Intel Core i5 13th Gen", "16GB DDR4 RAM", "512GB SSD", "Small Form Factor"],
    offers: ["No Cost EMI", "Exchange Offer available"],
    warranty: "3 Years Dell ProSupport",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 4,
    specs: [
      { label: "Processor", value: "Intel Core i5-13500" },
      { label: "RAM", value: "16 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Operating System", value: "Windows 11 Pro" },
      { label: "Form Factor", value: "Small Form Factor" },
      { label: "Weight", value: "5.1 kg" },
    ],
  },
  {
    id: "cctv-1",
    name: "CP PLUS 2MP 4-Channel DVR Kit",
    brand: "CP PLUS",
    price: 12990,
    oldPrice: 16990,
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Popular",
    rating: 4.4,
    categoryId: "cctv",
    category: "CCTV",
    subcategory: "DVR Kit",
    description: "CP PLUS 2MP Full HD 4-Channel DVR with 4 Bullet Cameras, 1TB HDD, Night Vision, and Mobile View support.",
    highlights: ["4 Channel 1080p DVR", "4 Bullet 2MP Cameras", "1TB Pre-installed HDD", "Night Vision up to 20m"],
    offers: ["Free Installation Support", "Bank Offer: 5% instant discount"],
    warranty: "1 Year CP PLUS Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 2,
    specs: [
      { label: "Camera Resolution", value: "2MP (1920 x 1080)" },
      { label: "DVR Channels", value: "4 Channel" },
      { label: "HDD", value: "1 TB Pre-installed" },
      { label: "Night Vision", value: "Up to 20 meters" },
      { label: "Connectivity", value: "Coaxial BNC" },
      { label: "Weatherproof", value: "IP66 Rated" },
    ],
  },
  {
    id: "cctv-2",
    name: "Hikvision 5MP ColorVu Camera (4 Pcs) + NVR",
    brand: "Hikvision",
    price: 24990,
    oldPrice: 30990,
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    ],
    badge: "Color Night Vision",
    rating: 4.6,
    categoryId: "cctv",
    category: "CCTV",
    subcategory: "NVR Kit",
    description: "Hikvision 5MP ColorVu 4 Camera Kit with 4-Channel NVR, 2TB HDD, Full Color Night Vision, and Audio Support.",
    highlights: ["5MP ColorVu Full Color Night", "4 Channel 4K NVR", "2TB HDD Pre-installed", "Built-in Mic Audio"],
    offers: ["Free Site Survey & Installation", "Bank Offer: Flat ₹1,500 off"],
    warranty: "2 Years Hikvision Warranty",
    seller: "Jalvindar Computer",
    inStock: true,
    deliveryDays: 3,
    specs: [
      { label: "Camera Resolution", value: "5MP (2560 x 1944)" },
      { label: "NVR Channels", value: "4 Channel 4K" },
      { label: "HDD", value: "2 TB Pre-installed" },
      { label: "Night Vision", value: "Full Color 24/7" },
      { label: "Audio", value: "Built-in Microphone" },
      { label: "Weatherproof", value: "IP67 Rated" },
    ],
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongodbUri);
    console.log('✓ Connected to MongoDB');

    // Admin user
    const adminEmail = config.adminEmail.toLowerCase();
    const adminPasswordHash = await bcrypt.hash(config.adminPassword, 10);
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        id: 'admin',
        name: 'Admin',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'admin'
      });
      await admin.save();
      console.log(`✓ Admin user created: ${config.adminEmail} / ${config.adminPassword}`);
    } else {
      existingAdmin.passwordHash = adminPasswordHash;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`✓ Admin user updated/verified: ${config.adminEmail}`);
    }

    // Categories
    for (const c of defaultCategories) {
      const exists = await Category.findOne({ slug: c.slug });
      if (!exists) {
        await new Category(c).save();
        console.log(`✓ Seeded category: ${c.name}`);
      } else {
        console.log(`• Category already exists: ${c.name}`);
      }
    }

    // Products
    for (const p of defaultProducts) {
      const exists = await Product.findOne({ id: p.id });
      if (!exists) {
        await new Product(p).save();
        console.log(`✓ Seeded product: ${p.name}`);
      } else {
        console.log(`• Product already exists: ${p.name}`);
      }
    }

    console.log('✓ Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal seeding error:', error);
    process.exit(1);
  }
}

seed();

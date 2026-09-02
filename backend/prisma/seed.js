const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  // 20 Cyberpunk Streetwear & Techwear (Clothing)
  {
    name: 'Cyberpunk Modular Techwear Hoodie',
    description: 'Heavyweight waterproof breathable membrane hoodie with removable tactical harness and magnetic Fidlock strap.',
    price: 8999,
    stock: 40,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop',
  },
  {
    name: 'Tactical Cargo Joggers with Strap System',
    description: 'Multi-pocket parachute ripstop joggers with adjustable D-ring webbed straps and ankle cinch toggles.',
    price: 6499,
    stock: 50,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
  },
  {
    name: 'Reflective Holographic Windbreaker',
    description: 'Prismatic 3M reflective coating windbreaker that shifts colors under stage and stream lighting.',
    price: 7999,
    stock: 35,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop',
  },
  {
    name: 'Programmable LED Matrix Smart Visor Cap',
    description: 'Curved streetwear cap with embedded Bluetooth-controlled flexible 12x48 RGB LED text display.',
    price: 4299,
    stock: 60,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop',
  },
  {
    name: 'Anime Glitch Cyber Bomber Jacket',
    description: 'Satin-finish flight bomber jacket with heat-transferred Japanese cybernetic artwork and arm utility pouch.',
    price: 9499,
    stock: 30,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
  },
  {
    name: 'Neon Cybernetic Oversized Graphic Tee',
    description: '280 GSM combed cotton drop-shoulder tee featuring high-density neon ultraviolet reactive silkscreen.',
    price: 2499,
    stock: 100,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop',
  },
  {
    name: 'Utility Molle Vest with Holster Accents',
    description: 'Modular Cordura plate-carrier style streetwear vest with laser-cut MOLLE webbing and quick-release buckles.',
    price: 5999,
    stock: 45,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop',
  },
  {
    name: 'High-Top Cyber Combat Sneakers',
    description: 'Futuristic chunky sneakers with translucent air-cushion pods, speed lacing, and reinforced toe bumper.',
    price: 11999,
    stock: 25,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
  },
  {
    name: 'Cyberpunk Waterproof Trench Poncho',
    description: 'Matte black polyurethane coated asymmetric poncho with storm flap, waterproof zips, and thumb loops.',
    price: 7499,
    stock: 30,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop',
  },
  {
    name: 'Thermal Heat-Reactive Long Sleeve Shirt',
    description: 'Color-changing thermochromic jersey fabric that alters shades with body heat and tactile interaction.',
    price: 3999,
    stock: 55,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop',
  },
  {
    name: 'Cybernetic Half-Face Dust Filter Mask',
    description: 'Aerospace-grade silicone respirator shell with replaceable N95 dual filters and magnetic chin latch.',
    price: 2199,
    stock: 80,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&auto=format&fit=crop',
  },
  {
    name: 'Illuminated Fibre-Optic Streetwear Beanie',
    description: 'Woven acrylic beanie with micro optic threads pulsing in 7 selectable static or breathing RGB modes.',
    price: 2799,
    stock: 65,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop',
  },
  {
    name: 'Tactical Magnetic Fidlock Utility Belt',
    description: 'Heavy duty military nylon webbing belt with genuine German Fidlock V-buckle quick release mechanism.',
    price: 2499,
    stock: 90,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop',
  },
  {
    name: 'Modular Holster Crossbody Sling Bag',
    description: 'Ergonomic anti-theft sling bag with waterproof YKK AquaGuard zips and dedicated quick-access tech slots.',
    price: 4999,
    stock: 40,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
  },
  {
    name: 'Acid-Wash Distressed Cyber Denim Pants',
    description: 'Bleached acid wash heavyweight denim with distressed knee slashes and cybernetic stencil typography.',
    price: 6999,
    stock: 35,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
  },
  {
    name: 'Kevlar Reinforced Techwear Gloves',
    description: 'Touchscreen-compatible carbon knuckle fingerless gloves with breathable 3D mesh and silicon grip palm.',
    price: 3299,
    stock: 70,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&auto=format&fit=crop',
  },
  {
    name: 'Cybernetic Circuit Print Track Pants',
    description: 'Water-resistant nylon track pants with reflective circuit pathway striping and zipped leg openings.',
    price: 5499,
    stock: 45,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&auto=format&fit=crop',
  },
  {
    name: 'Glitch Skull Printed Kimono Haori',
    description: 'Modern streetwear adaptation of traditional Japanese Haori with holographic glitch skull back artwork.',
    price: 6299,
    stock: 38,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop',
  },
  {
    name: 'Oversized Cyber Heavyweight Zip Hoodie',
    description: 'Boxy 450 GSM fleece zip hoodie with double hood construction, thumbholes, and custom metallic pullers.',
    price: 6999,
    stock: 50,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop',
  },
  {
    name: 'Anodized Aluminum Carabiner Lanyard',
    description: 'Tactical braided paracord keychain with matte black matte screw-gate carabiner and steel key loop.',
    price: 1299,
    stock: 120,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
  },

  // 20 Next-Gen Creator Equipment & Interactive RGB Hardware (Tech)
  {
    name: 'Magnetic Hall-Effect 8K Gaming Keyboard',
    description: 'Rapid-trigger analog hall-effect magnetic switches with 0.1mm actuation and per-key addressable RGB.',
    price: 18999,
    stock: 30,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
  },
  {
    name: '15-Key Interactive OLED Stream Deck',
    description: 'Customizable tactile keys with full-color LCD screens, dual rotary encoders, and instant scene triggering.',
    price: 14999,
    stock: 40,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1612287233207-695e29a3a9ad?w=600&auto=format&fit=crop',
  },
  {
    name: '34" Curved QD-OLED 240Hz Creator Monitor',
    description: '1750R ultra-wide QD-OLED panel with 99.3% DCI-P3 color accuracy, 0.03ms response time, and USB-C 90W PD.',
    price: 74999,
    stock: 12,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop',
  },
  {
    name: 'Broadcast XLR Dynamic Microphone with Boom Arm',
    description: 'Cardioid studio mic with built-in pop filter, internal air shockmount, and heavy duty aluminum boom stand.',
    price: 21999,
    stock: 25,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop',
  },
  {
    name: 'Modular Hexagon RGB Smart Wall Panels (9-Pack)',
    description: 'Interlocking touch-sensitive and music-syncing LED light panels displaying 16.8 million animated colors.',
    price: 12999,
    stock: 35,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop',
  },
  {
    name: 'Ultralight Magnesium Wireless Gaming Mouse (38g)',
    description: 'Cast magnesium honeycomb skeleton with 30,000 DPI optical sensor, optical switches, and 4K polling rate.',
    price: 13499,
    stock: 45,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
  },
  {
    name: 'Multi-Channel Live Audio Streaming Mixer Interface',
    description: 'Hardware motorized fader mixer with hardware noise gate, compressor, reverb, and sampler pads.',
    price: 24999,
    stock: 20,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop',
  },
  {
    name: 'Addressable RGB Dual Desk Ambient Light Bars',
    description: 'Twin vertical corner light pillars with camera screen-mirroring and immersive audio reactive lighting.',
    price: 6999,
    stock: 50,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop',
  },
  {
    name: '4K60 Pro HDR Ultra-Low Latency Capture Card',
    description: 'PCIe and external USB 3.2 video capture interface capturing uncompressed 4K60 HDR10 with VRR passthrough.',
    price: 17999,
    stock: 28,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
  },
  {
    name: 'Key Light Air Studio Edge-Lit LED Panel',
    description: '1400 lumen multi-layer diffusion soft LED panel with app control, variable color temp (2900K-7000K), and desk clamp.',
    price: 11499,
    stock: 32,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
  },
  {
    name: 'Spatial 7.1 Wireless Planar Gaming Headset',
    description: '90mm planar magnetic drivers with broadcast-quality detachable mic, low-latency 2.4GHz dongle, and Bluetooth 5.3.',
    price: 26999,
    stock: 22,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
  },
  {
    name: 'Glass Hybrid Performance Mousepad (490x420mm)',
    description: 'Micro-etched tempered aluminosilicate glass surface with zero initial friction and anti-slip silicone backing.',
    price: 7999,
    stock: 40,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
  },
  {
    name: 'Dual-Motor Motorized RGB Sit-Stand Desk (160x80cm)',
    description: 'Heavy duty steel frame with anti-collision gyroscope, memory presets, and integrated under-desk diffused RGB glow.',
    price: 34999,
    stock: 15,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop',
  },
  {
    name: 'Mechanical Keyboard Coiled Aviator Cable',
    description: 'Double-sleeved paracord and Techflex USB-C to USB-A coiled cable with detachable GX16 5-pin aviator connector.',
    price: 2499,
    stock: 85,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
  },
  {
    name: 'Ergonomic Breathable Mesh Gaming Chair',
    description: 'Automotive-grade synchro-tilt mechanism with 4D armrests, magnetic memory foam headrest, and dynamic lumbar support.',
    price: 28999,
    stock: 18,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c546f23fef6e?w=600&auto=format&fit=crop',
  },
  {
    name: 'Smart Dynamic Monitor Screen Light Bar',
    description: 'Zero screen glare asymmetrical optical monitor lamp with dual light source and wireless 2.4G puck controller.',
    price: 4999,
    stock: 60,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&auto=format&fit=crop',
  },
  {
    name: 'Hi-Res USB Studio Audio DAC & Headphone Amp',
    description: 'ESS Sabre ES9281A PRO chip supporting 32-bit/384kHz PCM and MQA decoding with low-noise balanced output.',
    price: 9999,
    stock: 35,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop',
  },
  {
    name: '100W GaN Cyberpunk Transparent Desktop Charger',
    description: 'Futuristic clear casing showcasing heatsinks with 3x USB-C and 1x USB-A fast charging power delivery.',
    price: 5499,
    stock: 75,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1586253634026-8cb574908d1e?w=600&auto=format&fit=crop',
  },
  {
    name: 'Studio Acrylic Headphone Stand with RGB Glow',
    description: 'Solid crystal-clear laser-cut acrylic holder with capacitive touch cycling through 10 cyberpunk lighting modes.',
    price: 2999,
    stock: 80,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=600&auto=format&fit=crop',
  },
  {
    name: 'Wireless Foot Pedal Stream Controller',
    description: 'Triple heavy duty tactile foot switches for push-to-talk, mute, scene shifts, and hands-free streaming macros.',
    price: 6499,
    stock: 45,
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop',
  },
];

async function main() {
  console.log('Seeding PixelMart database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pixelmart.com' },
    update: {},
    create: {
      email: 'admin@pixelmart.com',
      passwordHash: adminHash,
      name: 'PixelMart Admin',
      role: 'ADMIN',
    },
  });
  console.log('Created admin:', admin.email);

  // Create customer user
  const customerHash = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@pixelmart.com' },
    update: {},
    create: {
      email: 'customer@pixelmart.com',
      passwordHash: customerHash,
      name: 'Cyber Creator',
      role: 'CUSTOMER',
    },
  });
  console.log('Created customer:', customer.email);

  // Create 40 products
  for (const p of products) {
    const slugId = 'px-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const product = await prisma.product.upsert({
      where: { id: slugId },
      update: { ...p },
      create: { id: slugId, ...p },
    });
    console.log(`Created [${product.category}] ${product.name}`);
  }

  console.log(`\nSeeding complete! 40 products seeded for PixelMart.`);
  console.log('\nDemo Accounts:');
  console.log('  Admin:    admin@pixelmart.com    / Admin@123');
  console.log('  Customer: customer@pixelmart.com / Customer@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

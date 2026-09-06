const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'accio.db');
const db = new Database(dbPath);

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  seedInitialData();
}

function seedInitialData() {
  // Check if users table is populated
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount > 0) return;

  console.log('🌱 Seeding initial Accio database records...');

  const hashPassword = (pw) => bcrypt.hashSync(pw, 10);

  // 1. Seed Users (Admin + Demo International Buyers)
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, company_name, country, phone, role, avatar_url)
    VALUES (@id, @email, @password_hash, @full_name, @company_name, @country, @phone, @role, @avatar_url)
  `);

  const users = [
    {
      id: 'usr_admin_001',
      email: 'admin@accio-ceylon.com',
      password_hash: hashPassword('Admin@Accio2026'),
      full_name: 'Kavindu Jayasiri',
      company_name: 'Accio Export Ltd (Colombo HQ)',
      country: 'Sri Lanka',
      phone: '+94 11 258 4930',
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_cust_001',
      email: 'oliver.wright@londonorganics.co.uk',
      password_hash: hashPassword('Password123'),
      full_name: 'Oliver Wright',
      company_name: 'London Organic Snacks Ltd',
      country: 'United Kingdom',
      phone: '+44 20 7946 0912',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_cust_002',
      email: 'sophia.chen@sydneyfinefoods.com.au',
      password_hash: hashPassword('Password123'),
      full_name: 'Sophia Chen',
      company_name: 'Sydney Fine Foods Importers',
      country: 'Australia',
      phone: '+61 2 9374 4000',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_cust_003',
      email: 'klaus.meyer@hamburg-bioimport.de',
      password_hash: hashPassword('Password123'),
      full_name: 'Klaus Meyer',
      company_name: 'Hamburg Bio Import GmbH',
      country: 'Germany',
      phone: '+49 40 123456',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  for (const u of users) {
    insertUser.run(u);
  }

  // 2. Seed Products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, slug, category, description, short_desc, moisture_level, shelf_life,
      packaging_types, fob_price_usd, moq_kg, origin_region, certifications, nutrition_facts,
      images, in_stock, is_featured
    ) VALUES (
      @id, @name, @slug, @category, @description, @short_desc, @moisture_level, @shelf_life,
      @packaging_types, @fob_price_usd, @moq_kg, @origin_region, @certifications, @nutrition_facts,
      @images, @in_stock, @is_featured
    )
  `);

  const products = [
    {
      id: 'prod_mango_01',
      name: 'Ceylon Premium Dehydrated Mango Slices',
      slug: 'ceylon-dehydrated-mango-slices',
      category: 'Dehydrated Fruits',
      description: 'Hand-picked tree-ripened Willard and Karthacolomban mangoes from the sun-drenched orchards of Kurunegala, Sri Lanka. Dehydrated at precision low temperatures (<48°C) to preserve delicate natural enzymes, beta-carotene, tropical aroma, and chewy velvety texture. 100% pure fruit with zero added sugar, no sulfur dioxide, and no artificial preservatives.',
      short_desc: '100% naturally sweet Ceylon mango slices with zero added sugar or preservatives. Export Grade A.',
      moisture_level: '< 10%',
      shelf_life: '24 Months',
      packaging_types: JSON.stringify([
        { type: 'Matte White Standup Pouch (Ziplock)', size: '50g', retailBox: '24 pcs/carton' },
        { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
        { type: 'Kraft Standup Pouch', size: '250g', retailBox: '12 pcs/carton' },
        { type: 'Bulk Food-Grade Master Carton', size: '5kg & 10kg', retailBox: 'Vacuum Inner Liner' }
      ]),
      fob_price_usd: 12.80, // per kg bulk / equivalent
      moq_kg: 25,
      origin_region: 'Kurunegala & Dambulla Agri-Zones',
      certifications: JSON.stringify(['100% Pure Ceylon Sourced', 'Sub-48°C Dehydrated', 'Zero Added Sugar', 'Zero Artificial Preservatives', 'Export Grade A']),
      nutrition_facts: JSON.stringify({
        serving_size: '40g',
        calories: 130,
        protein: '1.2g',
        carbs: '31g',
        dietary_fiber: '3.5g',
        sugars: '24g (Natural Fruit Sugars)',
        vitamin_c: '45% DV',
        potassium: '220mg'
      }),
      images: JSON.stringify([
        '/products/mango_slices.jpg',
        '/reviews/review_mango_hand.jpg',
        '/reviews/review_mango_table.png',
        '/products/ceylon_mango.jpg'
      ]),
      in_stock: 1,
      is_featured: 1
    },
    {
      id: 'prod_bael_02',
      name: 'Ceylon Dehydrated Beli Fruit (Bael) Slices',
      slug: 'ceylon-dehydrated-beli-bael-fruit',
      category: 'Dehydrated Fruits',
      description: 'Authentic wild-harvested Ceylon Beli (Aegle marmelos / Golden Apple) harvested from the ancient dry-zone forests of Anuradhapura. Sliced into iconic sunburst discs and gently dehydrated to lock in aromatic herbal tannins and digestive health properties. Celebrated in Ayurvedic traditions for gut wellness and restorative hot herbal infusions.',
      short_desc: 'Sunburst sliced Ayurvedic Ceylon Bael fruit. Ideal for herbal tea brewing and digestive wellness.',
      moisture_level: '< 8%',
      shelf_life: '24 Months',
      packaging_types: JSON.stringify([
        { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
        { type: 'Matte White Standup Pouch', size: '200g', retailBox: '15 pcs/carton' },
        { type: 'Bulk Corrugated Export Carton', size: '10kg', retailBox: 'Double Poly-lined' }
      ]),
      fob_price_usd: 14.50,
      moq_kg: 20,
      origin_region: 'Anuradhapura & Polonnaruwa Dry Zone',
      certifications: JSON.stringify(['Wild Harvest Sourced', 'Sub-48°C Dehydrated', 'Ayurvedic Botanical Purity', 'Zero Additives']),
      nutrition_facts: JSON.stringify({
        serving_size: '30g',
        calories: 95,
        protein: '1.8g',
        carbs: '22g',
        dietary_fiber: '4.8g',
        sugars: '14g',
        tannins: 'Active Bioflavonoids',
        calcium: '85mg'
      }),
      images: JSON.stringify([
        '/products/beli_slices.jpg',
        '/reviews/review_mango_table.png',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
      ]),
      in_stock: 1,
      is_featured: 1
    },
    {
      id: 'prod_pineapple_03',
      name: 'Ceylon Dehydrated Mauritius Pineapple Rings',
      slug: 'ceylon-dehydrated-pineapple-rings',
      category: 'Dehydrated Fruits',
      description: 'Succulent queen-variety Mauritius pineapples cultivated in the rich red loam soils of Gampaha. Peeled, cored, and sliced into golden flower rings before gentle dehydration. Tangy, intensely aromatic, and rich in bromelain digestive enzyme with zero sulfites or syrupy coatings.',
      short_desc: 'Naturally tangy and sweet golden pineapple rings packed with active bromelain. Zero added sugar.',
      moisture_level: '< 11%',
      shelf_life: '18 Months',
      packaging_types: JSON.stringify([
        { type: 'Matte White Standup Pouch', size: '75g', retailBox: '24 pcs/carton' },
        { type: 'Kraft Window Pouch', size: '150g', retailBox: '18 pcs/carton' },
        { type: 'Bulk Master Carton', size: '10kg', retailBox: 'Nitrogen Flushed' }
      ]),
      fob_price_usd: 13.90,
      moq_kg: 25,
      origin_region: 'Gampaha & Mirigama Pine Belt',
      certifications: JSON.stringify(['100% Pure Fruit', 'Active Bromelain Retained', 'Zero Added Sugar', 'Non-GMO']),
      nutrition_facts: JSON.stringify({
        serving_size: '40g',
        calories: 125,
        protein: '0.9g',
        carbs: '30g',
        dietary_fiber: '2.8g',
        sugars: '22g',
        bromelain: 'High Bioactive',
        manganese: '65% DV'
      }),
      images: JSON.stringify([
        '/products/pineapple_rings.jpg',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80'
      ]),
      in_stock: 1,
      is_featured: 1
    },
    {
      id: 'prod_jackfruit_04',
      name: 'Ceylon Dehydrated Ripe Jackfruit Honey Crisps',
      slug: 'ceylon-dehydrated-ripe-jackfruit',
      category: 'Dehydrated Fruits',
      description: 'Golden pods of Ceylon "Waraka" honey jackfruit harvested at peak fragrance in the central foothills. Dehydrated to a delightful chewiness that releases waves of tropical banana-mango notes. Highly prized across European gourmet snack distributors.',
      short_desc: 'Exotic golden Ceylon Waraka jackfruit chunks. Intense tropical aroma and natural chewiness.',
      moisture_level: '< 9%',
      shelf_life: '20 Months',
      packaging_types: JSON.stringify([
        { type: 'Matte White Standup Pouch', size: '60g', retailBox: '24 pcs/carton' },
        { type: 'Kraft Standup Pouch', size: '200g', retailBox: '16 pcs/carton' },
        { type: 'Bulk Carton', size: '8kg', retailBox: 'Vacuum Packed' }
      ]),
      fob_price_usd: 15.20,
      moq_kg: 20,
      origin_region: 'Matale & Kegalle Agro-Forests',
      certifications: JSON.stringify(['100% Tree Ripened Waraka', 'Sub-48°C Dehydrated', 'Zero Added Sugar', 'Direct Farm Sourced']),
      nutrition_facts: JSON.stringify({
        serving_size: '35g',
        calories: 110,
        protein: '1.5g',
        carbs: '26g',
        dietary_fiber: '3.1g',
        sugars: '19g',
        potassium: '310mg'
      }),
      images: JSON.stringify([
        '/products/jackfruit_dried.jpg',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=80'
      ]),
      in_stock: 1,
      is_featured: 1
    },
    {
      id: 'prod_cinnamon_05',
      name: 'Pure Ceylon Cinnamon Quills (Alba Grade A+)',
      slug: 'pure-ceylon-cinnamon-quills-alba',
      category: 'Ceylon Spices',
      description: 'True Ceylon Cinnamon (Cinnamomum verum) Alba grade — the most exquisite, pencil-thin quills hand-rolled from young inner bark in Mirissa, Southern Sri Lanka. Ultra-low coumarin (<0.004%), sweet fragrant aroma, and delicate multi-layered papery texture. The pinnacle of culinary spices.',
      short_desc: 'True Ceylon Cinnamon Grade Alba. Ultra-low coumarin, delicate sweet fragrance and paper-thin quills.',
      moisture_level: '< 12%',
      shelf_life: '36 Months',
      packaging_types: JSON.stringify([
        { type: 'Glass Spice Jar with Wooden Cap', size: '50g', retailBox: '24 pcs/carton' },
        { type: 'Matte Kraft Cylinder Tube', size: '100g', retailBox: '18 pcs/carton' },
        { type: 'Bulk Export Bales / Carton', size: '5kg, 10kg, 25kg', retailBox: 'Export Gunny Bales' }
      ]),
      fob_price_usd: 34.00,
      moq_kg: 15,
      origin_region: 'Mirissa & Galle Spice Belt',
      certifications: JSON.stringify(['True Ceylon Cinnamon Alba', 'Ultra-Low Coumarin (<0.004%)', 'Hand-Rolled Quills', 'Export Grade A+']),
      nutrition_facts: JSON.stringify({
        serving_size: '5g',
        calories: 12,
        cinnamaldehyde: '> 65%',
        coumarin: '< 0.004% (Safe Daily Consumption)',
        calcium: '26mg',
        antioxidants: 'ORAC 131,420 µmol TE/100g'
      }),
      images: JSON.stringify([
        '/products/ceylon_spices.jpg',
        'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
      ]),
      in_stock: 1,
      is_featured: 1
    },
    {
      id: 'prod_moringa_06',
      name: 'Organic Ceylon Moringa Leaf Dehydrated Flakes',
      slug: 'organic-ceylon-moringa-leaf-flakes',
      category: 'Herbal Infusions',
      description: 'Pure shade-dehydrated Moringa oleifera leaves hand-plucked from organically certified estates in Hambantota. Dehydrated at sub-40°C to safeguard rich chlorophyll, 27 vitamins, 46 antioxidants, and essential amino acids. Perfect for premium tea blending, superfood smoothies, and nutraceutical capsulation.',
      short_desc: 'Vibrant green sub-40°C dehydrated Ceylon Moringa flakes. Nutrient-dense organic superfood.',
      moisture_level: '< 7%',
      shelf_life: '24 Months',
      packaging_types: JSON.stringify([
        { type: 'Kraft Standup Pouch', size: '80g', retailBox: '24 pcs/carton' },
        { type: 'Matte White Ziplock Pouch', size: '150g', retailBox: '18 pcs/carton' },
        { type: 'Bulk Fiber Drum', size: '10kg & 20kg', retailBox: 'Foil Lined' }
      ]),
      fob_price_usd: 11.50,
      moq_kg: 25,
      origin_region: 'Hambantota Organic Agri-Corridor',
      certifications: JSON.stringify(['100% Pure Leaf Flakes', 'Sub-40°C Shade Dehydrated', 'High Natural Chlorophyll', 'Nutrient Dense']),
      nutrition_facts: JSON.stringify({
        serving_size: '10g',
        calories: 32,
        protein: '2.8g',
        vitamin_a: '160% DV',
        iron: '28% DV',
        calcium: '185mg',
        chlorophyll: 'Natural High'
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
      ]),
      in_stock: 1,
      is_featured: 0
    },
    {
      id: 'prod_banana_07',
      name: 'Ceylon Solar Dehydrated Ambul Banana Slices',
      slug: 'ceylon-dehydrated-ambul-banana-slices',
      category: 'Dehydrated Fruits',
      description: 'Golden sweet Ceylon Ambul banana coins sun-kissed and precision low-temperature dehydrated to lock in rich natural potassium, vitamin B6, and prebiotic fiber. Intensely caramelized flavor with zero added sugar, no sulfur dioxide, and a delightful natural chewiness.',
      short_desc: 'Naturally sweet and tangy Ceylon Ambul banana coins with zero added sugar. Nutrient dense and export ready.',
      moisture_level: '< 10%',
      shelf_life: '20 Months',
      packaging_types: JSON.stringify([
        { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
        { type: 'Matte White Standup Pouch', size: '200g', retailBox: '16 pcs/carton' },
        { type: 'Bulk Food-Grade Master Carton', size: '10kg', retailBox: 'Vacuum Inner Liner' }
      ]),
      fob_price_usd: 10.90,
      moq_kg: 25,
      origin_region: 'Kandy & Kegalle Highland Agro-Belts',
      certifications: JSON.stringify(['100% Pure Ceylon Sourced', 'Sub-48°C Dehydrated', 'Zero Added Sugar', 'Zero Preservatives', 'Direct Farm Traceability']),
      nutrition_facts: JSON.stringify({
        serving_size: '40g',
        calories: 135,
        protein: '1.4g',
        carbs: '33g',
        dietary_fiber: '3.8g',
        sugars: '21g (Natural Fruit Sugars)',
        potassium: '380mg',
        magnesium: '28mg'
      }),
      images: JSON.stringify([
        '/products/banana_slices.jpg',
        '/reviews/review_gleora_table.png',
        '/reviews/review_gleora_hand.jpg'
      ]),
      in_stock: 1,
      is_featured: 1
    }
  ];

  for (const p of products) {
    insertProduct.run(p);
  }

  // 3. Seed Reviews (Featuring authentic packaging photos)
  const insertReview = db.prepare(`
    INSERT INTO reviews (
      id, product_id, author_name, author_country, author_company, rating, title,
      comment, photo_urls, is_verified, is_featured, status, created_at
    ) VALUES (
      @id, @product_id, @author_name, @author_country, @author_company, @rating, @title,
      @comment, @photo_urls, @is_verified, @is_featured, @status, @created_at
    )
  `);

  const reviews = [
    {
      id: 'rev_001',
      product_id: 'prod_mango_01',
      author_name: 'Oliver Wright',
      author_country: 'United Kingdom',
      author_company: 'London Organics Snack Co.',
      rating: 5,
      title: 'Flawless packaging and unbeatable naturally sweet taste!',
      comment: 'We received our initial shipment of the 50g matte white pouches at London Gateway last month. The texture and aroma of these Ceylon mango slices are astonishing — zero sulfites, no sugary syrup, just pure fruit. Our retail customers in Soho gave instant rave feedback. The resealable pouch design with the clean branding is so premium.',
      photo_urls: JSON.stringify(['/reviews/review_gleora_hand.jpg']),
      is_verified: 1,
      is_featured: 1,
      status: 'approved',
      created_at: '2026-08-14 10:20:00'
    },
    {
      id: 'rev_002',
      product_id: 'prod_mango_01',
      author_name: 'Sophia Chen',
      author_country: 'Australia',
      author_company: 'Sydney Fine Foods Importers',
      rating: 5,
      title: 'Our entire sample batch passed Australian biosecurity with flying colors!',
      comment: 'We tested both the white stand-up pouches and the kraft window pouches shown on our inspection table. Moisture levels were consistently under 10%, exactly matching the lab certificates. Shipped direct from Port of Colombo to Port Botany in 14 days. Exceptional quality assurance from the Accio team!',
      photo_urls: JSON.stringify(['/reviews/review_gleora_table.png']),
      is_verified: 1,
      is_featured: 1,
      status: 'approved',
      created_at: '2026-08-20 14:45:00'
    },
    {
      id: 'rev_003',
      product_id: 'prod_bael_02',
      author_name: 'Dr. Klaus Meyer',
      author_country: 'Germany',
      author_company: 'Hamburg Bio Tea & Infusions GmbH',
      rating: 5,
      title: 'The authentic sunburst sliced Beli fruit is unmatched in Europe',
      comment: 'We have been sourcing bael fruit from various Southeast Asian suppliers for 7 years, but Accio’s Ceylon harvest from Anuradhapura is leagues ahead. The sliced wheels stay intact without crumbling, and the herbal liquor brews a rich amber infusion with soothing aroma. Looking forward to our next 20ft container.',
      photo_urls: JSON.stringify(['/products/beli_slices.jpg']),
      is_verified: 1,
      is_featured: 1,
      status: 'approved',
      created_at: '2026-08-25 09:15:00'
    },
    {
      id: 'rev_004',
      product_id: 'prod_cinnamon_05',
      author_name: 'Chef Tariq Al-Mansoor',
      author_country: 'United Arab Emirates',
      author_company: 'Emirates Gourmet Logistics (Dubai)',
      rating: 5,
      title: 'Genuine Alba Grade True Cinnamon with paper-thin rolls',
      comment: 'The coumarin lab report provided with the FOB paperwork was verified by Dubai Central Labs. The fragrance of this Alba Ceylon cinnamon is delicate and sweet without the harshness of Cassia. Best partner in Colombo for wholesale spice procurement.',
      photo_urls: JSON.stringify(['/products/ceylon_spices.jpg']),
      is_verified: 1,
      is_featured: 1,
      status: 'approved',
      created_at: '2026-08-28 16:30:00'
    },
    {
      id: 'rev_005',
      product_id: 'prod_pineapple_03',
      author_name: 'Liam O’Connor',
      author_country: 'Ireland',
      author_company: 'Dublin Artisan Pantry',
      rating: 5,
      title: 'Tangy, golden rings — kids and adults adore them',
      comment: 'The pineapple rings retain their natural flower shape and vibrant sun-gold color. Perfect balance of acidity and sweetness. Our sample pack arrived via DHL Express in 4 days.',
      photo_urls: JSON.stringify([]),
      is_verified: 1,
      is_featured: 0,
      status: 'approved',
      created_at: '2026-08-30 11:10:00'
    }
  ];

  for (const r of reviews) {
    insertReview.run(r);
  }

  // 4. Seed Export Orders
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, tracking_number, user_id, customer_name, customer_email, customer_company,
      customer_phone, destination_country, destination_port, order_type, total_amount,
      currency, status, shipping_method, items_json, incoterms, notes, created_at, updated_at
    ) VALUES (
      @id, @tracking_number, @user_id, @customer_name, @customer_email, @customer_company,
      @customer_phone, @destination_country, @destination_port, @order_type, @total_amount,
      @currency, @status, @shipping_method, @items_json, @incoterms, @notes, @created_at, @updated_at
    )
  `);

  const orders = [
    {
      id: 'ord_1001',
      tracking_number: 'ACC-EXP-2026-7841',
      user_id: 'usr_cust_001',
      customer_name: 'Oliver Wright',
      customer_email: 'oliver.wright@londonorganics.co.uk',
      customer_company: 'London Organic Snacks Ltd',
      customer_phone: '+44 20 7946 0912',
      destination_country: 'United Kingdom',
      destination_port: 'London Gateway Port (GB LGP)',
      order_type: 'wholesale_fob',
      total_amount: 6400.00,
      currency: 'USD',
      status: 'Shipped (Colombo Port)',
      shipping_method: 'Ocean Freight (FCL 20ft)',
      items_json: JSON.stringify([
        { productId: 'prod_mango_01', productName: 'Ceylon Dehydrated Mango Slices', quantityKg: 500, packType: 'Matte White Standup Pouch (50g)', unitPrice: 12.80, lineTotal: 6400.00 }
      ]),
      incoterms: 'FOB Colombo',
      notes: 'Vessel MSC ANNA departed Colombo Port on Aug 28. Estimated arrival at London Gateway Sept 16.',
      created_at: '2026-08-15 08:30:00',
      updated_at: '2026-08-28 12:00:00'
    },
    {
      id: 'ord_1002',
      tracking_number: 'ACC-EXP-2026-8924',
      user_id: 'usr_cust_002',
      customer_name: 'Sophia Chen',
      customer_email: 'sophia.chen@sydneyfinefoods.com.au',
      customer_company: 'Sydney Fine Foods Importers',
      customer_phone: '+61 2 9374 4000',
      destination_country: 'Australia',
      destination_port: 'Port Botany, Sydney (AU SYD)',
      order_type: 'wholesale_cif',
      total_amount: 4950.00,
      currency: 'USD',
      status: 'Customs Cleared',
      shipping_method: 'Ocean Freight (LCL Consolidate)',
      items_json: JSON.stringify([
        { productId: 'prod_mango_01', productName: 'Ceylon Dehydrated Mango Slices', quantityKg: 200, packType: 'Kraft Window Pouch (100g)', unitPrice: 12.80, lineTotal: 2560.00 },
        { productId: 'prod_pineapple_03', productName: 'Mauritius Pineapple Rings', quantityKg: 150, packType: 'Kraft Window Pouch (150g)', unitPrice: 13.90, lineTotal: 2085.00 }
      ]),
      incoterms: 'CIF Sydney',
      notes: 'Phytosanitary certificate & Certificate of Origin issued by Sri Lanka Export Development Board.',
      created_at: '2026-08-22 11:15:00',
      updated_at: '2026-09-01 15:45:00'
    },
    {
      id: 'ord_1003',
      tracking_number: 'ACC-SMP-2026-1109',
      user_id: 'usr_cust_003',
      customer_name: 'Dr. Klaus Meyer',
      customer_email: 'klaus.meyer@hamburg-bioimport.de',
      customer_company: 'Hamburg Bio Import GmbH',
      customer_phone: '+49 40 123456',
      destination_country: 'Germany',
      destination_port: 'Hamburg Airport (Air Cargo)',
      order_type: 'sample',
      total_amount: 145.00,
      currency: 'EUR',
      status: 'Quotation Sent',
      shipping_method: 'Air Express Courier (DHL)',
      items_json: JSON.stringify([
        { productId: 'prod_bael_02', productName: 'Ceylon Dehydrated Beli Fruit', quantityKg: 2, packType: 'Sample Pack (500g)', unitPrice: 25.00, lineTotal: 50.00 },
        { productId: 'prod_cinnamon_05', productName: 'Ceylon Cinnamon Alba', quantityKg: 1, packType: 'Sample Glass Tube (100g)', unitPrice: 45.00, lineTotal: 45.00 }
      ]),
      incoterms: 'DDP Hamburg',
      notes: 'Sample kit prepared for European bio-retail evaluation.',
      created_at: '2026-09-01 09:40:00',
      updated_at: '2026-09-01 10:15:00'
    }
  ];

  for (const o of orders) {
    insertOrder.run(o);
  }

  // 5. Seed Initial Chat Room & Messages
  const insertRoom = db.prepare(`
    INSERT INTO chat_rooms (
      id, customer_id, guest_session_id, customer_name, customer_country,
      customer_company, last_message, last_message_at, unread_admin_count, unread_customer_count
    ) VALUES (
      @id, @customer_id, @guest_session_id, @customer_name, @customer_country,
      @customer_company, @last_message, @last_message_at, @unread_admin_count, @unread_customer_count
    )
  `);

  const insertMsg = db.prepare(`
    INSERT INTO chat_messages (id, room_id, sender_type, sender_id, sender_name, message_text, attachments, is_read, created_at)
    VALUES (@id, @room_id, @sender_type, @sender_id, @sender_name, @message_text, @attachments, @is_read, @created_at)
  `);

  const demoRoom = {
    id: 'room_oliver_uk',
    customer_id: 'usr_cust_001',
    guest_session_id: null,
    customer_name: 'Oliver Wright',
    customer_country: 'United Kingdom',
    customer_company: 'London Organic Snacks Ltd',
    last_message: 'Thank you Dinuka! Can you confirm if the 500kg mango shipment includes the palletized shrink wrap for London Gateway?',
    last_message_at: '2026-09-02 08:15:00',
    unread_admin_count: 1,
    unread_customer_count: 0
  };

  insertRoom.run(demoRoom);

  const messages = [
    {
      id: 'msg_001',
      room_id: 'room_oliver_uk',
      sender_type: 'customer',
      sender_id: 'usr_cust_001',
      sender_name: 'Oliver Wright',
      message_text: 'Hello Accio Team, we are preparing our Q4 holiday order for the 50g retail mango pouches.',
      attachments: JSON.stringify([]),
      is_read: 1,
      created_at: '2026-09-02 07:30:00'
    },
    {
      id: 'msg_002',
      room_id: 'room_oliver_uk',
      sender_type: 'admin',
      sender_id: 'usr_admin_001',
      sender_name: 'Dinuka Senanayake (Accio Export)',
      message_text: 'Ayubowan Oliver! Great to hear from you. We have 4.2 Metric Tons of Grade A Willard mango currently completing low-temperature dehydration in our Colombo chambers.',
      attachments: JSON.stringify([]),
      is_read: 1,
      created_at: '2026-09-02 07:45:00'
    },
    {
      id: 'msg_003',
      room_id: 'room_oliver_uk',
      sender_type: 'customer',
      sender_id: 'usr_cust_001',
      sender_name: 'Oliver Wright',
      message_text: 'Thank you Dinuka! Can you confirm if the 500kg mango shipment includes the palletized shrink wrap for London Gateway?',
      attachments: JSON.stringify([]),
      is_read: 0,
      created_at: '2026-09-02 08:15:00'
    }
  ];

  for (const m of messages) {
    insertMsg.run(m);
  }

  console.log('✅ Accio database schema and seed data created successfully.');
}

module.exports = {
  db,
  initDb
};

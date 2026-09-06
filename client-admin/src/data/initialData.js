export const INITIAL_PRODUCTS = [
  {
    id: 'prod_mango_01',
    name: 'Ceylon Solar Dehydrated Mango Slices',
    slug: 'ceylon-solar-dehydrated-mango-slices',
    category: 'Dehydrated Fruits',
    description: 'Harvested from lush organic orchards across Kurunegala and Anuradhapura, our premium Ceylon mango slices undergo slow, gentle dehydration below 48°C. This meticulous process locks in radiant tropical beta-carotene, vibrant natural sweetness, and a delightfully chewy, soft texture with zero added sugar, sulfur dioxide, or artificial preservatives.',
    short_desc: 'Naturally sweet and chewy pure Ceylon mango slices dried at low temperatures. 100% natural, zero added sugar.',
    moisture_level: '< 12%',
    shelf_life: '18 Months',
    fob_price_usd: 12.50,
    moq_kg: 50,
    origin_region: 'Kurunegala & Anuradhapura Orchards',
    images: [
      '/products/mango_slices.jpg',
      '/products/ceylon_mango.jpg',
      '/reviews/review_gleora_table.png',
      '/reviews/review_gleora_hand.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_banana_02',
    name: 'Ceylon Solar Dehydrated Ambul Banana Slices',
    slug: 'ceylon-solar-dehydrated-ambul-banana-slices',
    category: 'Dehydrated Fruits',
    description: 'Crafted from Sri Lanka’s world-renowned indigenous Ambul (Sour-Sweet) banana variety grown in the fertile mid-country slopes. Sliced and gently solar-dehydrated at low temperatures.',
    short_desc: 'Authentic Ceylon Ambul banana coins dried slowly. Rich in natural potassium and caramel sweetness.',
    moisture_level: '< 10%',
    shelf_life: '18 Months',
    fob_price_usd: 11.20,
    moq_kg: 40,
    origin_region: 'Kandy & Matale Hills, Sri Lanka',
    images: [
      '/products/banana_slices.jpg',
      '/reviews/review_gleora_table.png'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_beli_02',
    name: 'Ceylon Dehydrated Beli Fruit (Bael) Slices',
    slug: 'ceylon-dehydrated-beli-bael-fruit',
    category: 'Dehydrated Fruits',
    description: 'Authentic wild-harvested Ceylon Beli (Aegle marmelos / Golden Apple) harvested from the ancient dry-zone forests of Anuradhapura.',
    short_desc: 'Sunburst sliced Ayurvedic Ceylon Bael fruit. Ideal for herbal tea brewing and digestive wellness.',
    moisture_level: '< 8%',
    shelf_life: '24 Months',
    fob_price_usd: 14.50,
    moq_kg: 20,
    origin_region: 'Anuradhapura & Polonnaruwa Dry Zone',
    images: [
      '/products/beli_slices.jpg',
      '/reviews/review_gleora_table.png'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_pineapple_03',
    name: 'Ceylon Dehydrated Mauritius Pineapple Rings',
    slug: 'ceylon-dehydrated-pineapple-rings',
    category: 'Dehydrated Fruits',
    description: 'Succulent queen-variety Mauritius pineapples cultivated in the rich red loam soils of Gampaha.',
    short_desc: 'Naturally tangy and sweet golden pineapple rings packed with active bromelain. Zero added sugar.',
    moisture_level: '< 10%',
    shelf_life: '18 Months',
    fob_price_usd: 13.80,
    moq_kg: 30,
    origin_region: 'Gampaha & Mirigama Pineapple Belts',
    images: [
      '/products/pineapple_rings.jpg',
      '/reviews/review_gleora_table.png'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_jackfruit_04',
    name: 'Ceylon Dehydrated Young Green Jackfruit (Polos)',
    slug: 'ceylon-dehydrated-young-green-jackfruit',
    category: 'Botanical & Culinary',
    description: 'Tender young green jackfruit harvested before starch turns to sugar. Carefully shredded into fibrous vegan meat chunks and dehydrated.',
    short_desc: '100% plant-based meat alternative. Fibrous whole food with high dietary fiber and zero fat.',
    moisture_level: '< 9%',
    shelf_life: '24 Months',
    fob_price_usd: 10.90,
    moq_kg: 50,
    origin_region: 'Kurunegala & Kegalle Agro Forests',
    images: [
      '/products/jackfruit_dried.jpg',
      '/reviews/review_gleora_table.png'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_cinnamon_05',
    name: 'Pure Ceylon Organic Alba Cinnamon Quills',
    slug: 'pure-ceylon-organic-alba-cinnamon-quills',
    category: 'Spices & Botanicals',
    description: 'True Ceylon Cinnamon (Cinnamomum verum) Grade Alba — the thinnest, most prized pencil quills hand-rolled by master peelers in southern Galle.',
    short_desc: 'Supreme Grade Alba true Ceylon cinnamon quills. Rare floral bouquet with ultra-low coumarin.',
    moisture_level: '< 12%',
    shelf_life: '36 Months',
    fob_price_usd: 28.00,
    moq_kg: 10,
    origin_region: 'Southern Galle & Matara Coastal Plantations',
    images: [
      '/products/ceylon_spices.jpg',
      '/products/mango_slices.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord_sample_001',
    tracking_number: 'ACC-EXP-2026-7841',
    customer_id: 'usr_cust_001',
    customer_name: 'Oliver Wright',
    customer_email: 'oliver.wright@londonorganics.co.uk',
    customer_company: 'London Organic Snacks Ltd',
    order_type: 'sample',
    destination_country: 'United Kingdom',
    destination_port: 'Port of London Gateway',
    shipping_method: 'Air Cargo Express',
    total_amount: 320.00,
    currency: 'USD',
    status: 'dispatched',
    tracking_url: 'https://accio-ceylon.com/track/ACC-EXP-2026-7841',
    created_at: '2026-08-25T11:20:00Z',
    items: [
      { product_name: 'Ceylon Solar Dehydrated Mango Slices', quantity_units: 50, size: '50g pouch' },
      { product_name: 'Ceylon Dehydrated Beli Fruit Slices', quantity_units: 20, size: '100g Kraft' }
    ]
  },
  {
    id: 'ord_fcl_002',
    tracking_number: 'ACC-EXP-2026-9920',
    customer_id: 'usr_cust_002',
    customer_name: 'Klaus Reinhardt',
    customer_email: 'klaus.reinhardt@bavaria-bio.de',
    customer_company: 'Bavaria Bio-Handel GmbH',
    order_type: 'commercial_fob',
    destination_country: 'Germany',
    destination_port: 'Port of Hamburg',
    shipping_method: 'Ocean Freight (FCL 20ft)',
    total_amount: 14500.00,
    currency: 'USD',
    status: 'in_transit',
    tracking_url: 'https://accio-ceylon.com/track/ACC-EXP-2026-9920',
    created_at: '2026-08-10T14:45:00Z',
    items: [
      { product_name: 'Ceylon Solar Dehydrated Mango Slices', quantity_units: 1000, size: '5kg Bulk Carton' }
    ]
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_001',
    product_name: 'Ceylon Solar Dehydrated Mango Slices',
    customer_name: 'Oliver Wright',
    customer_company: 'London Organic Snacks Ltd',
    rating: 5,
    title: 'Superb chewiness & natural flavor - Our top selling dried fruit in London!',
    comment: 'We received our second 500kg FCL sample consignment at London Gateway. The low-temperature dehydration preserves the genuine tropical mango flavor without any sulfur aftertaste. The matte white packaging and Kraft window bags arrived in flawless shape. Truly world-class Ceylon quality!',
    verified_buyer: 1,
    status: 'approved',
    media_url: '/reviews/review_gleora_table.png',
    created_at: '2026-08-15T10:30:00Z'
  },
  {
    id: 'rev_002',
    product_name: 'Ceylon Solar Dehydrated Mango Slices',
    customer_name: 'Klaus Reinhardt',
    customer_company: 'Bavaria Bio-Handel GmbH',
    rating: 5,
    title: 'Flawless 50g pouches. Zero added sugar and pristine lab moisture specs.',
    comment: 'The 50g retail pouches for Gleora Living are phenomenal. Our Munich lab verified moisture under 11.5% with zero added sucrose or chemicals. The hand-held pouch presentation is stunning for high-end European retail shelves.',
    verified_buyer: 1,
    status: 'approved',
    media_url: '/reviews/review_gleora_hand.jpg',
    created_at: '2026-08-22T14:15:00Z'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'usr_cust_001',
    full_name: 'Oliver Wright',
    email: 'oliver.wright@londonorganics.co.uk',
    company_name: 'London Organic Snacks Ltd',
    country: 'United Kingdom',
    phone: '+44 20 7946 0912',
    total_orders: 4,
    total_spend_usd: 18450.00
  },
  {
    id: 'usr_cust_002',
    full_name: 'Klaus Reinhardt',
    email: 'klaus.reinhardt@bavaria-bio.de',
    company_name: 'Bavaria Bio-Handel GmbH',
    country: 'Germany',
    phone: '+49 89 2018 3920',
    total_orders: 2,
    total_spend_usd: 24800.00
  },
  {
    id: 'usr_cust_003',
    full_name: 'Sophia Chen',
    email: 'sophia.chen@sydneyfinefoods.com.au',
    company_name: 'Sydney Fine Foods',
    country: 'Australia',
    phone: '+61 2 9384 1029',
    total_orders: 1,
    total_spend_usd: 6200.00
  }
];

export const DEFAULT_ADMIN_USER = {
  id: 'usr_admin_001',
  full_name: 'Kavindu Jayasiri',
  email: 'admin@accio-ceylon.com',
  company_name: 'Accio Export Ltd (Colombo HQ)',
  country: 'Sri Lanka',
  phone: '+94 11 258 4930',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
};

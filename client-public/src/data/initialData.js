export const INITIAL_PRODUCTS = [
  {
    id: 'prod_mango_01',
    name: 'Ceylon Solar Dehydrated Mango Slices',
    slug: 'ceylon-solar-dehydrated-mango-slices',
    category: 'Dehydrated Fruits',
    description: 'Harvested from lush organic orchards across Kurunegala and Anuradhapura, our premium Ceylon mango slices undergo slow, gentle dehydration below 48°C. This meticulous process locks in radiant tropical beta-carotene, vibrant natural sweetness, and a delightfully chewy, soft texture with zero added sugar, sulfur dioxide, or artificial preservatives. Packaged for international retail shelves and bulk industrial confectionery blending.',
    short_desc: 'Naturally sweet and chewy pure Ceylon mango slices dried at low temperatures. 100% natural, zero added sugar.',
    moisture_level: '< 12%',
    shelf_life: '18 Months',
    packaging_types: [
      { type: 'Matte White Standup Pouch', size: '50g', retailBox: '24 pcs/carton' },
      { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
      { type: 'Bulk Multi-wall Poly Liner', size: '5kg', retailBox: 'Master Box' }
    ],
    fob_price_usd: 12.50,
    moq_kg: 50,
    origin_region: 'Kurunegala & Anuradhapura Orchards',
    certifications: ['100% Pure Ceylon Harvest', 'Sub-48°C Low-Temp Dehydration', 'Zero Added Sugar', 'Zero Sulfites & Preservatives'],
    nutrition_facts: {
      serving_size: '40g',
      calories: 128,
      protein: '1.2g',
      carbs: '31g',
      dietary_fiber: '3.4g',
      sugars: '24g (Natural Fruit Fructose)',
      vitamin_a: '45% DV',
      vitamin_c: '60% DV'
    },
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
    description: 'Crafted from Sri Lanka’s world-renowned indigenous Ambul (Sour-Sweet) banana variety grown in the fertile mid-country slopes. Sliced and gently solar-dehydrated at low temperatures to concentrate its distinctive caramel notes, high potassium, and prebiotic pectin fiber. Soft, deeply satisfying, and completely free from palm oil frying, sulfites, or artificial sweeteners.',
    short_desc: 'Authentic Ceylon Ambul banana coins dried slowly. Rich in natural potassium and caramel sweetness.',
    moisture_level: '< 10%',
    shelf_life: '18 Months',
    packaging_types: [
      { type: 'Matte White Standup Pouch', size: '50g', retailBox: '24 pcs/carton' },
      { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
      { type: 'Bulk Multi-wall Poly Liner', size: '5kg', retailBox: 'Master Box' }
    ],
    fob_price_usd: 11.20,
    moq_kg: 40,
    origin_region: 'Kandy & Matale Hills, Sri Lanka',
    certifications: ['100% Pure Ceylon Harvest', 'Sub-48°C Low-Temp Dehydration', 'Zero Added Sugar', 'Zero Sulfites & Preservatives'],
    nutrition_facts: {
      serving_size: '40g',
      calories: 135,
      protein: '1.5g',
      carbs: '33g',
      dietary_fiber: '3.8g',
      sugars: '22g (Natural Fruit Fructose)',
      potassium: '380mg (11% DV)',
      vitamin_b6: '20% DV'
    },
    images: [
      '/products/banana_slices.jpg',
      '/reviews/review_gleora_table.png',
      '/products/mango_slices.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_beli_02',
    name: 'Ceylon Dehydrated Beli Fruit (Bael) Slices',
    slug: 'ceylon-dehydrated-beli-bael-fruit',
    category: 'Dehydrated Fruits',
    description: 'Authentic wild-harvested Ceylon Beli (Aegle marmelos / Golden Apple) harvested from the ancient dry-zone forests of Anuradhapura. Sliced into iconic sunburst discs and gently dehydrated to lock in aromatic herbal tannins and digestive health properties. Celebrated in Ayurvedic traditions for gut wellness and restorative hot herbal infusions.',
    short_desc: 'Sunburst sliced Ayurvedic Ceylon Bael fruit. Ideal for herbal tea brewing and digestive wellness.',
    moisture_level: '< 8%',
    shelf_life: '24 Months',
    packaging_types: [
      { type: 'Kraft Paper Window Pouch', size: '100g', retailBox: '20 pcs/carton' },
      { type: 'Matte White Standup Pouch', size: '200g', retailBox: '15 pcs/carton' },
      { type: 'Bulk Corrugated Export Carton', size: '10kg', retailBox: 'Double Poly-lined' }
    ],
    fob_price_usd: 14.50,
    moq_kg: 20,
    origin_region: 'Anuradhapura & Polonnaruwa Dry Zone',
    certifications: ['Wild Harvest Sourced', 'Sub-48°C Dehydrated', 'Ayurvedic Botanical Purity', 'Zero Additives'],
    nutrition_facts: {
      serving_size: '30g',
      calories: 95,
      protein: '1.8g',
      carbs: '22g',
      dietary_fiber: '4.8g',
      sugars: '14g',
      tannins: 'Active Bioflavonoids',
      calcium: '85mg'
    },
    images: [
      '/products/beli_slices.jpg',
      '/reviews/review_gleora_table.png',
      '/products/mango_slices.jpg'
    ],
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
    moisture_level: '< 10%',
    shelf_life: '18 Months',
    packaging_types: [
      { type: 'Matte White Standup Pouch', size: '50g', retailBox: '24 pcs/carton' },
      { type: 'Kraft Standup Pouch', size: '150g', retailBox: '20 pcs/carton' },
      { type: 'Vacuum Foil Barrier Bag', size: '5kg', retailBox: 'Master Carton' }
    ],
    fob_price_usd: 13.80,
    moq_kg: 30,
    origin_region: 'Gampaha & Mirigama Pineapple Belts',
    certifications: ['100% Pure Ceylon Harvest', 'Low-Temp Dehydration', 'Zero Added Sugar', 'Zero Preservatives'],
    nutrition_facts: {
      serving_size: '40g',
      calories: 130,
      protein: '1.0g',
      carbs: '32g',
      dietary_fiber: '2.8g',
      sugars: '25g',
      bromelain: 'Active Enzyme',
      vitamin_c: '80% DV'
    },
    images: [
      '/products/pineapple_rings.jpg',
      '/reviews/review_gleora_table.png',
      '/products/mango_slices.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_jackfruit_04',
    name: 'Ceylon Dehydrated Young Green Jackfruit (Polos)',
    slug: 'ceylon-dehydrated-young-green-jackfruit',
    category: 'Botanical & Culinary',
    description: 'Tender young green jackfruit harvested before starch turns to sugar. Carefully shredded into fibrous vegan meat chunks and dehydrated. Neutral in flavor with a shred-like texture that absorbs broths, marinades, curries, and gourmet plant-based culinary creations.',
    short_desc: '100% plant-based meat alternative. Fibrous whole food with high dietary fiber and zero fat.',
    moisture_level: '< 9%',
    shelf_life: '24 Months',
    packaging_types: [
      { type: 'Foil Standup Barrier Pouch', size: '200g', retailBox: '18 pcs/carton' },
      { type: 'Bulk Food-Service Carton', size: '10kg', retailBox: 'Heavy Duty Bag' }
    ],
    fob_price_usd: 10.90,
    moq_kg: 50,
    origin_region: 'Kurunegala & Kegalle Agro Forests',
    certifications: ['Whole Food Plant Based', 'Sub-50°C Dehydration', 'Non-GMO', 'Zero Additives'],
    nutrition_facts: {
      serving_size: '50g',
      calories: 78,
      protein: '3.2g',
      carbs: '18g',
      dietary_fiber: '9.2g',
      sugars: '1.5g',
      fat: '0.4g',
      potassium: '320mg'
    },
    images: [
      '/products/jackfruit_dried.jpg',
      '/reviews/review_gleora_table.png',
      '/products/mango_slices.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  },
  {
    id: 'prod_cinnamon_05',
    name: 'Pure Ceylon Organic Alba Cinnamon Quills',
    slug: 'pure-ceylon-organic-alba-cinnamon-quills',
    category: 'Spices & Botanicals',
    description: 'True Ceylon Cinnamon (Cinnamomum verum) Grade Alba — the thinnest, most prized pencil quills hand-rolled by master peelers in southern Galle. Possesses an exquisite floral sweetness with ultra-low coumarin levels (< 0.004%), ensuring safe daily consumption.',
    short_desc: 'Supreme Grade Alba true Ceylon cinnamon quills. Rare floral bouquet with ultra-low coumarin.',
    moisture_level: '< 12%',
    shelf_life: '36 Months',
    packaging_types: [
      { type: 'Airtight Glass Tube (Retail)', size: '40g', retailBox: '24 tubes/display' },
      { type: 'Kraft Standup Pouch', size: '100g', retailBox: '20 pcs/carton' },
      { type: 'Jute Bales / Export Master Carton', size: '10kg', retailBox: 'FOB Export Standard' }
    ],
    fob_price_usd: 28.00,
    moq_kg: 10,
    origin_region: 'Southern Galle & Matara Coastal Plantations',
    certifications: ['Pure Ceylon Cinnamon', 'Alba Grade Super-Thin', 'Ultra-Low Coumarin (< 0.004%)', 'Direct Estate Sourced'],
    nutrition_facts: {
      serving_size: '5g',
      cinnamaldehyde: '65-75%',
      eugenol: '5-10%',
      coumarin: '< 0.004% (Non-toxic)'
    },
    images: [
      '/products/ceylon_spices.jpg',
      '/products/mango_slices.jpg'
    ],
    in_stock: 1,
    is_featured: 1
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_001',
    product_id: 'prod_mango_01',
    product_name: 'Ceylon Solar Dehydrated Mango Slices',
    customer_name: 'Oliver Wright',
    customer_company: 'London Organic Snacks Ltd',
    customer_country: 'United Kingdom',
    rating: 5,
    title: 'Superb chewiness & natural flavor - Our top selling dried fruit in London!',
    comment: 'We received our second 500kg FCL sample consignment at London Gateway. The low-temperature dehydration preserves the genuine tropical mango flavor without any sulfur aftertaste. The matte white packaging and Kraft window bags arrived in flawless shape. Truly world-class Ceylon quality!',
    verified_buyer: 1,
    status: 'approved',
    is_featured: 1,
    media_url: '/reviews/review_gleora_table.png',
    created_at: '2026-08-15T10:30:00Z'
  },
  {
    id: 'rev_002',
    product_id: 'prod_mango_01',
    product_name: 'Ceylon Solar Dehydrated Mango Slices',
    customer_name: 'Klaus Reinhardt',
    customer_company: 'Bavaria Bio-Handel GmbH',
    customer_country: 'Germany',
    rating: 5,
    title: 'Flawless 50g pouches. Zero added sugar and pristine lab moisture specs.',
    comment: 'The 50g retail pouches for Gleora Living are phenomenal. Our Munich lab verified moisture under 11.5% with zero added sucrose or chemicals. The hand-held pouch presentation is stunning for high-end European retail shelves.',
    verified_buyer: 1,
    status: 'approved',
    is_featured: 1,
    media_url: '/reviews/review_gleora_hand.jpg',
    created_at: '2026-08-22T14:15:00Z'
  },
  {
    id: 'rev_003',
    product_id: 'prod_banana_02',
    product_name: 'Ceylon Solar Dehydrated Ambul Banana Slices',
    customer_name: 'Sophia Chen',
    customer_company: 'Sydney Fine Foods',
    customer_country: 'Australia',
    rating: 5,
    title: 'The Ambul banana coins are deeply addictive and wholesome',
    comment: 'Australian consumers love the tangy sweet profile of Ceylon Ambul bananas. Arrived fresh with zero oxidation or moisture loss. Excellent export coordination from Colombo.',
    verified_buyer: 1,
    status: 'approved',
    is_featured: 1,
    media_url: '/products/banana_slices.jpg',
    created_at: '2026-08-28T09:00:00Z'
  }
];

export const INITIAL_COMPANY = {
  company_name: 'Accio Ceylon (Pvt) Ltd',
  tagline: 'Colombo’s Premier Dehydrated Tropical Fruits & Botanical Infusions Exporter',
  address: 'Port Road, Colombo 01, Sri Lanka',
  phone: '+94 11 258 4930',
  whatsapp: '+94 77 123 4567',
  email: 'export@accio-ceylon.com',
  vessel_notice: 'MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)',
  export_target_kg: 50000
};

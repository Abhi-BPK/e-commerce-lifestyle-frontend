// Mock product catalog for Men's Clothing.
// 6 products per subcategory = 36 products total.
//
// Each product has:
//   id          — unique string identifier
//   name        — display name
//   slug        — URL-friendly name (used if needed)
//   subcategory — matches MEN_SUBCATEGORIES[].slug
//   price       — current selling price (number)
//   originalPrice — strikethrough price (null if no discount)
//   rating      — 1–5 (one decimal)
//   reviewCount — number of reviews
//   badge       — short promo label (null for none): 'New', 'Sale', 'Hot', etc.
//   description — 2–3 sentence product blurb shown on the detail page
//   image       — Unsplash URL showing the actual garment/look
//   inStock     — boolean

// ── Party Wear ───────────────────────────────────────────────────────────────

const partyWear = [
  {
    id: 'pw-001',
    name: 'Midnight Sequin Blazer',
    slug: 'midnight-sequin-blazer',
    subcategory: 'party-wear',
    price: 3499,
    originalPrice: 4999,
    rating: 4.7,
    reviewCount: 312,
    badge: 'Sale',
    description:
      'Make a grand entrance with this midnight-black sequin blazer. Slim-fit cut with satin lapels, perfect for club nights and festive dinners. Pairs beautifully with black trousers or dark jeans.',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4ae1?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'pw-002',
    name: 'Indo-Western Nehru Jacket Set',
    slug: 'indo-western-nehru-jacket-set',
    subcategory: 'party-wear',
    price: 4199,
    originalPrice: 5500,
    rating: 4.8,
    reviewCount: 489,
    badge: 'Hot',
    description:
      'A stunning fusion of contemporary style and traditional Indian craftsmanship. Rich brocade Nehru jacket paired with slim churidar trousers. Ideal for cocktail parties, receptions, and festive occasions.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'pw-003',
    name: 'Velvet Tuxedo Suit',
    slug: 'velvet-tuxedo-suit',
    subcategory: 'party-wear',
    price: 8999,
    originalPrice: 12000,
    rating: 4.9,
    reviewCount: 201,
    badge: 'Premium',
    description:
      'Luxurious deep-burgundy velvet tuxedo that commands attention. Shawl lapel design with satin trim and matching trousers. The ultimate choice for gala dinners and black-tie events.',
    image:
      'https://images.unsplash.com/photo-1617127365659-c47fa9d30294?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'pw-004',
    name: 'Printed Satin Party Shirt',
    slug: 'printed-satin-party-shirt',
    subcategory: 'party-wear',
    price: 1799,
    originalPrice: 2499,
    rating: 4.4,
    reviewCount: 678,
    badge: 'Sale',
    description:
      'Smooth, lightweight satin shirt with an abstract floral print. Camp collar and relaxed fit make it the go-to shirt for rooftop parties and date nights. Available in sizes S–XXL.',
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'pw-005',
    name: 'Embroidered Bandhgala Suit',
    slug: 'embroidered-bandhgala-suit',
    subcategory: 'party-wear',
    price: 6499,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 134,
    badge: 'New',
    description:
      'Regal bandhgala suit with intricate thread embroidery on the collar and cuffs. Comes with matching straight trousers. Perfect for sangeet nights, cocktail parties, and wedding functions.',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'pw-006',
    name: 'Metallic Slim Chinos & Shirt Co-Ord',
    slug: 'metallic-slim-chinos-shirt-coord',
    subcategory: 'party-wear',
    price: 2999,
    originalPrice: 3799,
    rating: 4.3,
    reviewCount: 290,
    badge: null,
    description:
      'Head-turning co-ord set featuring a metallic gold shirt and matching slim-fit chinos. Effortlessly stylish for anniversary dinners, festival parties, and nightlife. Dry-clean recommended.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=700&fit=crop',
    inStock: false,
  },
]

// ── Ethnic Wear ──────────────────────────────────────────────────────────────

const ethnicWear = [
  {
    id: 'ew-001',
    name: 'Classic White Kurta Pajama',
    slug: 'classic-white-kurta-pajama',
    subcategory: 'ethnic-wear',
    price: 1299,
    originalPrice: 1799,
    rating: 4.6,
    reviewCount: 1023,
    badge: 'Sale',
    description:
      'Timeless white cotton kurta with subtle self-stripe texture. Breathable fabric keeps you comfortable during long pooja sessions or Eid celebrations. Comes with matching straight-cut pajama.',
    image:
      'https://images.unsplash.com/photo-1583391099995-d4adde10c1e4?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'ew-002',
    name: 'Royal Sherwani with Dupatta',
    slug: 'royal-sherwani-with-dupatta',
    subcategory: 'ethnic-wear',
    price: 9999,
    originalPrice: 14000,
    rating: 4.9,
    reviewCount: 342,
    badge: 'Hot',
    description:
      'Resplendent ivory sherwani with gold zari embroidery throughout the yoke and cuffs. Includes churidar pants and a matching brocade dupatta. The ideal groom\'s look for wedding ceremonies.',
    image:
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'ew-003',
    name: 'Linen Kurta with Patiala Salwar',
    slug: 'linen-kurta-patiala-salwar',
    subcategory: 'ethnic-wear',
    price: 1699,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 567,
    badge: 'New',
    description:
      'Breathable linen kurta in earthy terracotta with pintuck detailing on the placket. Paired with voluminous Patiala salwar — a smart, breezy choice for summer festivals and cultural events.',
    image:
      'https://images.unsplash.com/photo-1612902456551-b67dd9fd54fc?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'ew-004',
    name: 'Anarkali Kurta with Straight Pants',
    slug: 'anarkali-kurta-straight-pants',
    subcategory: 'ethnic-wear',
    price: 2299,
    originalPrice: 2999,
    rating: 4.4,
    reviewCount: 215,
    badge: null,
    description:
      'Floor-length anarkali-style kurta for men in rich teal with block-printed borders. Flared silhouette with quarter sleeves. Comes with off-white straight-cut trousers for a balanced contrast.',
    image:
      'https://images.unsplash.com/photo-1607827448299-a099b845f076?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'ew-005',
    name: 'Bandhani Print Kurta',
    slug: 'bandhani-print-kurta',
    subcategory: 'ethnic-wear',
    price: 999,
    originalPrice: 1499,
    rating: 4.3,
    reviewCount: 892,
    badge: 'Sale',
    description:
      'Vibrant Bandhani (tie-dye) print kurta in cotton cambric fabric. The bright polka-dot resist-dye pattern celebrates Rajasthani craft. A go-to pick for Navratri, Holi, and cultural programs.',
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'ew-006',
    name: 'Pathani Suit — Olive Green',
    slug: 'pathani-suit-olive-green',
    subcategory: 'ethnic-wear',
    price: 1849,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 441,
    badge: null,
    description:
      'Ruggedly handsome Pathani salwar kameez in olive-green cotton-linen blend. Mandarin collar, full sleeves, and deep side slits offer movement and comfort. Pair with mojris for a complete traditional look.',
    image:
      'https://images.unsplash.com/photo-1620912189866-c4cf63048e63?w=600&h=700&fit=crop',
    inStock: true,
  },
]

// ── Formal ───────────────────────────────────────────────────────────────────

const formal = [
  {
    id: 'fm-001',
    name: 'Egyptian Cotton Dress Shirt — White',
    slug: 'egyptian-cotton-dress-shirt-white',
    subcategory: 'formal',
    price: 1499,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 2134,
    badge: 'Sale',
    description:
      '100% Egyptian cotton with a 2-ply weave for exceptional breathability and a smooth drape. French placket, barrel cuffs, and a slim fit through the chest and waist. Wrinkle-resistant — perfect for long office days.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fm-002',
    name: 'Slim-Fit Wool Blend Trousers',
    slug: 'slim-fit-wool-blend-trousers',
    subcategory: 'formal',
    price: 2199,
    originalPrice: 2999,
    rating: 4.5,
    reviewCount: 987,
    badge: null,
    description:
      'Italian-inspired slim-fit trousers in a lightweight charcoal wool blend. Mid-rise waist, slash pockets, and a flat front give a polished, contemporary silhouette. Machine washable at 30°C.',
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fm-003',
    name: 'Oxford Striped Business Shirt',
    slug: 'oxford-striped-business-shirt',
    subcategory: 'formal',
    price: 1249,
    originalPrice: null,
    rating: 4.4,
    reviewCount: 1456,
    badge: 'New',
    description:
      'Classic alternating-stripe Oxford cloth shirt in navy and white. Button-down collar holds its shape without a tie pin. Relaxed fit gives room through the shoulders for comfortable, all-day wear.',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fm-004',
    name: 'Formal Tie & Pocket Square Set',
    slug: 'formal-tie-pocket-square-set',
    subcategory: 'formal',
    price: 799,
    originalPrice: 1199,
    rating: 4.6,
    reviewCount: 734,
    badge: 'Sale',
    description:
      'Elevate any formal look with this microfibre silk-blend tie in midnight blue paired with a matching white pocket square. Pre-tied option available. Ideal corporate gift for new joiners.',
    image:
      'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fm-005',
    name: 'Checked Formal Blazer',
    slug: 'checked-formal-blazer',
    subcategory: 'formal',
    price: 3999,
    originalPrice: 5499,
    rating: 4.8,
    reviewCount: 523,
    badge: 'Hot',
    description:
      'Heritage glen-plaid blazer in grey and navy. Structured shoulders, notch lapels, and a two-button single-breast closure. The perfect blazer to wear over a dress shirt for boardroom meetings.',
    image:
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fm-006',
    name: 'Formal Derby Shoes — Black',
    slug: 'formal-derby-shoes-black',
    subcategory: 'formal',
    price: 2799,
    originalPrice: 3499,
    rating: 4.5,
    reviewCount: 612,
    badge: null,
    description:
      'Genuine leather derby shoes with a cap toe and Goodyear welt construction. Cushioned insole for all-day comfort. Pairs flawlessly with trousers and formal suits for office or client meetings.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop',
    inStock: false,
  },
]

// ── Casual ───────────────────────────────────────────────────────────────────

const casual = [
  {
    id: 'cs-001',
    name: 'Classic Fit Crew-Neck Tee',
    slug: 'classic-fit-crew-neck-tee',
    subcategory: 'casual',
    price: 499,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 3412,
    badge: null,
    description:
      '180 GSM combed cotton jersey tee with a reinforced crew neck that keeps its shape wash after wash. Pre-shrunk and available in 12 colours. The everyday staple that works under flannels or solo.',
    image:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'cs-002',
    name: 'Slim Stretch Jeans — Indigo',
    slug: 'slim-stretch-jeans-indigo',
    subcategory: 'casual',
    price: 1799,
    originalPrice: 2299,
    rating: 4.5,
    reviewCount: 2876,
    badge: 'Sale',
    description:
      'Four-way stretch denim with 2% elastane for unrestricted movement. Slim leg, mid-rise, with classic five-pocket construction. Fade-resistant indigo wash that gets better with every wear.',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'cs-003',
    name: 'Oversized Flannel Shirt',
    slug: 'oversized-flannel-shirt',
    subcategory: 'casual',
    price: 1299,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 1234,
    badge: 'New',
    description:
      'Soft-brushed cotton flannel in a warm red plaid. Oversized silhouette is great as a layering shirt over tees or worn open like a jacket. Drop shoulders and chest pockets complete the look.',
    image:
      'https://images.unsplash.com/photo-1512138664757-360e0aad5132?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'cs-004',
    name: 'Cargo Shorts — Olive',
    slug: 'cargo-shorts-olive',
    subcategory: 'casual',
    price: 999,
    originalPrice: 1399,
    rating: 4.4,
    reviewCount: 1789,
    badge: null,
    description:
      'Relaxed-fit cargo shorts in durable olive ripstop cotton. Six pockets (including thigh cargo pockets) give you plenty of carry space. Elasticated waistband with a drawstring — ideal for weekends and travel.',
    image:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'cs-005',
    name: 'Zip-Up Hoodie — Charcoal',
    slug: 'zip-up-hoodie-charcoal',
    subcategory: 'casual',
    price: 1599,
    originalPrice: 1999,
    rating: 4.8,
    reviewCount: 2201,
    badge: 'Hot',
    description:
      '320 GSM fleece-lined hoodie with a full-length YKK zip and kangaroo pocket. Ribbed cuffs and hem lock in warmth. The go-to throw-on for morning gym sessions, college campuses, and chill evenings.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'cs-006',
    name: 'Linen Drawstring Trousers',
    slug: 'linen-drawstring-trousers',
    subcategory: 'casual',
    price: 1149,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 845,
    badge: null,
    description:
      'Airy 100% linen trousers with an elasticated drawstring waist and tapered ankle. The natural fibre breathes beautifully — perfect for hot days, beach trips, and relaxed café mornings.',
    image:
      'https://images.unsplash.com/photo-1506634572416-48cdfe9e6b6f?w=600&h=700&fit=crop',
    inStock: true,
  },
]

// ── Blazer & Suits ───────────────────────────────────────────────────────────

const blazerSuits = [
  {
    id: 'bs-001',
    name: 'Slim-Fit 2-Piece Navy Suit',
    slug: 'slim-fit-2-piece-navy-suit',
    subcategory: 'blazer-suits',
    price: 9999,
    originalPrice: 13500,
    rating: 4.9,
    reviewCount: 678,
    badge: 'Hot',
    description:
      'Impeccably tailored two-piece suit in super-120 navy wool. Slim fit with notch lapels, a single-breasted two-button closure, and a half canvas construction for natural drape. Includes matching flat-front trousers.',
    image:
      'https://images.unsplash.com/photo-1617127365659-c47fa9d30294?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'bs-002',
    name: 'Charcoal Windowpane Check Suit',
    slug: 'charcoal-windowpane-check-suit',
    subcategory: 'blazer-suits',
    price: 11499,
    originalPrice: 15000,
    rating: 4.8,
    reviewCount: 312,
    badge: 'Sale',
    description:
      'Sophisticated charcoal suit with a subtle white windowpane check pattern woven in Italian wool. Modern slim cut, double-vented jacket, and tapered trousers. A versatile power suit for executives and groomsmen alike.',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'bs-003',
    name: 'Smart Casual Unstructured Blazer',
    slug: 'smart-casual-unstructured-blazer',
    subcategory: 'blazer-suits',
    price: 4499,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 891,
    badge: 'New',
    description:
      'Lightweight unstructured blazer in a breathable cotton-linen blend. No shoulder padding means a relaxed, easy fit — dress it up with chinos or down with jeans. Available in off-white and khaki.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'bs-004',
    name: 'Double-Breasted Pinstripe Suit',
    slug: 'double-breasted-pinstripe-suit',
    subcategory: 'blazer-suits',
    price: 13999,
    originalPrice: 18000,
    rating: 4.9,
    reviewCount: 145,
    badge: 'Premium',
    description:
      'Bold double-breasted suit in classic chalk-stripe navy flannel. Peak lapels, six-button front (fastened on two), and ticket pocket add old-school elegance. For the man who dresses to impress.',
    image:
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'bs-005',
    name: 'Olive Green Stretch Blazer',
    slug: 'olive-green-stretch-blazer',
    subcategory: 'blazer-suits',
    price: 3799,
    originalPrice: 4999,
    rating: 4.5,
    reviewCount: 567,
    badge: null,
    description:
      'Versatile olive-green blazer cut from a wrinkle-resistant stretch wool blend. Four-way stretch fabric allows for full range of motion. Dress it over a turtleneck or wear solo over dark jeans for weekend events.',
    image:
      'https://images.unsplash.com/photo-1609957372782-aa0ab2f8eed8?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'bs-006',
    name: '3-Piece Wedding Suit — Ivory',
    slug: '3-piece-wedding-suit-ivory',
    subcategory: 'blazer-suits',
    price: 16999,
    originalPrice: 22000,
    rating: 4.9,
    reviewCount: 98,
    badge: 'Sale',
    description:
      'Complete ivory three-piece suit — jacket, waistcoat, and trousers — in premium Italian wool-silk blend. Slim lapels with a contrast ivory satin and mother-of-pearl buttons. The dream groom or cocktail suit.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=700&fit=crop',
    inStock: true,
  },
]

// ── Funky (Gen Z) ────────────────────────────────────────────────────────────

const funky = [
  {
    id: 'fk-001',
    name: 'Tie-Dye Oversized Tee',
    slug: 'tie-dye-oversized-tee',
    subcategory: 'funky',
    price: 699,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 2345,
    badge: 'Hot',
    description:
      'Hand-dyed spiral tie-dye tee in electric blue and lime green. 240 GSM heavyweight cotton with a boxy, oversized drop-shoulder cut. Each piece is uniquely dyed — no two are exactly alike. #OOTD guaranteed.',
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fk-002',
    name: 'Patchwork Cargo Pants',
    slug: 'patchwork-cargo-pants',
    subcategory: 'funky',
    price: 2199,
    originalPrice: 2999,
    rating: 4.5,
    reviewCount: 1123,
    badge: 'Sale',
    description:
      'Y2K-inspired cargo pants featuring a multi-panel patchwork of contrasting fabrics and colours. Low-rise waist, wide-leg silhouette, and six utility pockets. The street-style statement piece that breaks all the rules.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fk-003',
    name: 'Graffiti Print Bomber Jacket',
    slug: 'graffiti-print-bomber-jacket',
    subcategory: 'funky',
    price: 3499,
    originalPrice: 4499,
    rating: 4.8,
    reviewCount: 876,
    badge: 'New',
    description:
      'Nylon bomber jacket with an all-over urban graffiti print. Ribbed collar, cuffs, and hem with a clean-zip front. Lightweight and windproof — the perfect throw-on for festivals, skate parks, and late-night outings.',
    image:
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fk-004',
    name: 'Checkerboard Vans-Style Co-Ord',
    slug: 'checkerboard-coord-set',
    subcategory: 'funky',
    price: 2799,
    originalPrice: 3499,
    rating: 4.4,
    reviewCount: 654,
    badge: null,
    description:
      'Black-and-white checkerboard co-ord set: an oversized short-sleeve shirt and matching wide-leg shorts. 90s skater aesthetic meets modern streetwear. Wear the full set or mix individually for infinite looks.',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fk-005',
    name: 'Neon Mesh Layering Top',
    slug: 'neon-mesh-layering-top',
    subcategory: 'funky',
    price: 799,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 432,
    badge: null,
    description:
      'Semi-transparent neon-green mesh top designed for layering over coloured tees or bralettes. Dropped shoulders, relaxed crew neck, and ribbed hem. Bold, boundary-pushing festival-wear for the unapologetically loud.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=700&fit=crop',
    inStock: true,
  },
  {
    id: 'fk-006',
    name: 'Cartoon Print Relaxed Joggers',
    slug: 'cartoon-print-relaxed-joggers',
    subcategory: 'funky',
    price: 1399,
    originalPrice: 1799,
    rating: 4.7,
    reviewCount: 1543,
    badge: 'Hot',
    description:
      'Soft cotton-terry joggers covered in retro cartoon characters from the 90s. Elasticated waistband with drawstring, cuffed ankles, and deep side pockets. Cosy, fun, and wildly shareable on social media.',
    image:
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=700&fit=crop',
    inStock: true,
  },
]

// ── Combined export ──────────────────────────────────────────────────────────
export const menProducts = [
  ...partyWear,
  ...ethnicWear,
  ...formal,
  ...casual,
  ...blazerSuits,
  ...funky,
]

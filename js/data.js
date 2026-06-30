/* ==================================================
   TravelEase — data.js
   All static content: cities, modes, pricing, seed data
   ================================================== */

const MOODS = [
  { mood: 'Adventure', dest: 'Ladakh',   emoji: '🏔️', status: 'Boarding' },
  { mood: 'Chill',     dest: 'Goa',      emoji: '🏖️', status: 'On time' },
  { mood: 'Cold',      dest: 'Manali',   emoji: '❄️', status: 'On time' },
  { mood: 'Spiritual', dest: 'Varanasi', emoji: '🪔', status: 'Boarding' },
];

const POPULAR_TRIPS = [
  { from: 'Mumbai',    to: 'Goa',      bookings: 482, tag: 'Top pick',    emoji: '🌊' },
  { from: 'Delhi',     to: 'Manali',   bookings: 391, tag: 'Trending',    emoji: '🏔️' },
  { from: 'Bengaluru', to: 'Ladakh',   bookings: 266, tag: 'Bucket list', emoji: '⛰️' },
  { from: 'Delhi',     to: 'Varanasi', bookings: 233, tag: 'Heritage',    emoji: '🪔' },
];

const TESTIMONIALS = [
  { quote: 'Set a budget, picked "Chill," and TravelEase had the whole Goa trip costed out before I finished my chai.', who: 'Riya, Mumbai' },
  { quote: 'The budget split planner saved us from blowing everything on flights. We had buffer money left over!', who: 'Aman & Divya, Pune' },
  { quote: 'Booked, then plans changed. The refund preview meant no surprises when I had to cancel.', who: 'Karthik, Chennai' },
];

const MODES = {
  bus:    { label: 'Bus',    icon: '🚌', perKm: 1.3,  base: 150,  speedKmph: 45,  comfort: 1, perVehicle: false, desc: 'Most affordable' },
  train:  { label: 'Train',  icon: '🚆', perKm: 1.8,  base: 250,  speedKmph: 55,  comfort: 2, perVehicle: false, desc: 'Best balance' },
  flight: { label: 'Flight', icon: '✈️', perKm: 6.5,  base: 1800, speedKmph: 500, comfort: 3, perVehicle: false, desc: 'Fastest option' },
  cab:    { label: 'Cab',    icon: '🚕', perKm: 11,   base: 300,  speedKmph: 55,  comfort: 2, perVehicle: true,  desc: 'Door to door' },
};

const STAY_TIERS = {
  budget:   { label: 'Budget stay',  perNight: 1200, comfort: 1 },
  midrange: { label: 'Comfort stay', perNight: 2800, comfort: 2 },
  premium:  { label: 'Premium stay', perNight: 6000, comfort: 3 },
};

const FOOD_PER_DAY_PER_PERSON = 500;

const KNOWN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Manali', 'Ladakh', 'Leh',
  'Varanasi', 'Rishikesh', 'Amritsar', 'Shimla', 'Udaipur', 'Kochi',
  'Agra', 'Mysuru', 'Coimbatore', 'Surat', 'Nagpur', 'Indore', 'Bhopal',
  'Lucknow', 'Patna', 'Ranchi', 'Bhubaneswar', 'Guwahati', 'Chandigarh',
];

const CITY_ALIASES = { ladakh: 'leh', bengaluru: 'bangalore', mysore: 'mysuru' };

const DISTANCES = [
  ['mumbai','delhi',1400], ['mumbai','goa',590], ['mumbai','manali',1850],
  ['mumbai','varanasi',1490], ['mumbai','leh',2100], ['mumbai','bangalore',980],
  ['mumbai','jaipur',1170], ['mumbai','pune',150], ['mumbai','udaipur',760],
  ['mumbai','amritsar',1850], ['mumbai','kolkata',1960], ['mumbai','chennai',1330],
  ['mumbai','hyderabad',710], ['mumbai','ahmedabad',525], ['mumbai','kochi',1380],
  ['mumbai','rishikesh',1580], ['mumbai','shimla',1900],
  ['delhi','goa',1880], ['delhi','manali',540], ['delhi','varanasi',815],
  ['delhi','leh',1010], ['delhi','bangalore',2150], ['delhi','jaipur',280],
  ['delhi','udaipur',660], ['delhi','amritsar',450], ['delhi','kolkata',1500],
  ['delhi','chennai',2200], ['delhi','hyderabad',1580], ['delhi','ahmedabad',950],
  ['delhi','kochi',2650], ['delhi','rishikesh',240], ['delhi','shimla',350],
  ['delhi','pune',1450],
  ['goa','bangalore',560], ['goa','chennai',920], ['goa','kochi',600],
  ['goa','hyderabad',600], ['goa','pune',450],
  ['bangalore','chennai',350], ['bangalore','kochi',460], ['bangalore','hyderabad',570],
  ['bangalore','varanasi',1880], ['bangalore','manali',2450], ['bangalore','leh',2900],
  ['chennai','kochi',690], ['chennai','varanasi',1670], ['chennai','kolkata',1670],
  ['kolkata','varanasi',680], ['kolkata','manali',1850], ['kolkata','leh',2400],
  ['varanasi','rishikesh',660], ['varanasi','amritsar',1250],
  ['manali','amritsar',320], ['manali','rishikesh',480], ['manali','shimla',250],
  ['manali','leh',480],
  ['rishikesh','shimla',220], ['amritsar','shimla',280],
  ['pune','bangalore',840], ['pune','hyderabad',560], ['pune','jaipur',1180],
  ['pune','udaipur',660], ['pune','ahmedabad',660],
  ['jaipur','udaipur',395], ['jaipur','amritsar',600], ['jaipur','rishikesh',460],
  ['ahmedabad','udaipur',260], ['ahmedabad','goa',600],
  ['hyderabad','chennai',630], ['hyderabad','kolkata',1500], ['hyderabad','varanasi',1370],
];
/* --------------------------------------------------
   HOTELS — per-city listings, one entry per tier per city
   amenities: short icon+label pairs shown on the card
   -------------------------------------------------- */
const HOTELS = {
  Goa: [
    {
      id: 'GOA-B1', city: 'Goa', tier: 'budget', name: 'Panjim Backpackers Inn',
      stars: 2, pricePerNight: 1100, rating: 3.9, reviews: 412,
      img: '🏡', neighborhood: 'Panjim',
      amenities: ['🛏️ Dorm beds', '📶 Free Wi-Fi', '🧊 AC', '🚿 Hot water'],
      desc: 'No-frills stay steps from the old Latin Quarter. Great for solo travellers.',
      highlight: 'Best location for nightlife access',
    },
    {
      id: 'GOA-M1', city: 'Goa', tier: 'midrange', name: 'Calangute Beach Resort',
      stars: 3, pricePerNight: 2600, rating: 4.2, reviews: 886,
      img: '🏨', neighborhood: 'Calangute',
      amenities: ['🏊 Pool', '📶 Free Wi-Fi', '🧊 AC', '🍳 Breakfast', '🅿️ Parking'],
      desc: 'Popular resort a 5-minute walk from Calangute beach with an outdoor pool.',
      highlight: 'Pool + beach combo',
    },
    {
      id: 'GOA-P1', city: 'Goa', tier: 'premium', name: 'Taj Exotica Resort & Spa',
      stars: 5, pricePerNight: 7200, rating: 4.8, reviews: 1240,
      img: '🏩', neighborhood: 'Benaulim',
      amenities: ['🏊 Infinity pool', '💆 Spa', '🍽️ Fine dining', '🏖️ Private beach', '🛎️ Butler'],
      desc: 'Iconic 5-star on a quiet stretch of South Goa beach with world-class spa.',
      highlight: 'Travellers\' top rated in Goa',
    },
  ],
  Manali: [
    {
      id: 'MNL-B1', city: 'Manali', tier: 'budget', name: 'Vashisht Village Hostel',
      stars: 2, pricePerNight: 900, rating: 4.1, reviews: 319,
      img: '🏡', neighborhood: 'Vashisht',
      amenities: ['🛏️ Bunk beds', '📶 Wi-Fi', '☕ Common kitchen', '🔥 Bonfire area'],
      desc: 'Cosy hostel near Vashisht hot springs with a fantastic mountain view terrace.',
      highlight: 'Mountain views from rooftop',
    },
    {
      id: 'MNL-M1', city: 'Manali', tier: 'midrange', name: 'Snow Valley Resorts',
      stars: 3, pricePerNight: 2800, rating: 4.3, reviews: 674,
      img: '🏨', neighborhood: 'Mall Road',
      amenities: ['🔥 Fireplace', '📶 Wi-Fi', '🍳 Breakfast', '🎿 Ski storage', '🅿️ Parking'],
      desc: 'Timber-and-stone resort with valley views, cosy rooms with in-room fireplaces.',
      highlight: 'Fireplace rooms — perfect for winter',
    },
    {
      id: 'MNL-P1', city: 'Manali', tier: 'premium', name: 'Solang Valley Resort',
      stars: 5, pricePerNight: 6500, rating: 4.7, reviews: 521,
      img: '🏩', neighborhood: 'Solang Valley',
      amenities: ['🏊 Heated pool', '💆 Spa', '🍽️ Restaurant', '🎿 Ski access', '🛎️ Concierge'],
      desc: 'Luxury mountain retreat at the base of Solang Valley ski slopes.',
      highlight: 'Slope-side luxury',
    },
  ],
  Ladakh: [
    {
      id: 'LEH-B1', city: 'Ladakh', tier: 'budget', name: 'Leh Old Town Guesthouse',
      stars: 2, pricePerNight: 850, rating: 3.8, reviews: 228,
      img: '🏡', neighborhood: 'Old Leh',
      amenities: ['🛏️ Private room', '📶 Wi-Fi', '🍵 Butter tea', '🚿 Shared bath'],
      desc: 'Family-run guesthouse in the old town with rooftop views of Leh Palace.',
      highlight: 'Authentic local family experience',
    },
    {
      id: 'LEH-M1', city: 'Ladakh', tier: 'midrange', name: 'Hotel Ladakh Palace',
      stars: 3, pricePerNight: 3000, rating: 4.4, reviews: 493,
      img: '🏨', neighborhood: 'Leh City',
      amenities: ['📶 Wi-Fi', '🍳 Breakfast', '🌄 Mountain views', '☀️ Sun terrace', '🅿️ Parking'],
      desc: 'Well-appointed hotel with panoramic Himalayan views and a popular restaurant.',
      highlight: 'Best Himalayan panoramas',
    },
    {
      id: 'LEH-P1', city: 'Ladakh', tier: 'premium', name: 'The Grand Dragon Ladakh',
      stars: 5, pricePerNight: 7800, rating: 4.9, reviews: 387,
      img: '🏩', neighborhood: 'Leh Upper',
      amenities: ['🏊 Heated pool', '💆 Spa', '🍽️ Fine dining', '🌌 Stargazing deck', '🛎️ Butler'],
      desc: 'The highest-rated luxury hotel in Ladakh with stargazing terrace and Karakoram views.',
      highlight: 'Only 5-star with rooftop stargazing',
    },
  ],
  Varanasi: [
    {
      id: 'VNS-B1', city: 'Varanasi', tier: 'budget', name: 'Ganges View Hostel',
      stars: 2, pricePerNight: 750, rating: 4.0, reviews: 361,
      img: '🏡', neighborhood: 'Assi Ghat',
      amenities: ['🛏️ Dorm beds', '📶 Wi-Fi', '🌅 Ghat views', '☕ Chai bar'],
      desc: 'Budget gem right on Assi Ghat. Watch the morning aarti from your dorm.',
      highlight: 'Direct Ghat access',
    },
    {
      id: 'VNS-M1', city: 'Varanasi', tier: 'midrange', name: 'BrijRama Palace Hotel',
      stars: 4, pricePerNight: 2500, rating: 4.5, reviews: 712,
      img: '🏨', neighborhood: 'Darbhanga Ghat',
      amenities: ['🌊 Ganga view', '📶 Wi-Fi', '🍳 Breakfast', '🛶 Boat rides', '🏛️ Heritage building'],
      desc: '200-year-old heritage palace turned boutique hotel directly on the Ganges.',
      highlight: 'Heritage stay on the Ganges',
    },
    {
      id: 'VNS-P1', city: 'Varanasi', tier: 'premium', name: 'Taj Ganges',
      stars: 5, pricePerNight: 6800, rating: 4.7, reviews: 930,
      img: '🏩', neighborhood: 'Nadesar',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🌳 Heritage gardens', '🛎️ Butler'],
      desc: 'Taj\'s iconic Varanasi property set in heritage gardens, the finest address in the city.',
      highlight: 'Taj heritage gardens',
    },
  ],
  Mumbai: [
    {
      id: 'BOM-B1', city: 'Mumbai', tier: 'budget', name: 'Backpacker Panda Colaba',
      stars: 2, pricePerNight: 1200, rating: 4.1, reviews: 588,
      img: '🏡', neighborhood: 'Colaba',
      amenities: ['🛏️ Capsule pods', '📶 Wi-Fi', '🧊 AC', '🍳 Breakfast available'],
      desc: 'Modern capsule hostel in the heart of Colaba, steps from Gateway of India.',
      highlight: 'Gateway of India walkable',
    },
    {
      id: 'BOM-M1', city: 'Mumbai', tier: 'midrange', name: 'Residency Hotel Fort',
      stars: 3, pricePerNight: 2700, rating: 4.2, reviews: 1100,
      img: '🏨', neighborhood: 'Fort',
      amenities: ['📶 Wi-Fi', '🧊 AC', '🍳 Restaurant', '🏙️ City views', '🅿️ Parking'],
      desc: 'Reliable mid-range in Mumbai\'s business and heritage district, well-connected.',
      highlight: 'Central business district',
    },
    {
      id: 'BOM-P1', city: 'Mumbai', tier: 'premium', name: 'The Taj Mahal Palace',
      stars: 5, pricePerNight: 18000, rating: 4.9, reviews: 3200,
      img: '🏩', neighborhood: 'Colaba',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🌊 Sea views', '🛎️ Butler', '🏛️ Iconic heritage'],
      desc: 'India\'s most iconic hotel, overlooking the Gateway of India since 1903.',
      highlight: 'India\'s most iconic hotel',
    },
  ],
  Delhi: [
    {
      id: 'DEL-B1', city: 'Delhi', tier: 'budget', name: 'Zostel Delhi',
      stars: 2, pricePerNight: 950, rating: 4.2, reviews: 720,
      img: '🏡', neighborhood: 'Paharganj',
      amenities: ['🛏️ Dorm & private', '📶 Wi-Fi', '🧊 AC', '☕ Common lounge', '🗺️ Tours desk'],
      desc: 'India\'s most popular hostel chain. Great social scene, clean rooms, central location.',
      highlight: 'Best social hostel in Delhi',
    },
    {
      id: 'DEL-M1', city: 'Delhi', tier: 'midrange', name: 'Hotel Broadway',
      stars: 3, pricePerNight: 2900, rating: 4.3, reviews: 840,
      img: '🏨', neighborhood: 'Daryaganj',
      amenities: ['📶 Wi-Fi', '🍳 Restaurant', '🧊 AC', '🏛️ Heritage feel', '🅿️ Parking'],
      desc: 'Old Delhi classic with a heritage feel, home to the legendary Chor Bizarre restaurant.',
      highlight: 'Heritage hotel with Chor Bizarre',
    },
    {
      id: 'DEL-P1', city: 'Delhi', tier: 'premium', name: 'The Imperial New Delhi',
      stars: 5, pricePerNight: 15000, rating: 4.8, reviews: 2100,
      img: '🏩', neighborhood: 'Janpath',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🌳 Gardens', '🛎️ Butler', '🎨 Art gallery'],
      desc: '1930s heritage grand dame on Janpath — art deco architecture and impeccable service.',
      highlight: 'Art Deco heritage grand hotel',
    },
  ],
  Jaipur: [
    {
      id: 'JAI-B1', city: 'Jaipur', tier: 'budget', name: 'Moustache Jaipur',
      stars: 2, pricePerNight: 900, rating: 4.3, reviews: 504,
      img: '🏡', neighborhood: 'C-Scheme',
      amenities: ['🛏️ Dorm & private', '📶 Wi-Fi', '🧊 AC', '🍳 Breakfast', '🏊 Pool access'],
      desc: 'Award-winning hostel with a rooftop pool and vibrant traveller community.',
      highlight: 'Rooftop pool hostel',
    },
    {
      id: 'JAI-M1', city: 'Jaipur', tier: 'midrange', name: 'Pearl Palace Heritage',
      stars: 3, pricePerNight: 2600, rating: 4.6, reviews: 1380,
      img: '🏨', neighborhood: 'Hathroi',
      amenities: ['🍳 Breakfast', '📶 Wi-Fi', '🎨 Heritage decor', '🛺 Tuk-tuk service', '🏛️ Rooftop'],
      desc: 'Consistently top-rated mid-range in Jaipur — hand-painted rooms, rooftop restaurant.',
      highlight: 'TripAdvisor #1 mid-range for years',
    },
    {
      id: 'JAI-P1', city: 'Jaipur', tier: 'premium', name: 'Rambagh Palace',
      stars: 5, pricePerNight: 25000, rating: 4.9, reviews: 1800,
      img: '🏩', neighborhood: 'Bhawani Singh Road',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🐴 Horse polo', '🛎️ Butler', '👑 Royal suites'],
      desc: 'The former palace of the Maharaja of Jaipur — perhaps India\'s most spectacular hotel.',
      highlight: 'Stay in a Maharaja\'s palace',
    },
  ],
  Udaipur: [
    {
      id: 'UDR-B1', city: 'Udaipur', tier: 'budget', name: 'Bunkyard Hostel',
      stars: 2, pricePerNight: 800, rating: 4.2, reviews: 290,
      img: '🏡', neighborhood: 'Old City',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🏙️ Lake views', '☕ Rooftop café'],
      desc: 'Charming hostel in the old city with rooftop views of Lake Pichola.',
      highlight: 'Lake Pichola views',
    },
    {
      id: 'UDR-M1', city: 'Udaipur', tier: 'midrange', name: 'Jheel Guest House',
      stars: 3, pricePerNight: 2400, rating: 4.5, reviews: 620,
      img: '🏨', neighborhood: 'Gangaur Ghat',
      amenities: ['🌊 Lake views', '📶 Wi-Fi', '🍳 Breakfast', '🛶 Boat rides', '🏛️ Heritage building'],
      desc: 'Whitewashed heritage haveli on Gangaur Ghat with unobstructed lake views.',
      highlight: 'Best lake-view haveli',
    },
    {
      id: 'UDR-P1', city: 'Udaipur', tier: 'premium', name: 'Taj Lake Palace',
      stars: 5, pricePerNight: 22000, rating: 4.9, reviews: 2400,
      img: '🏩', neighborhood: 'Lake Pichola (Island)',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '⛵ Boat access only', '🛎️ Butler', '🌊 360° lake views'],
      desc: 'A 250-year-old marble palace floating on Lake Pichola — one of the world\'s great hotels.',
      highlight: 'Floating palace — one of a kind',
    },
  ],
  Rishikesh: [
    {
      id: 'RSH-B1', city: 'Rishikesh', tier: 'budget', name: 'Beatles Ashram Camp',
      stars: 2, pricePerNight: 700, rating: 4.0, reviews: 215,
      img: '🏕️', neighborhood: 'Tapovan',
      amenities: ['🛏️ Tent & dorm', '📶 Wi-Fi', '🌊 Ganga views', '🧘 Yoga classes', '🔥 Bonfire'],
      desc: 'Riverside camp near the famous Beatles Ashram, popular with yoga-goers.',
      highlight: 'Yoga & Ganga in one',
    },
    {
      id: 'RSH-M1', city: 'Rishikesh', tier: 'midrange', name: 'Atali Ganga Resort',
      stars: 3, pricePerNight: 2800, rating: 4.5, reviews: 480,
      img: '🏨', neighborhood: 'Byasi',
      amenities: ['🌊 Riverside', '📶 Wi-Fi', '🍳 Meals included', '🚣 Rafting access', '🧘 Yoga deck'],
      desc: 'Stunning riverside resort with adventure activities and white-water rafting access.',
      highlight: 'Rafting from your doorstep',
    },
    {
      id: 'RSH-P1', city: 'Rishikesh', tier: 'premium', name: 'Ananda in the Himalayas',
      stars: 5, pricePerNight: 28000, rating: 4.9, reviews: 890,
      img: '🏩', neighborhood: 'Narendra Nagar',
      amenities: ['🏊 Pool', '💆 World-class spa', '🍽️ Ayurvedic cuisine', '🌄 Himalayan views', '🧘 Master classes'],
      desc: 'India\'s most celebrated wellness retreat, set in a Viceregal Palace with Himalayan vistas.',
      highlight: 'India\'s #1 wellness resort',
    },
  ],
  Kochi: [
    {
      id: 'COK-B1', city: 'Kochi', tier: 'budget', name: 'Zostel Kochi',
      stars: 2, pricePerNight: 1000, rating: 4.1, reviews: 390,
      img: '🏡', neighborhood: 'Fort Kochi',
      amenities: ['🛏️ Dorm & private', '📶 Wi-Fi', '🧊 AC', '🎨 Art gallery vibes'],
      desc: 'Trendy hostel in Fort Kochi\'s art district, walking distance to Chinese fishing nets.',
      highlight: 'Art district location',
    },
    {
      id: 'COK-M1', city: 'Kochi', tier: 'midrange', name: 'Brunton Boatyard Hotel',
      stars: 4, pricePerNight: 3200, rating: 4.6, reviews: 760,
      img: '🏨', neighborhood: 'Fort Kochi',
      amenities: ['🌊 Harbour views', '📶 Wi-Fi', '🍳 Breakfast', '⛵ Heritage building', '🏊 Pool'],
      desc: 'Atmospheric heritage hotel in a 19th-century boatyard with stunning harbour views.',
      highlight: 'Historic boatyard on the harbour',
    },
    {
      id: 'COK-P1', city: 'Kochi', tier: 'premium', name: 'Taj Malabar Resort & Spa',
      stars: 5, pricePerNight: 8500, rating: 4.8, reviews: 1100,
      img: '🏩', neighborhood: 'Willingdon Island',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Seafood restaurant', '🌊 Backwater views', '🛎️ Butler'],
      desc: 'Iconic Taj property on Willingdon Island, famous for seafood and backwater panoramas.',
      highlight: 'Iconic backwater views',
    },
  ],
  Amritsar: [
    {
      id: 'ATQ-B1', city: 'Amritsar', tier: 'budget', name: 'Golden Temple Hostel',
      stars: 2, pricePerNight: 700, rating: 4.3, reviews: 310,
      img: '🏡', neighborhood: 'Golden Temple Area',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🏛️ Temple walkable', '☕ Chai lounge'],
      desc: 'Budget stay minutes from the Golden Temple. Best value in the city.',
      highlight: '5-minute walk to Golden Temple',
    },
    {
      id: 'ATQ-M1', city: 'Amritsar', tier: 'midrange', name: 'Hotel Ritz Plaza',
      stars: 3, pricePerNight: 2200, rating: 4.2, reviews: 540,
      img: '🏨', neighborhood: 'Mall Road',
      amenities: ['📶 Wi-Fi', '🍳 Breakfast', '🧊 AC', '🏛️ Central location', '🅿️ Parking'],
      desc: 'Comfortable hotel on Mall Road — central location for Golden Temple and Wagah Border.',
      highlight: 'Wagah Border tour pickup available',
    },
    {
      id: 'ATQ-P1', city: 'Amritsar', tier: 'premium', name: 'Taj Swarna Amritsar',
      stars: 5, pricePerNight: 7500, rating: 4.8, reviews: 680,
      img: '🏩', neighborhood: 'City Centre',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🛎️ Butler', '🎭 Cultural experiences'],
      desc: 'Taj\'s flagship Amritsar property — blends Punjabi heritage with modern luxury.',
      highlight: 'Taj\'s Punjabi heritage experience',
    },
  ],
  Shimla: [
    {
      id: 'SML-B1', city: 'Shimla', tier: 'budget', name: 'Zostel Shimla',
      stars: 2, pricePerNight: 850, rating: 4.1, reviews: 280,
      img: '🏡', neighborhood: 'Mall Road',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🏔️ Valley views', '☕ Common lounge'],
      desc: 'Social hostel near The Ridge with valley views and a lively common area.',
      highlight: 'Mall Road & Ridge walkable',
    },
    {
      id: 'SML-M1', city: 'Shimla', tier: 'midrange', name: 'Hotel Combermere',
      stars: 3, pricePerNight: 2500, rating: 4.3, reviews: 490,
      img: '🏨', neighborhood: 'The Mall',
      amenities: ['📶 Wi-Fi', '🍳 Breakfast', '🏔️ Mountain views', '🏛️ Colonial heritage', '🅿️ Parking'],
      desc: 'Colonial-era hotel on The Mall with original heritage architecture and mountain vistas.',
      highlight: 'Original colonial heritage',
    },
    {
      id: 'SML-P1', city: 'Shimla', tier: 'premium', name: 'Wildflower Hall',
      stars: 5, pricePerNight: 22000, rating: 4.9, reviews: 750,
      img: '🏩', neighborhood: 'Chharabra',
      amenities: ['🏊 Heated pool', '💆 Spa', '🍽️ Fine dining', '🌲 Cedar forest', '🛎️ Butler'],
      desc: 'Former residence of Lord Kitchener, set in ancient cedar forests above Shimla.',
      highlight: 'Lord Kitchener\'s former estate',
    },
  ],
  Bengaluru: [
    {
      id: 'BLR-B1', city: 'Bengaluru', tier: 'budget', name: 'Zostel Bengaluru',
      stars: 2, pricePerNight: 1100, rating: 4.0, reviews: 620,
      img: '🏡', neighborhood: 'Indiranagar',
      amenities: ['🛏️ Dorm & private', '📶 Wi-Fi', '🧊 AC', '🍺 Pub nearby', '🗺️ Tours desk'],
      desc: 'Well-run hostel in Indiranagar, Bangalore\'s trendiest neighbourhood.',
      highlight: 'Indiranagar nightlife & food hub',
    },
    {
      id: 'BLR-M1', city: 'Bengaluru', tier: 'midrange', name: 'Lemon Tree Hotel Whitefield',
      stars: 4, pricePerNight: 3000, rating: 4.4, reviews: 900,
      img: '🏨', neighborhood: 'Whitefield',
      amenities: ['🏊 Pool', '📶 Wi-Fi', '🍳 Breakfast', '🏋️ Gym', '🅿️ Parking'],
      desc: 'Popular business hotel in Whitefield with good amenities and reliable service.',
      highlight: 'Best value for IT corridor visits',
    },
    {
      id: 'BLR-P1', city: 'Bengaluru', tier: 'premium', name: 'The Leela Palace Bengaluru',
      stars: 5, pricePerNight: 12000, rating: 4.9, reviews: 1600,
      img: '🏩', neighborhood: 'Old Airport Road',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🌳 Gardens', '🛎️ Butler', '🎰 Casino'],
      desc: 'Bangalore\'s grandest luxury address with palatial architecture and lush gardens.',
      highlight: 'Bangalore\'s palatial grand dame',
    },
  ],
  Chennai: [
    {
      id: 'MAA-B1', city: 'Chennai', tier: 'budget', name: 'Hidesign Hostel Mylapore',
      stars: 2, pricePerNight: 1000, rating: 4.0, reviews: 270,
      img: '🏡', neighborhood: 'Mylapore',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🏛️ Temple access', '☕ Rooftop lounge'],
      desc: 'Artsy hostel in the cultural heart of Chennai, walking distance from Kapaleeshwarar Temple.',
      highlight: 'Cultural Mylapore neighbourhood',
    },
    {
      id: 'MAA-M1', city: 'Chennai', tier: 'midrange', name: 'Radisson Blu Chennai City Centre',
      stars: 4, pricePerNight: 3500, rating: 4.4, reviews: 1100,
      img: '🏨', neighborhood: 'Thousand Lights',
      amenities: ['🏊 Pool', '📶 Wi-Fi', '🍳 Breakfast', '🏋️ Gym', '🍽️ Multi-cuisine restaurant'],
      desc: 'Well-appointed city hotel in a central location with a rooftop pool.',
      highlight: 'Rooftop pool in the city centre',
    },
    {
      id: 'MAA-P1', city: 'Chennai', tier: 'premium', name: 'ITC Grand Chola',
      stars: 5, pricePerNight: 11000, rating: 4.8, reviews: 1800,
      img: '🏩', neighborhood: 'Guindy',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🎭 Cultural shows', '🛎️ Butler'],
      desc: 'A celebration of Chola dynasty architecture — Chennai\'s most distinctive luxury hotel.',
      highlight: 'Chola heritage architecture landmark',
    },
  ],
  Hyderabad: [
    {
      id: 'HYD-B1', city: 'Hyderabad', tier: 'budget', name: 'Backpackers Ritz',
      stars: 2, pricePerNight: 900, rating: 3.9, reviews: 310,
      img: '🏡', neighborhood: 'Abids',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🧊 AC', '🍖 Biryani nearby', '🗺️ Charminar tours'],
      desc: 'Budget base near Charminar and the old city — perfect for food and heritage exploration.',
      highlight: 'Charminar & biryani belt access',
    },
    {
      id: 'HYD-M1', city: 'Hyderabad', tier: 'midrange', name: 'Taj Deccan',
      stars: 4, pricePerNight: 3200, rating: 4.5, reviews: 980,
      img: '🏨', neighborhood: 'Banjara Hills',
      amenities: ['🏊 Pool', '📶 Wi-Fi', '🍳 Breakfast', '🍽️ Dum Pukht dining', '🏋️ Gym'],
      desc: 'Reliable Taj property in upscale Banjara Hills with the legendary Dum Pukht restaurant.',
      highlight: 'Home of legendary Dum Pukht biryani',
    },
    {
      id: 'HYD-P1', city: 'Hyderabad', tier: 'premium', name: 'Taj Falaknuma Palace',
      stars: 5, pricePerNight: 20000, rating: 4.9, reviews: 1400,
      img: '🏩', neighborhood: 'Falaknuma',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Palace dining', '🐴 Horse carriage', '🛎️ Butler', '👑 Nizam suites'],
      desc: 'The Nizam of Hyderabad\'s private palace, now India\'s most theatrical hotel experience.',
      highlight: 'The Nizam\'s own palace — unforgettable',
    },
  ],
  Kolkata: [
    {
      id: 'CCU-B1', city: 'Kolkata', tier: 'budget', name: 'Zostel Kolkata',
      stars: 2, pricePerNight: 900, rating: 4.1, reviews: 420,
      img: '🏡', neighborhood: 'Sudder Street',
      amenities: ['🛏️ Dorms', '📶 Wi-Fi', '🏛️ Heritage area', '☕ Common area'],
      desc: 'On the famous Sudder Street backpacker strip, perfectly placed for colonial Kolkata.',
      highlight: 'Sudder Street backpacker hub',
    },
    {
      id: 'CCU-M1', city: 'Kolkata', tier: 'midrange', name: 'Peerless Inn',
      stars: 4, pricePerNight: 2800, rating: 4.3, reviews: 760,
      img: '🏨', neighborhood: 'Chowringhee',
      amenities: ['📶 Wi-Fi', '🍳 Restaurant', '🏋️ Gym', '🏙️ City views', '🅿️ Parking'],
      desc: 'Solid city hotel on Chowringhee Road, central to Victoria Memorial and Park Street.',
      highlight: 'Best access to Park Street & Maidan',
    },
    {
      id: 'CCU-P1', city: 'Kolkata', tier: 'premium', name: 'The Oberoi Grand',
      stars: 5, pricePerNight: 10000, rating: 4.8, reviews: 1500,
      img: '🏩', neighborhood: 'Chowringhee',
      amenities: ['🏊 Pool', '💆 Spa', '🍽️ Fine dining', '🌳 Colonial gardens', '🛎️ Butler'],
      desc: 'The grande dame of Kolkata since 1936 — white colonial façade, impeccable service.',
      highlight: 'Kolkata\'s original grand hotel since 1936',
    },
  ],
};

/* Helper: get hotels for a city (case-insensitive, falls back to empty) */
function getHotelsForCity(cityRaw) {
  if (!cityRaw) return [];
  const key = Object.keys(HOTELS).find(k => k.toLowerCase() === cityRaw.trim().toLowerCase());
  return key ? HOTELS[key] : [];
}

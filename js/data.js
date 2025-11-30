// Mock data for TuniGuide

const PLACES = [
  {
    id: 1,
    name: 'Sidi Bou Said',
    city: 'Tunis',
    description: 'Blue-and-white cliff-top village with stunning sea views.',
    activities: ['Photography', 'Cafe hopping', 'Art galleries'],
    transport: 'Metro TGM from Tunis; taxis available',
    hotelPrice: 85,
    rating: 4.7,
    images: ['assets/images/sidi1.jpg','assets/images/sidi2.jpg','assets/images/sidi3.jpg'],
    coords: { x: 36.869324, y: 10.342024 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 5 - (i%3)*0.5, text: 'Beautiful views and cozy cafes!' }))
  },
  {
    id: 2,
    name: 'Medina of Tunis',
    city: 'Tunis',
    description: 'UNESCO-listed old city with souks and historic mosques.',
    activities: ['Souk shopping', 'Culture', 'Architecture'],
    transport: 'Walk or taxi within central Tunis',
    hotelPrice: 60,
    rating: 4.5,
    images: ['assets/images/medina1.jpg','assets/images/medina2.jpg','assets/images/medina3.jpg'],
    coords: { x: 36.799355, y: 10.168853 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4 - (i%2)*0.5, text: 'Authentic atmosphere with friendly locals.' }))
  },
  {
    id: 3,
    name: 'Carthage Ruins',
    city: 'Carthage',
    description: 'Ancient ruins including amphitheatre and Antonine baths.',
    activities: ['History', 'Museums', 'Walking'],
    transport: 'TGM from Tunis; short walk from stations',
    hotelPrice: 100,
    rating: 4.6,
    images: ['assets/images/carthage1.jpg','assets/images/carthage2.jpg','assets/images/carthage3.jpg'],
    coords: { x: 36.852056, y: 10.330084 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.5 - (i%2)*0.5, text: 'A must-see for history lovers.' }))
  },
  {
    id: 4,
    name: 'Bizerte Marina',
    city: 'Bizerte',
    description: 'Charming harbor with seafood restaurants and boats.',
    activities: ['Seafood', 'Boating', 'Sunset walks'],
    transport: 'Bus from Tunis; taxis locally',
    hotelPrice: 75,
    rating: 4.3,
    images: ['assets/images/bizerte1.jpg','assets/images/bizerte2.jpg','assets/images/bizerte3.jpg'],
    coords: { x: 37.279529, y: 9.879289 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4 - (i%2)*0.5, text: 'Fresh seafood and relaxing vibe.' }))
  },
  {
    id: 5,
    name: 'Hammamet Beach',
    city: 'Hammamet',
    description: 'Golden sands with turquoise waters and resorts.',
    activities: ['Swimming', 'Beach sports', 'Resort stay'],
    transport: 'Train from Tunis; taxis to resorts',
    hotelPrice: 120,
    rating: 4.4,
    images: ['assets/images/hammamet1.jpg','assets/images/hammamet2.jpg','assets/images/hammamet3.jpg'],
    coords: { x: 36.398717, y: 10.627051 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.2 - (i%2)*0.5, text: 'Clean beach and friendly staff.' }))
  },
  {
    id: 6,
    name: 'Kairouan Mosque',
    city: 'Kairouan',
    description: 'Great Mosque with historic architecture and courtyards.',
    activities: ['Culture', 'Architecture', 'Photography'],
    transport: 'Buses from major cities; taxis locally',
    hotelPrice: 65,
    rating: 4.5,
    images: ['assets/images/kairouan1.jpg','assets/images/kairouan2.jpg','assets/images/kairouan3.jpg'],
    coords: { x: 35.681688, y: 10.103863 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.6 - (i%2)*0.5, text: 'Stunning architecture and peaceful.' }))
  },
  {
    id: 7,
    name: 'Sousse Medina',
    city: 'Sousse',
    description: 'Historic medina with fort and seaside ambiance.',
    activities: ['Souks', 'Museums', 'Beach walks'],
    transport: 'Train from Tunis; local taxis',
    hotelPrice: 90,
    rating: 4.2,
    images: ['assets/images/sousse1.jpg','assets/images/sousse2.jpg','assets/images/sousse3.jpg'],
    coords: { x: 35.838887, y: 10.628362 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4 - (i%2)*0.5, text: 'Lively atmosphere and history.' }))
  },
  {
    id: 8,
    name: 'Tozeur Oasis',
    city: 'Tozeur',
    description: 'Desert oasis with palm groves and ksar villages.',
    activities: ['Desert tours', 'Oasis walk', 'Photography'],
    transport: 'Flights from Tunis; local 4x4 tours',
    hotelPrice: 110,
    rating: 4.6,
    images: ['assets/images/tozeur1.jpg','assets/images/tozeur2.jpg','assets/images/tozeur3.jpg'],
    coords: { x: 33.893831, y: 8.177948 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.7 - (i%2)*0.5, text: 'Magical desert vibes.' }))
  },
  {
    id: 9,
    name: 'Dougga Ruins',
    city: 'Teboursouk',
    description: 'Roman city ruins with theatre and temples.',
    activities: ['History', 'Hiking', 'Photography'],
    transport: 'Car from Tunis (2h); local taxis',
    hotelPrice: 55,
    rating: 4.4,
    images: ['assets/images/dougga1.jpg','assets/images/dougga2.jpg','assets/images/dougga3.jpg'],
    coords: { x: 36.422720, y: 9.220245 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.3 - (i%2)*0.5, text: 'Incredible Roman heritage.' }))
  },
  {
    id: 10,
    name: 'Djerba Island',
    city: 'Djerba',
    description: 'Island beaches, markets, and heritage sites.',
    activities: ['Beach', 'Markets', 'Museums'],
    transport: 'Flights or bus + ferry; taxis on island',
    hotelPrice: 130,
    rating: 4.5,
    images: ['assets/images/djerba1.jpg','assets/images/djerba2.jpg','assets/images/djerba3.jpg'],
    coords: { x: 33.819899, y: 10.861992 },
    reviews: Array.from({ length: 10 }).map((_, i) => ({ name: `User ${i+1}`, rating: 4.5 - (i%2)*0.5, text: 'Relaxed vibe and great food.' }))
  }
];

const GUIDES = [
  { id: 1, name: 'Amine', languages: ['Arabic','French','English'], price: 40, rating: 4.8, image: 'assets/images/guide1.jpg' },
  { id: 2, name: 'Nour', languages: ['Arabic','English'], price: 35, rating: 4.6, image: 'assets/images/guide2.jpg' },
  { id: 3, name: 'Tito', languages: ['Arabic','French'], price: 30, rating: 4.4, image: 'assets/images/guide3.jpg' },
  { id: 4, name: 'Sana', languages: ['Arabic','French','English','Italian'], price: 45, rating: 4.7, image: 'assets/images/guide4.jpg' },
  { id: 5, name: 'Youssef', languages: ['Arabic','German','English'], price: 50, rating: 4.9, image: 'assets/images/guide5.jpg' }
];

const GROUPS = [
  { id: 1, name: 'Hiking in Zaghouan', type: 'Hiking', description: 'Weekend hike to springs and Roman aqueduct.', members: 42 },
  { id: 2, name: 'Tunis Street Food', type: 'Food', description: 'Taste local favorites: fricassee, kafteji, brik.', members: 58 },
  { id: 3, name: 'Heritage Walks Tunis', type: 'Culture', description: 'Explore medina alleys and historic monuments.', members: 33 },
  { id: 4, name: 'Sahara Photo Tour', type: 'Photography', description: 'Oasis, dunes, and desert architecture.', members: 27 },
  { id: 5, name: 'Coastal Cycling Sousse', type: 'Cycling', description: 'Seaside route with coffee stops.', members: 19 }
];

// Export to global (simple for static pages)
window.TuniData = { PLACES, GUIDES, GROUPS };

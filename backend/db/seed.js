const db = require('./database');
const bcrypt = require('bcryptjs');

// Seed demo user
const passwordHash = bcrypt.hashSync('demo123', 10);
const insertUser = db.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`);
insertUser.run('Demo User', 'demo@traveloop.com', passwordHash, 'user');
insertUser.run('Admin User', 'admin@traveloop.com', passwordHash, 'admin');

// Seed cities
const insertCity = db.prepare(`INSERT OR IGNORE INTO cities (name, country, region, cost_index, popularity, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

const cities = [
  ['Paris', 'France', 'Europe', 4.2, 98, 'The City of Light, renowned for art, fashion, and cuisine.', 48.8566, 2.3522],
  ['Tokyo', 'Japan', 'Asia', 3.8, 95, 'A dazzling blend of ultramodern and traditional culture.', 35.6762, 139.6503],
  ['New York', 'USA', 'North America', 4.5, 97, 'The city that never sleeps – iconic skyline and vibrant energy.', 40.7128, -74.0060],
  ['Bali', 'Indonesia', 'Asia', 2.1, 92, 'Tropical paradise with stunning temples, beaches, and rice terraces.', -8.3405, 115.0920],
  ['Rome', 'Italy', 'Europe', 3.5, 90, 'The Eternal City, a living museum of ancient history.', 41.9028, 12.4964],
  ['Barcelona', 'Spain', 'Europe', 3.3, 88, 'Gaudí architecture, Mediterranean beaches, and tapas culture.', 41.3874, 2.1686],
  ['London', 'UK', 'Europe', 4.3, 96, 'Historic landmarks, world-class museums, and royal heritage.', 51.5074, -0.1278],
  ['Dubai', 'UAE', 'Middle East', 4.0, 89, 'Futuristic skyline, luxury shopping, and desert adventures.', 25.2048, 55.2708],
  ['Sydney', 'Australia', 'Oceania', 3.9, 87, 'Harbour city with iconic opera house and beautiful beaches.', -33.8688, 151.2093],
  ['Bangkok', 'Thailand', 'Asia', 1.8, 91, 'Vibrant street life, ornate temples, and incredible food.', 13.7563, 100.5018],
  ['Istanbul', 'Turkey', 'Europe', 2.5, 85, 'Where East meets West – bazaars, mosques, and Bosphorus views.', 41.0082, 28.9784],
  ['Cape Town', 'South Africa', 'Africa', 2.3, 82, 'Table Mountain, stunning coastlines, and diverse culture.', -33.9249, 18.4241],
  ['Kyoto', 'Japan', 'Asia', 3.5, 86, 'Ancient temples, geisha culture, and serene bamboo groves.', 35.0116, 135.7681],
  ['Amsterdam', 'Netherlands', 'Europe', 3.7, 88, 'Canals, cycling culture, and world-renowned museums.', 52.3676, 4.9041],
  ['Marrakech', 'Morocco', 'Africa', 1.9, 80, 'Colorful souks, palaces, and the magic of the Sahara nearby.', 31.6295, -7.9811],
  ['Rio de Janeiro', 'Brazil', 'South America', 2.8, 86, 'Carnival city with Christ the Redeemer and Copacabana Beach.', -22.9068, -43.1729],
  ['Prague', 'Czech Republic', 'Europe', 2.4, 84, 'Fairy-tale architecture, cobblestone streets, and great beer.', 50.0755, 14.4378],
  ['Singapore', 'Singapore', 'Asia', 4.1, 90, 'Garden city with futuristic architecture and hawker food culture.', 1.3521, 103.8198],
  ['Cusco', 'Peru', 'South America', 1.7, 78, 'Gateway to Machu Picchu and the heart of Inca civilization.', -13.5319, -71.9675],
  ['Santorini', 'Greece', 'Europe', 3.8, 88, 'Iconic white-washed buildings and breathtaking Aegean sunsets.', 36.3932, 25.4615],
  ['Jaipur', 'India', 'Asia', 1.5, 81, 'The Pink City – majestic forts, palaces, and vibrant bazaars.', 26.9124, 75.7873],
  ['Lisbon', 'Portugal', 'Europe', 2.9, 85, 'Hilly coastal city with pastel buildings and pastéis de nata.', 38.7223, -9.1393],
  ['Reykjavik', 'Iceland', 'Europe', 4.6, 76, 'Gateway to Northern Lights, geysers, and volcanic landscapes.', 64.1466, -21.9426],
  ['Hanoi', 'Vietnam', 'Asia', 1.4, 83, 'Centuries-old architecture, vibrant street food, and Old Quarter charm.', 21.0278, 105.8342],
];

cities.forEach(c => insertCity.run(...c));

// Seed activities
const insertActivity = db.prepare(`INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES (?, ?, ?, ?, ?, ?, ?)`);

const activities = [
  [1, 'Eiffel Tower Visit', 'Ascend the iconic iron tower for panoramic Paris views.', 'sightseeing', 25, 2, 4.7],
  [1, 'Louvre Museum', 'Explore the world\'s largest art museum housing the Mona Lisa.', 'culture', 17, 3, 4.8],
  [1, 'Seine River Cruise', 'Romantic evening cruise along the Seine.', 'sightseeing', 15, 1.5, 4.5],
  [1, 'French Cooking Class', 'Learn to make classic French dishes with a local chef.', 'food', 85, 3, 4.6],
  [2, 'Shibuya Crossing', 'Experience the world\'s busiest pedestrian crossing.', 'sightseeing', 0, 0.5, 4.3],
  [2, 'Tsukiji Outer Market', 'Fresh sushi and street food at the famous fish market.', 'food', 30, 2, 4.7],
  [2, 'Senso-ji Temple', 'Tokyo\'s oldest Buddhist temple in Asakusa.', 'culture', 0, 1.5, 4.6],
  [2, 'TeamLab Borderless', 'Immersive digital art museum experience.', 'culture', 32, 2.5, 4.8],
  [3, 'Statue of Liberty', 'Ferry ride and visit to the iconic landmark.', 'sightseeing', 24, 3, 4.5],
  [3, 'Central Park Walk', 'Stroll through Manhattan\'s green oasis.', 'sightseeing', 0, 2, 4.6],
  [3, 'Broadway Show', 'Catch a world-class theater performance.', 'culture', 120, 2.5, 4.8],
  [3, 'Brooklyn Food Tour', 'Taste diverse cuisines across Brooklyn neighborhoods.', 'food', 65, 3, 4.5],
  [4, 'Ubud Monkey Forest', 'Walk among playful monkeys in a sacred sanctuary.', 'sightseeing', 5, 1.5, 4.3],
  [4, 'Tegallalang Rice Terraces', 'Stunning tiered rice paddies with jungle views.', 'sightseeing', 3, 2, 4.7],
  [4, 'Bali Surf Lesson', 'Learn to surf on beautiful Kuta Beach.', 'adventure', 35, 2, 4.4],
  [4, 'Balinese Cooking Class', 'Cook traditional dishes in a village setting.', 'food', 28, 3, 4.6],
  [5, 'Colosseum Tour', 'Explore the ancient Roman amphitheater.', 'sightseeing', 18, 2, 4.7],
  [5, 'Vatican Museums', 'Marvel at the Sistine Chapel and Renaissance masterpieces.', 'culture', 20, 3, 4.8],
  [5, 'Trastevere Food Walk', 'Authentic Roman cuisine in the charming Trastevere district.', 'food', 55, 2.5, 4.6],
  [6, 'Sagrada Familia', 'Gaudí\'s unfinished masterpiece basilica.', 'sightseeing', 26, 1.5, 4.9],
  [6, 'Park Güell', 'Whimsical mosaic-covered park by Gaudí.', 'sightseeing', 10, 1.5, 4.5],
  [6, 'La Boqueria Market', 'Vibrant food market on La Rambla.', 'food', 20, 1.5, 4.4],
  [7, 'Tower of London', 'Medieval castle and home of the Crown Jewels.', 'culture', 30, 2.5, 4.6],
  [7, 'British Museum', 'World-class museum with free admission.', 'culture', 0, 3, 4.7],
  [7, 'London Eye', 'Giant observation wheel with Thames views.', 'sightseeing', 35, 1, 4.4],
  [8, 'Burj Khalifa', 'Visit the observation deck of the world\'s tallest building.', 'sightseeing', 40, 1.5, 4.6],
  [8, 'Desert Safari', 'Dune bashing, camel rides, and BBQ dinner.', 'adventure', 65, 5, 4.7],
  [8, 'Dubai Mall & Fountain Show', 'Shopping and spectacular water fountain show.', 'sightseeing', 0, 3, 4.5],
  [9, 'Sydney Opera House Tour', 'Guided tour of the architectural icon.', 'culture', 30, 1.5, 4.5],
  [9, 'Bondi to Coogee Walk', 'Scenic coastal walk between famous beaches.', 'adventure', 0, 2.5, 4.7],
  [9, 'Harbour Bridge Climb', 'Climb the iconic bridge for stunning harbour views.', 'adventure', 175, 3, 4.8],
  [10, 'Grand Palace', 'Stunning royal palace and Wat Phra Kaew temple.', 'culture', 15, 2, 4.6],
  [10, 'Floating Markets', 'Traditional markets on Bangkok\'s canals.', 'food', 8, 3, 4.4],
  [10, 'Street Food Night Tour', 'Guided tour through Bangkok\'s best street food spots.', 'food', 25, 3, 4.8],
  [11, 'Hagia Sophia', 'Magnificent former cathedral and mosque.', 'culture', 15, 1.5, 4.7],
  [11, 'Grand Bazaar', 'One of the world\'s oldest covered markets.', 'sightseeing', 0, 2.5, 4.3],
  [11, 'Bosphorus Cruise', 'Cruise between Europe and Asia on the strait.', 'sightseeing', 12, 2, 4.6],
  [12, 'Table Mountain Cable Car', 'Ride to the top for panoramic views.', 'adventure', 18, 2, 4.7],
  [12, 'Cape of Good Hope', 'Visit the southwestern tip of Africa.', 'sightseeing', 10, 4, 4.5],
  [12, 'Wine Tasting in Stellenbosch', 'Sample world-class wines in the Cape Winelands.', 'food', 35, 4, 4.6],
];

db.exec('BEGIN');
try {
  activities.forEach(a => insertActivity.run(...a));
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');
  throw err;
}

console.log('✅ Database seeded successfully!');
console.log(`   - ${cities.length} cities`);
console.log(`   - ${activities.length} activities`);
process.exit(0);

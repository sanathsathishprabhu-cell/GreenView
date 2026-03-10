/**
 * Firestore Seed Script
 *
 * Run this script ONCE to populate your Firestore database with sample room data.
 *
 * Prerequisites:
 * 1. Replace the Firebase config below with your actual project config
 * 2. Ensure your Firestore rules allow writes (or use Admin SDK)
 * 3. Run: node scripts/seed-firestore.js
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, setDoc, doc } = require("firebase/firestore");

// ⚠️ Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const rooms = [
  {
    name: "Forest Deluxe Room",
    category: "Deluxe",
    price: 18000,
    capacity: 2,
    size: 45,
    beds: "1 King Bed",
    view: "Forest",
    shortDescription: "An intimate retreat enveloped in ancient forest, with floor-to-ceiling windows framing an ever-changing tableau of woodland.",
    description: "Nestled within a canopy of ancient deodar trees, the Forest Deluxe Room offers a profound sense of immersion in nature. Floor-to-ceiling glass walls dissolve the boundary between inside and out, while the hand-crafted interiors—local stone, warm timber, hand-woven textiles—create a space that feels at once elemental and deeply refined.",
    amenities: ["High-Speed Wi-Fi", "Mini Bar", "Private Balcony", "Forest View", "Rainfall Shower", "Air Conditioning", "Room Service", "Safe"],
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85"],
    available: true,
    featured: true,
  },
  {
    name: "Mountain Suite",
    category: "Suite",
    price: 38000,
    capacity: 2,
    size: 90,
    beds: "1 King Bed",
    view: "Mountain",
    shortDescription: "A sweeping suite commanding panoramic views of the snow-capped peaks, featuring a private plunge pool and fireplace.",
    description: "The Mountain Suite commands the property's most extraordinary views: an uninterrupted panorama of the high Himalayan peaks. A private plunge pool sits at the room's edge, seemingly suspended above the valley. Inside, a wood-burning fireplace anchors the living space.",
    amenities: ["Private Plunge Pool", "Fireplace", "Personal Butler", "Panoramic Mountain View", "Outdoor Deck", "Soaking Tub", "Walk-in Closet", "Premium Minibar"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85"],
    available: true,
    featured: true,
  },
  {
    name: "Lakeside Villa",
    category: "Villa",
    price: 75000,
    capacity: 4,
    size: 180,
    beds: "1 King + 1 Twin",
    view: "Lake",
    shortDescription: "A private villa at the water's edge with a personal butler, infinity pool, and direct access to the serene lake.",
    description: "The Lakeside Villa occupies a private promontory at the lake's edge—a world entirely unto itself. A personal butler and private chef are at your disposal from morning until night. The infinity pool flows visually into the lake beyond.",
    amenities: ["Private Infinity Pool", "Personal Butler", "Private Chef", "Lake Access", "Full Kitchen", "Two Bedrooms", "Outdoor Dining", "Boat Access"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85"],
    available: true,
    featured: true,
  },
  {
    name: "Penthouse Retreat",
    category: "Penthouse",
    price: 120000,
    capacity: 4,
    size: 280,
    beds: "2 King Beds",
    view: "Valley",
    shortDescription: "The pinnacle of luxury high above the valley with rooftop pool and private chef.",
    description: "The Penthouse Retreat is the most exclusive accommodation at GreenView. Occupying the entire top floor, it surveys the valley in every direction. A rooftop pool, private chef, and bespoke concierge service ensure an experience of unparalleled luxury.",
    amenities: ["Rooftop Pool", "Private Chef", "360° View", "Jacuzzi", "Personal Butler", "Home Cinema", "Wine Cellar", "Helipad Access"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85"],
    available: true,
    featured: false,
  },
  {
    name: "Garden Deluxe",
    category: "Deluxe",
    price: 15000,
    capacity: 2,
    size: 40,
    beds: "1 Queen Bed",
    view: "Garden",
    shortDescription: "Peaceful garden views with a private terrace and ambient lighting.",
    description: "The Garden Deluxe opens directly onto a private terrace surrounded by flowering trees and curated plantings. A serene, grounding space that reconnects you with the turning of seasons.",
    amenities: ["Garden View", "Private Terrace", "Wi-Fi", "Mini Bar", "Rainfall Shower", "Room Service"],
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85"],
    available: true,
    featured: false,
  },
  {
    name: "Forest Suite",
    category: "Suite",
    price: 45000,
    capacity: 2,
    size: 110,
    beds: "1 King Bed",
    view: "Forest",
    shortDescription: "Expansive suite with private forest plunge pool and outdoor bathing terrace.",
    description: "The Forest Suite extends the living space into the forest itself. A private plunge pool sits among the trees, and an outdoor bathing terrace allows for bathing beneath the open sky. The interiors are a meditation in natural materials.",
    amenities: ["Private Plunge Pool", "Outdoor Bathing Terrace", "Forest View", "Personal Butler", "Fireplace", "Observatory Window"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85"],
    available: true,
    featured: false,
  },
];

async function seed() {
  console.log("🌱 Seeding Firestore with room data...");
  for (const room of rooms) {
    const docRef = await addDoc(collection(db, "rooms"), {
      ...room,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✓ Created room: ${room.name} (${docRef.id})`);
  }
  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

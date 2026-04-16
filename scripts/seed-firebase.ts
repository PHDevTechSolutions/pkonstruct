// This script seeds initial data to Firebase Firestore
// Run with: npx ts-node scripts/seed-firebase.ts

import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { readFileSync } from "fs"
import { join } from "path"

// Initialize Firebase Admin
// You need to download your service account key from Firebase Console
// and save it as serviceAccountKey.json in the project root
const serviceAccountPath = join(process.cwd(), "serviceAccountKey.json")
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

// Blog Posts Data
const blogPosts = [
  {
    id: "trends-2024",
    title: "2024 Construction Trends: Sustainable Building Practices",
    excerpt: "Explore the latest sustainable building practices that are reshaping the construction industry.",
    content: "The construction industry is undergoing a significant transformation as sustainability becomes a central focus. Modern sustainable construction relies heavily on eco-friendly materials. From bamboo flooring to recycled steel and low-VOC paints, builders now have access to a wide range of sustainable options.",
    category: "Industry Trends",
    author: "David Chen",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: ["Sustainability", "Green Building", "2024 Trends"],
    published: true
  },
  {
    id: "choose-contractor",
    title: "How to Choose the Right Contractor for Your Project",
    excerpt: "Essential tips for selecting a construction contractor.",
    content: "Selecting the right contractor is crucial for the success of your construction project. Always ensure your contractor holds valid licenses and insurance. Review past projects and check references before making a decision.",
    category: "Tips & Guides",
    author: "Maria Rodriguez",
    date: "2024-03-10",
    readTime: "8 min read",
    tags: ["Contractor Selection", "Project Planning"],
    published: true
  },
  {
    id: "commercial-residential",
    title: "Commercial vs Residential Construction: Key Differences",
    excerpt: "Understanding the distinct approaches in construction projects.",
    content: "Commercial and residential construction differ significantly in regulations, materials, and project management approaches.",
    category: "Education",
    author: "John Peterson",
    date: "2024-03-05",
    readTime: "6 min read",
    tags: ["Commercial", "Residential"],
    published: true
  },
  {
    id: "tech-hub-spotlight",
    title: "Project Spotlight: The Tech Hub Office Tower",
    excerpt: "An inside look at our latest commercial project in San Francisco.",
    content: "Discover the challenges and innovations behind this 25-story building in downtown San Francisco.",
    category: "Project Stories",
    author: "Sarah Thompson",
    date: "2024-02-28",
    readTime: "4 min read",
    tags: ["Commercial", "Spotlight"],
    published: true
  },
  {
    id: "safety-standards",
    title: "Building Safety: OSHA Standards and Best Practices",
    excerpt: "A comprehensive guide to construction safety standards.",
    content: "Learn how we maintain our zero-accident record across all construction sites with rigorous safety protocols.",
    category: "Safety",
    author: "Sarah Thompson",
    date: "2024-02-20",
    readTime: "7 min read",
    tags: ["Safety", "OSHA"],
    published: true
  },
  {
    id: "smart-buildings",
    title: "The Future of Smart Buildings and IoT Integration",
    excerpt: "How IoT technology is transforming modern construction.",
    content: "From automated systems to predictive maintenance, smart building technology is revolutionizing the industry.",
    category: "Technology",
    author: "David Chen",
    date: "2024-02-15",
    readTime: "6 min read",
    tags: ["Technology", "IoT", "Smart Buildings"],
    published: true
  }
]

// Projects Data
const projects = [
  {
    id: "villa-complex",
    title: "Modern Villa Complex",
    category: "Residential",
    location: "Beverly Hills, CA",
    year: "2024",
    duration: "18 months",
    size: "45,000 sq ft",
    team: "35 workers",
    client: "Private Developer",
    description: "A luxury residential complex featuring 12 modern villas with sustainable design elements and smart home technology.",
    challenge: "The project required building on a hillside location with strict environmental regulations.",
    solution: "We implemented terraced construction techniques and used locally-sourced materials.",
    results: [
      "12 luxury villas completed on schedule",
      "LEED Gold certification achieved",
      "30% energy savings through smart design",
      "Zero environmental incidents"
    ],
    features: [
      "Smart home automation systems",
      "Solar panel integration",
      "Rainwater harvesting systems",
      "Electric vehicle charging stations"
    ],
    published: true
  },
  {
    id: "tech-hub-tower",
    title: "Tech Hub Office Tower",
    category: "Commercial",
    location: "San Francisco, CA",
    year: "2024",
    duration: "24 months",
    size: "125,000 sq ft",
    team: "120 workers",
    client: "TechStart Inc.",
    description: "State-of-the-art 25-story office building designed for leading tech companies.",
    challenge: "Building in a dense urban environment with limited access and strict noise restrictions.",
    solution: "Modular construction techniques and off-site prefabrication reduced on-site work by 40%.",
    results: [
      "Completed 2 weeks ahead of schedule",
      "Under budget by 8%",
      "99.2% employee satisfaction rating",
      "Won AIA Design Excellence Award"
    ],
    features: [
      "Open collaborative floors",
      "Rooftop terrace and garden",
      "Fitness center and wellness rooms",
      "Smart building management system"
    ],
    published: true
  },
  {
    id: "manufacturing-facility",
    title: "Manufacturing Facility",
    category: "Industrial",
    location: "Detroit, MI",
    year: "2023",
    duration: "14 months",
    size: "100,000 sq ft",
    team: "80 workers",
    client: "AutoTech Manufacturing",
    description: "Modern manufacturing plant with automated production lines for automotive parts.",
    challenge: "Integrating heavy industrial equipment while maintaining precision alignment.",
    solution: "Specialized foundation designs and precision installation protocols.",
    results: [
      "40% increase in client productivity",
      "Zero equipment alignment issues",
      "Passed all safety inspections",
      "Completed during harsh winter conditions"
    ],
    features: [
      "Automated production lines",
      "Climate-controlled environment",
      "Heavy-duty flooring systems",
      "Advanced fire suppression"
    ],
    published: true
  },
  {
    id: "riverside-apartments",
    title: "Riverside Apartments",
    category: "Residential",
    location: "Miami, FL",
    year: "2023",
    duration: "20 months",
    size: "180,000 sq ft",
    team: "95 workers",
    client: "Waterfront Development LLC",
    description: "Waterfront apartment complex with 200 units and recreational facilities.",
    challenge: "Coastal construction with hurricane-resistant requirements.",
    solution: "Reinforced concrete construction with impact-resistant windows and storm preparation systems.",
    results: [
      "200 luxury apartments delivered",
      "Hurricane Cat 4 rated construction",
      "95% pre-lease rate at completion"
    ],
    features: [
      "Private balconies with water views",
      "Resort-style pool and spa",
      "Fitness center and yoga studio",
      "Private marina access"
    ],
    published: true
  },
  {
    id: "shopping-mall",
    title: "Shopping Mall Extension",
    category: "Commercial",
    location: "Austin, TX",
    year: "2023",
    duration: "12 months",
    size: "50,000 sq ft",
    team: "60 workers",
    client: "Austin Retail Group",
    description: "50,000 sq ft mall extension with modern retail spaces and entertainment zone.",
    challenge: "Construction while mall remained operational with minimal disruption.",
    solution: "Phased construction with temporary walkways and night-shift heavy work.",
    results: [
      "Zero safety incidents",
      "99% on-time retail openings",
      "Increased mall traffic by 35%"
    ],
    features: [
      "Modern retail spaces",
      "Entertainment zone with cinema",
      "Food court expansion",
      "Indoor playground"
    ],
    published: true
  },
  {
    id: "warehouse-distribution",
    title: "Warehouse Distribution Center",
    category: "Industrial",
    location: "Chicago, IL",
    year: "2022",
    duration: "10 months",
    size: "250,000 sq ft",
    team: "110 workers",
    client: "Logistics Plus",
    description: "Automated distribution center serving major e-commerce operations.",
    challenge: "Tight timeline to meet holiday season demand.",
    solution: "Accelerated schedule with overlapping trades and 24/7 operations.",
    results: [
      "Completed 3 weeks early",
      "Processed 1M packages first month",
      "LEED Silver certified"
    ],
    features: [
      "Automated sorting systems",
      "50 loading docks",
      "Cold storage capability",
      "Solar panel roof array"
    ],
    published: true
  }
]

// Testimonials Data
const testimonials = [
  {
    id: "testimonial-1",
    name: "Robert Johnson",
    role: "Homeowner",
    location: "Beverly Hills, CA",
    rating: 5,
    text: "PKonstruct transformed our dream home into reality. Their attention to detail and quality craftsmanship exceeded our expectations.",
    project: "Custom Villa Construction",
    published: true
  },
  {
    id: "testimonial-2",
    name: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    location: "San Francisco, CA",
    rating: 5,
    text: "Working with PKonstruct on our new headquarters was an excellent experience. They delivered on time and within budget.",
    project: "Commercial Office Building",
    published: true
  },
  {
    id: "testimonial-3",
    name: "Michael Torres",
    role: "Factory Manager",
    location: "Detroit, MI",
    rating: 5,
    text: "Our new manufacturing facility is a testament to PKonstruct's industrial expertise. Productivity increased by 40%.",
    project: "Manufacturing Facility",
    published: true
  },
  {
    id: "testimonial-4",
    name: "Emily Watson",
    role: "Property Developer",
    location: "Miami, FL",
    rating: 5,
    text: "I've worked with many construction companies, but PKonstruct stands out for their reliability and quality.",
    project: "Riverside Apartments",
    published: true
  },
  {
    id: "testimonial-5",
    name: "David Park",
    role: "Retail Chain Owner",
    location: "Austin, TX",
    rating: 5,
    text: "The mall extension project was complex, but PKonstruct handled it flawlessly with excellent project management.",
    project: "Shopping Mall Extension",
    published: true
  }
]

async function seedData() {
  try {
    console.log("Starting Firebase seeding...")

    // Seed Blog Posts
    console.log("Seeding blog posts...")
    for (const post of blogPosts) {
      await db.collection("blogPosts").doc(post.id).set(post)
      console.log(`  ✓ Blog post: ${post.title}`)
    }

    // Seed Projects
    console.log("Seeding projects...")
    for (const project of projects) {
      await db.collection("projects").doc(project.id).set(project)
      console.log(`  ✓ Project: ${project.title}`)
    }

    // Seed Testimonials
    console.log("Seeding testimonials...")
    for (const testimonial of testimonials) {
      await db.collection("testimonials").doc(testimonial.id).set(testimonial)
      console.log(`  ✓ Testimonial: ${testimonial.name}`)
    }

    console.log("\n✅ Seeding completed successfully!")
    console.log(`   - ${blogPosts.length} blog posts`)
    console.log(`   - ${projects.length} projects`)
    console.log(`   - ${testimonials.length} testimonials`)

  } catch (error) {
    console.error("❌ Seeding failed:", error)
  }
}

seedData()

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

// Services Data
const services = [
  {
    id: "residential-construction",
    icon: "home",
    title: "Residential Construction",
    description: "Custom homes, renovations, and additions built to your exact specifications with premium materials.",
    fullDescription: "Our residential construction services cover everything from custom home building to major renovations and additions. We work closely with homeowners to bring their vision to life, using only premium materials and employing skilled craftsmen who take pride in their work.",
    features: [
      "Custom home design and construction",
      "Home additions and expansions",
      "Kitchen and bathroom remodeling",
      "Energy-efficient upgrades",
      "Outdoor living spaces",
      "Basement finishing"
    ],
    order: 1
  },
  {
    id: "commercial-building",
    icon: "building2",
    title: "Commercial Building",
    description: "Office buildings, retail spaces, and commercial complexes designed for functionality and aesthetics.",
    fullDescription: "We specialize in commercial construction projects of all sizes, from small retail spaces to large office complexes. Our team understands the unique requirements of commercial construction, including zoning regulations, accessibility standards, and efficient space planning.",
    features: [
      "Office building construction",
      "Retail space development",
      "Restaurant and hospitality build-outs",
      "Mixed-use developments",
      "Commercial tenant improvements",
      "ADA compliance upgrades"
    ],
    order: 2
  },
  {
    id: "industrial-projects",
    icon: "factory",
    title: "Industrial Projects",
    description: "Warehouses, factories, and industrial facilities built to meet stringent safety standards.",
    fullDescription: "Our industrial construction expertise covers manufacturing facilities, warehouses, distribution centers, and specialized industrial buildings. We understand the critical importance of durability, safety, and efficiency in industrial environments.",
    features: [
      "Manufacturing facility construction",
      "Warehouse and distribution centers",
      "Cold storage facilities",
      "Heavy equipment foundations",
      "Industrial renovations",
      "Specialized process equipment installation"
    ],
    order: 3
  },
  {
    id: "renovations",
    icon: "hammer",
    title: "Renovations",
    description: "Transform existing spaces with our expert renovation services, from kitchens to entire buildings.",
    fullDescription: "Whether you're looking to update a single room or completely transform an entire building, our renovation team has the expertise to handle projects of any scale. We specialize in breathing new life into existing structures while maintaining their character.",
    features: [
      "Whole house renovations",
      "Historical building restoration",
      "Structural modifications",
      "Exterior facade updates",
      "Interior space reconfiguration",
      "Code compliance updates"
    ],
    order: 4
  },
  {
    id: "interior-exterior-finishing",
    icon: "paintbrush",
    title: "Interior & Exterior Finishing",
    description: "Professional painting, flooring, and finishing touches that bring your project to completion.",
    fullDescription: "The finishing touches make all the difference. Our finishing specialists excel at painting, flooring installation, trim work, and all the details that transform a construction site into a beautiful, functional space.",
    features: [
      "Interior and exterior painting",
      "Hardwood and tile flooring",
      "Custom trim and molding",
      "Cabinet installation",
      "Countertop installation",
      "Landscape hardscaping"
    ],
    order: 5
  },
  {
    id: "project-management",
    icon: "hardhat",
    title: "Project Management",
    description: "End-to-end project management ensuring on-time delivery and within budget constraints.",
    fullDescription: "Effective project management is the key to successful construction. Our experienced project managers coordinate all aspects of your project, from permits and inspections to subcontractor management and quality control.",
    features: [
      "Complete project coordination",
      "Permit and inspection management",
      "Budget tracking and reporting",
      "Schedule management",
      "Quality assurance programs",
      "Safety management"
    ],
    order: 6
  },
  {
    id: "architectural-design",
    icon: "ruler",
    title: "Architectural Design",
    description: "Innovative architectural solutions tailored to your needs, combining form with function.",
    fullDescription: "Our in-house architectural team creates innovative designs that balance aesthetics, functionality, and budget. From initial concepts to final construction documents, we provide comprehensive design services.",
    features: [
      "Custom architectural design",
      "3D modeling and visualization",
      "Space planning",
      "Sustainable design solutions",
      "Renovation design services",
      "Construction documentation"
    ],
    order: 7
  },
  {
    id: "site-preparation",
    icon: "truck",
    title: "Site Preparation",
    description: "Complete site preparation including excavation, grading, and foundation work.",
    fullDescription: "Proper site preparation is the foundation of every successful construction project. Our site preparation services include everything from initial surveying and clearing to final grading and utility installation.",
    features: [
      "Land clearing and demolition",
      "Excavation and grading",
      "Foundation construction",
      "Utility installation",
      "Erosion control",
      "Site drainage solutions"
    ],
    order: 8
  }
]

// Team Data
const team = [
  {
    id: "john-peterson",
    name: "John Peterson",
    role: "Founder & CEO",
    experience: "25+ years",
    bio: "John founded PKonstruct in 2005 with a vision to deliver exceptional construction services. His leadership has grown the company from a small team to an industry leader.",
    phone: "+1 (555) 101-0001",
    email: "john@pkonstruct.com",
    order: 1,
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnpeterson"
    }
  },
  {
    id: "maria-rodriguez",
    name: "Maria Rodriguez",
    role: "Chief Operations Officer",
    experience: "18 years",
    bio: "Maria ensures every project runs smoothly from start to finish. Her expertise in project management has been key to our 100% on-time delivery record.",
    phone: "+1 (555) 101-0002",
    email: "maria@pkonstruct.com",
    order: 2,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mariarodriguez"
    }
  },
  {
    id: "david-chen",
    name: "David Chen",
    role: "Head of Architecture",
    experience: "20 years",
    bio: "David brings creative vision and technical expertise to every project. His innovative designs have won multiple industry awards.",
    phone: "+1 (555) 101-0003",
    email: "david@pkonstruct.com",
    order: 3,
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidchen"
    }
  },
  {
    id: "sarah-thompson",
    name: "Sarah Thompson",
    role: "Safety Director",
    experience: "15 years",
    bio: "Sarah maintains our impeccable safety record. Her rigorous safety protocols ensure zero accidents across all project sites.",
    phone: "+1 (555) 101-0004",
    email: "sarah@pkonstruct.com",
    order: 4,
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahthompson"
    }
  }
]

// Clients Data
const clients = [
  { id: "marriott", name: "Marriott Hotels", icon: "hotel", order: 1 },
  { id: "home-depot", name: "Home Depot", icon: "store", order: 2 },
  { id: "amazon", name: "Amazon Logistics", icon: "warehouse", order: 3 },
  { id: "lennar", name: "Lennar Homes", icon: "home", order: 4 },
  { id: "tesla", name: "Tesla Motors", icon: "factory", order: 5 },
  { id: "wells-fargo", name: "Wells Fargo", icon: "landmark", order: 6 },
  { id: "hyatt", name: "Hyatt Resorts", icon: "castle", order: 7 },
  { id: "cbre", name: "CBRE Group", icon: "building2", order: 8 }
]

// About Data
const aboutData = {
  id: "company",
  title: "Building Excellence for Over Two Decades",
  subtitle: "About Us",
  description: "PKonstruct has established itself as a trusted name in the construction industry. Our commitment to quality, safety, and client satisfaction has made us the preferred choice for projects of all sizes.",
  story: "From humble beginnings in 2005, we have grown into a full-service construction company with expertise spanning residential, commercial, and industrial sectors.",
  values: [
    { icon: "checkcircle", title: "Quality Excellence", description: "We never compromise on quality. Every project is executed with precision and attention to detail." },
    { icon: "award", title: "Award Winning", description: "Recognized with multiple industry awards for our innovative designs and sustainable practices." },
    { icon: "users", title: "Expert Team", description: "Our team consists of certified professionals with decades of combined industry experience." },
    { icon: "shield", title: "Safety First", description: "We maintain rigorous safety standards, ensuring zero accidents across all our project sites." }
  ],
  milestones: [
    { year: "2005", event: "PKonstruct founded with 5 employees", order: 1 },
    { year: "2010", event: "Completed 100th project milestone", order: 2 },
    { year: "2015", event: "Expanded to commercial construction", order: 3 },
    { year: "2020", event: "Achieved ISO 9001 certification", order: 4 },
    { year: "2024", event: "500+ projects completed", order: 5 }
  ],
  stats: {
    teamMembers: 150,
    industryAwards: 25,
    projectsCompleted: 500,
    yearsExperience: 19
  }
}

// FAQ Data
const faqs = [
  {
    id: "faq-1",
    question: "How long does a typical construction project take?",
    answer: "Project timelines vary based on scope and complexity. A small renovation might take 2-4 weeks, while a custom home could take 8-12 months. Commercial projects typically range from 6 months to 2 years. We provide detailed timelines during the planning phase and keep you updated throughout the project.",
    category: "general",
    order: 1
  },
  {
    id: "faq-2",
    question: "Do you offer free estimates?",
    answer: "Yes! We provide free, no-obligation estimates for all projects. Our team will visit your site, discuss your vision, and provide a detailed quote outlining all costs, timelines, and project specifications. Contact us to schedule your consultation.",
    category: "general",
    order: 2
  },
  {
    id: "faq-3",
    question: "Are you licensed and insured?",
    answer: "Absolutely. PKonstruct is fully licensed in all states where we operate, and we carry comprehensive general liability and workers' compensation insurance. We can provide certificates of insurance upon request, and all our subcontractors are also fully licensed and insured.",
    category: "general",
    order: 3
  },
  {
    id: "faq-4",
    question: "What types of payment do you accept?",
    answer: "We accept various payment methods including checks, wire transfers, and major credit cards. For larger projects, we typically work with a payment schedule tied to project milestones. We also partner with several financing companies that offer construction loans and home improvement financing.",
    category: "pricing",
    order: 4
  },
  {
    id: "faq-5",
    question: "Do you offer warranties on your work?",
    answer: "Yes, we stand behind our work with comprehensive warranties. All projects include a 1-year workmanship warranty, and we pass along manufacturer warranties for all materials and products used. Some structural elements may have extended warranties. We'll provide detailed warranty information with your project contract.",
    category: "general",
    order: 5
  },
  {
    id: "faq-6",
    question: "How do you handle project changes or modifications?",
    answer: "We understand that changes may be necessary during construction. All modifications are handled through our change order process, which includes documenting the change, providing cost and timeline impacts, and obtaining your written approval before proceeding. We maintain clear communication throughout this process.",
    category: "process",
    order: 6
  },
  {
    id: "faq-7",
    question: "What is your safety record?",
    answer: "Safety is our top priority. We maintain a zero-accident policy across all job sites through rigorous safety training, daily safety briefings, and strict adherence to OSHA standards. Our safety director regularly inspects all sites, and we have received multiple safety excellence awards from industry organizations.",
    category: "safety",
    order: 7
  },
  {
    id: "faq-8",
    question: "Do you handle permits and inspections?",
    answer: "Yes, we manage all aspects of permits and inspections for your project. Our team has extensive experience working with local building departments and understands the requirements in all areas we serve. We handle permit applications, schedule inspections, and ensure all work meets or exceeds code requirements.",
    category: "process",
    order: 8
  },
  {
    id: "faq-9",
    question: "Can you work with my architect or designer?",
    answer: "Absolutely! We regularly collaborate with architects, interior designers, and other professionals. We're experienced in working with existing plans or can provide recommendations for design professionals if needed. Our goal is to ensure seamless coordination between all parties for the best possible outcome.",
    category: "process",
    order: 9
  },
  {
    id: "faq-10",
    question: "What areas do you serve?",
    answer: "PKonstruct operates throughout the United States with regional offices in major metropolitan areas. Our main service areas include California, Texas, Florida, New York, Illinois, and Michigan. For projects outside these areas, please contact us to discuss availability and logistics.",
    category: "general",
    order: 10
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

    // Seed Services
    console.log("Seeding services...")
    for (const service of services) {
      await db.collection("services").doc(service.id).set(service)
      console.log(`  ✓ Service: ${service.title}`)
    }

    // Seed Team
    console.log("Seeding team...")
    for (const member of team) {
      await db.collection("team").doc(member.id).set(member)
      console.log(`  ✓ Team: ${member.name}`)
    }

    // Seed Clients
    console.log("Seeding clients...")
    for (const client of clients) {
      await db.collection("clients").doc(client.id).set(client)
      console.log(`  ✓ Client: ${client.name}`)
    }

    // Seed About
    console.log("Seeding about data...")
    await db.collection("about").doc(aboutData.id).set(aboutData)
    console.log(`  ✓ About data`)

    // Seed FAQ
    console.log("Seeding FAQ...")
    for (const faq of faqs) {
      await db.collection("faq").doc(faq.id).set(faq)
      console.log(`  ✓ FAQ: ${faq.question.substring(0, 40)}...`)
    }

    console.log("\n✅ Seeding completed successfully!")
    console.log(`   - ${blogPosts.length} blog posts`)
    console.log(`   - ${projects.length} projects`)
    console.log(`   - ${testimonials.length} testimonials`)
    console.log(`   - ${services.length} services`)
    console.log(`   - ${team.length} team members`)
    console.log(`   - ${clients.length} clients`)
    console.log(`   - 1 about document`)
    console.log(`   - ${faqs.length} FAQs`)

  } catch (error) {
    console.error("❌ Seeding failed:", error)
  }
}

seedData()

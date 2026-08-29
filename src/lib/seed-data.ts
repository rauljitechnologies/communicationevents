/**
 * Canonical starting content.
 *
 * Two jobs:
 *  1. `npm run seed` pushes this into Supabase (tables in supabase/schema.sql).
 *  2. The content layer falls back to it whenever Supabase is unreachable or
 *     not yet configured, so the site always renders.
 *
 * Once Supabase is seeded, edit content in the Supabase Table Editor — the site
 * picks changes up on its own, no rebuild and no code change.
 */
import type {
  Client,
  GalleryCategory,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

const M = "/media";

export const siteSettings: SiteSettings = {
  phone: "9831085630",
  email: "niladdri@communicationevent.in",
  address: "Communication & Events, 335, Jodhpur Park, Kolkata 700068",
  hero_video: `${M}/hero-loop.mp4`,
  hero_poster: `${M}/hero.jpg`,
  founder_image: `${M}/founder.jpg`,
  founder_name: "Niladdri Biswas",
  about_body: [
    "With over 3 decades of unparalleled proficiency in executing successful promotions, campaigns and events, our founder has a deep understanding of effectively engaging target audiences and creating memorable experiences that leave a lasting impact.",
    "Whether it's a large-scale product launch or an intimate brand activation, our founder's expertise in logistics, marketing and event management ensures seamless execution and remarkable results. With a proven track record in executing mega events and working with international and national celebrities, he has successfully curated and promoted a diverse range of events, elevating the profiles of both established and up-and-coming artists.",
    "Our team of professionals is driven by commitment, motivation and passion to produce memorable brand events. We have all the expertise under one roof to ensure the success of any activity.",
  ],
  stats: [
    { value: 100, suffix: "+", label: "Brands Served" },
    { value: 1000, suffix: "+", label: "Successful Events" },
    { value: 30, suffix: "+", label: "Years of Excellence" },
  ],
};

export const services: Service[] = [
  {
    slug: "corporate-events",
    title: "Corporate Events",
    icon: "Building2",
    copy: "Organized at star banquets to brief employees on future strategies, facilitate discussions, and encourage the exchange of ideas and opinions.",
    image: `${M}/s1.jpg`,
    points: [
      "Annual conferences, townhalls and dealer meets",
      "Award nights, gala dinners and celebrations",
      "Stage design, production and AV management",
      "Guest management, hospitality and logistics",
    ],
    sort_order: 1,
  },
  {
    slug: "festival-activation",
    title: "Festival Activation",
    icon: "Sparkles",
    copy: "Our team works closely with you to bring your vision to life, ensuring every detail reflects your unique style, personality and preferences.",
    image: `${M}/s2.jpg`,
    points: [
      "Durga Puja and festive property activations",
      "Pandal branding and experience zones",
      "Cultural performances and crowd engagement",
      "Permissions, vendor and crowd-flow management",
    ],
    sort_order: 2,
  },
  {
    slug: "exhibition",
    title: "Exhibition",
    icon: "LayoutPanelTop",
    copy: "From venue selection and creative booth design to pre-event marketing, staff training and on-ground execution — every detail handled.",
    image: `${M}/s3.jpg`,
    points: [
      "Creative booth design and fabrication",
      "Venue selection and space negotiation",
      "Pre-event marketing and visitor drives",
      "Trained staffing and lead capture",
    ],
    sort_order: 3,
  },
  {
    slug: "brand-activation",
    title: "Brand Activation",
    icon: "Megaphone",
    copy: "From immersive experiences to strategic engagements, we help brands inspire audiences and turn interactions into lasting loyalty.",
    image: `${M}/s4.jpg`,
    points: [
      "Mall, retail and campus experiences",
      "Sampling, demo and photo-op installations",
      "Promoter recruitment and training",
      "Reporting, imagery and campaign analytics",
    ],
    sort_order: 4,
  },
  {
    slug: "roadshows",
    title: "Roadshows & Activations",
    icon: "Truck",
    copy: "We bring brands to life through engaging activations, immersive experiences and seamless on-ground execution.",
    image: `${M}/s5.jpg`,
    points: [
      "Multi-city route planning and permissions",
      "Mobile stages, LED trucks and canters",
      "Anchors, artists and crowd engagement",
      "Daily reporting across every city",
    ],
    sort_order: 5,
  },
  {
    slug: "sports-csr",
    title: "Sports / CSR Events",
    icon: "Trophy",
    copy: "Venue selection, catering, games, return gifts and more — activities designed to enhance community spirit, teamwork and health.",
    image: `${M}/s6.jpg`,
    points: [
      "Corporate sports days and tournaments",
      "Marathons, walkathons and health drives",
      "CSR and community outreach programmes",
      "Catering, trophies and return gifts",
    ],
    sort_order: 6,
  },
  {
    slug: "trade-activation",
    title: "Trade Activation",
    icon: "Store",
    copy: "Channel and retail programmes that move product — designed for distributors, dealers and the last mile of your market.",
    image: `${M}/s7.jpg`,
    points: [
      "Dealer, distributor and channel partner meets",
      "In-shop branding and retail visibility drives",
      "Trade schemes, incentives and loyalty programmes",
      "Market-wise execution and on-ground reporting",
    ],
    sort_order: 7,
  },
  {
    slug: "special-assignment",
    title: "Special Assignment",
    icon: "Star",
    copy: "One-of-a-kind mandates that don't fit a template — conceptualised, produced and delivered end to end by a dedicated team.",
    image: `${M}/s8.jpg`,
    points: [
      "Bespoke concepts and custom production",
      "Government, institutional and CSR mandates",
      "Milestone celebrations and inaugurations",
      "Dedicated project team from brief to closure",
    ],
    sort_order: 8,
  },
];

export const clients: Client[] = [
  { name: "Pepsi", logo: `${M}/clients/pepsi-logo.png`, website: null, sort_order: 1 },
  { name: "Nestlé", logo: `${M}/clients/nestle-logo.png`, website: null, sort_order: 2 },
  { name: "ITC", logo: `${M}/clients/itc-logo.png`, website: null, sort_order: 3 },
  { name: "Reliance", logo: `${M}/clients/reliance-logo.png`, website: null, sort_order: 4 },
  { name: "HP", logo: `${M}/clients/hp-logo.png`, website: null, sort_order: 5 },
  { name: "Nokia", logo: `${M}/clients/nokia-logo.png`, website: null, sort_order: 6 },
  { name: "Kellogg's", logo: `${M}/clients/kelloggs-logo.png`, website: null, sort_order: 7 },
  { name: "Johnson & Johnson", logo: `${M}/clients/j-j.png`, website: null, sort_order: 8 },
  { name: "ICICI Bank", logo: `${M}/clients/icici-bank.png`, website: null, sort_order: 9 },
  { name: "HDFC", logo: `${M}/clients/hdfc-logo.png`, website: null, sort_order: 10 },
  { name: "Airtel", logo: `${M}/clients/airtel-logo.png`, website: null, sort_order: 11 },
  { name: "Vodafone", logo: `${M}/clients/vodafone-logo-08.png`, website: null, sort_order: 12 },
  { name: "Emami", logo: `${M}/clients/emami-logo.png`, website: null, sort_order: 13 },
  { name: "IPL", logo: `${M}/clients/ipl.png`, website: null, sort_order: 14 },
  { name: "Star Sports", logo: `${M}/clients/star-sports.png`, website: null, sort_order: 15 },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "They took a two-line brief and returned a full experience. Our annual conference in Kolkata has never run this smoothly.",
    name: "Regional Marketing Head",
    org: "FMCG Major",
    sort_order: 1,
  },
  {
    quote:
      "Three cities, nine days of roadshows, zero surprises. The on-ground team is calm, sharp and completely dependable.",
    name: "Brand Manager",
    org: "Telecom Brand",
    sort_order: 2,
  },
  {
    quote:
      "The exhibition booth pulled the highest footfall we've had. Design, build and staffing were all handled end to end.",
    name: "AVP Communications",
    org: "Private Bank",
    sort_order: 3,
  },
];

const img = (url: string, caption: string, sort_order: number) => ({ url, caption, sort_order });

export const gallery: GalleryCategory[] = [
  {
    slug: "corporate-events",
    title: "Corporate Events",
    copy: "Conferences, annual days and townhalls at star banquets — staged, produced and run end to end.",
    sort_order: 1,
    images: [
      img(`${M}/gallery/corp-1.jpg`, "Annual conference, Kolkata", 1),
      img(`${M}/gallery/corp-2.jpg`, "Leadership townhall", 2),
      img(`${M}/gallery/corp-3.jpg`, "Awards night main stage", 3),
      img(`${M}/gallery/corp-4.jpg`, "Product launch keynote", 4),
      img(`${M}/gallery/corp-5.jpg`, "Gala dinner setup", 5),
      img(`${M}/gallery/corp-6.jpg`, "Panel discussion stage", 6),
      img(`${M}/s1.jpg`, "Backstage production", 7),
    ],
  },
  {
    slug: "festival-activation",
    title: "Festival Activation",
    copy: "Durga Puja and festive properties built around culture, craft and crowd flow.",
    sort_order: 2,
    images: [
      img(`${M}/gallery/fest-1.jpg`, "Puja pandal activation", 1),
      img(`${M}/gallery/fest-2.jpg`, "Festive brand zone", 2),
      img(`${M}/gallery/fest-3.jpg`, "Cultural showcase", 3),
      img(`${M}/gallery/fest-4.jpg`, "Illuminated festive gate", 4),
      img(`${M}/gallery/fest-5.jpg`, "Dhunuchi performance", 5),
      img(`${M}/gallery/fest-6.jpg`, "Festive retail counter", 6),
      img(`${M}/s2.jpg`, "Evening festive crowd", 7),
    ],
  },
  {
    slug: "exhibition",
    title: "Exhibition",
    copy: "Booth design, fabrication, staffing and on-ground execution for trade fairs and expos.",
    sort_order: 3,
    images: [
      img(`${M}/gallery/exhib-1.jpg`, "Trade expo pavilion", 1),
      img(`${M}/gallery/exhib-2.jpg`, "Custom booth build", 2),
      img(`${M}/gallery/exhib-3.jpg`, "Product display wall", 3),
      img(`${M}/gallery/exhib-4.jpg`, "Double-decker stall", 4),
      img(`${M}/gallery/exhib-5.jpg`, "Interactive demo bay", 5),
      img(`${M}/gallery/exhib-6.jpg`, "Expo hall walkthrough", 6),
      img(`${M}/s3.jpg`, "Visitor engagement desk", 7),
    ],
  },
  {
    slug: "brand-activation",
    title: "Brand Activation",
    copy: "Mall, retail and campus experiences that turn footfall into conversation.",
    sort_order: 4,
    images: [
      img(`${M}/gallery/brand-1.jpg`, "Mall experience zone", 1),
      img(`${M}/gallery/brand-2.jpg`, "Sampling counter", 2),
      img(`${M}/gallery/brand-3.jpg`, "Interactive brand pod", 3),
      img(`${M}/gallery/brand-4.jpg`, "Campus engagement drive", 4),
      img(`${M}/gallery/brand-5.jpg`, "Photo-op installation", 5),
      img(`${M}/gallery/brand-6.jpg`, "Retail launch takeover", 6),
      img(`${M}/s4.jpg`, "Brand pop-up counter", 7),
    ],
  },
  {
    slug: "roadshows",
    title: "Roadshows & Activations",
    copy: "Multi-city mobile stages, anchors and crowd engagement, city after city.",
    sort_order: 5,
    images: [
      img(`${M}/gallery/road-1.jpg`, "Night roadshow stage", 1),
      img(`${M}/gallery/road-2.jpg`, "Mobile activation van", 2),
      img(`${M}/gallery/road-3.jpg`, "On-ground engagement", 3),
      img(`${M}/gallery/road-4.jpg`, "LED truck rollout", 4),
      img(`${M}/gallery/road-5.jpg`, "Anchor crowd interaction", 5),
      img(`${M}/gallery/road-6.jpg`, "City square setup", 6),
      img(`${M}/s5.jpg`, "Convoy on the move", 7),
    ],
  },
  {
    slug: "sports-csr",
    title: "Sports & CSR Events",
    copy: "Sports days, marathons and community initiatives built for teamwork and impact.",
    sort_order: 6,
    images: [
      img(`${M}/gallery/sport-1.jpg`, "Corporate sports day", 1),
      img(`${M}/gallery/sport-2.jpg`, "Community CSR drive", 2),
      img(`${M}/gallery/sport-3.jpg`, "Team engagement", 3),
      img(`${M}/gallery/sport-4.jpg`, "Marathon flag-off", 4),
      img(`${M}/gallery/sport-5.jpg`, "Tug of war finals", 5),
      img(`${M}/gallery/sport-6.jpg`, "Trophy presentation", 6),
      img(`${M}/s6.jpg`, "Community celebration", 7),
    ],
  },
];

/** Static page copy that isn't worth a database table. */
export const differences = [
  {
    title: "Aligned with your vision",
    copy: "We don't just listen to your brief — we understand your vision and turn it into every detail, every decision, every experience.",
  },
  {
    title: "Built on real outcomes",
    copy: "More than promises — years of experience, consistent execution and 1,000+ events have shaped our expertise in what truly delivers.",
  },
  {
    title: "Driven by creative impact",
    copy: "Creative concepts, powerful storytelling and seamless execution come together to create events that connect and inspire.",
  },
  {
    title: "Your partner at every step",
    copy: "We work as an extension of your team — shared ownership, seamless collaboration and complete transparency on every project.",
  },
];

export const process = [
  {
    title: "Vision Discovery",
    copy: "We go beyond the brief to understand your vision, objectives, values, and what success looks like for you.",
  },
  {
    title: "Strategic Planning",
    copy: "Your vision meets our expertise. Thoughtful strategies, creative concepts and precise plans designed around your goals.",
  },
  {
    title: "Seamless Execution",
    copy: "From the first detail to the final moment, we orchestrate every element with precision for a flawless experience.",
  },
  {
    title: "Lasting Impact",
    copy: "The event may end, but its impact continues — meaningful connections and outcomes that leave a lasting impression.",
  },
];

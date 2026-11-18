export type Coordinator = {
  name: string;
  phone: string;
};

export type SportCategory = {
  id: string;
  label: string;
  prizePoolDisplay: string;
  prizePoolInr: number;
  feeDisplay: string;
  feeInr: number;
  minPlayers: number;
  maxPlayers: number;
  squadRuleLabel: string;
  format: string;
  entryType: "Team" | "Individual";
};

export type Sport = {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  ageLimit: number;
  eligibility: string[];
  categories: SportCategory[];
  coordinators: Coordinator[];
};

export const FEST_INFO = {
  name: "ZENITH 2027",
  subtitle: "IIST Inter-College Sports Fest",
  tagline: "Let's Go Beyond The Horizon",
  institute: "Indian Institute of Space Science and Technology (IIST)",
  location: "Valiamala, Thiruvananthapuram, Kerala",
  established: 2007,
  isroAlumniCount: "1442+",
  totalPrizePoolDisplay: "₹3,62,500",
  socials: {
    instagram: "https://instagram.com/zenith.iist",
    instagramHandle: "@zenith.iist",
    website: "https://zenithiist.org",
    websiteLabel: "zenithiist.org",
    linkedin: "https://linkedin.com/company/zenith-iist",
    linkedinHandle: "zenith-iist",
  },
  chiefCoordinator: {
    role: "Chief Coordinator",
    name: "Kushal Aradhya",
    phone: "+91 9353510445",
  },
  eventsHeads: [
    { role: "Events Head", name: "Anshuman", phone: "+91 9548269026" },
    { role: "Events Head", name: "Rohith CV", phone: "+91 9207784237" },
  ],
  distinguishedLeaders: [
    "Dr. APJ Abdul Kalam",
    "Dr. S. Somanath",
    "Dr. V. Narayanan",
    "Dr. BN Suresh",
    "Dr. S. Unnikrishnan Nair",
    "Dr. Dipankar Banerjee",
  ],
};

export const SPORTS: Sport[] = [
  {
    slug: "football",
    name: "Football",
    tagline: "11v11 full-pitch turf & ground showdown",
    badge: "Field Sport",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "open",
        label: "Men's / Open Team",
        prizePoolDisplay: "₹75K",
        prizePoolInr: 75000,
        feeDisplay: "₹5,000",
        feeInr: 5000,
        minPlayers: 11,
        maxPlayers: 20,
        squadRuleLabel: "Min: 11, Max: 20 players",
        format: "League + Playoffs",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Aromal", phone: "+91 7736192740" },
      { name: "Mecwin", phone: "+91 9188012004" },
    ],
  },
  {
    slug: "cricket",
    name: "Cricket",
    tagline: "High-stakes university leather-ball tournament",
    badge: "Field Sport",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "open",
        label: "Men's / Open Team",
        prizePoolDisplay: "₹75K",
        prizePoolInr: 75000,
        feeDisplay: "₹5,000",
        feeInr: 5000,
        minPlayers: 13,
        maxPlayers: 16,
        squadRuleLabel: "Min: 13, Max: 16 players",
        format: "League + Playoffs",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Mansoor", phone: "+91 7051147597" },
      { name: "Arnav", phone: "+91 9960693993" },
      { name: "Dipanshu Kushwaha", phone: "+91 7209237228" },
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    tagline: "Men's & Women's court championships",
    badge: "Men's & Women's",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "mens",
        label: "Men's Team",
        prizePoolDisplay: "₹45K",
        prizePoolInr: 45000,
        feeDisplay: "₹3,500",
        feeInr: 3500,
        minPlayers: 5,
        maxPlayers: 12,
        squadRuleLabel: "Min: 5, Max: 12 players",
        format: "League + Playoffs",
        entryType: "Team",
      },
      {
        id: "womens",
        label: "Women's Team",
        prizePoolDisplay: "₹25K",
        prizePoolInr: 25000,
        feeDisplay: "₹2,500",
        feeInr: 2500,
        minPlayers: 3,
        maxPlayers: 7,
        squadRuleLabel: "Min: 3, Max: 7 players",
        format: "League + Playoffs",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Mohit", phone: "+91 9503994130" },
      { name: "Hrishi", phone: "+91 8891167320" },
      { name: "Shiivam Tomar", phone: "+91 8882031113" },
    ],
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    tagline: "Fast-paced knockout court clashes",
    badge: "Court Sport",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "open",
        label: "Open Team",
        prizePoolDisplay: "₹45K",
        prizePoolInr: 45000,
        feeDisplay: "₹3,500",
        feeInr: 3500,
        minPlayers: 7,
        maxPlayers: 10,
        squadRuleLabel: "Min: 7, Max: 10 players",
        format: "Knockout",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Adithya", phone: "+91 7330734087" },
      { name: "Preetham Krishna", phone: "+91 9390488477" },
    ],
  },
  {
    slug: "chess",
    name: "Chess",
    tagline: "Swiss rounds & playoff tactical battles",
    badge: "Mind Sport",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "open",
        label: "Team Event",
        prizePoolDisplay: "₹35K",
        prizePoolInr: 35000,
        feeDisplay: "₹1,750",
        feeInr: 1750,
        minPlayers: 3,
        maxPlayers: 12,
        squadRuleLabel: "Min: 3, Max: 12 players",
        format: "Swiss and Playoffs",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Shanmukh", phone: "+91 9032841546" },
      { name: "Kathan Rathod", phone: "+91 7698261707" },
      { name: "Aditya Mohanty", phone: "+91 7327974138" },
    ],
  },
  {
    slug: "badminton",
    name: "Badminton",
    tagline: "Mixed team tie format — MD, MD, MS, WS, XD",
    badge: "Mixed Team",
    ageLimit: 28,
    eligibility: [
      "Age Limit: 28 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
      "Max of 1 Man & 1 Woman can play 2 formats",
    ],
    categories: [
      {
        id: "mixed-team",
        label: "Mixed Team Tie",
        prizePoolDisplay: "₹40K",
        prizePoolInr: 40000,
        feeDisplay: "₹4,000",
        feeInr: 4000,
        minPlayers: 6,
        maxPlayers: 8,
        squadRuleLabel: "Min: 1W, 5M | Max: 2W, 6M",
        format: "MD, MD, MS, WS, XD",
        entryType: "Team",
      },
    ],
    coordinators: [
      { name: "Parth Goel", phone: "+91 7972282266" },
      { name: "Shlok Jha", phone: "+91 7208797570" },
      { name: "Mitali Ingale", phone: "+91 9822909034" },
      { name: "Tirth Parikh", phone: "+91 9699314081" },
    ],
  },
  {
    slug: "table-tennis",
    name: "Table Tennis",
    tagline: "Men's ABC-XYZ teams & Women's individual knockouts",
    badge: "Men's & Women's",
    ageLimit: 25,
    eligibility: [
      "Age Limit: 25 Years",
      "Only for university students",
      "Valid College ID & Aadhar ID must be present",
    ],
    categories: [
      {
        id: "mens",
        label: "Men's Team",
        prizePoolDisplay: "₹15K",
        prizePoolInr: 15000,
        feeDisplay: "₹1,750",
        feeInr: 1750,
        minPlayers: 3,
        maxPlayers: 5,
        squadRuleLabel: "Min: 3, Max: 5 players",
        format: "ABC-XYZ",
        entryType: "Team",
      },
      {
        id: "womens",
        label: "Women's Individual",
        prizePoolDisplay: "₹7.5K",
        prizePoolInr: 7500,
        feeDisplay: "₹700",
        feeInr: 700,
        minPlayers: 1,
        maxPlayers: 1,
        squadRuleLabel: "Individual Entry (1 player)",
        format: "Knockouts",
        entryType: "Individual",
      },
    ],
    coordinators: [
      { name: "Pramodh", phone: "+91 9962696097" },
      { name: "Pranav", phone: "+91 9611531523" },
      { name: "Swarnakar", phone: "+91 7908405668" },
    ],
  },
];

export function getSportBySlug(slug: string): Sport | undefined {
  return SPORTS.find((sport) => sport.slug === slug);
}

export function getSportCategory(
  slug: string,
  categoryId?: string
): { sport: Sport; category: SportCategory } | undefined {
  const sport = getSportBySlug(slug);
  if (!sport) return undefined;
  const category =
    sport.categories.find((c) => c.id === categoryId) ?? sport.categories[0];
  return { sport, category };
}

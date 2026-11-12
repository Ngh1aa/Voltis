/*
 * VOLTIS prototype data — the single source for catalogue content and the
 * seed for user data. app-core.js copies `seed` into sessionStorage on the
 * first visit in a tab and again when "Reset demo data" is used.
 *
 * Figures (range, price, charging) are concept targets for the prototype,
 * not homologated values or commercial offers. Prices are in VND.
 */
(() => {
  "use strict";

  // Free-licence photography from Wikimedia Commons, processed into
  // assets/photos/. Authors, sources and licences: credits.html.
  const P = "./assets/photos/";
  const IMG = {
    aero: P + "aero-fastback.webp",
    terrain: P + "terrain-crossover.webp",
    terrainXl: P + "terrain-xl-suv.webp",
    city: P + "city-compact.webp",
    link: P + "link-van.webp",
    cockpit: P + "cockpit-display.webp",
    cabin: P + "cabin-interior.webp",
    steering: P + "steering-detail.webp",
    chargingNight: P + "charging-night.webp",
    chargingHub: P + "charging-hub.webp",
    connector: P + "connector-hand.webp",
    fleetDepot: P + "fleet-depot.webp",
    solarRoof: P + "solar-roof.webp",
    solarField: P + "solar-field.webp",
    storage: P + "battery-storage.webp",
    assembly: P + "assembly-line.webp"
  };

  const COLOURS = {
    graphite: { id: "graphite", name: "Graphite Black", hex: "#1b1f1d", price: 0 },
    mineral: { id: "mineral", name: "Mineral White", hex: "#e9ece6", price: 0 },
    slate: { id: "slate", name: "Slate Blue", hex: "#45566a", price: 15000000 },
    volt: { id: "volt", name: "Volt Green", hex: "#8dff63", price: 25000000 },
    ember: { id: "ember", name: "Ember Orange", hex: "#ff7a1a", price: 25000000 },
    sand: { id: "sand", name: "Dune Sand", hex: "#b9a88a", price: 15000000 }
  };

  const vehicles = [
    {
      id: "aero",
      name: "AERO",
      type: "fastback",
      typeLabel: "Fastback",
      index: "VOLTIS / 01",
      tagline: "Low, quiet and precise.",
      summary: "A fastback concept shaped around clean airflow and a driver-first cabin.",
      image: IMG.aero,
      imageAlt: "Dark grey electric fastback saloon in side profile, used as reference for the VOLTIS AERO direction",
      seats: 5,
      chargeMinutes: 22,
      drive: "Rear- or all-wheel drive",
      driveShort: "RWD / AWD",
      highlights: [
        ["Driver-centred interface", "Primary information is kept glanceable, with secondary controls intentionally de-emphasised."],
        ["Electric-first packaging", "Cabin and storage are considered from the platform outward, not adapted from a combustion layout."],
        ["Aerodynamic language", "Long surfaces, controlled edges and restrained detailing support an efficient silhouette."]
      ],
      trims: [
        { id: "core", name: "Core", price: 1190000000, note: "Rear-wheel drive, fabric-free cabin, 18-inch wheels." },
        { id: "sport", name: "Sport", price: 1390000000, note: "All-wheel drive, adaptive damping, 19-inch wheels." },
        { id: "signature", name: "Signature", price: 1590000000, note: "All-wheel drive, glass roof, ventilated seats." }
      ],
      batteries: [
        { id: "standard", name: "Standard Range", kwh: 62, rangeKm: 480, price: 0 },
        { id: "long", name: "Long Range", kwh: 82, rangeKm: 610, price: 160000000 }
      ],
      colours: [COLOURS.graphite, COLOURS.mineral, COLOURS.slate, COLOURS.volt, COLOURS.ember],
      options: [
        { id: "assist", name: "Assisted driving pack", price: 60000000 },
        { id: "wheels", name: "20-inch aero wheels", price: 30000000 },
        { id: "audio", name: "Studio audio system", price: 32000000 },
        { id: "wallbox", name: "Home wallbox, 11 kW, installed", price: 28000000 }
      ]
    },
    {
      id: "terrain",
      name: "TERRAIN",
      type: "suv",
      typeLabel: "SUV",
      index: "VOLTIS / 02",
      tagline: "Utility, without visual weight.",
      summary: "More space, more flexibility and an elevated driving position for longer, less predictable journeys.",
      image: IMG.terrain,
      imageAlt: "Grey electric crossover seen from the rear three-quarter, used as reference for the VOLTIS TERRAIN direction",
      seats: 5,
      chargeMinutes: 26,
      drive: "All-wheel drive",
      driveShort: "AWD",
      highlights: [
        ["Flexible space", "Storage and passenger space organised around changing needs, with a flat load floor."],
        ["Clear control", "Calm information hierarchy with immediate system feedback on rough roads."],
        ["Efficient energy", "Range and charging communication designed to reduce uncertainty on long trips."]
      ],
      trims: [
        { id: "core", name: "Core", price: 1490000000, note: "All-wheel drive, washable cabin, 19-inch wheels." },
        { id: "adventure", name: "Adventure", price: 1690000000, note: "Raised suspension, all-terrain tyres, underbody guard." },
        { id: "signature", name: "Signature", price: 1890000000, note: "Air suspension, glass roof, heated rear seats." }
      ],
      batteries: [
        { id: "standard", name: "Standard Range", kwh: 75, rangeKm: 470, price: 0 },
        { id: "long", name: "Long Range", kwh: 98, rangeKm: 590, price: 180000000 }
      ],
      colours: [COLOURS.graphite, COLOURS.mineral, COLOURS.sand, COLOURS.slate, COLOURS.ember],
      options: [
        { id: "tow", name: "Tow bar, 2,000 kg", price: 25000000 },
        { id: "rails", name: "Roof rails and cross bars", price: 18000000 },
        { id: "assist", name: "Assisted driving pack", price: 60000000 },
        { id: "wallbox", name: "Home wallbox, 11 kW, installed", price: 28000000 }
      ]
    },
    {
      id: "terrain-xl",
      name: "TERRAIN XL",
      type: "suv",
      typeLabel: "SUV",
      index: "VOLTIS / 03",
      tagline: "Seven seats, one calm cabin.",
      summary: "A three-row electric SUV for families who travel together and need space without compromise.",
      image: IMG.terrainXl,
      imageAlt: "Black three-row electric SUV parked in a car park, used as reference for the VOLTIS TERRAIN XL direction",
      seats: 7,
      chargeMinutes: 28,
      drive: "All-wheel drive",
      driveShort: "AWD",
      highlights: [
        ["Three usable rows", "Third-row access and headroom planned for adults, not only children."],
        ["Family routines", "Child-seat anchors, rear climate and charging ports in every row."],
        ["Trip planning", "Route planning that includes charging stops and passenger load."]
      ],
      trims: [
        { id: "core", name: "Core", price: 1790000000, note: "Seven seats, tri-zone climate, 20-inch wheels." },
        { id: "signature", name: "Signature", price: 2090000000, note: "Captain's chairs, air suspension, glass roof." }
      ],
      batteries: [
        { id: "long", name: "Long Range", kwh: 98, rangeKm: 540, price: 0 },
        { id: "extended", name: "Extended Range", kwh: 110, rangeKm: 620, price: 150000000 }
      ],
      colours: [COLOURS.graphite, COLOURS.mineral, COLOURS.sand, COLOURS.slate],
      options: [
        { id: "tow", name: "Tow bar, 2,500 kg", price: 25000000 },
        { id: "rear-screen", name: "Rear entertainment screens", price: 45000000 },
        { id: "assist", name: "Assisted driving pack", price: 60000000 },
        { id: "wallbox", name: "Home wallbox, 11 kW, installed", price: 28000000 }
      ]
    },
    {
      id: "city",
      name: "CITY",
      type: "compact",
      typeLabel: "Compact",
      index: "VOLTIS / 04",
      tagline: "Small footprint, full attention.",
      summary: "A compact hatch for dense streets, short trips and easy parking, with the same calm interface.",
      image: IMG.city,
      imageAlt: "Compact silver electric hatchback with round headlamps in a dark exhibition hall, used as reference for the VOLTIS CITY direction",
      seats: 5,
      chargeMinutes: 25,
      drive: "Front-wheel drive",
      driveShort: "FWD",
      highlights: [
        ["Urban agility", "Tight turning circle and clear sightlines for dense traffic."],
        ["Honest range", "Range shown with context such as temperature and air-conditioning load."],
        ["Low ownership effort", "Over-the-air updates and service booking from the app."]
      ],
      trims: [
        { id: "core", name: "Core", price: 690000000, note: "Front-wheel drive, 16-inch wheels, 10-inch display." },
        { id: "plus", name: "Plus", price: 790000000, note: "Heat pump, parking camera, 17-inch wheels." }
      ],
      batteries: [
        { id: "standard", name: "Standard Range", kwh: 44, rangeKm: 340, price: 0 },
        { id: "plus", name: "Plus Range", kwh: 54, rangeKm: 410, price: 70000000 }
      ],
      colours: [COLOURS.mineral, COLOURS.graphite, COLOURS.volt, COLOURS.ember],
      options: [
        { id: "parking", name: "Parking assist pack", price: 22000000 },
        { id: "roof", name: "Contrast black roof", price: 9000000 },
        { id: "wallbox", name: "Home wallbox, 7 kW, installed", price: 18000000 }
      ]
    },
    {
      id: "link",
      name: "LINK",
      type: "van",
      typeLabel: "Van",
      index: "VOLTIS / 05",
      tagline: "Built for work that runs all day.",
      summary: "An electric van for deliveries, shuttles and service fleets, planned around depot charging.",
      image: IMG.link,
      imageAlt: "White electric panel van parked under a tree, used as reference for the VOLTIS LINK fleet direction",
      seats: 8,
      chargeMinutes: 32,
      drive: "Rear-wheel drive",
      driveShort: "RWD",
      highlights: [
        ["Depot-first charging", "Charging schedules planned around shifts and tariff windows."],
        ["Modular body", "Cargo and shuttle layouts on the same platform."],
        ["Fleet visibility", "Energy, location and service status visible to fleet managers."]
      ],
      trims: [
        { id: "cargo", name: "Cargo", price: 1090000000, note: "Two seats, 9 m³ load space, sliding side door." },
        { id: "shuttle", name: "Shuttle", price: 1290000000, note: "Eight seats, wide step, rear climate control." }
      ],
      batteries: [
        { id: "standard", name: "Standard Range", kwh: 77, rangeKm: 380, price: 0 },
        { id: "long", name: "Long Range", kwh: 92, rangeKm: 450, price: 120000000 }
      ],
      colours: [COLOURS.mineral, COLOURS.graphite, COLOURS.slate],
      options: [
        { id: "racking", name: "Cargo racking system", price: 35000000 },
        { id: "telematics", name: "Fleet telematics, 3 years", price: 24000000 },
        { id: "depot", name: "Depot charger, 22 kW", price: 55000000 }
      ]
    }
  ];

  const showrooms = [
    { id: "hanoi", name: "VOLTIS Studio Hanoi", city: "Hanoi", address: "Concept location, Tay Ho District, Hanoi", hours: "Tue to Sun, 09:00 to 18:00", models: ["aero", "terrain", "terrain-xl", "city", "link"] },
    { id: "saigon", name: "VOLTIS Studio Saigon", city: "Ho Chi Minh City", address: "Concept location, Thu Duc City, Ho Chi Minh City", hours: "Tue to Sun, 09:00 to 18:00", models: ["aero", "terrain", "terrain-xl", "city", "link"] },
    { id: "danang", name: "VOLTIS Studio Da Nang", city: "Da Nang", address: "Concept location, Son Tra District, Da Nang", hours: "Tue to Sun, 09:00 to 18:00", models: ["aero", "terrain", "city"] }
  ];

  const slots = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

  const stories = [
    {
      id: "interior-language",
      category: "design",
      date: "2026-09-10",
      readMinutes: 6,
      title: "Why electric vehicles deserve a different interior language.",
      excerpt: "Removing mechanical complexity should create a calmer cabin, not an excuse to fill every surface with another interface.",
      image: IMG.cabin,
      imageAlt: "Electric car cabin with tan seats, floating centre console and curved dashboard display",
      body: [
        "An electric platform removes the transmission tunnel, the engine bay and much of the heat management that shaped car interiors for a century. That freedom is easy to waste. Many new cabins fill the space with more screens, more lighting and more surfaces that ask for attention.",
        "VOLTIS starts from the opposite question: what does the driver actually need to see, touch and trust? Speed, energy state and warnings are separated by priority. Climate and media stay reachable without looking. Everything else waits until it is useful.",
        "Materials follow the same rule. Matte and gloss contrasts mark what can be touched. Colour is reserved for state, never decoration. The result should feel quieter than the car you came from, because the technology is doing more of the work."
      ]
    },
    {
      id: "software-decisions",
      category: "technology",
      date: "2026-09-08",
      readMinutes: 5,
      title: "Software should reduce decisions, not create more of them.",
      excerpt: "A useful interface reveals complexity only when the driver needs it.",
      image: IMG.cockpit,
      imageAlt: "Electric car cockpit with a wide panoramic driver and infotainment display",
      body: [
        "Every setting added to a vehicle interface is a decision handed back to the driver. Over time those decisions accumulate into menus nobody opens and features nobody trusts.",
        "The VOLTIS interface model treats defaults as product decisions. Regenerative braking, charging limits and climate pre-conditioning start from sensible values and explain themselves when changed.",
        "When the system needs input, it asks once, in plain language, at a safe moment. That is slower to design and faster to live with."
      ]
    },
    {
      id: "charging-information",
      category: "energy",
      date: "2026-09-02",
      readMinutes: 7,
      title: "Fast charging is also an information design problem.",
      excerpt: "Finding a charger, understanding state and recovering from errors all shape perceived speed.",
      image: IMG.chargingNight,
      imageAlt: "Electric car plugged into a street charger on a rainy city evening",
      body: [
        "Charging speed is usually reported in kilowatts. Drivers experience it in minutes, uncertainty and queues. A charger that delivers fewer kilowatts but works first time can feel faster than one that needs three attempts.",
        "That is why VOLTIS treats charging as a journey with states: finding a charger, arriving, connecting, charging, recovering from a fault and leaving. Each state has a clear message and a clear next action.",
        "Failure recovery deserves the most care. If a session stops, the driver should know why, whether they were charged, and what to do next without calling anyone."
      ]
    },
    {
      id: "one-brief",
      category: "company",
      date: "2026-08-28",
      readMinutes: 4,
      title: "One brief, many disciplines.",
      excerpt: "Why product, engineering and communication need the same source of truth.",
      image: IMG.assembly,
      imageAlt: "Car bodies moving along a factory assembly line",
      body: [
        "Vehicle programmes often split into separate tracks: design, engineering, software and marketing each with their own documents. The gaps between those documents are where customer problems hide.",
        "VOLTIS works from one brief per product decision. It states the user need, the constraints, the evidence and the open questions. Every discipline writes into it and reads from it.",
        "It is not glamorous. It does mean that when a claim appears on the website, someone can trace it back to a test, a calculation or a decision."
      ]
    },
    {
      id: "energy-transparency",
      category: "energy",
      date: "2026-08-21",
      readMinutes: 5,
      title: "Energy transparency should be part of ownership.",
      excerpt: "Drivers deserve clear context around source, storage and consumption.",
      image: IMG.solarRoof,
      imageAlt: "Solar panels covering the roof of a family house under a blue sky",
      body: [
        "An electric vehicle is only as clean as the energy that charges it, and only as efficient as the habits around it. Most drivers have no way to see either.",
        "VOLTIS ownership concepts show where energy came from when that data is available, how much was used per trip and what changed it: speed, temperature, climate settings or load.",
        "The goal is not to lecture. It is to give drivers the same quality of information a fleet manager would expect."
      ]
    },
    {
      id: "visible-restraint",
      category: "design",
      date: "2026-08-14",
      readMinutes: 4,
      title: "Good restraint is visible in what was removed.",
      excerpt: "Premium design is often the result of editing, hierarchy and material discipline.",
      image: IMG.steering,
      imageAlt: "Close-up of a perforated leather steering-wheel rim beside the instrument dials",
      body: [
        "Restraint is not minimalism for its own sake. It is the discipline of deciding what matters most and letting everything else step back.",
        "In the VOLTIS design language that means one accent colour per decision zone, one primary action per screen and physical controls for anything used while driving.",
        "The test is simple: if you remove an element and nobody misses it, it should not have been there."
      ]
    }
  ];

  const storyCategories = [
    { id: "design", label: "Design" },
    { id: "technology", label: "Technology" },
    { id: "energy", label: "Energy" },
    { id: "company", label: "Company" }
  ];

  const projects = [
    {
      id: "charge-network",
      layer: "charging",
      status: "pilot",
      index: "PROJECT / 01",
      title: "Charge Network",
      summary: "A concept for reliable, legible charging experiences across destination, workplace and journey charging.",
      image: IMG.chargingHub,
      imageAlt: "Rows of DC fast chargers at an open-air public charging hub",
      location: "Hanoi to Da Nang corridor",
      overview: "Charge Network explores how a mixed network of journey, destination and workplace chargers can feel like one service. The focus is availability before arrival, simple payment and fast recovery when a session fails.",
      phases: [
        ["Discover", "Ride-alongs with drivers on the Hanoi to Da Nang corridor to map waiting time and uncertainty."],
        ["Prototype", "Pilot signage, app states and fault recovery at two concept sites."],
        ["Measure", "Track first-time session success and time from arrival to charging."],
        ["Scale", "Package the site standard for partners and landlords."]
      ],
      outcomes: ["Availability shown before arrival", "One payment flow across partners", "Fault recovery without a phone call"]
    },
    {
      id: "energy-sites",
      layer: "energy",
      status: "concept",
      index: "PROJECT / 02",
      title: "Energy Sites",
      summary: "Renewable generation, storage and site-level energy management visualised as one operating system.",
      image: IMG.solarField,
      imageAlt: "Rows of ground-mounted solar panels at a photovoltaic power station",
      location: "Central Vietnam",
      overview: "Energy Sites combines solar generation, buffer storage and charging into one site plan, with a control interface that operators can read at a glance.",
      phases: [
        ["Discover", "Map load profiles and grid constraints for three candidate sites."],
        ["Prototype", "Design the operator dashboard and alarm hierarchy."],
        ["Measure", "Agree reporting for energy source, storage cycles and downtime."],
        ["Scale", "Turn the site plan into a reusable reference design."]
      ],
      outcomes: ["One view of generation, storage and demand", "Source reporting that drivers can read", "Reference design for partners"]
    },
    {
      id: "storage-layer",
      layer: "energy",
      status: "research",
      index: "PROJECT / 03",
      title: "Storage Layer",
      summary: "Utility-scale storage as the bridge between intermittent renewable generation and dependable mobility energy.",
      image: IMG.storage,
      imageAlt: "Containerised utility-scale battery energy storage system on a gravel site",
      location: "Research programme",
      overview: "Storage Layer studies how stationary batteries can smooth renewable generation for high-power charging hubs, and how second-life vehicle packs could contribute.",
      phases: [
        ["Discover", "Literature review and partner interviews on second-life battery use."],
        ["Prototype", "Model hub demand against storage sizing scenarios."],
        ["Measure", "Define safety, degradation and reporting requirements."],
        ["Scale", "Publish findings and decide whether to pilot."]
      ],
      outcomes: ["Sizing model for charging hubs", "Second-life feasibility notes", "Safety reporting framework"]
    },
    {
      id: "fleet-depot",
      layer: "charging",
      status: "pilot",
      index: "PROJECT / 04",
      title: "Fleet Depot",
      summary: "Overnight depot charging for delivery and shuttle fleets, scheduled around shifts and tariff windows.",
      image: IMG.fleetDepot,
      imageAlt: "Plug-in buses connected to chargers at a city bus depot",
      location: "Ho Chi Minh City",
      overview: "Fleet Depot designs the charging schedule, depot layout and fleet manager interface for operators moving vans and shuttles to electric.",
      phases: [
        ["Discover", "Shadow depot managers through a full shift cycle."],
        ["Prototype", "Schedule charging around routes, tariffs and driver handover."],
        ["Measure", "Track vehicles ready at shift start and energy cost per route."],
        ["Scale", "Offer the depot playbook with the LINK van."]
      ],
      outcomes: ["Vehicles ready at shift start", "Lower energy cost per route", "Clear handover between drivers"]
    },
    {
      id: "service-journey",
      layer: "digital",
      status: "concept",
      index: "PROJECT / 05",
      title: "Service Journey",
      summary: "One digital journey for booking, tracking and understanding vehicle service, from app to workshop.",
      image: IMG.connector,
      imageAlt: "Hand holding a CCS fast-charging connector at a public charging station",
      location: "Digital programme",
      overview: "Service Journey connects the owner app, the workshop and remote diagnostics so that owners always know what is happening to their vehicle and why.",
      phases: [
        ["Discover", "Interview owners and technicians about service pain points."],
        ["Prototype", "Design booking, status tracking and approval of extra work."],
        ["Measure", "Track repeat contacts and time to approval."],
        ["Scale", "Roll the journey into every studio."]
      ],
      outcomes: ["Live service status", "Plain-language diagnostics", "Approval before extra work"]
    }
  ];

  const projectLayers = [
    { id: "charging", label: "Charging" },
    { id: "energy", label: "Energy" },
    { id: "digital", label: "Digital" }
  ];
  const projectStatuses = [
    { id: "pilot", label: "Pilot" },
    { id: "concept", label: "Concept" },
    { id: "research", label: "Research" }
  ];

  const resources = [
    { id: "product-principles", title: "VOLTIS Product Principles", summary: "Design intent, interaction hierarchy and concept boundaries.", category: "concept", format: "md", generator: "principles" },
    { id: "energy-architecture", title: "Energy Architecture Overview", summary: "Charging, storage and vehicle-energy communication framework.", category: "tech", format: "md", generator: "energy" },
    { id: "impact-framework", title: "Impact Disclosure Framework", summary: "How lifecycle, sourcing and emissions claims should be documented.", category: "esg", format: "md", generator: "impact" },
    { id: "interface-guidelines", title: "Digital Interface Guidelines", summary: "Typography, hierarchy, accessibility and system feedback principles.", category: "ux", format: "md", generator: "interface" },
    { id: "corporate-profile", title: "Corporate Profile", summary: "Company positioning, capabilities and partnership model.", category: "company", format: "txt", generator: "profile" },
    { id: "vehicle-specs", title: "Concept Range Specification Sheet", summary: "Trims, batteries, range targets and indicative prices for every model.", category: "tech", format: "csv", generator: "specs" },
    { id: "image-sources", title: "Image Sources and Credits", summary: "Author, source and licence for every free-licence photograph and film used in this prototype.", category: "source", format: "md", file: "./docs/image-sources.md" }
  ];

  const resourceCategories = [
    { id: "concept", label: "Concept" },
    { id: "tech", label: "Technical" },
    { id: "esg", label: "ESG" },
    { id: "ux", label: "UX" },
    { id: "company", label: "Company" },
    { id: "source", label: "Sources" }
  ];

  const disciplines = [
    { id: "design", label: "Vehicle Design" },
    { id: "digital", label: "Digital Experience" },
    { id: "engineering", label: "Engineering" },
    { id: "energy", label: "Energy" }
  ];

  const jobs = [
    {
      id: "product-designer-incar",
      title: "Senior Product Designer, In-Car UX",
      discipline: "digital",
      location: "Hanoi",
      workMode: "Hybrid",
      type: "Full-time",
      posted: "2026-09-04",
      summary: "Shape how drivers read energy, navigation and safety information in the VOLTIS cabin.",
      responsibilities: ["Lead interaction design for the driver display and centre screen.", "Run in-vehicle usability studies with engineering.", "Maintain interaction patterns in the shared design system."],
      requirements: ["Six or more years in product or interaction design.", "Shipped work in automotive, embedded or safety-critical interfaces.", "Clear written reasoning about trade-offs."],
      niceToHave: ["Experience with driver distraction guidelines.", "Vietnamese and English working proficiency."]
    },
    {
      id: "systems-engineer-energy",
      title: "Vehicle Systems Engineer, Energy",
      discipline: "engineering",
      location: "Ho Chi Minh City",
      workMode: "On-site",
      type: "Full-time",
      posted: "2026-09-01",
      summary: "Integrate battery, thermal and charging systems and turn their behaviour into data the driver can trust.",
      responsibilities: ["Define energy system requirements with suppliers.", "Validate charging behaviour across temperatures.", "Provide engineering truth for range communication."],
      requirements: ["Degree in electrical, mechanical or systems engineering.", "Four or more years with battery or powertrain systems.", "Comfortable with test data and requirement tracing."],
      niceToHave: ["Experience with CCS2 or GB/T charging standards."]
    },
    {
      id: "charging-experience-lead",
      title: "Charging Experience Lead",
      discipline: "energy",
      location: "Da Nang",
      workMode: "Hybrid",
      type: "Full-time",
      posted: "2026-08-27",
      summary: "Own the end-to-end experience of finding, using and recovering from problems at a charger.",
      responsibilities: ["Map charging journeys with drivers and site partners.", "Define site standards for signage, layout and status.", "Work with digital teams on charging app states."],
      requirements: ["Experience in service design, operations or infrastructure.", "Track record of improving a physical and digital service together."],
      niceToHave: ["Background in energy or mobility infrastructure."]
    },
    {
      id: "technical-content-designer",
      title: "Technical Content Designer",
      discipline: "digital",
      location: "Remote (Vietnam)",
      workMode: "Remote",
      type: "Contract",
      posted: "2026-08-20",
      summary: "Write the words that explain energy, charging and safety in plain language across web, app and vehicle.",
      responsibilities: ["Write and maintain interface copy and help content.", "Build a terminology list shared by product and engineering.", "Review claims with the evidence owners."],
      requirements: ["Portfolio of technical or product writing.", "Excellent English; Vietnamese is a strong advantage."],
      niceToHave: ["Experience with localisation workflows."]
    },
    {
      id: "exterior-designer",
      title: "Exterior Designer",
      discipline: "design",
      location: "Hanoi",
      workMode: "On-site",
      type: "Full-time",
      posted: "2026-08-12",
      summary: "Develop proportion, surfacing and lighting for the next VOLTIS concept.",
      responsibilities: ["Sketch, model and present exterior proposals.", "Work with aerodynamics on efficient surfaces.", "Prepare data for physical models."],
      requirements: ["Degree in transportation design.", "Strong sketching and digital surfacing skills."],
      niceToHave: ["Experience with Alias or Blender."]
    },
    {
      id: "graduate-programme",
      title: "Graduate Programme, Systems and Design",
      discipline: "engineering",
      location: "Ho Chi Minh City",
      workMode: "On-site",
      type: "Internship",
      posted: "2026-08-05",
      summary: "A twelve-month rotation across engineering, design and energy teams with a named mentor.",
      responsibilities: ["Join three six-week rotations on live problems.", "Document each rotation for the next cohort.", "Present a final project to the leadership team."],
      requirements: ["Graduating in 2026 or 2027 in engineering, design or a related field.", "Curiosity about how disciplines connect."],
      niceToHave: ["A personal project you can talk about in depth."]
    }
  ];

  const seed = {
    version: 1,
    garage: [
      {
        id: "cfg-sample",
        name: "Weekend AERO",
        vehicleId: "aero",
        trimId: "sport",
        colourId: "slate",
        batteryId: "long",
        optionIds: ["wheels"],
        createdAt: "2026-11-01T09:30:00.000Z",
        updatedAt: "2026-11-01T09:30:00.000Z"
      }
    ],
    bookings: [],
    applications: [],
    enquiries: [],
    compare: [],
    failNext: false,
    drafts: {}
  };

  window.VOLTIS_DATA = Object.freeze({
    vehicles, showrooms, slots, stories, storyCategories, projects, projectLayers, projectStatuses,
    resources, resourceCategories, disciplines, jobs, seed, images: IMG
  });
})();

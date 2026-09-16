/**
 * BENGKEL MALAM
 * Static Parts / Component Catalog
 *
 * IMPORTANT:
 * - File ini hanya berisi DATA MASTER.
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan inventory pemain.
 * - Tidak menyimpan quantity milik pemain.
 * - Tidak melakukan mutation terhadap GameState.
 *
 * Player-owned inventory harus berada di GameState / save state.
 */

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type PartCategory =
  | "ENGINE"
  | "FUEL"
  | "IGNITION"
  | "TRANSMISSION"
  | "CLUTCH"
  | "DRIVETRAIN"
  | "BRAKE"
  | "SUSPENSION"
  | "WHEEL"
  | "TIRE"
  | "ELECTRICAL"
  | "EXHAUST"
  | "BODY"
  | "FRAME"
  | "COOLING"
  | "UTILITY";

export type PartTier =
  | "STOCK"
  | "BASIC"
  | "STREET"
  | "PERFORMANCE"
  | "RACE"
  | "ELITE"
  | "LEGENDARY";

export type PartConditionTier =
  | "SALVAGE"
  | "POOR"
  | "FAIR"
  | "GOOD"
  | "EXCELLENT";

export type PartSource =
  | "STOCK"
  | "USED"
  | "AFTERMARKET"
  | "PROJECT"
  | "SALVAGE"
  | "SPECIAL";

export type PartAvailability =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "VERY_RARE"
  | "LEGENDARY";

export type PartStatKey =
  | "power"
  | "acceleration"
  | "grip"
  | "reliability"
  | "launch"
  | "braking"
  | "handling"
  | "topSpeed";

export interface PartPerformanceModifier {
  power?: number;
  acceleration?: number;
  grip?: number;
  reliability?: number;
  launch?: number;
  braking?: number;
  handling?: number;
  topSpeed?: number;
}

export interface PartPhysicalSpec {
  weightKg?: number;
  size?: "SMALL" | "MEDIUM" | "LARGE";
}

export interface PartEconomy {
  baseValue: number;
  minimumValue: number;
  maximumValue: number;
  marketVolatility: number;
  availability: PartAvailability;
}

export interface PartCompatibility {
  motorClasses?: string[];
  motorCategories?: string[];
  engineTypes?: string[];
  requiredMotorIds?: string[];
}

export interface PartRequirements {
  minimumGarageLevel: number;
  minimumReputation: number;
  requiredParts?: string[];
}

export interface PartDefinition {
  id: string;

  name: string;
  shortName: string;
  brand: string;

  category: PartCategory;
  tier: PartTier;

  description: string;

  defaultCondition: number;
  defaultConditionTier: PartConditionTier;

  performance: PartPerformanceModifier;

  physical?: PartPhysicalSpec;

  economy: PartEconomy;

  compatibility: PartCompatibility;

  requirements: PartRequirements;

  marketSources: PartSource[];

  /**
   * Indicates whether this part is normally consumed
   * during an installation.
   *
   * false = reusable component.
   * true = consumable component.
   */
  consumable: boolean;

  /**
   * Useful for market / UI sorting.
   */
  installTimeHours: number;

  visual: {
    label: string;
    accent: "NORMAL" | "IMPORTANT" | "DANGER";
    icon:
      | "wrench"
      | "engine"
      | "bolt"
      | "toolbox"
      | "brake"
      | "wheel"
      | "pipe"
      | "battery"
      | "clipboard";
  };
}

/* -------------------------------------------------------------------------- */
/* STATIC CATALOG                                                             */
/* -------------------------------------------------------------------------- */

export const PARTS: PartDefinition[] = [
  /* ---------------------------------------------------------------------- */
  /* ENGINE                                                                 */
  /* ---------------------------------------------------------------------- */

  {
    id: "engine-basic",

    name: "Basic Engine Kit",
    shortName: "ENGINE BASIC",
    brand: "BENGKEL",

    category: "ENGINE",
    tier: "BASIC",

    description:
      "Paket komponen mesin dasar untuk memperbaiki kondisi mesin dan menjaga performa tetap stabil.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 5,
      acceleration: 4,
      reliability: 8,
    },

    physical: {
      weightKg: 8.5,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 1_250_000,
      minimumValue: 850_000,
      maximumValue: 1_750_000,
      marketVolatility: 0.12,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 4,

    visual: {
      label: "ENGINE",
      accent: "NORMAL",
      icon: "engine",
    },
  },

  {
    id: "engine-street-125",

    name: "Street Engine Kit 125",
    shortName: "ENGINE STREET 125",
    brand: "RACING",

    category: "ENGINE",
    tier: "STREET",

    description:
      "Paket mesin street untuk menaikkan output tanpa membuat motor kehilangan karakter penggunaan harian.",

    defaultCondition: 88,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 10,
      acceleration: 8,
      reliability: 5,
    },

    physical: {
      weightKg: 9.2,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 2_950_000,
      minimumValue: 2_250_000,
      maximumValue: 4_100_000,
      marketVolatility: 0.18,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 10,
      requiredParts: ["engine-basic"],
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
      "PROJECT",
    ],

    consumable: false,
    installTimeHours: 6,

    visual: {
      label: "STREET ENGINE",
      accent: "IMPORTANT",
      icon: "engine",
    },
  },

  {
    id: "engine-race-125",

    name: "Race Engine Kit 125",
    shortName: "ENGINE RACE 125",
    brand: "RACING",

    category: "ENGINE",
    tier: "RACE",

    description:
      "Paket mesin race untuk kelas 125 dengan fokus utama pada power, acceleration, dan launch.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 18,
      acceleration: 14,
      reliability: -4,
      launch: 9,
      topSpeed: 8,
    },

    physical: {
      weightKg: 10.4,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 6_750_000,
      minimumValue: 5_250_000,
      maximumValue: 9_500_000,
      marketVolatility: 0.28,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: ["UNDER_125"],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 30,
      requiredParts: [
        "engine-street-125",
        "fuel-carb-performance-125",
      ],
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
      "PROJECT",
    ],

    consumable: false,
    installTimeHours: 10,

    visual: {
      label: "RACE ENGINE",
      accent: "DANGER",
      icon: "engine",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* FUEL                                                                   */
  /* ---------------------------------------------------------------------- */

  {
    id: "fuel-carb-basic",

    name: "Basic Carburetor",
    shortName: "CARB BASIC",
    brand: "BENGKEL",

    category: "FUEL",
    tier: "BASIC",

    description:
      "Karburator pengganti untuk menjaga suplai bahan bakar tetap konsisten.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 2,
      reliability: 5,
    },

    physical: {
      weightKg: 0.8,
      size: "SMALL",
    },

    economy: {
      baseValue: 650_000,
      minimumValue: 450_000,
      maximumValue: 900_000,
      marketVolatility: 0.11,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
      ],
      engineTypes: ["4T", "2T"],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 2,

    visual: {
      label: "FUEL",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "fuel-carb-performance-125",

    name: "Performance Carburetor 125",
    shortName: "CARB PERFORMANCE 125",
    brand: "RACING",

    category: "FUEL",
    tier: "PERFORMANCE",

    description:
      "Karburator performa untuk respons throttle dan akselerasi yang lebih agresif.",

    defaultCondition: 88,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 4,
      acceleration: 7,
      launch: 3,
      reliability: 1,
    },

    physical: {
      weightKg: 0.9,
      size: "SMALL",
    },

    economy: {
      baseValue: 1_850_000,
      minimumValue: 1_350_000,
      maximumValue: 2_650_000,
      marketVolatility: 0.2,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 10,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "FUEL PERFORMANCE",
      accent: "IMPORTANT",
      icon: "bolt",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* IGNITION                                                                */
  /* ---------------------------------------------------------------------- */

  {
    id: "ignition-basic",

    name: "Basic Ignition Module",
    shortName: "IGNITION BASIC",
    brand: "BENGKEL",

    category: "IGNITION",
    tier: "BASIC",

    description:
      "Modul pengapian dasar untuk menjaga respons mesin dan reliability.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 2,
      acceleration: 2,
      reliability: 6,
    },

    physical: {
      weightKg: 0.5,
      size: "SMALL",
    },

    economy: {
      baseValue: 500_000,
      minimumValue: 350_000,
      maximumValue: 700_000,
      marketVolatility: 0.1,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 1,

    visual: {
      label: "IGNITION",
      accent: "NORMAL",
      icon: "bolt",
    },
  },

  {
    id: "ignition-race",

    name: "Race Ignition Controller",
    shortName: "IGNITION RACE",
    brand: "RACING",

    category: "IGNITION",
    tier: "RACE",

    description:
      "Sistem pengapian race yang meningkatkan respons mesin dan kemampuan launch.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 5,
      acceleration: 5,
      launch: 6,
      reliability: -2,
    },

    physical: {
      weightKg: 0.4,
      size: "SMALL",
    },

    economy: {
      baseValue: 2_250_000,
      minimumValue: 1_650_000,
      maximumValue: 3_350_000,
      marketVolatility: 0.25,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 25,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 2,

    visual: {
      label: "RACE IGNITION",
      accent: "DANGER",
      icon: "bolt",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* TRANSMISSION                                                            */
  /* ---------------------------------------------------------------------- */

  {
    id: "transmission-stock",

    name: "Stock Gear Set",
    shortName: "GEAR STOCK",
    brand: "OEM",

    category: "TRANSMISSION",
    tier: "STOCK",

    description:
      "Rasio standar untuk penggunaan harian dan reliability yang stabil.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      reliability: 7,
    },

    physical: {
      weightKg: 4.2,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 900_000,
      minimumValue: 650_000,
      maximumValue: 1_250_000,
      marketVolatility: 0.08,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "TRANSMISSION",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "transmission-short-ratio",

    name: "Short Ratio Gear Set",
    shortName: "GEAR SHORT",
    brand: "RACING",

    category: "TRANSMISSION",
    tier: "PERFORMANCE",

    description:
      "Rasio gear pendek untuk meningkatkan launch dan acceleration pada lintasan pendek.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 5,
      launch: 8,
      topSpeed: -2,
      reliability: -1,
    },

    physical: {
      weightKg: 4.4,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 1_950_000,
      minimumValue: 1_450_000,
      maximumValue: 2_850_000,
      marketVolatility: 0.2,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 15,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 4,

    visual: {
      label: "SHORT RATIO",
      accent: "IMPORTANT",
      icon: "bolt",
    },
  },

  {
    id: "transmission-race",

    name: "Race Close Ratio Gear Set",
    shortName: "GEAR RACE",
    brand: "RACING",

    category: "TRANSMISSION",
    tier: "RACE",

    description:
      "Gearset race untuk perpindahan rasio yang lebih optimal sepanjang run.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 8,
      launch: 10,
      topSpeed: 5,
      reliability: -3,
    },

    physical: {
      weightKg: 4.6,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 4_500_000,
      minimumValue: 3_300_000,
      maximumValue: 6_500_000,
      marketVolatility: 0.28,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 30,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 6,

    visual: {
      label: "RACE GEAR",
      accent: "DANGER",
      icon: "bolt",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* CLUTCH                                                                  */
  /* ---------------------------------------------------------------------- */

  {
    id: "clutch-basic",

    name: "Basic Clutch Set",
    shortName: "CLUTCH BASIC",
    brand: "BENGKEL",

    category: "CLUTCH",
    tier: "BASIC",

    description:
      "Set kopling dasar untuk menjaga perpindahan tenaga tetap konsisten.",

    defaultCondition: 88,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 2,
      launch: 2,
      reliability: 7,
    },

    physical: {
      weightKg: 2.3,
      size: "SMALL",
    },

    economy: {
      baseValue: 750_000,
      minimumValue: 500_000,
      maximumValue: 1_050_000,
      marketVolatility: 0.1,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 2,

    visual: {
      label: "CLUTCH",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "clutch-race",

    name: "Race Clutch Pack",
    shortName: "CLUTCH RACE",
    brand: "RACING",

    category: "CLUTCH",
    tier: "RACE",

    description:
      "Kopling race dengan engagement cepat untuk launch yang lebih agresif.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 4,
      launch: 10,
      reliability: -2,
    },

    physical: {
      weightKg: 2.1,
      size: "SMALL",
    },

    economy: {
      baseValue: 2_750_000,
      minimumValue: 2_000_000,
      maximumValue: 4_000_000,
      marketVolatility: 0.24,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 25,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "RACE CLUTCH",
      accent: "DANGER",
      icon: "bolt",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* BRAKE                                                                   */
  /* ---------------------------------------------------------------------- */

  {
    id: "brake-basic",

    name: "Basic Brake Set",
    shortName: "BRAKE BASIC",
    brand: "BENGKEL",

    category: "BRAKE",
    tier: "BASIC",

    description:
      "Set pengereman dasar untuk mengembalikan braking dan reliability.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      braking: 8,
      reliability: 7,
    },

    physical: {
      weightKg: 3.5,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 1_150_000,
      minimumValue: 800_000,
      maximumValue: 1_550_000,
      marketVolatility: 0.12,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "BRAKE",
      accent: "NORMAL",
      icon: "brake",
    },
  },

  {
    id: "brake-performance",

    name: "Performance Brake Kit",
    shortName: "BRAKE PERFORMANCE",
    brand: "RACING",

    category: "BRAKE",
    tier: "PERFORMANCE",

    description:
      "Sistem pengereman performa untuk membantu motor tetap stabil saat masuk zona pengereman.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      braking: 14,
      grip: 3,
      reliability: 3,
    },

    physical: {
      weightKg: 3.9,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 2_650_000,
      minimumValue: 1_950_000,
      maximumValue: 3_850_000,
      marketVolatility: 0.18,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 15,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 4,

    visual: {
      label: "BRAKE PERFORMANCE",
      accent: "IMPORTANT",
      icon: "brake",
    },
  },

  {
    id: "brake-race",

    name: "Race Brake System",
    shortName: "BRAKE RACE",
    brand: "RACING",

    category: "BRAKE",
    tier: "RACE",

    description:
      "Sistem pengereman race dengan fokus kuat pada braking dan kontrol.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      braking: 20,
      grip: 5,
      handling: 4,
      reliability: -2,
    },

    physical: {
      weightKg: 4.1,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 5_250_000,
      minimumValue: 3_850_000,
      maximumValue: 7_750_000,
      marketVolatility: 0.27,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 30,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 5,

    visual: {
      label: "RACE BRAKE",
      accent: "DANGER",
      icon: "brake",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* SUSPENSION                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "suspension-stock",

    name: "Stock Suspension Set",
    shortName: "SUSPENSION STOCK",
    brand: "OEM",

    category: "SUSPENSION",
    tier: "STOCK",

    description:
      "Suspensi standar untuk penggunaan harian dengan reliability stabil.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      handling: 2,
      grip: 3,
      reliability: 7,
    },

    physical: {
      weightKg: 5.5,
      size: "LARGE",
    },

    economy: {
      baseValue: 1_200_000,
      minimumValue: 850_000,
      maximumValue: 1_650_000,
      marketVolatility: 0.1,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 4,

    visual: {
      label: "SUSPENSION",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "suspension-performance",

    name: "Performance Suspension Set",
    shortName: "SUSPENSION PERFORMANCE",
    brand: "RACING",

    category: "SUSPENSION",
    tier: "PERFORMANCE",

    description:
      "Suspensi yang lebih firm untuk meningkatkan handling dan grip.",

    defaultCondition: 91,
    defaultConditionTier: "EXCELLENT",

    performance: {
      handling: 10,
      grip: 8,
      braking: 3,
      reliability: 1,
    },

    physical: {
      weightKg: 5.8,
      size: "LARGE",
    },

    economy: {
      baseValue: 3_250_000,
      minimumValue: 2_350_000,
      maximumValue: 4_850_000,
      marketVolatility: 0.19,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 15,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 5,

    visual: {
      label: "SUSPENSION PRO",
      accent: "IMPORTANT",
      icon: "wrench",
    },
  },

  {
    id: "suspension-race",

    name: "Race Suspension Set",
    shortName: "SUSPENSION RACE",
    brand: "RACING",

    category: "SUSPENSION",
    tier: "RACE",

    description:
      "Suspensi race dengan karakter agresif untuk kontrol motor selama run.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      handling: 16,
      grip: 13,
      braking: 5,
      reliability: -2,
    },

    physical: {
      weightKg: 6,
      size: "LARGE",
    },

    economy: {
      baseValue: 6_250_000,
      minimumValue: 4_650_000,
      maximumValue: 9_250_000,
      marketVolatility: 0.26,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 30,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 7,

    visual: {
      label: "RACE SUSPENSION",
      accent: "DANGER",
      icon: "wrench",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* WHEEL / TIRE                                                            */
  /* ---------------------------------------------------------------------- */

  {
    id: "wheel-basic",

    name: "Basic Wheel Set",
    shortName: "WHEEL BASIC",
    brand: "BENGKEL",

    category: "WHEEL",
    tier: "BASIC",

    description:
      "Set roda pengganti untuk menjaga grip dan handling tetap stabil.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      grip: 5,
      handling: 4,
      reliability: 4,
    },

    physical: {
      weightKg: 6.5,
      size: "LARGE",
    },

    economy: {
      baseValue: 1_650_000,
      minimumValue: 1_150_000,
      maximumValue: 2_350_000,
      marketVolatility: 0.13,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "WHEEL",
      accent: "NORMAL",
      icon: "wheel",
    },
  },

  {
    id: "wheel-race-light",

    name: "Race Lightweight Wheel Set",
    shortName: "WHEEL RACE LIGHT",
    brand: "RACING",

    category: "WHEEL",
    tier: "RACE",

    description:
      "Roda ringan untuk meningkatkan handling dan respons motor.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      grip: 9,
      handling: 12,
      acceleration: 4,
      reliability: -1,
    },

    physical: {
      weightKg: 4.8,
      size: "LARGE",
    },

    economy: {
      baseValue: 4_750_000,
      minimumValue: 3_450_000,
      maximumValue: 7_000_000,
      marketVolatility: 0.26,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 30,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 4,

    visual: {
      label: "LIGHTWEIGHT",
      accent: "DANGER",
      icon: "wheel",
    },
  },

  {
    id: "tire-street",

    name: "Street Performance Tire",
    shortName: "TIRE STREET",
    brand: "RACING",

    category: "TIRE",
    tier: "STREET",

    description:
      "Ban performa untuk meningkatkan grip tanpa mengorbankan penggunaan harian.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      grip: 9,
      handling: 5,
      braking: 4,
    },

    physical: {
      weightKg: 5.2,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 1_850_000,
      minimumValue: 1_300_000,
      maximumValue: 2_750_000,
      marketVolatility: 0.16,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
      ],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 10,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: true,
    installTimeHours: 1,

    visual: {
      label: "TIRE STREET",
      accent: "IMPORTANT",
      icon: "wheel",
    },
  },

  {
    id: "tire-drag",

    name: "Drag Compound Tire",
    shortName: "TIRE DRAG",
    brand: "RACING",

    category: "TIRE",
    tier: "RACE",

    description:
      "Compound khusus untuk drag dengan fokus pada launch dan grip.",

    defaultCondition: 96,
    defaultConditionTier: "EXCELLENT",

    performance: {
      grip: 16,
      launch: 12,
      acceleration: 4,
      handling: -2,
      reliability: -1,
    },

    physical: {
      weightKg: 5.7,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 3_250_000,
      minimumValue: 2_300_000,
      maximumValue: 4_950_000,
      marketVolatility: 0.3,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 25,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: true,
    installTimeHours: 1,

    visual: {
      label: "DRAG COMPOUND",
      accent: "DANGER",
      icon: "wheel",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* ELECTRICAL                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "battery-basic",

    name: "Basic Battery",
    shortName: "BATTERY BASIC",
    brand: "BENGKEL",

    category: "ELECTRICAL",
    tier: "BASIC",

    description:
      "Aki dasar untuk kebutuhan electrical dan reliability motor.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      reliability: 7,
      launch: 1,
    },

    physical: {
      weightKg: 2.8,
      size: "SMALL",
    },

    economy: {
      baseValue: 450_000,
      minimumValue: 300_000,
      maximumValue: 650_000,
      marketVolatility: 0.09,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: true,
    installTimeHours: 1,

    visual: {
      label: "BATTERY",
      accent: "NORMAL",
      icon: "battery",
    },
  },

  {
    id: "battery-race",

    name: "Lightweight Race Battery",
    shortName: "BATTERY RACE",
    brand: "RACING",

    category: "ELECTRICAL",
    tier: "RACE",

    description:
      "Battery ringan untuk mengurangi bobot dengan electrical support yang tetap memadai.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      acceleration: 3,
      launch: 3,
      handling: 3,
      reliability: -1,
    },

    physical: {
      weightKg: 1.1,
      size: "SMALL",
    },

    economy: {
      baseValue: 1_650_000,
      minimumValue: 1_200_000,
      maximumValue: 2_500_000,
      marketVolatility: 0.25,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 25,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: true,
    installTimeHours: 1,

    visual: {
      label: "LIGHTWEIGHT",
      accent: "DANGER",
      icon: "battery",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* EXHAUST                                                                 */
  /* ---------------------------------------------------------------------- */

  {
    id: "exhaust-street",

    name: "Street Exhaust",
    shortName: "EXHAUST STREET",
    brand: "RACING",

    category: "EXHAUST",
    tier: "STREET",

    description:
      "Knalpot street untuk tambahan power dan respons dengan karakter harian.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 5,
      acceleration: 3,
      topSpeed: 3,
      reliability: 1,
    },

    physical: {
      weightKg: 4.5,
      size: "LARGE",
    },

    economy: {
      baseValue: 1_900_000,
      minimumValue: 1_350_000,
      maximumValue: 2_850_000,
      marketVolatility: 0.18,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 10,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "EXHAUST STREET",
      accent: "IMPORTANT",
      icon: "pipe",
    },
  },

  {
    id: "exhaust-race",

    name: "Race Exhaust System",
    shortName: "EXHAUST RACE",
    brand: "RACING",

    category: "EXHAUST",
    tier: "RACE",

    description:
      "Exhaust race untuk mengejar power dan top speed dengan trade-off reliability.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 12,
      acceleration: 7,
      topSpeed: 10,
      reliability: -3,
    },

    physical: {
      weightKg: 3.7,
      size: "LARGE",
    },

    economy: {
      baseValue: 4_250_000,
      minimumValue: 3_100_000,
      maximumValue: 6_500_000,
      marketVolatility: 0.27,
      availability: "RARE",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
      engineTypes: ["4T", "2T"],
    },

    requirements: {
      minimumGarageLevel: 3,
      minimumReputation: 25,
    },

    marketSources: [
      "AFTERMARKET",
      "SPECIAL",
    ],

    consumable: false,
    installTimeHours: 5,

    visual: {
      label: "RACE EXHAUST",
      accent: "DANGER",
      icon: "pipe",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* COOLING                                                                 */
  /* ---------------------------------------------------------------------- */

  {
    id: "cooling-basic",

    name: "Basic Cooling Kit",
    shortName: "COOLING BASIC",
    brand: "BENGKEL",

    category: "COOLING",
    tier: "BASIC",

    description:
      "Komponen pendinginan dasar untuk membantu menjaga reliability mesin.",

    defaultCondition: 90,
    defaultConditionTier: "EXCELLENT",

    performance: {
      reliability: 8,
    },

    physical: {
      weightKg: 2.2,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 750_000,
      minimumValue: 500_000,
      maximumValue: 1_050_000,
      marketVolatility: 0.1,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "USED",
      "AFTERMARKET",
    ],

    consumable: false,
    installTimeHours: 2,

    visual: {
      label: "COOLING",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "cooling-performance",

    name: "Performance Cooling System",
    shortName: "COOLING PERFORMANCE",
    brand: "RACING",

    category: "COOLING",
    tier: "PERFORMANCE",

    description:
      "Sistem pendinginan performa untuk motor dengan output mesin lebih tinggi.",

    defaultCondition: 94,
    defaultConditionTier: "EXCELLENT",

    performance: {
      power: 1,
      reliability: 12,
      acceleration: 1,
    },

    physical: {
      weightKg: 2.7,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 2_250_000,
      minimumValue: 1_650_000,
      maximumValue: 3_350_000,
      marketVolatility: 0.18,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
      engineTypes: ["4T"],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 15,
    },

    marketSources: [
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 3,

    visual: {
      label: "COOLING PRO",
      accent: "IMPORTANT",
      icon: "wrench",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* BODY / FRAME                                                            */
  /* ---------------------------------------------------------------------- */

  {
    id: "frame-reinforcement-basic",

    name: "Basic Frame Reinforcement",
    shortName: "FRAME REINFORCE",
    brand: "BENGKEL",

    category: "FRAME",
    tier: "BASIC",

    description:
      "Penguatan frame untuk meningkatkan kontrol dan reliability pada motor yang mulai dipakai lebih keras.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      handling: 3,
      reliability: 8,
      grip: 2,
    },

    physical: {
      weightKg: 1.8,
      size: "MEDIUM",
    },

    economy: {
      baseValue: 1_100_000,
      minimumValue: 750_000,
      maximumValue: 1_550_000,
      marketVolatility: 0.13,
      availability: "COMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "AFTERMARKET",
      "PROJECT",
    ],

    consumable: false,
    installTimeHours: 5,

    visual: {
      label: "FRAME",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "body-street-kit",

    name: "Street Body Kit",
    shortName: "BODY STREET",
    brand: "CUSTOM",

    category: "BODY",
    tier: "STREET",

    description:
      "Body kit custom untuk membangun identitas visual motor tanpa fokus pada performa.",

    defaultCondition: 92,
    defaultConditionTier: "EXCELLENT",

    performance: {
      handling: 2,
      reliability: 1,
    },

    physical: {
      weightKg: 3.5,
      size: "LARGE",
    },

    economy: {
      baseValue: 2_500_000,
      minimumValue: 1_700_000,
      maximumValue: 3_750_000,
      marketVolatility: 0.2,
      availability: "UNCOMMON",
    },

    compatibility: {
      motorClasses: [
        "UNDER_110",
        "UNDER_125",
        "UNDER_150",
        "OPEN",
      ],
    },

    requirements: {
      minimumGarageLevel: 2,
      minimumReputation: 10,
    },

    marketSources: [
      "AFTERMARKET",
      "PROJECT",
      "USED",
    ],

    consumable: false,
    installTimeHours: 8,

    visual: {
      label: "BODY CUSTOM",
      accent: "IMPORTANT",
      icon: "toolbox",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* UTILITY / WORKSHOP                                                      */
  /* ---------------------------------------------------------------------- */

  {
    id: "toolkit-basic",

    name: "Basic Workshop Toolkit",
    shortName: "TOOLKIT BASIC",
    brand: "BENGKEL",

    category: "UTILITY",
    tier: "BASIC",

    description:
      "Perlengkapan alat kerja dasar untuk mempercepat pekerjaan ringan di workshop.",

    defaultCondition: 95,
    defaultConditionTier: "EXCELLENT",

    performance: {
      reliability: 0,
    },

    economy: {
      baseValue: 850_000,
      minimumValue: 600_000,
      maximumValue: 1_150_000,
      marketVolatility: 0.08,
      availability: "COMMON",
    },

    compatibility: {},

    requirements: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
    },

    marketSources: [
      "STOCK",
      "AFTERMARKET",
      "USED",
    ],

    consumable: false,
    installTimeHours: 0,

    visual: {
      label: "TOOLS",
      accent: "NORMAL",
      icon: "toolbox",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Return all parts.
 *
 * Returns a fresh array to protect the catalog from accidental
 * push/splice/sort mutation by UI or game systems.
 */
export function getParts(): PartDefinition[] {
  return [...PARTS];
}

/**
 * Return one part by ID.
 */
export function getPartById(
  id: string,
): PartDefinition | undefined {
  return PARTS.find((part) => part.id === id);
}

/**
 * Return parts by category.
 */
export function getPartsByCategory(
  category: PartCategory,
): PartDefinition[] {
  return PARTS.filter(
    (part) => part.category === category,
  );
}

/**
 * Return parts by tier.
 */
export function getPartsByTier(
  tier: PartTier,
): PartDefinition[] {
  return PARTS.filter(
    (part) => part.tier === tier,
  );
}

/**
 * Return parts by source.
 */
export function getPartsBySource(
  source: PartSource,
): PartDefinition[] {
  return PARTS.filter((part) =>
    part.marketSources.includes(source),
  );
}

/**
 * Return all parts compatible with a motor class.
 */
export function getPartsForMotorClass(
  motorClass: string,
): PartDefinition[] {
  return PARTS.filter((part) => {
    const classes = part.compatibility.motorClasses;

    if (!classes || classes.length === 0) {
      return true;
    }

    return classes.includes(motorClass);
  });
}

/**
 * Return parts compatible with an engine type.
 */
export function getPartsForEngineType(
  engineType: string,
): PartDefinition[] {
  return PARTS.filter((part) => {
    const engineTypes = part.compatibility.engineTypes;

    if (!engineTypes || engineTypes.length === 0) {
      return true;
    }

    return engineTypes.includes(engineType);
  });
}

/**
 * Return parts that are normally available in the market.
 */
export function getMarketParts(): PartDefinition[] {
  return PARTS.filter(
    (part) => part.marketSources.length > 0,
  );
}

/**
 * Return consumable parts.
 */
export function getConsumableParts(): PartDefinition[] {
  return PARTS.filter((part) => part.consumable);
}

/**
 * Return reusable parts.
 */
export function getReusableParts(): PartDefinition[] {
  return PARTS.filter((part) => !part.consumable);
}

/**
 * Get base market value.
 */
export function getPartBaseValue(
  part: PartDefinition,
): number {
  return part.economy.baseValue;
}

/**
 * Get minimum market value.
 */
export function getPartMinimumValue(
  part: PartDefinition,
): number {
  return part.economy.minimumValue;
}

/**
 * Get maximum market value.
 */
export function getPartMaximumValue(
  part: PartDefinition,
): number {
  return part.economy.maximumValue;
}

/**
 * Get all numeric performance modifiers from a part.
 */
export function getPartModifiers(
  part: PartDefinition,
): PartPerformanceModifier {
  return { ...part.performance };
}

/**
 * Get one performance modifier safely.
 */
export function getPartModifier(
  part: PartDefinition,
  stat: PartStatKey,
): number {
  return part.performance[stat] ?? 0;
}

/**
 * Calculate absolute sum of positive performance modifiers.
 *
 * Useful for UI ordering / displaying "performance intensity".
 */
export function getPartPerformanceScore(
  part: PartDefinition,
): number {
  return Object.values(part.performance).reduce(
    (total, value) => total + Math.max(0, value ?? 0),
    0,
  );
}

/**
 * Calculate a simple total modifier.
 *
 * Positive and negative modifiers both count.
 */
export function getPartModifierTotal(
  part: PartDefinition,
): number {
  return Object.values(part.performance).reduce(
    (total, value) => total + (value ?? 0),
    0,
  );
}

/**
 * Human-readable part category.
 */
export function getPartCategoryLabel(
  category: PartCategory,
): string {
  const labels: Record<PartCategory, string> = {
    ENGINE: "ENGINE",
    FUEL: "FUEL",
    IGNITION: "IGNITION",
    TRANSMISSION: "TRANSMISSION",
    CLUTCH: "CLUTCH",
    DRIVETRAIN: "DRIVETRAIN",
    BRAKE: "BRAKE",
    SUSPENSION: "SUSPENSION",
    WHEEL: "WHEEL",
    TIRE: "TIRE",
    ELECTRICAL: "ELECTRICAL",
    EXHAUST: "EXHAUST",
    BODY: "BODY",
    FRAME: "FRAME",
    COOLING: "COOLING",
    UTILITY: "UTILITY",
  };

  return labels[category];
}

/**
 * Human-readable part tier.
 */
export function getPartTierLabel(
  tier: PartTier,
): string {
  const labels: Record<PartTier, string> = {
    STOCK: "STOCK",
    BASIC: "BASIC",
    STREET: "STREET",
    PERFORMANCE: "PERFORMANCE",
    RACE: "RACE",
    ELITE: "ELITE",
    LEGENDARY: "LEGENDARY",
  };

  return labels[tier];
}

/**
 * Human-readable condition tier.
 */
export function getPartConditionTierLabel(
  tier: PartConditionTier,
): string {
  const labels: Record<PartConditionTier, string> = {
    SALVAGE: "SALVAGE",
    POOR: "POOR",
    FAIR: "FAIR",
    GOOD: "GOOD",
    EXCELLENT: "EXCELLENT",
  };

  return labels[tier];
}

/**
 * Convert numeric condition into a condition tier.
 *
 * The same thresholds are used by motor condition logic.
 */
export function getPartConditionTier(
  condition: number,
): PartConditionTier {
  const value = Math.max(0, Math.min(100, condition));

  if (value < 20) return "SALVAGE";
  if (value < 40) return "POOR";
  if (value < 60) return "FAIR";
  if (value < 85) return "GOOD";

  return "EXCELLENT";
}

/**
 * Return IDs for parts required by another part.
 */
export function getRequiredPartIds(
  part: PartDefinition,
): string[] {
  return [...(part.requirements.requiredParts ?? [])];
}

/**
 * Check whether a part can be unlocked by garage/reputation.
 *
 * This does NOT check owned inventory or actual installation state.
 */
export function isPartUnlocked(
  part: PartDefinition,
  garageLevel: number,
  reputation: number,
): boolean {
  if (garageLevel < part.requirements.minimumGarageLevel) {
    return false;
  }

  if (reputation < part.requirements.minimumReputation) {
    return false;
  }

  return true;
}

/**
 * Return parts available for a player's garage / reputation.
 */
export function getUnlockedParts(
  garageLevel: number,
  reputation: number,
): PartDefinition[] {
  return PARTS.filter((part) =>
    isPartUnlocked(
      part,
      garageLevel,
      reputation,
    ),
  );
}

/**
 * Check whether a part is compatible with a motor definition-like object.
 *
 * This helper deliberately accepts only the relevant primitive fields
 * so data.ts does not need to import motor implementation details.
 */
export function isPartCompatible(
  part: PartDefinition,
  motor: {
    id: string;
    class: string;
    category: string;
    engineType: string;
  },
): boolean {
  const compatibility = part.compatibility;

  if (
    compatibility.requiredMotorIds &&
    compatibility.requiredMotorIds.length > 0 &&
    !compatibility.requiredMotorIds.includes(motor.id)
  ) {
    return false;
  }

  if (
    compatibility.motorClasses &&
    compatibility.motorClasses.length > 0 &&
    !compatibility.motorClasses.includes(motor.class)
  ) {
    return false;
  }

  if (
    compatibility.motorCategories &&
    compatibility.motorCategories.length > 0 &&
    !compatibility.motorCategories.includes(motor.category)
  ) {
    return false;
  }

  if (
    compatibility.engineTypes &&
    compatibility.engineTypes.length > 0 &&
    !compatibility.engineTypes.includes(motor.engineType)
  ) {
    return false;
  }

  return true;
}

/**
 * Return parts compatible with a specific motor.
 */
export function getPartsForMotor(
  motor: {
    id: string;
    class: string;
    category: string;
    engineType: string;
  },
): PartDefinition[] {
  return PARTS.filter((part) =>
    isPartCompatible(part, motor),
  );
}

/**
 * Return the strongest part available for a category.
 *
 * "Strongest" here means total positive modifier,
 * not necessarily highest economic value.
 */
export function getBestPartForCategory(
  category: PartCategory,
  garageLevel = Number.MAX_SAFE_INTEGER,
  reputation = Number.MAX_SAFE_INTEGER,
): PartDefinition | undefined {
  const candidates = PARTS
    .filter((part) => part.category === category)
    .filter((part) =>
      isPartUnlocked(
        part,
        garageLevel,
        reputation,
      ),
    );

  return candidates.sort(
    (a, b) =>
      getPartPerformanceScore(b) -
      getPartPerformanceScore(a),
  )[0];
}

/**
 * Return all categories represented by the catalog.
 */
export function getPartCategories(): PartCategory[] {
  return [
    ...new Set(
      PARTS.map((part) => part.category),
    ),
  ];
}

/**
 * Return all tiers represented by the catalog.
 */
export function getPartTiers(): PartTier[] {
  return [
    ...new Set(
      PARTS.map((part) => part.tier),
    ),
  ];
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate static parts catalog.
 *
 * Useful in development/tests.
 */
export function validatePartCatalog(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const part of PARTS) {
    /* Duplicate IDs */
    if (ids.has(part.id)) {
      errors.push(`Duplicate part ID: ${part.id}`);
    }

    ids.add(part.id);

    /* Required text */
    if (!part.name.trim()) {
      errors.push(`Part ${part.id}: missing name`);
    }

    if (!part.shortName.trim()) {
      errors.push(`Part ${part.id}: missing shortName`);
    }

    if (!part.brand.trim()) {
      errors.push(`Part ${part.id}: missing brand`);
    }

    if (!part.description.trim()) {
      errors.push(`Part ${part.id}: missing description`);
    }

    /* Condition */
    if (
      part.defaultCondition < 0 ||
      part.defaultCondition > 100
    ) {
      errors.push(
        `Part ${part.id}: defaultCondition must be 0-100`,
      );
    }

    /* Economy */
    const {
      baseValue,
      minimumValue,
      maximumValue,
      marketVolatility,
    } = part.economy;

    if (baseValue < 0) {
      errors.push(
        `Part ${part.id}: baseValue cannot be negative`,
      );
    }

    if (minimumValue < 0) {
      errors.push(
        `Part ${part.id}: minimumValue cannot be negative`,
      );
    }

    if (maximumValue < 0) {
      errors.push(
        `Part ${part.id}: maximumValue cannot be negative`,
      );
    }

    if (
      minimumValue > baseValue ||
      baseValue > maximumValue
    ) {
      errors.push(
        `Part ${part.id}: minimumValue <= baseValue <= maximumValue violated`,
      );
    }

    if (
      marketVolatility < 0 ||
      marketVolatility > 1
    ) {
      errors.push(
        `Part ${part.id}: marketVolatility must be 0-1`,
      );
    }

    /* Requirements */
    if (part.requirements.minimumGarageLevel < 0) {
      errors.push(
        `Part ${part.id}: minimumGarageLevel cannot be negative`,
      );
    }

    if (part.requirements.minimumReputation < 0) {
      errors.push(
        `Part ${part.id}: minimumReputation cannot be negative`,
      );
    }

    /* Installation */
    if (part.installTimeHours < 0) {
      errors.push(
        `Part ${part.id}: installTimeHours cannot be negative`,
      );
    }

    /* Required part IDs */
    for (const requiredPartId of
      part.requirements.requiredParts ?? []) {
      if (!ids.has(requiredPartId)) {
        /*
         * Do not treat this as immediately invalid during a single-pass
         * validation because the required part may appear later.
         * It is checked again below after collecting all IDs.
         */
      }
    }
  }

  /* Check all required part references after IDs are collected. */
  for (const part of PARTS) {
    for (const requiredPartId of
      part.requirements.requiredParts ?? []) {
      if (!ids.has(requiredPartId)) {
        errors.push(
          `Part ${part.id}: missing required part ${requiredPartId}`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

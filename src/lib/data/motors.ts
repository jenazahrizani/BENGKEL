/**
 * BENGKEL MALAM
 * MOTOR / MASTER CATALOG
 *
 * ------------------------------------------------------------------
 * PURPOSE
 * ------------------------------------------------------------------
 * Static master data for every motorcycle available in the game.
 *
 * This file is the authoritative catalog for motorcycle definitions.
 *
 * IMPORTANT:
 * - NO localStorage
 * - NO GameState mutation
 * - NO player inventory
 * - NO buying / selling logic
 * - NO repair logic
 * - NO part installation
 * - NO race simulation
 *
 * Gameplay behavior belongs in:
 *
 *   src/lib/game/motor.ts
 *   src/lib/game/parts.ts
 *   src/lib/game/market.ts
 *   src/lib/game/race.ts
 *   src/lib/save.ts
 *
 * ------------------------------------------------------------------
 * ARCHITECTURE
 * ------------------------------------------------------------------
 *
 * motors.ts
 *      ↓
 * game/motor.ts
 *      ↓
 * PlayerMotor instance
 *      ↓
 * GameState
 *      ↓
 * save.ts
 *      ↓
 * localStorage
 *
 * A motorcycle in this file is a catalog definition.
 *
 * A motorcycle owned by the player MUST be represented by a separate
 * runtime instance stored in GameState.
 */

/* ================================================================
   TYPES
   ================================================================ */

export type MotorConditionTier =
  | "SALVAGE"
  | "POOR"
  | "FAIR"
  | "GOOD"
  | "EXCELLENT";

export type MotorSource =
  | "STOCK"
  | "USED"
  | "PROJECT"
  | "SALVAGE"
  | "SPECIAL";

export type MotorClass =
  | "UNDER_110"
  | "UNDER_125"
  | "UNDER_150"
  | "OPEN";

export type MotorCategory =
  | "UNDERBONE"
  | "CUB"
  | "SPORT"
  | "NAKED"
  | "SCOOTER"
  | "CLASSIC";

export type MotorEngineType =
  | "2T"
  | "4T"
  | "ELECTRIC";

export type MotorDriveType =
  | "CHAIN"
  | "BELT"
  | "HUB";

export type MotorAvailability =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "VERY_RARE"
  | "LEGENDARY";

export interface MotorBaseStats {
  power: number;
  acceleration: number;
  grip: number;
  reliability: number;
}

export interface MotorPhysicalStats {
  engineCc: number;
  weightKg: number;
  fuelCapacity: number;
  gearCount: number;
}

export interface MotorPerformanceProfile {
  topSpeed: number;
  launch: number;
  braking: number;
  handling: number;
}

export interface MotorEconomy {

  /**
   * Reference price of a stock unit in healthy condition.
   */
  baseValue: number;

  /**
   * Suggested minimum market value.
   */
  minimumValue: number;

  /**
   * Suggested maximum market value before modifications.
   */
  maximumValue: number;

  /**
   * Approximate market volatility.
   *
   * 0.00 = stable
   * 1.00 = highly volatile
   */
  marketVolatility: number;

  /**
   * General difficulty of finding this unit.
   */
  availability: MotorAvailability;
}

export interface MotorRestrictions {
  minimumGarageLevel: number;
  minimumReputation: number;

  eligibleRaceClasses: MotorClass[];

  /**
   * Some catalog units may have explicit requirements.
   */
  requiredParts?: string[];
}

export interface MotorDefinition {
  id: string;

  brand: string;
  name: string;

  /**
   * Short display name used in compact UI.
   */
  shortName: string;

  year: number;

  category: MotorCategory;
  engineType: MotorEngineType;
  driveType: MotorDriveType;

  class: MotorClass;

  description: string;

  /**
   * Base factory condition for a newly generated stock unit.
   */
  factoryCondition: number;

  /**
   * Catalog-level condition tier.
   */
  defaultConditionTier: MotorConditionTier;

  /**
   * Factory baseline stats.
   *
   * These values MUST remain immutable.
   */
  baseStats: MotorBaseStats;

  /**
   * Basic physical specifications.
   */
  physical: MotorPhysicalStats;

  /**
   * Additional performance values used by race calculations.
   */
  performance: MotorPerformanceProfile;

  /**
   * Economic reference values.
   */
  economy: MotorEconomy;

  /**
   * Progression restrictions.
   */
  restrictions: MotorRestrictions;

  /**
   * Which market pools may generate this motorcycle.
   */
  marketSources: MotorSource[];

  /**
   * Visual / design metadata useful for the UI.
   */
  visual: {
    primaryLabel: string;
    secondaryLabel: string;
    silhouette: "LIGHT" | "STANDARD" | "HEAVY";
  };
}


/* ================================================================
   MOTOR CATALOG
   ================================================================ */

export const MOTORS: MotorDefinition[] = [

  /* ================================================================
     UNDER 110
     ================================================================ */

  {
    id: "nusa-100",

    brand: "NUSA",
    name: "NUSA 100",
    shortName: "NUSA 100",

    year: 2016,

    category: "UNDERBONE",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_110",

    description:
      "Motor ringan dengan karakter jinak dan biaya perawatan rendah. Cocok sebagai unit awal untuk membangun garage.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 34,
      acceleration: 39,
      grip: 43,
      reliability: 85,
    },

    physical: {
      engineCc: 100,
      weightKg: 96,
      fuelCapacity: 4.0,
      gearCount: 4,
    },

    performance: {
      topSpeed: 86,
      launch: 61,
      braking: 67,
      handling: 72,
    },

    economy: {
      baseValue: 9500000,
      minimumValue: 4000000,
      maximumValue: 14500000,
      marketVolatility: 0.12,
      availability: "COMMON",
    },

    restrictions: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
      eligibleRaceClasses: [
        "UNDER_110",
        "UNDER_125",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "NUSA",
      secondaryLabel: "100",
      silhouette: "LIGHT",
    },
  },


  {
    id: "garuda-105",

    brand: "GARUDA",
    name: "GARUDA 105",
    shortName: "GARUDA 105",

    year: 2017,

    category: "CUB",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_110",

    description:
      "Basis motor sederhana dengan mesin yang cukup kuat dan reliability tinggi. Sangat mudah dijadikan project street.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 37,
      acceleration: 42,
      grip: 41,
      reliability: 88,
    },

    physical: {
      engineCc: 105,
      weightKg: 99,
      fuelCapacity: 4.2,
      gearCount: 4,
    },

    performance: {
      topSpeed: 89,
      launch: 64,
      braking: 65,
      handling: 69,
    },

    economy: {
      baseValue: 10800000,
      minimumValue: 4500000,
      maximumValue: 15800000,
      marketVolatility: 0.14,
      availability: "COMMON",
    },

    restrictions: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
      eligibleRaceClasses: [
        "UNDER_110",
        "UNDER_125",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "GARUDA",
      secondaryLabel: "105",
      silhouette: "LIGHT",
    },
  },


  /* ================================================================
     UNDER 125
     ================================================================ */

  {
    id: "nusa-125",

    brand: "NUSA",
    name: "NUSA 125",
    shortName: "NUSA 125",

    year: 2018,

    category: "UNDERBONE",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_125",

    description:
      "Basis motor yang seimbang untuk street build. Bobot ringan, respons cukup baik, dan reliability cocok untuk garage awal.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 42,
      acceleration: 47,
      grip: 44,
      reliability: 78,
    },

    physical: {
      engineCc: 125,
      weightKg: 101,
      fuelCapacity: 4.5,
      gearCount: 4,
    },

    performance: {
      topSpeed: 98,
      launch: 69,
      braking: 70,
      handling: 74,
    },

    economy: {
      baseValue: 18500000,
      minimumValue: 8500000,
      maximumValue: 26500000,
      marketVolatility: 0.18,
      availability: "COMMON",
    },

    restrictions: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
      eligibleRaceClasses: [
        "UNDER_125",
        "UNDER_150",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "NUSA",
      secondaryLabel: "125",
      silhouette: "LIGHT",
    },
  },


  {
    id: "garuda-125",

    brand: "GARUDA",
    name: "GARUDA 125",
    shortName: "GARUDA 125",

    year: 2019,

    category: "UNDERBONE",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_125",

    description:
      "Motor underbone dengan karakter lebih agresif daripada NUSA 125. Basis menarik untuk acceleration-focused build.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 46,
      acceleration: 51,
      grip: 42,
      reliability: 74,
    },

    physical: {
      engineCc: 125,
      weightKg: 103,
      fuelCapacity: 4.6,
      gearCount: 4,
    },

    performance: {
      topSpeed: 101,
      launch: 73,
      braking: 68,
      handling: 71,
    },

    economy: {
      baseValue: 19800000,
      minimumValue: 9000000,
      maximumValue: 28500000,
      marketVolatility: 0.2,
      availability: "UNCOMMON",
    },

    restrictions: {
      minimumGarageLevel: 1,
      minimumReputation: 8,
      eligibleRaceClasses: [
        "UNDER_125",
        "UNDER_150",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "GARUDA",
      secondaryLabel: "125",
      silhouette: "LIGHT",
    },
  },


  {
    id: "satria-125",

    brand: "SATRIA",
    name: "SATRIA 125",
    shortName: "SATRIA 125",

    year: 2020,

    category: "SPORT",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_125",

    description:
      "Motor ringan dengan karakter lebih tajam. Menawarkan power dan top speed yang lebih baik dengan kebutuhan tuning lebih tinggi.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 51,
      acceleration: 50,
      grip: 51,
      reliability: 68,
    },

    physical: {
      engineCc: 125,
      weightKg: 108,
      fuelCapacity: 5.0,
      gearCount: 5,
    },

    performance: {
      topSpeed: 108,
      launch: 70,
      braking: 75,
      handling: 79,
    },

    economy: {
      baseValue: 23500000,
      minimumValue: 11000000,
      maximumValue: 34000000,
      marketVolatility: 0.24,
      availability: "UNCOMMON",
    },

    restrictions: {
      minimumGarageLevel: 2,
      minimumReputation: 20,
      eligibleRaceClasses: [
        "UNDER_125",
        "UNDER_150",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
    ],

    visual: {
      primaryLabel: "SATRIA",
      secondaryLabel: "125",
      silhouette: "LIGHT",
    },
  },


  /* ================================================================
     UNDER 150
     ================================================================ */

  {
    id: "nusa-135",

    brand: "NUSA",
    name: "NUSA 135",
    shortName: "NUSA 135",

    year: 2019,

    category: "UNDERBONE",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_150",

    description:
      "Upgrade dari basis 125 dengan power lebih besar tanpa meninggalkan karakter ringan yang mudah dikontrol.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 54,
      acceleration: 56,
      grip: 49,
      reliability: 75,
    },

    physical: {
      engineCc: 135,
      weightKg: 106,
      fuelCapacity: 4.8,
      gearCount: 5,
    },

    performance: {
      topSpeed: 116,
      launch: 76,
      braking: 74,
      handling: 76,
    },

    economy: {
      baseValue: 26500000,
      minimumValue: 12500000,
      maximumValue: 39000000,
      marketVolatility: 0.23,
      availability: "UNCOMMON",
    },

    restrictions: {
      minimumGarageLevel: 2,
      minimumReputation: 25,
      eligibleRaceClasses: [
        "UNDER_150",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "NUSA",
      secondaryLabel: "135",
      silhouette: "LIGHT",
    },
  },


  {
    id: "garuda-150",

    brand: "GARUDA",
    name: "GARUDA 150",
    shortName: "GARUDA 150",

    year: 2020,

    category: "SPORT",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_150",

    description:
      "Basis sport ringan dengan power kuat dan grip lebih tinggi. Cocok untuk race dengan tuntutan speed dan kontrol seimbang.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 63,
      acceleration: 61,
      grip: 58,
      reliability: 71,
    },

    physical: {
      engineCc: 150,
      weightKg: 116,
      fuelCapacity: 6.0,
      gearCount: 6,
    },

    performance: {
      topSpeed: 128,
      launch: 78,
      braking: 82,
      handling: 84,
    },

    economy: {
      baseValue: 37500000,
      minimumValue: 17000000,
      maximumValue: 54000000,
      marketVolatility: 0.27,
      availability: "UNCOMMON",
    },

    restrictions: {
      minimumGarageLevel: 2,
      minimumReputation: 40,
      eligibleRaceClasses: [
        "UNDER_150",
        "OPEN",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
    ],

    visual: {
      primaryLabel: "GARUDA",
      secondaryLabel: "150",
      silhouette: "STANDARD",
    },
  },


  {
    id: "elang-150",

    brand: "ELANG",
    name: "ELANG 150",
    shortName: "ELANG 150",

    year: 2021,

    category: "NAKED",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_150",

    description:
      "Naked bike dengan karakter torsi kuat dan chassis stabil. Lebih berat tetapi sangat usable untuk street-oriented build.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 61,
      acceleration: 57,
      grip: 64,
      reliability: 79,
    },

    physical: {
      engineCc: 150,
      weightKg: 126,
      fuelCapacity: 10.0,
      gearCount: 6,
    },

    performance: {
      topSpeed: 124,
      launch: 75,
      braking: 84,
      handling: 88,
    },

    economy: {
      baseValue: 42000000,
      minimumValue: 19000000,
      maximumValue: 60000000,
      marketVolatility: 0.21,
      availability: "UNCOMMON",
    },

    restrictions: {
      minimumGarageLevel: 3,
      minimumReputation: 55,
      eligibleRaceClasses: [
        "UNDER_150",
        "OPEN",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
    ],

    visual: {
      primaryLabel: "ELANG",
      secondaryLabel: "150",
      silhouette: "STANDARD",
    },
  },


  /* ================================================================
     OPEN CLASS
     ================================================================ */

  {
    id: "garuda-200",

    brand: "GARUDA",
    name: "GARUDA 200",
    shortName: "GARUDA 200",

    year: 2021,

    category: "SPORT",
    engineType: "4T",
    driveType: "CHAIN",

    class: "OPEN",

    description:
      "Motor sport kelas atas dengan power besar dan chassis kompetitif. Membutuhkan build, tire setup, dan joki yang matang.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 76,
      acceleration: 72,
      grip: 71,
      reliability: 69,
    },

    physical: {
      engineCc: 200,
      weightKg: 133,
      fuelCapacity: 11.0,
      gearCount: 6,
    },

    performance: {
      topSpeed: 151,
      launch: 84,
      braking: 89,
      handling: 91,
    },

    economy: {
      baseValue: 65000000,
      minimumValue: 29000000,
      maximumValue: 92000000,
      marketVolatility: 0.31,
      availability: "RARE",
    },

    restrictions: {
      minimumGarageLevel: 3,
      minimumReputation: 80,
      eligibleRaceClasses: [
        "UNDER_150",
        "OPEN",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
    ],

    visual: {
      primaryLabel: "GARUDA",
      secondaryLabel: "200",
      silhouette: "STANDARD",
    },
  },


  {
    id: "elang-250",

    brand: "ELANG",
    name: "ELANG 250",
    shortName: "ELANG 250",

    year: 2022,

    category: "SPORT",
    engineType: "4T",
    driveType: "CHAIN",

    class: "OPEN",

    description:
      "Platform performa tinggi dengan power besar, chassis stabil, dan ruang tuning yang luas untuk build kompetitif.",

    factoryCondition: 100,

    defaultConditionTier: "EXCELLENT",

    baseStats: {
      power: 84,
      acceleration: 78,
      grip: 79,
      reliability: 73,
    },

    physical: {
      engineCc: 250,
      weightKg: 145,
      fuelCapacity: 14.0,
      gearCount: 6,
    },

    performance: {
      topSpeed: 171,
      launch: 88,
      braking: 93,
      handling: 94,
    },

    economy: {
      baseValue: 92500000,
      minimumValue: 42000000,
      maximumValue: 132000000,
      marketVolatility: 0.34,
      availability: "RARE",
    },

    restrictions: {
      minimumGarageLevel: 4,
      minimumReputation: 120,
      eligibleRaceClasses: [
        "OPEN",
      ],
    },

    marketSources: [
      "STOCK",
      "USED",
      "PROJECT",
    ],

    visual: {
      primaryLabel: "ELANG",
      secondaryLabel: "250",
      silhouette: "HEAVY",
    },
  },


  /* ================================================================
     SPECIAL / PROJECT PLATFORM
     ================================================================ */

  {
    id: "jawa-110-classic",

    brand: "JAWA",
    name: "JAWA 110 CLASSIC",
    shortName: "JAWA 110",

    year: 1998,

    category: "CLASSIC",
    engineType: "2T",
    driveType: "CHAIN",

    class: "UNDER_125",

    description:
      "Motor tua dengan karakter unik. Nilai kolektor rendah tetapi memiliki potensi build yang berbeda dari platform modern.",

    factoryCondition: 100,

    defaultConditionTier: "FAIR",

    baseStats: {
      power: 39,
      acceleration: 44,
      grip: 35,
      reliability: 51,
    },

    physical: {
      engineCc: 110,
      weightKg: 108,
      fuelCapacity: 5.0,
      gearCount: 4,
    },

    performance: {
      topSpeed: 91,
      launch: 67,
      braking: 54,
      handling: 58,
    },

    economy: {
      baseValue: 12500000,
      minimumValue: 3500000,
      maximumValue: 32000000,
      marketVolatility: 0.65,
      availability: "VERY_RARE",
    },

    restrictions: {
      minimumGarageLevel: 2,
      minimumReputation: 20,
      eligibleRaceClasses: [
        "UNDER_125",
      ],
    },

    marketSources: [
      "USED",
      "PROJECT",
      "SALVAGE",
      "SPECIAL",
    ],

    visual: {
      primaryLabel: "JAWA",
      secondaryLabel: "110",
      silhouette: "STANDARD",
    },
  },


  {
    id: "bali-project-125",

    brand: "BALI",
    name: "BALI PROJECT 125",
    shortName: "BALI 125",

    year: 2008,

    category: "CUB",
    engineType: "4T",
    driveType: "CHAIN",

    class: "UNDER_125",

    description:
      "Unit project tua yang populer di kalangan builder lokal. Kondisi awal biasanya buruk tetapi memiliki ruang modifikasi luas.",

    factoryCondition: 100,

    defaultConditionTier: "POOR",

    baseStats: {
      power: 31,
      acceleration: 35,
      grip: 38,
      reliability: 42,
    },

    physical: {
      engineCc: 125,
      weightKg: 104,
      fuelCapacity: 4.0,
      gearCount: 4,
    },

    performance: {
      topSpeed: 82,
      launch: 56,
      braking: 59,
      handling: 64,
    },

    economy: {
      baseValue: 8500000,
      minimumValue: 1800000,
      maximumValue: 28000000,
      marketVolatility: 0.58,
      availability: "RARE",
    },

    restrictions: {
      minimumGarageLevel: 1,
      minimumReputation: 0,
      eligibleRaceClasses: [
        "UNDER_125",
      ],
    },

    marketSources: [
      "USED",
      "PROJECT",
      "SALVAGE",
    ],

    visual: {
      primaryLabel: "BALI",
      secondaryLabel: "PROJECT",
      silhouette: "LIGHT",
    },
  },
];

/* ================================================================
   CONDITION HELPERS
   ================================================================ */

/**
 * Convert a numeric condition value into a readable condition tier.
 *
 * This is a pure helper. It does not modify the motor.
 */
export function getMotorConditionTier(
  condition: number
): MotorConditionTier {

  const value = Math.max(
    0,
    Math.min(100, condition)
  );

  if (value < 20) return "SALVAGE";
  if (value < 40) return "POOR";
  if (value < 60) return "FAIR";
  if (value < 85) return "GOOD";

  return "EXCELLENT";
}


/**
 * Find a motor by catalog id.
 */
export function getMotorById(
  id: string
): MotorDefinition | undefined {
  return MOTORS.find(
    (motor) => motor.id === id
  );
}


/**
 * Return the complete catalog.
 */
export function getMotors(): readonly MotorDefinition[] {
  return MOTORS;
}


/**
 * Return motors belonging to a class.
 */
export function getMotorsByClass(
  motorClass: MotorClass
): MotorDefinition[] {
  return MOTORS.filter(
    (motor) => motor.class === motorClass
  );
}


/**
 * Return motors by category.
 */
export function getMotorsByCategory(
  category: MotorCategory
): MotorDefinition[] {
  return MOTORS.filter(
    (motor) => motor.category === category
  );
}


/**
 * Return motors that may appear in a specific market source.
 */
export function getMotorsBySource(
  source: MotorSource
): MotorDefinition[] {
  return MOTORS.filter(
    (motor) =>
      motor.marketSources.includes(source)
  );
}


/**
 * Return motors available for a particular race class.
 */
export function getRaceEligibleMotors(
  raceClass: MotorClass
): MotorDefinition[] {
  return MOTORS.filter(
    (motor) =>
      motor.restrictions.eligibleRaceClasses.includes(
        raceClass
      )
  );
}


/**
 * Check whether a motor is unlocked by the player's
 * garage level and reputation.
 *
 * This only evaluates catalog requirements.
 */
export function isMotorUnlocked(
  motor: MotorDefinition,
  garageLevel: number,
  reputation: number
): boolean {

  return (
    garageLevel >=
      motor.restrictions.minimumGarageLevel &&
    reputation >=
      motor.restrictions.minimumReputation
  );
}


/**
 * Return motors unlocked for the player.
 */
export function getUnlockedMotors(
  garageLevel: number,
  reputation: number
): MotorDefinition[] {

  return MOTORS.filter(
    (motor) =>
      isMotorUnlocked(
        motor,
        garageLevel,
        reputation
      )
  );
}


/**
 * Return motors that can currently be generated
 * from a specific market source.
 */
export function getAvailableMarketMotors(
  source: MotorSource,
  garageLevel: number,
  reputation: number
): MotorDefinition[] {

  return MOTORS.filter((motor) => {

    const sourceAllowed =
      motor.marketSources.includes(source);

    const unlocked =
      isMotorUnlocked(
        motor,
        garageLevel,
        reputation
      );

    return sourceAllowed && unlocked;
  });
}


/* ================================================================
   STAT HELPERS
   ================================================================ */

/**
 * Calculate average base stat.
 */
export function getMotorAverageStat(
  motor: MotorDefinition
): number {

  const stats = Object.values(
    motor.baseStats
  );

  if (stats.length === 0) {
    return 0;
  }

  const total = stats.reduce(
    (sum, value) =>
      sum + value,
    0
  );

  return Math.round(
    total / stats.length
  );
}


/**
 * Return the strongest base stat.
 */
export function getMotorPrimaryStat(
  motor: MotorDefinition
): keyof MotorBaseStats {

  const entries = Object.entries(
    motor.baseStats
  ) as [
    keyof MotorBaseStats,
    number
  ][];

  return entries.reduce(
    (best, current) =>
      current[1] > best[1]
        ? current
        : best
  )[0];
}


/**
 * Get a compact display name.
 */
export function getMotorDisplayName(
  motor: MotorDefinition
): string {

  return `${motor.brand} ${motor.shortName
    .replace(`${motor.brand} `, "")
    .trim()}`;
}


/**
 * Return a normalized catalog value.
 *
 * Gameplay valuation must still be handled by game/motor.ts.
 */
export function getMotorBaseValue(
  motor: MotorDefinition
): number {

  return motor.economy.baseValue;
}


/* ================================================================
   CLASS HELPERS
   ================================================================ */

/**
 * Return all motor classes supported by the catalog.
 */
export function getMotorClasses(): MotorClass[] {

  return [
    "UNDER_110",
    "UNDER_125",
    "UNDER_150",
    "OPEN",
  ];
}


/**
 * Get human-readable class label.
 */
export function getMotorClassLabel(
  motorClass: MotorClass
): string {

  switch (motorClass) {

    case "UNDER_110":
      return "UNDER 110";

    case "UNDER_125":
      return "UNDER 125";

    case "UNDER_150":
      return "UNDER 150";

    case "OPEN":
      return "OPEN";

    default:
      return motorClass;
  }
}


/* ================================================================
   CATALOG VALIDATION
   ================================================================ */

/**
 * Development helper used to detect duplicate IDs.
 *
 * Throws only when called manually.
 * It does not execute automatically in production.
 */
export function validateMotorCatalog(): void {

  const ids = new Set<string>();

  for (const motor of MOTORS) {

    if (ids.has(motor.id)) {
      throw new Error(
        `[MOTORS] Duplicate motor id: ${motor.id}`
      );
    }

    ids.add(motor.id);

    const values = Object.values(
      motor.baseStats
    );

    for (const value of values) {

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      ) {
        throw new Error(
          `[MOTORS] Invalid stat in ${motor.id}`
        );
      }
    }

    if (
      motor.economy.baseValue < 0 ||
      motor.economy.minimumValue < 0 ||
      motor.economy.maximumValue < 0
    ) {
      throw new Error(
        `[MOTORS] Invalid economy values in ${motor.id}`
      );
    }

    if (
      motor.economy.minimumValue >
      motor.economy.baseValue
    ) {
      throw new Error(
        `[MOTORS] Minimum value exceeds base value in ${motor.id}`
      );
    }

    if (
      motor.economy.baseValue >
      motor.economy.maximumValue
    ) {
      throw new Error(
        `[MOTORS] Base value exceeds maximum value in ${motor.id}`
      );
    }
  }
}
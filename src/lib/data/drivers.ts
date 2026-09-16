/**
 * BENGKEL MALAM
 * DRIVER / JOKI CATALOG
 *
 * ------------------------------------------------------------------
 * PURPOSE
 * ------------------------------------------------------------------
 * Static master data for every driver available in the game.
 *
 * IMPORTANT:
 * - This file does NOT read from localStorage.
 * - This file does NOT mutate player state.
 * - This file does NOT handle contracts, salary payments, fatigue,
 *   pressure, progression, or recruitment.
 *
 * Those behaviors belong in:
 *
 *   src/lib/game/team.ts
 *   src/lib/save.ts
 *   src/lib/game/state.ts
 *
 * ------------------------------------------------------------------
 * ARCHITECTURE
 * ------------------------------------------------------------------
 *
 * drivers.ts
 *      ↓
 * game/team.ts
 *      ↓
 * GameState
 *      ↓
 * save.ts
 *      ↓
 * localStorage
 *
 * The catalog remains the source of truth for driver definitions,
 * while the player-owned driver instance is stored in GameState.
 */

export type DriverTier =
  | "ROOKIE"
  | "LOCAL"
  | "KNOWN"
  | "PRO"
  | "ELITE";

export type DriverStyle =
  | "CONSISTENT"
  | "AGGRESSIVE"
  | "TECHNICAL"
  | "BALANCED"
  | "SPRINTER"
  | "ENDURANCE";

export type DriverClass =
  | "UNDER_125"
  | "UNDER_150"
  | "OPEN";

export type DriverTrait =
  | "CONSISTENT"
  | "QUICK_START"
  | "SMOOTH_SHIFT"
  | "LATE_BRAKER"
  | "HOT_HEAD"
  | "CALM"
  | "RISK_TAKER"
  | "STREET_SPECIALIST"
  | "DRAG_SPECIALIST";

export interface DriverStats {
  reaction: number;
  launch: number;
  shifting: number;
  consistency: number;
  control: number;
  focus: number;
  aggression: number;
}

export interface DriverTraitDefinition {
  id: DriverTrait;
  name: string;
  description: string;

  modifiers?: {
    reaction?: number;
    launch?: number;
    shifting?: number;
    consistency?: number;
    control?: number;
    focus?: number;
    aggression?: number;

    raceVariance?: number;
    driverPressure?: number;
    motorWear?: number;
  };
}

export interface DriverDefinition {
  id: string;

  name: string;
  nickname: string;

  tier: DriverTier;
  style: DriverStyle;

  bio: string;

  /**
   * Classes this driver can legally enter.
   */
  eligibleClasses: DriverClass[];

  /**
   * Base attributes.
   * These values belong to the catalog and should never be mutated
   * directly during gameplay.
   */
  baseStats: DriverStats;

  /**
   * Primary trait.
   */
  trait: DriverTraitDefinition;

  /**
   * Economic data used by game/team.ts.
   */
  recruitmentCost: number;
  dailySalary: number;

  /**
   * Minimum garage/reputation requirement.
   */
  unlock: {
    garageLevel?: number;
    reputation?: number;
  };

  /**
   * Optional hiring metadata.
   */
  contract: {
    minimumDays: number;
    renewalMultiplier: number;
  };

  /**
   * Availability weight can later be used by market/team generation.
   */
  availabilityWeight: number;
}

/* ================================================================
   TRAITS
   ================================================================ */

export const DRIVER_TRAITS: Record<
  DriverTrait,
  DriverTraitDefinition
> = {
  CONSISTENT: {
    id: "CONSISTENT",
    name: "CONSISTENT",
    description:
      "Performa lebih stabil dan lebih sedikit terpengaruh variasi hasil.",
    modifiers: {
      consistency: 8,
      focus: 4,
      raceVariance: -0.08,
    },
  },

  QUICK_START: {
    id: "QUICK_START",
    name: "QUICK START",
    description:
      "Memiliki respons launch yang kuat dan cenderung mendapatkan start lebih bersih.",
    modifiers: {
      reaction: 4,
      launch: 9,
      raceVariance: 0.02,
    },
  },

  SMOOTH_SHIFT: {
    id: "SMOOTH_SHIFT",
    name: "SMOOTH SHIFT",
    description:
      "Perpindahan gigi lebih konsisten dan membantu menjaga momentum akselerasi.",
    modifiers: {
      shifting: 9,
      consistency: 4,
      motorWear: -0.04,
    },
  },

  LATE_BRAKER: {
    id: "LATE_BRAKER",
    name: "LATE BRAKER",
    description:
      "Berani menunda pengereman untuk mempertahankan kecepatan lebih tinggi.",
    modifiers: {
      control: 7,
      aggression: 6,
      raceVariance: 0.05,
    },
  },

  HOT_HEAD: {
    id: "HOT_HEAD",
    name: "HOT HEAD",
    description:
      "Sangat agresif dan dapat menghasilkan performa tinggi saat tekanan terkendali.",
    modifiers: {
      aggression: 10,
      launch: 4,
      focus: -6,
      raceVariance: 0.12,
      driverPressure: 0.12,
    },
  },

  CALM: {
    id: "CALM",
    name: "CALM",
    description:
      "Tetap tenang dalam situasi sulit dan cenderung menjaga performa tetap stabil.",
    modifiers: {
      focus: 9,
      control: 5,
      driverPressure: -0.1,
      raceVariance: -0.04,
    },
  },

  RISK_TAKER: {
    id: "RISK_TAKER",
    name: "RISK TAKER",
    description:
      "Mampu memanfaatkan setup agresif dengan konsekuensi variasi hasil yang lebih besar.",
    modifiers: {
      aggression: 8,
      reaction: 3,
      raceVariance: 0.14,
      driverPressure: 0.08,
    },
  },

  STREET_SPECIALIST: {
    id: "STREET_SPECIALIST",
    name: "STREET SPECIALIST",
    description:
      "Berpengalaman menghadapi kondisi street race dengan permukaan dan situasi yang tidak selalu ideal.",
    modifiers: {
      control: 7,
      focus: 6,
      consistency: 5,
      raceVariance: -0.03,
    },
  },

  DRAG_SPECIALIST: {
    id: "DRAG_SPECIALIST",
    name: "DRAG SPECIALIST",
    description:
      "Spesialis lintasan pendek dengan fokus utama pada launch dan akselerasi.",
    modifiers: {
      launch: 10,
      reaction: 6,
      shifting: 4,
      motorWear: 0.03,
    },
  },
};

/* ================================================================
   DRIVER CATALOG
   ================================================================ */

export const DRIVERS: DriverDefinition[] = [
  {
    id: "bimo-kilat",

    name: "BIMO",
    nickname: "KILAT",

    tier: "LOCAL",
    style: "CONSISTENT",

    bio:
      "Joki muda yang dikenal tenang saat start dan jarang membuat kesalahan besar. Cocok untuk garage yang sedang membangun fondasi.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
    ],

    baseStats: {
      reaction: 78,
      launch: 76,
      shifting: 71,
      consistency: 82,
      control: 74,
      focus: 80,
      aggression: 48,
    },

    trait: DRIVER_TRAITS.CONSISTENT,

    recruitmentCost: 1500000,
    dailySalary: 150000,

    unlock: {
      garageLevel: 1,
      reputation: 0,
    },

    contract: {
      minimumDays: 7,
      renewalMultiplier: 1.05,
    },

    availabilityWeight: 100,
  },

  {
    id: "adi-taring",

    name: "ADI",
    nickname: "TARING",

    tier: "ROOKIE",
    style: "AGGRESSIVE",

    bio:
      "Cepat saat launch dan tidak takut membuka throttle lebih awal. Hasilnya bisa sangat bagus, tetapi kesalahan juga lebih besar.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
    ],

    baseStats: {
      reaction: 71,
      launch: 84,
      shifting: 67,
      consistency: 61,
      control: 66,
      focus: 62,
      aggression: 79,
    },

    trait: DRIVER_TRAITS.QUICK_START,

    recruitmentCost: 1000000,
    dailySalary: 115000,

    unlock: {
      garageLevel: 1,
      reputation: 5,
    },

    contract: {
      minimumDays: 7,
      renewalMultiplier: 1.04,
    },

    availabilityWeight: 90,
  },

  {
    id: "raka-siku",

    name: "RAKA",
    nickname: "SIKU",

    tier: "LOCAL",
    style: "TECHNICAL",

    bio:
      "Joki teknis dengan kontrol yang rapi. Lebih nyaman mengandalkan setup motor daripada gaya balap ekstrem.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
    ],

    baseStats: {
      reaction: 73,
      launch: 68,
      shifting: 85,
      consistency: 78,
      control: 86,
      focus: 79,
      aggression: 39,
    },

    trait: DRIVER_TRAITS.SMOOTH_SHIFT,

    recruitmentCost: 2200000,
    dailySalary: 185000,

    unlock: {
      garageLevel: 1,
      reputation: 15,
    },

    contract: {
      minimumDays: 10,
      renewalMultiplier: 1.08,
    },

    availabilityWeight: 72,
  },

  {
    id: "yuda-bara",

    name: "YUDA",
    nickname: "BARA",

    tier: "LOCAL",
    style: "AGGRESSIVE",

    bio:
      "Gaya balap agresif dan berani mengambil risiko. Sangat menarik untuk event dengan reward tinggi.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 76,
      launch: 81,
      shifting: 72,
      consistency: 57,
      control: 70,
      focus: 58,
      aggression: 91,
    },

    trait: DRIVER_TRAITS.HOT_HEAD,

    recruitmentCost: 3200000,
    dailySalary: 250000,

    unlock: {
      garageLevel: 2,
      reputation: 25,
    },

    contract: {
      minimumDays: 10,
      renewalMultiplier: 1.1,
    },

    availabilityWeight: 55,
  },

  {
    id: "deni-santai",

    name: "DENI",
    nickname: "SANTAI",

    tier: "LOCAL",
    style: "BALANCED",

    bio:
      "Tidak terlalu ekstrem di satu sisi. Pilihan aman untuk garage yang membutuhkan joki serbaguna.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 69,
      launch: 68,
      shifting: 72,
      consistency: 76,
      control: 75,
      focus: 82,
      aggression: 46,
    },

    trait: DRIVER_TRAITS.CALM,

    recruitmentCost: 2700000,
    dailySalary: 210000,

    unlock: {
      garageLevel: 2,
      reputation: 30,
    },

    contract: {
      minimumDays: 10,
      renewalMultiplier: 1.07,
    },

    availabilityWeight: 62,
  },

  {
    id: "fajar-gaspol",

    name: "FAJAR",
    nickname: "GASPOL",

    tier: "KNOWN",
    style: "SPRINTER",

    bio:
      "Spesialis lintasan pendek. Launch dan akselerasi menjadi senjata utama sejak lampu start.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 86,
      launch: 89,
      shifting: 78,
      consistency: 68,
      control: 63,
      focus: 70,
      aggression: 83,
    },

    trait: DRIVER_TRAITS.DRAG_SPECIALIST,

    recruitmentCost: 4800000,
    dailySalary: 340000,

    unlock: {
      garageLevel: 2,
      reputation: 45,
    },

    contract: {
      minimumDays: 14,
      renewalMultiplier: 1.12,
    },

    availabilityWeight: 38,
  },

  {
    id: "eko-jalur",

    name: "EKO",
    nickname: "JALUR",

    tier: "KNOWN",
    style: "TECHNICAL",

    bio:
      "Pembalap yang kuat membaca jalur dan menjaga motor tetap terkendali ketika kondisi lintasan berubah.",

    eligibleClasses: [
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 81,
      launch: 70,
      shifting: 88,
      consistency: 84,
      control: 91,
      focus: 87,
      aggression: 54,
    },

    trait: DRIVER_TRAITS.STREET_SPECIALIST,

    recruitmentCost: 5600000,
    dailySalary: 385000,

    unlock: {
      garageLevel: 3,
      reputation: 60,
    },

    contract: {
      minimumDays: 14,
      renewalMultiplier: 1.12,
    },

    availabilityWeight: 28,
  },

  {
    id: "gilang-garis",

    name: "GILANG",
    nickname: "GARIS",

    tier: "PRO",
    style: "BALANCED",

    bio:
      "Joki berpengalaman dengan performa seimbang. Mampu beradaptasi terhadap setup motor dan jenis event.",

    eligibleClasses: [
      "UNDER_125",
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 88,
      launch: 82,
      shifting: 86,
      consistency: 88,
      control: 86,
      focus: 89,
      aggression: 66,
    },

    trait: DRIVER_TRAITS.CALM,

    recruitmentCost: 8500000,
    dailySalary: 550000,

    unlock: {
      garageLevel: 3,
      reputation: 80,
    },

    contract: {
      minimumDays: 21,
      renewalMultiplier: 1.15,
    },

    availabilityWeight: 16,
  },

  {
    id: "rangga-panas",

    name: "RANGGA",
    nickname: "PANAS",

    tier: "PRO",
    style: "AGGRESSIVE",

    bio:
      "Joki papan atas dengan output tinggi. Cocok untuk garage yang berani menjalankan setup agresif.",

    eligibleClasses: [
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 92,
      launch: 90,
      shifting: 83,
      consistency: 64,
      control: 78,
      focus: 73,
      aggression: 95,
    },

    trait: DRIVER_TRAITS.RISK_TAKER,

    recruitmentCost: 12000000,
    dailySalary: 720000,

    unlock: {
      garageLevel: 4,
      reputation: 110,
    },

    contract: {
      minimumDays: 21,
      renewalMultiplier: 1.18,
    },

    availabilityWeight: 9,
  },

  {
    id: "bayu-rantai",

    name: "BAYU",
    nickname: "RANTAI",

    tier: "ELITE",
    style: "TECHNICAL",

    bio:
      "Joki elite dengan kontrol, fokus, dan shifting yang sangat tinggi. Direkrut oleh garage yang sudah memiliki reputasi besar.",

    eligibleClasses: [
      "UNDER_150",
      "OPEN",
    ],

    baseStats: {
      reaction: 94,
      launch: 88,
      shifting: 96,
      consistency: 94,
      control: 95,
      focus: 96,
      aggression: 68,
    },

    trait: DRIVER_TRAITS.SMOOTH_SHIFT,

    recruitmentCost: 20000000,
    dailySalary: 1100000,

    unlock: {
      garageLevel: 5,
      reputation: 180,
    },

    contract: {
      minimumDays: 30,
      renewalMultiplier: 1.22,
    },

    availabilityWeight: 3,
  },
];

/* ================================================================
   LOOKUP HELPERS
   ================================================================ */

/**
 * Return every driver in the catalog.
 */
export function getDrivers(): readonly DriverDefinition[] {
  return DRIVERS;
}

/**
 * Find one driver by catalog id.
 */
export function getDriverById(
  id: string
): DriverDefinition | undefined {
  return DRIVERS.find((driver) => driver.id === id);
}

/**
 * Return drivers available for a race class.
 */
export function getDriversForClass(
  raceClass: DriverClass
): DriverDefinition[] {
  return DRIVERS.filter((driver) =>
    driver.eligibleClasses.includes(raceClass)
  );
}

/**
 * Return drivers that satisfy the basic unlock requirements.
 *
 * This function only evaluates catalog requirements.
 * It does not mutate player state.
 */
export function getUnlockedDrivers(
  garageLevel: number,
  reputation: number
): DriverDefinition[] {
  return DRIVERS.filter((driver) => {
    const requiredGarageLevel =
      driver.unlock.garageLevel ?? 1;

    const requiredReputation =
      driver.unlock.reputation ?? 0;

    return (
      garageLevel >= requiredGarageLevel &&
      reputation >= requiredReputation
    );
  });
}

/**
 * Return drivers that can be shown by a recruitment screen.
 */
export function getRecruitableDrivers(
  garageLevel: number,
  reputation: number
): DriverDefinition[] {
  return getUnlockedDrivers(
    garageLevel,
    reputation
  );
}

/**
 * Return trait definition for a driver.
 */
export function getDriverTrait(
  driver: DriverDefinition
): DriverTraitDefinition {
  return DRIVER_TRAITS[driver.trait.id];
}

/**
 * Calculate the static average of driver base stats.
 *
 * This is intentionally a pure catalog helper.
 * Gameplay modifiers belong to game/team.ts or game/race.ts.
 */
export function getDriverAverageStat(
  driver: DriverDefinition
): number {
  const stats = Object.values(driver.baseStats);

  if (stats.length === 0) return 0;

  const total = stats.reduce(
    (sum, value) => sum + value,
    0
  );

  return Math.round(total / stats.length);
}

/**
 * Get display-ready driver full name.
 *
 * Example:
 * BIMO "KILAT"
 */
export function getDriverDisplayName(
  driver: DriverDefinition
): string {
  return driver.nickname
    ? `${driver.name} "${driver.nickname}"`
    : driver.name;
}

/**
 * BENGKEL MALAM
 * Static Race / Event Catalog
 *
 * IMPORTANT:
 * - File ini hanya berisi DATA MASTER.
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan hasil race pemain.
 * - Tidak menyimpan championship points pemain.
 * - Tidak melakukan mutation terhadap GameState.
 *
 * Data mutable seperti:
 * - race history
 * - best time
 * - wins
 * - podiums
 * - entered event
 * - championship points
 * - cooldown
 *
 * harus berada di GameState / save state.
 */

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type RaceClass =
  | "UNDER_110"
  | "UNDER_125"
  | "UNDER_150"
  | "OPEN";

export type RaceType =
  | "DRAG"
  | "SPRINT"
  | "BRACKET"
  | "TIME_ATTACK"
  | "CHAMPIONSHIP"
  | "STREET";

export type RaceDifficulty =
  | "BEGINNER"
  | "NOVICE"
  | "INTERMEDIATE"
  | "HARD"
  | "PRO"
  | "ELITE";

export type RaceSurface =
  | "ASPHALT"
  | "CONCRETE"
  | "MIXED"
  | "STREET";

export type RaceVenueType =
  | "OFFICIAL_TRACK"
  | "LOCAL_TRACK"
  | "INDUSTRIAL"
  | "STREET"
  | "AIRSTRIP";

export type RaceWeather =
  | "CLEAR"
  | "CLOUDY"
  | "HOT"
  | "RAIN"
  | "VARIABLE";

export type RaceEntryRequirementType =
  | "GARAGE_LEVEL"
  | "REPUTATION"
  | "MOTOR_CLASS"
  | "MOTOR_CATEGORY"
  | "MOTOR_CONDITION"
  | "DRIVER_CLASS"
  | "DRIVER_LEVEL"
  | "TEAM_LEVEL"
  | "PART"
  | "LICENSE"
  | "CHAMPIONSHIP";

export type RaceRewardType =
  | "CASH"
  | "XP"
  | "REPUTATION"
  | "CHAMPIONSHIP_POINTS";

export type RaceRiskLevel =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export interface RaceDistance {
  meters: number;
  description: string;
}

export interface RaceReward {
  type: RaceRewardType;
  amount: number;
}

export interface RaceEntryRequirement {
  type: RaceEntryRequirementType;
  value: string | number;
}

export interface RacePrize {
  position: number;
  rewards: RaceReward[];
}

export interface RaceField {
  minimumDrivers: number;
  maximumDrivers: number;
}

export interface RaceSetup {
  /**
   * How strongly launch matters.
   * 0-100.
   */
  launchImportance: number;

  /**
   * How strongly acceleration matters.
   * 0-100.
   */
  accelerationImportance: number;

  /**
   * How strongly top speed matters.
   * 0-100.
   */
  topSpeedImportance: number;

  /**
   * How strongly braking matters.
   * 0-100.
   */
  brakingImportance: number;

  /**
   * How strongly handling matters.
   * 0-100.
   */
  handlingImportance: number;

  /**
   * How strongly driver reaction matters.
   * 0-100.
   */
  reactionImportance: number;

  /**
   * How strongly driver consistency matters.
   * 0-100.
   */
  consistencyImportance: number;

  /**
   * General mechanical reliability pressure.
   * 0-100.
   */
  reliabilityImportance: number;
}

export interface RaceConditions {
  surface: RaceSurface;
  venueType: RaceVenueType;
  weather: RaceWeather;

  /**
   * Grip modifier in percentage points.
   *
   * Example:
   * 0 = normal
   * -5 = slightly slippery
   * +5 = unusually grippy
   */
  gripModifier: number;

  /**
   * Reliability pressure in percentage points.
   *
   * Example:
   * 0 = normal
   * +10 = high mechanical stress
   */
  reliabilityPressure: number;

  /**
   * Indicates whether weather introduces variability.
   */
  variableConditions: boolean;
}

export interface RaceDefinition {
  id: string;

  name: string;
  shortName: string;

  type: RaceType;
  class: RaceClass;
  difficulty: RaceDifficulty;

  venue: string;
  location: string;

  description: string;
  note?: string;

  distance: RaceDistance;

  field: RaceField;

  conditions: RaceConditions;

  setup: RaceSetup;

  entryFee: number;

  rewards: RaceReward[];

  prizes: RacePrize[];

  requirements: RaceEntryRequirement[];

  /**
   * Weight used when selecting races for a dynamic race board.
   */
  generationWeight: number;

  /**
   * Whether the event can appear in the public race board.
   */
  publicBoard: boolean;

  /**
   * Whether this race belongs to an official championship.
   */
  championship: boolean;

  /**
   * Optional championship series ID.
   */
  championshipId?: string;

  /**
   * Number of races / rounds inside the series if applicable.
   */
  championshipRound?: number;

  /**
   * Suggested cooldown after completing the event.
   * This is base game data only.
   */
  cooldownHours: number;

  visual: {
    label: string;
    accent: "NORMAL" | "IMPORTANT" | "DANGER";
    icon:
      | "flag"
      | "timer"
      | "trophy"
      | "chart"
      | "helmet";
  };
}

/* -------------------------------------------------------------------------- */
/* STATIC RACE CATALOG                                                        */
/* -------------------------------------------------------------------------- */

export const RACES: RaceDefinition[] = [
  /* ---------------------------------------------------------------------- */
  /* UNDER 110                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "race-local-110-001",

    name: "Kuta 110 Night Drag",
    shortName: "KUTA 110",

    type: "DRAG",
    class: "UNDER_110",
    difficulty: "BEGINNER",

    venue: "Kuta Industrial Strip",
    location: "Kuta",

    description:
      "Balap malam kelas kecil untuk rider yang baru mulai masuk ke dunia race.",

    note:
      "Jarak pendek membuat launch dan reaction terasa sangat penting.",

    distance: {
      meters: 201,
      description: "201 METER",
    },

    field: {
      minimumDrivers: 4,
      maximumDrivers: 8,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "INDUSTRIAL",
      weather: "CLEAR",
      gripModifier: 0,
      reliabilityPressure: 5,
      variableConditions: false,
    },

    setup: {
      launchImportance: 90,
      accelerationImportance: 85,
      topSpeedImportance: 55,
      brakingImportance: 30,
      handlingImportance: 35,
      reactionImportance: 80,
      consistencyImportance: 60,
      reliabilityImportance: 55,
    },

    entryFee: 150_000,

    rewards: [
      {
        type: "CASH",
        amount: 250_000,
      },
      {
        type: "XP",
        amount: 25,
      },
      {
        type: "REPUTATION",
        amount: 2,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 600_000,
          },
          {
            type: "XP",
            amount: 60,
          },
          {
            type: "REPUTATION",
            amount: 3,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 400_000,
          },
          {
            type: "XP",
            amount: 40,
          },
          {
            type: "REPUTATION",
            amount: 2,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 275_000,
          },
          {
            type: "XP",
            amount: 30,
          },
          {
            type: "REPUTATION",
            amount: 1,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "REPUTATION",
        value: 0,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_110",
      },
      {
        type: "DRIVER_CLASS",
        value: "UNDER_125",
      },
    ],

    generationWeight: 100,
    publicBoard: true,
    championship: false,

    cooldownHours: 12,

    visual: {
      label: "NIGHT DRAG",
      accent: "NORMAL",
      icon: "flag",
    },
  },

  {
    id: "race-local-110-002",

    name: "Mengwi 110 Sprint",
    shortName: "MENGWI 110",

    type: "SPRINT",
    class: "UNDER_110",
    difficulty: "NOVICE",

    venue: "Mengwi Sprint Loop",
    location: "Mengwi",

    description:
      "Sprint kelas kecil yang memberi porsi lebih besar pada acceleration dan consistency.",

    note:
      "Lintasan sedikit lebih panjang dari event drag pemula.",

    distance: {
      meters: 402,
      description: "402 METER",
    },

    field: {
      minimumDrivers: 4,
      maximumDrivers: 10,
    },

    conditions: {
      surface: "CONCRETE",
      venueType: "LOCAL_TRACK",
      weather: "CLOUDY",
      gripModifier: -2,
      reliabilityPressure: 7,
      variableConditions: false,
    },

    setup: {
      launchImportance: 75,
      accelerationImportance: 90,
      topSpeedImportance: 70,
      brakingImportance: 45,
      handlingImportance: 50,
      reactionImportance: 70,
      consistencyImportance: 70,
      reliabilityImportance: 60,
    },

    entryFee: 200_000,

    rewards: [
      {
        type: "CASH",
        amount: 350_000,
      },
      {
        type: "XP",
        amount: 35,
      },
      {
        type: "REPUTATION",
        amount: 2,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 800_000,
          },
          {
            type: "XP",
            amount: 80,
          },
          {
            type: "REPUTATION",
            amount: 4,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 550_000,
          },
          {
            type: "XP",
            amount: 50,
          },
          {
            type: "REPUTATION",
            amount: 3,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 350_000,
          },
          {
            type: "XP",
            amount: 35,
          },
          {
            type: "REPUTATION",
            amount: 2,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "REPUTATION",
        value: 5,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_110",
      },
    ],

    generationWeight: 70,
    publicBoard: true,
    championship: false,

    cooldownHours: 18,

    visual: {
      label: "SPRINT",
      accent: "NORMAL",
      icon: "flag",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* UNDER 125                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "race-local-125-001",

    name: "Badung 125 Night Drag",
    shortName: "BADUNG 125",

    type: "DRAG",
    class: "UNDER_125",
    difficulty: "NOVICE",

    venue: "Badung Night Strip",
    location: "Badung",

    description:
      "Event drag kelas 125 yang menjadi pintu masuk utama ke kompetisi resmi.",

    note:
      "Launch, clutch control, dan consistency menjadi faktor penting.",

    distance: {
      meters: 201,
      description: "201 METER",
    },

    field: {
      minimumDrivers: 4,
      maximumDrivers: 12,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "INDUSTRIAL",
      weather: "CLEAR",
      gripModifier: 1,
      reliabilityPressure: 8,
      variableConditions: false,
    },

    setup: {
      launchImportance: 95,
      accelerationImportance: 88,
      topSpeedImportance: 60,
      brakingImportance: 25,
      handlingImportance: 30,
      reactionImportance: 90,
      consistencyImportance: 72,
      reliabilityImportance: 60,
    },

    entryFee: 300_000,

    rewards: [
      {
        type: "CASH",
        amount: 500_000,
      },
      {
        type: "XP",
        amount: 40,
      },
      {
        type: "REPUTATION",
        amount: 3,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 1_500_000,
          },
          {
            type: "XP",
            amount: 120,
          },
          {
            type: "REPUTATION",
            amount: 7,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 1_000_000,
          },
          {
            type: "XP",
            amount: 90,
          },
          {
            type: "REPUTATION",
            amount: 5,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 650_000,
          },
          {
            type: "XP",
            amount: 65,
          },
          {
            type: "REPUTATION",
            amount: 3,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "REPUTATION",
        value: 5,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "DRIVER_CLASS",
        value: "UNDER_125",
      },
    ],

    generationWeight: 100,
    publicBoard: true,
    championship: false,

    cooldownHours: 18,

    visual: {
      label: "125 NIGHT DRAG",
      accent: "IMPORTANT",
      icon: "flag",
    },
  },

  {
    id: "race-local-125-002",

    name: "Abiansemal 125 Time Attack",
    shortName: "ABIANSEMAL 125",

    type: "TIME_ATTACK",
    class: "UNDER_125",
    difficulty: "INTERMEDIATE",

    venue: "Abiansemal Test Route",
    location: "Abiansemal",

    description:
      "Time attack individual untuk menguji seberapa cepat setup motor tanpa harus melawan seluruh field secara langsung.",

    note:
      "Consistency dan handling memberi pengaruh lebih besar daripada event drag.",

    distance: {
      meters: 801,
      description: "801 METER",
    },

    field: {
      minimumDrivers: 4,
      maximumDrivers: 12,
    },

    conditions: {
      surface: "MIXED",
      venueType: "LOCAL_TRACK",
      weather: "CLOUDY",
      gripModifier: -4,
      reliabilityPressure: 10,
      variableConditions: true,
    },

    setup: {
      launchImportance: 60,
      accelerationImportance: 76,
      topSpeedImportance: 75,
      brakingImportance: 65,
      handlingImportance: 78,
      reactionImportance: 55,
      consistencyImportance: 88,
      reliabilityImportance: 72,
    },

    entryFee: 350_000,

    rewards: [
      {
        type: "CASH",
        amount: 700_000,
      },
      {
        type: "XP",
        amount: 60,
      },
      {
        type: "REPUTATION",
        amount: 4,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 1_900_000,
          },
          {
            type: "XP",
            amount: 150,
          },
          {
            type: "REPUTATION",
            amount: 8,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 1_250_000,
          },
          {
            type: "XP",
            amount: 100,
          },
          {
            type: "REPUTATION",
            amount: 5,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 800_000,
          },
          {
            type: "XP",
            amount: 75,
          },
          {
            type: "REPUTATION",
            amount: 4,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 12,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
    ],

    generationWeight: 65,
    publicBoard: true,
    championship: false,

    cooldownHours: 24,

    visual: {
      label: "TIME ATTACK",
      accent: "IMPORTANT",
      icon: "timer",
    },
  },

  {
    id: "race-official-125-001",

    name: "Badung Official 125",
    shortName: "BADUNG OFFICIAL 125",

    type: "BRACKET",
    class: "UNDER_125",
    difficulty: "HARD",

    venue: "Badung Official Circuit",
    location: "Badung",

    description:
      "Kompetisi bracket resmi kelas 125 dengan field yang lebih kuat dan biaya masuk lebih tinggi.",

    note:
      "Kesalahan kecil pada launch dapat langsung mengakhiri run.",

    distance: {
      meters: 201,
      description: "201 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "OFFICIAL_TRACK",
      weather: "HOT",
      gripModifier: 2,
      reliabilityPressure: 14,
      variableConditions: false,
    },

    setup: {
      launchImportance: 96,
      accelerationImportance: 90,
      topSpeedImportance: 65,
      brakingImportance: 28,
      handlingImportance: 35,
      reactionImportance: 94,
      consistencyImportance: 82,
      reliabilityImportance: 76,
    },

    entryFee: 750_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_000_000,
      },
      {
        type: "XP",
        amount: 80,
      },
      {
        type: "REPUTATION",
        amount: 5,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 4_500_000,
          },
          {
            type: "XP",
            amount: 300,
          },
          {
            type: "REPUTATION",
            amount: 15,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 2_750_000,
          },
          {
            type: "XP",
            amount: 200,
          },
          {
            type: "REPUTATION",
            amount: 10,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 1_500_000,
          },
          {
            type: "XP",
            amount: 125,
          },
          {
            type: "REPUTATION",
            amount: 7,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 20,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "DRIVER_CLASS",
        value: "UNDER_125",
      },
      {
        type: "LICENSE",
        value: "D",
      },
    ],

    generationWeight: 45,
    publicBoard: true,
    championship: false,

    cooldownHours: 36,

    visual: {
      label: "OFFICIAL",
      accent: "DANGER",
      icon: "flag",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* UNDER 150                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "race-local-150-001",

    name: "Mengwi 150 Sprint",
    shortName: "MENGWI 150",

    type: "SPRINT",
    class: "UNDER_150",
    difficulty: "INTERMEDIATE",

    venue: "Mengwi Sprint Circuit",
    location: "Mengwi",

    description:
      "Sprint kelas 150 dengan lintasan lebih panjang dan kebutuhan setup lebih kompleks.",

    note:
      "Top speed mulai terasa penting, tetapi acceleration masih menjadi pembeda.",

    distance: {
      meters: 804,
      description: "804 METER",
    },

    field: {
      minimumDrivers: 6,
      maximumDrivers: 12,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "LOCAL_TRACK",
      weather: "CLEAR",
      gripModifier: 0,
      reliabilityPressure: 12,
      variableConditions: false,
    },

    setup: {
      launchImportance: 68,
      accelerationImportance: 82,
      topSpeedImportance: 84,
      brakingImportance: 60,
      handlingImportance: 62,
      reactionImportance: 65,
      consistencyImportance: 76,
      reliabilityImportance: 74,
    },

    entryFee: 650_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_200_000,
      },
      {
        type: "XP",
        amount: 90,
      },
      {
        type: "REPUTATION",
        amount: 6,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 5_500_000,
          },
          {
            type: "XP",
            amount: 350,
          },
          {
            type: "REPUTATION",
            amount: 18,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 3_400_000,
          },
          {
            type: "XP",
            amount: 250,
          },
          {
            type: "REPUTATION",
            amount: 11,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 2_100_000,
          },
          {
            type: "XP",
            amount: 175,
          },
          {
            type: "REPUTATION",
            amount: 8,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 3,
      },
      {
        type: "REPUTATION",
        value: 35,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_150",
      },
    ],

    generationWeight: 40,
    publicBoard: true,
    championship: false,

    cooldownHours: 36,

    visual: {
      label: "150 SPRINT",
      accent: "IMPORTANT",
      icon: "flag",
    },
  },

  {
    id: "race-official-150-001",

    name: "Badung 150 Official",
    shortName: "BADUNG 150",

    type: "BRACKET",
    class: "UNDER_150",
    difficulty: "PRO",

    venue: "Badung Official Circuit",
    location: "Badung",

    description:
      "Event resmi kelas 150 untuk tim yang sudah memiliki setup dan driver yang matang.",

    note:
      "Reliability pressure lebih tinggi karena motor bekerja keras sepanjang event.",

    distance: {
      meters: 402,
      description: "402 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "OFFICIAL_TRACK",
      weather: "HOT",
      gripModifier: -1,
      reliabilityPressure: 18,
      variableConditions: false,
    },

    setup: {
      launchImportance: 88,
      accelerationImportance: 90,
      topSpeedImportance: 82,
      brakingImportance: 54,
      handlingImportance: 52,
      reactionImportance: 88,
      consistencyImportance: 86,
      reliabilityImportance: 84,
    },

    entryFee: 1_250_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_800_000,
      },
      {
        type: "XP",
        amount: 130,
      },
      {
        type: "REPUTATION",
        amount: 8,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 8_500_000,
          },
          {
            type: "XP",
            amount: 550,
          },
          {
            type: "REPUTATION",
            amount: 25,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 5_000_000,
          },
          {
            type: "XP",
            amount: 375,
          },
          {
            type: "REPUTATION",
            amount: 16,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 3_000_000,
          },
          {
            type: "XP",
            amount: 250,
          },
          {
            type: "REPUTATION",
            amount: 11,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 3,
      },
      {
        type: "REPUTATION",
        value: 45,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_150",
      },
      {
        type: "LICENSE",
        value: "C",
      },
    ],

    generationWeight: 25,
    publicBoard: true,
    championship: false,

    cooldownHours: 48,

    visual: {
      label: "150 OFFICIAL",
      accent: "DANGER",
      icon: "flag",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* OPEN CLASS                                                              */
  /* ---------------------------------------------------------------------- */

  {
    id: "race-open-001",

    name: "Badung Open Night Drag",
    shortName: "BADUNG OPEN",

    type: "DRAG",
    class: "OPEN",
    difficulty: "PRO",

    venue: "Badung Open Strip",
    location: "Badung",

    description:
      "Drag open class untuk motor dengan setup ekstrem dan driver berpengalaman.",

    note:
      "Reaction, launch, dan reliability menjadi kombinasi penting.",

    distance: {
      meters: 201,
      description: "201 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "INDUSTRIAL",
      weather: "HOT",
      gripModifier: 3,
      reliabilityPressure: 22,
      variableConditions: false,
    },

    setup: {
      launchImportance: 96,
      accelerationImportance: 94,
      topSpeedImportance: 74,
      brakingImportance: 20,
      handlingImportance: 25,
      reactionImportance: 96,
      consistencyImportance: 84,
      reliabilityImportance: 90,
    },

    entryFee: 2_000_000,

    rewards: [
      {
        type: "CASH",
        amount: 2_500_000,
      },
      {
        type: "XP",
        amount: 180,
      },
      {
        type: "REPUTATION",
        amount: 12,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 15_000_000,
          },
          {
            type: "XP",
            amount: 900,
          },
          {
            type: "REPUTATION",
            amount: 40,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 9_000_000,
          },
          {
            type: "XP",
            amount: 650,
          },
          {
            type: "REPUTATION",
            amount: 25,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 5_500_000,
          },
          {
            type: "XP",
            amount: 450,
          },
          {
            type: "REPUTATION",
            amount: 16,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 4,
      },
      {
        type: "REPUTATION",
        value: 60,
      },
      {
        type: "MOTOR_CLASS",
        value: "OPEN",
      },
      {
        type: "DRIVER_CLASS",
        value: "OPEN",
      },
      {
        type: "LICENSE",
        value: "B",
      },
    ],

    generationWeight: 15,
    publicBoard: true,
    championship: false,

    cooldownHours: 72,

    visual: {
      label: "OPEN CLASS",
      accent: "DANGER",
      icon: "flag",
    },
  },

  {
    id: "race-open-002",

    name: "Airstrip Open Time Attack",
    shortName: "AIRSTRIP OPEN",

    type: "TIME_ATTACK",
    class: "OPEN",
    difficulty: "ELITE",

    venue: "Old Airstrip",
    location: "Badung",

    description:
      "Time attack open class di lintasan panjang yang memberi bobot besar pada top speed dan consistency.",

    note:
      "Setup yang terlalu agresif dapat menghasilkan output besar sekaligus reliability pressure tinggi.",

    distance: {
      meters: 1_201,
      description: "1.201 METER",
    },

    field: {
      minimumDrivers: 6,
      maximumDrivers: 12,
    },

    conditions: {
      surface: "CONCRETE",
      venueType: "AIRSTRIP",
      weather: "VARIABLE",
      gripModifier: -3,
      reliabilityPressure: 28,
      variableConditions: true,
    },

    setup: {
      launchImportance: 48,
      accelerationImportance: 68,
      topSpeedImportance: 96,
      brakingImportance: 62,
      handlingImportance: 58,
      reactionImportance: 42,
      consistencyImportance: 94,
      reliabilityImportance: 92,
    },

    entryFee: 3_500_000,

    rewards: [
      {
        type: "CASH",
        amount: 4_000_000,
      },
      {
        type: "XP",
        amount: 250,
      },
      {
        type: "REPUTATION",
        amount: 18,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 25_000_000,
          },
          {
            type: "XP",
            amount: 1_500,
          },
          {
            type: "REPUTATION",
            amount: 60,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 15_000_000,
          },
          {
            type: "XP",
            amount: 1_000,
          },
          {
            type: "REPUTATION",
            amount: 38,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 8_500_000,
          },
          {
            type: "XP",
            amount: 700,
          },
          {
            type: "REPUTATION",
            amount: 24,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 4,
      },
      {
        type: "REPUTATION",
        value: 80,
      },
      {
        type: "MOTOR_CLASS",
        value: "OPEN",
      },
      {
        type: "DRIVER_CLASS",
        value: "OPEN",
      },
      {
        type: "LICENSE",
        value: "A",
      },
    ],

    generationWeight: 8,
    publicBoard: true,
    championship: false,

    cooldownHours: 96,

    visual: {
      label: "AIRSTRIP ATTACK",
      accent: "DANGER",
      icon: "timer",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* CHAMPIONSHIP — UNDER 125                                                */
  /* ---------------------------------------------------------------------- */

  {
    id: "championship-125-round-01",

    name: "Badung Cup 125 — Round 01",
    shortName: "BADUNG CUP R1",

    type: "CHAMPIONSHIP",
    class: "UNDER_125",
    difficulty: "HARD",

    venue: "Official Circuit",
    location: "Badung",

    description:
      "Putaran pertama kejuaraan kelas 125. Hasil setiap ronde menentukan posisi klasemen.",

    note:
      "Championship membutuhkan konsistensi. Satu kemenangan bukan satu-satunya cara mengumpulkan poin.",

    distance: {
      meters: 201,
      description: "201 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "OFFICIAL_TRACK",
      weather: "CLEAR",
      gripModifier: 1,
      reliabilityPressure: 15,
      variableConditions: false,
    },

    setup: {
      launchImportance: 94,
      accelerationImportance: 89,
      topSpeedImportance: 62,
      brakingImportance: 28,
      handlingImportance: 31,
      reactionImportance: 92,
      consistencyImportance: 92,
      reliabilityImportance: 84,
    },

    entryFee: 800_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_000_000,
      },
      {
        type: "XP",
        amount: 100,
      },
      {
        type: "REPUTATION",
        amount: 5,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 4_000_000,
          },
          {
            type: "XP",
            amount: 300,
          },
          {
            type: "REPUTATION",
            amount: 12,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 25,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 2_500_000,
          },
          {
            type: "XP",
            amount: 220,
          },
          {
            type: "REPUTATION",
            amount: 8,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 18,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 1_500_000,
          },
          {
            type: "XP",
            amount: 160,
          },
          {
            type: "REPUTATION",
            amount: 5,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 15,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 25,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "LICENSE",
        value: "D",
      },
    ],

    generationWeight: 20,
    publicBoard: true,
    championship: true,
    championshipId: "badung-cup-125",
    championshipRound: 1,

    cooldownHours: 72,

    visual: {
      label: "CHAMPIONSHIP",
      accent: "DANGER",
      icon: "trophy",
    },
  },

  {
    id: "championship-125-round-02",

    name: "Badung Cup 125 — Round 02",
    shortName: "BADUNG CUP R2",

    type: "CHAMPIONSHIP",
    class: "UNDER_125",
    difficulty: "HARD",

    venue: "Mengwi Circuit",
    location: "Mengwi",

    description:
      "Putaran kedua Badung Cup 125 dengan lintasan sedikit lebih panjang dan kondisi lebih menuntut.",

    distance: {
      meters: 402,
      description: "402 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "CONCRETE",
      venueType: "OFFICIAL_TRACK",
      weather: "CLOUDY",
      gripModifier: -2,
      reliabilityPressure: 18,
      variableConditions: false,
    },

    setup: {
      launchImportance: 82,
      accelerationImportance: 88,
      topSpeedImportance: 70,
      brakingImportance: 46,
      handlingImportance: 44,
      reactionImportance: 78,
      consistencyImportance: 94,
      reliabilityImportance: 88,
    },

    entryFee: 800_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_000_000,
      },
      {
        type: "XP",
        amount: 100,
      },
      {
        type: "REPUTATION",
        amount: 5,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 4_000_000,
          },
          {
            type: "XP",
            amount: 300,
          },
          {
            type: "REPUTATION",
            amount: 12,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 25,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 2_500_000,
          },
          {
            type: "XP",
            amount: 220,
          },
          {
            type: "REPUTATION",
            amount: 8,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 18,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 1_500_000,
          },
          {
            type: "XP",
            amount: 160,
          },
          {
            type: "REPUTATION",
            amount: 5,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 15,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 30,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "LICENSE",
        value: "D",
      },
      {
        type: "CHAMPIONSHIP",
        value: "badung-cup-125",
      },
    ],

    generationWeight: 15,
    publicBoard: true,
    championship: true,
    championshipId: "badung-cup-125",
    championshipRound: 2,

    cooldownHours: 72,

    visual: {
      label: "CHAMPIONSHIP",
      accent: "DANGER",
      icon: "trophy",
    },
  },

  {
    id: "championship-125-round-03",

    name: "Badung Cup 125 — Final",
    shortName: "BADUNG CUP FINAL",

    type: "CHAMPIONSHIP",
    class: "UNDER_125",
    difficulty: "PRO",

    venue: "Badung Grand Circuit",
    location: "Badung",

    description:
      "Final Badung Cup 125. Ronde terakhir menentukan juara klasemen.",

    note:
      "Tekanan tinggi. Reliability dan consistency semakin penting ketika motor sudah melalui beberapa ronde.",

    distance: {
      meters: 402,
      description: "402 METER",
    },

    field: {
      minimumDrivers: 8,
      maximumDrivers: 16,
    },

    conditions: {
      surface: "ASPHALT",
      venueType: "OFFICIAL_TRACK",
      weather: "VARIABLE",
      gripModifier: -1,
      reliabilityPressure: 22,
      variableConditions: true,
    },

    setup: {
      launchImportance: 86,
      accelerationImportance: 91,
      topSpeedImportance: 76,
      brakingImportance: 50,
      handlingImportance: 52,
      reactionImportance: 84,
      consistencyImportance: 97,
      reliabilityImportance: 94,
    },

    entryFee: 1_000_000,

    rewards: [
      {
        type: "CASH",
        amount: 1_500_000,
      },
      {
        type: "XP",
        amount: 150,
      },
      {
        type: "REPUTATION",
        amount: 8,
      },
    ],

    prizes: [
      {
        position: 1,
        rewards: [
          {
            type: "CASH",
            amount: 7_500_000,
          },
          {
            type: "XP",
            amount: 500,
          },
          {
            type: "REPUTATION",
            amount: 25,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 35,
          },
        ],
      },
      {
        position: 2,
        rewards: [
          {
            type: "CASH",
            amount: 4_500_000,
          },
          {
            type: "XP",
            amount: 350,
          },
          {
            type: "REPUTATION",
            amount: 16,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 22,
          },
        ],
      },
      {
        position: 3,
        rewards: [
          {
            type: "CASH",
            amount: 2_750_000,
          },
          {
            type: "XP",
            amount: 250,
          },
          {
            type: "REPUTATION",
            amount: 10,
          },
          {
            type: "CHAMPIONSHIP_POINTS",
            amount: 18,
          },
        ],
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 40,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "LICENSE",
        value: "D",
      },
      {
        type: "CHAMPIONSHIP",
        value: "badung-cup-125",
      },
    ],

    generationWeight: 10,
    publicBoard: true,
    championship: true,
    championshipId: "badung-cup-125",
    championshipRound: 3,

    cooldownHours: 96,

    visual: {
      label: "CHAMPIONSHIP FINAL",
      accent: "DANGER",
      icon: "trophy",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Return all race definitions.
 *
 * A fresh array is returned so callers cannot accidentally mutate
 * the static catalog.
 */
export function getRaces(): RaceDefinition[] {
  return [...RACES];
}

/**
 * Return one race by ID.
 */
export function getRaceById(
  id: string,
): RaceDefinition | undefined {
  return RACES.find((race) => race.id === id);
}

/**
 * Return races for a class.
 */
export function getRacesByClass(
  raceClass: RaceClass,
): RaceDefinition[] {
  return RACES.filter(
    (race) => race.class === raceClass,
  );
}

/**
 * Return races by type.
 */
export function getRacesByType(
  type: RaceType,
): RaceDefinition[] {
  return RACES.filter(
    (race) => race.type === type,
  );
}

/**
 * Return races by difficulty.
 */
export function getRacesByDifficulty(
  difficulty: RaceDifficulty,
): RaceDefinition[] {
  return RACES.filter(
    (race) => race.difficulty === difficulty,
  );
}

/**
 * Return public race-board events.
 */
export function getPublicRaces(): RaceDefinition[] {
  return RACES.filter((race) => race.publicBoard);
}

/**
 * Return championship races.
 */
export function getChampionshipRaces(): RaceDefinition[] {
  return RACES.filter((race) => race.championship);
}

/**
 * Return one championship series.
 */
export function getChampionshipRacesById(
  championshipId: string,
): RaceDefinition[] {
  return RACES
    .filter(
      (race) =>
        race.championship &&
        race.championshipId === championshipId,
    )
    .sort(
      (a, b) =>
        (a.championshipRound ?? 0) -
        (b.championshipRound ?? 0),
    );
}

/**
 * Return races from a specific location.
 */
export function getRacesByLocation(
  location: string,
): RaceDefinition[] {
  return RACES.filter(
    (race) => race.location === location,
  );
}

/**
 * Return races appropriate for a specific motor class.
 *
 * This is a catalog filter only.
 * Actual player eligibility must still be validated by game/race.ts.
 */
export function getRacesForMotorClass(
  motorClass: RaceClass,
): RaceDefinition[] {
  return RACES.filter(
    (race) => race.class === motorClass,
  );
}

/**
 * Return entry fee.
 */
export function getRaceEntryFee(
  race: RaceDefinition,
): number {
  return race.entryFee;
}

/**
 * Return total reward value from direct rewards.
 *
 * Only CASH rewards are included because XP / reputation /
 * championship points are not currency.
 */
export function getRaceCashReward(
  race: RaceDefinition,
): number {
  return race.rewards
    .filter((reward) => reward.type === "CASH")
    .reduce(
      (total, reward) => total + reward.amount,
      0,
    );
}

/**
 * Return prize rewards for a position.
 */
export function getRacePrize(
  race: RaceDefinition,
  position: number,
): RacePrize | undefined {
  return race.prizes.find(
    (prize) => prize.position === position,
  );
}

/**
 * Return cash from a particular prize position.
 */
export function getRacePrizeCash(
  race: RaceDefinition,
  position: number,
): number {
  return (
    getRacePrize(race, position)
      ?.rewards
      .filter((reward) => reward.type === "CASH")
      .reduce(
        (total, reward) => total + reward.amount,
        0,
      ) ?? 0
  );
}

/**
 * Return championship points for a position.
 */
export function getRacePrizeChampionshipPoints(
  race: RaceDefinition,
  position: number,
): number {
  return (
    getRacePrize(race, position)
      ?.rewards
      .filter(
        (reward) =>
          reward.type === "CHAMPIONSHIP_POINTS",
      )
      .reduce(
        (total, reward) => total + reward.amount,
        0,
      ) ?? 0
  );
}

/**
 * Return minimum required garage level.
 */
export function getRaceMinimumGarageLevel(
  race: RaceDefinition,
): number {
  const requirement = race.requirements.find(
    (item) => item.type === "GARAGE_LEVEL",
  );

  return typeof requirement?.value === "number"
    ? requirement.value
    : 0;
}

/**
 * Return minimum required reputation.
 */
export function getRaceMinimumReputation(
  race: RaceDefinition,
): number {
  const requirement = race.requirements.find(
    (item) => item.type === "REPUTATION",
  );

  return typeof requirement?.value === "number"
    ? requirement.value
    : 0;
}

/**
 * Human-readable class label.
 */
export function getRaceClassLabel(
  raceClass: RaceClass,
): string {
  const labels: Record<RaceClass, string> = {
    UNDER_110: "UNDER 110",
    UNDER_125: "UNDER 125",
    UNDER_150: "UNDER 150",
    OPEN: "OPEN",
  };

  return labels[raceClass];
}

/**
 * Human-readable type label.
 */
export function getRaceTypeLabel(
  type: RaceType,
): string {
  const labels: Record<RaceType, string> = {
    DRAG: "DRAG",
    SPRINT: "SPRINT",
    BRACKET: "BRACKET",
    TIME_ATTACK: "TIME ATTACK",
    CHAMPIONSHIP: "CHAMPIONSHIP",
    STREET: "STREET",
  };

  return labels[type];
}

/**
 * Human-readable difficulty label.
 */
export function getRaceDifficultyLabel(
  difficulty: RaceDifficulty,
): string {
  const labels: Record<RaceDifficulty, string> = {
    BEGINNER: "BEGINNER",
    NOVICE: "NOVICE",
    INTERMEDIATE: "INTERMEDIATE",
    HARD: "HARD",
    PRO: "PRO",
    ELITE: "ELITE",
  };

  return labels[difficulty];
}

/**
 * Return all race classes represented in the catalog.
 */
export function getRaceClasses(): RaceClass[] {
  return [
    ...new Set(
      RACES.map((race) => race.class),
    ),
  ];
}

/**
 * Return all race types represented in the catalog.
 */
export function getRaceTypes(): RaceType[] {
  return [
    ...new Set(
      RACES.map((race) => race.type),
    ),
  ];
}

/**
 * Return all championship IDs currently represented.
 */
export function getChampionshipIds(): string[] {
  return [
    ...new Set(
      RACES
        .filter((race) => race.championship)
        .map(
          (race) => race.championshipId,
        )
        .filter(
          (id): id is string => Boolean(id),
        ),
    ),
  ];
}

/**
 * Check whether a race is unlocked based only on
 * static numeric requirements.
 *
 * This intentionally does not validate:
 * - owned motor
 * - selected driver
 * - selected parts
 * - championship progress
 * - licenses stored in player state
 */
export function isRaceUnlocked(
  race: RaceDefinition,
  garageLevel: number,
  reputation: number,
): boolean {
  if (
    garageLevel <
    getRaceMinimumGarageLevel(race)
  ) {
    return false;
  }

  if (
    reputation <
    getRaceMinimumReputation(race)
  ) {
    return false;
  }

  return true;
}

/**
 * Return races unlocked by garage level + reputation.
 */
export function getUnlockedRaces(
  garageLevel: number,
  reputation: number,
): RaceDefinition[] {
  return RACES.filter((race) =>
    isRaceUnlocked(
      race,
      garageLevel,
      reputation,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* RACE SETUP HELPERS                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Return setup weights as a copy.
 */
export function getRaceSetup(
  race: RaceDefinition,
): RaceSetup {
  return {
    ...race.setup,
  };
}

/**
 * Calculate total setup weight.
 *
 * Useful when determining how much of a race is performance-heavy
 * versus driver-heavy.
 */
export function getRaceSetupWeight(
  race: RaceDefinition,
): number {
  return Object.values(race.setup).reduce(
    (total, value) => total + value,
    0,
  );
}

/**
 * Return the strongest setup priority.
 */
export function getRacePrimarySetupFactor(
  race: RaceDefinition,
): {
  factor: keyof RaceSetup;
  value: number;
} {
  const entries = Object.entries(
    race.setup,
  ) as [
    keyof RaceSetup,
    number,
  ][];

  return entries.reduce(
    (best, current) =>
      current[1] > best[1]
        ? current
        : best,
  );
}

/**
 * Return whether a race strongly favors launch.
 */
export function isLaunchFocusedRace(
  race: RaceDefinition,
): boolean {
  return race.setup.launchImportance >= 85;
}

/**
 * Return whether a race strongly favors top speed.
 */
export function isTopSpeedFocusedRace(
  race: RaceDefinition,
): boolean {
  return race.setup.topSpeedImportance >= 85;
}

/**
 * Return whether a race strongly favors consistency.
 */
export function isConsistencyFocusedRace(
  race: RaceDefinition,
): boolean {
  return race.setup.consistencyImportance >= 85;
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate the static race catalog.
 *
 * Useful for development / tests.
 */
export function validateRaceCatalog(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const race of RACES) {
    /* Duplicate IDs */
    if (ids.has(race.id)) {
      errors.push(
        `Duplicate race ID: ${race.id}`,
      );
    }

    ids.add(race.id);

    /* Basic text fields */
    if (!race.name.trim()) {
      errors.push(
        `Race ${race.id}: missing name`,
      );
    }

    if (!race.shortName.trim()) {
      errors.push(
        `Race ${race.id}: missing shortName`,
      );
    }

    if (!race.venue.trim()) {
      errors.push(
        `Race ${race.id}: missing venue`,
      );
    }

    if (!race.location.trim()) {
      errors.push(
        `Race ${race.id}: missing location`,
      );
    }

    if (!race.description.trim()) {
      errors.push(
        `Race ${race.id}: missing description`,
      );
    }

    /* Distance */
    if (race.distance.meters <= 0) {
      errors.push(
        `Race ${race.id}: distance must be > 0`,
      );
    }

    /* Field size */
    if (
      race.field.minimumDrivers <= 0
    ) {
      errors.push(
        `Race ${race.id}: minimumDrivers must be > 0`,
      );
    }

    if (
      race.field.maximumDrivers <
      race.field.minimumDrivers
    ) {
      errors.push(
        `Race ${race.id}: maximumDrivers must be >= minimumDrivers`,
      );
    }

    /* Entry fee */
    if (race.entryFee < 0) {
      errors.push(
        `Race ${race.id}: entryFee cannot be negative`,
      );
    }

    /* Cooldown */
    if (race.cooldownHours < 0) {
      errors.push(
        `Race ${race.id}: cooldownHours cannot be negative`,
      );
    }

    /* Generation */
    if (race.generationWeight < 0) {
      errors.push(
        `Race ${race.id}: generationWeight cannot be negative`,
      );
    }

    /* Setup values */
    const setupEntries = Object.entries(
      race.setup,
    ) as [string, number][];

    for (const [key, value] of setupEntries) {
      if (value < 0 || value > 100) {
        errors.push(
          `Race ${race.id}: setup.${key} must be 0-100`,
        );
      }
    }

    /* Conditions */
    if (
      race.conditions.gripModifier < -100 ||
      race.conditions.gripModifier > 100
    ) {
      errors.push(
        `Race ${race.id}: gripModifier outside valid range`,
      );
    }

    if (
      race.conditions.reliabilityPressure < 0 ||
      race.conditions.reliabilityPressure > 100
    ) {
      errors.push(
        `Race ${race.id}: reliabilityPressure must be 0-100`,
      );
    }

    /* Requirements */
    for (const requirement of race.requirements) {
      if (
        requirement.value === "" ||
        requirement.value === null ||
        requirement.value === undefined
      ) {
        errors.push(
          `Race ${race.id}: empty requirement value`,
        );
      }
    }

    /* Rewards */
    for (const reward of race.rewards) {
      if (reward.amount < 0) {
        errors.push(
          `Race ${race.id}: negative reward amount`,
        );
      }
    }

    for (const prize of race.prizes) {
      if (prize.position <= 0) {
        errors.push(
          `Race ${race.id}: invalid prize position`,
        );
      }

      for (const reward of prize.rewards) {
        if (reward.amount < 0) {
          errors.push(
            `Race ${race.id}: negative prize reward amount`,
          );
        }
      }
    }

    /* Championship consistency */
    if (
      race.championship &&
      !race.championshipId
    ) {
      errors.push(
        `Race ${race.id}: championship race missing championshipId`,
      );
    }

    if (
      race.championship &&
      (!race.championshipRound ||
        race.championshipRound <= 0)
    ) {
      errors.push(
        `Race ${race.id}: championship race missing valid championshipRound`,
      );
    }

    if (
      !race.championship &&
      race.championshipRound !== undefined
    ) {
      errors.push(
        `Race ${race.id}: non-championship race cannot have championshipRound`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

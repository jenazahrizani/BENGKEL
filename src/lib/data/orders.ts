/**
 * BENGKEL MALAM
 * Static Order / Job Catalog
 *
 * IMPORTANT:
 * - File ini hanya berisi DATA MASTER.
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan progress order pemain.
 * - Tidak melakukan mutation terhadap game state.
 * - Progress, status, acceptedAt, completedAt, dll harus berada
 *   di GameState / saved player state.
 */

export type OrderType =
  | "SERVICE"
  | "REPAIR"
  | "CUSTOMIZATION"
  | "ENGINE_BUILD"
  | "RESTORATION"
  | "RACE_PREP"
  | "FULL_BUILD";

export type OrderDifficulty =
  | "EASY"
  | "NORMAL"
  | "HARD"
  | "EXPERT"
  | "LEGENDARY";

export type OrderStatus =
  | "AVAILABLE"
  | "LOCKED";

export type OrderCustomerType =
  | "REGULAR"
  | "ENTHUSIAST"
  | "COLLECTOR"
  | "RACER"
  | "TRADER"
  | "LOCAL_SHOP"
  | "VIP";

export type OrderPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type OrderRequirementType =
  | "GARAGE_LEVEL"
  | "REPUTATION"
  | "MECHANIC_COUNT"
  | "MOTOR_CLASS"
  | "MOTOR_CATEGORY"
  | "MOTOR_CONDITION"
  | "PART"
  | "RACE_CLASS";

export type OrderRewardType =
  | "CASH"
  | "REPUTATION"
  | "XP";

export interface OrderRequirement {
  type: OrderRequirementType;

  /**
   * Generic value used by the requirement.
   *
   * Examples:
   * - GARAGE_LEVEL => 1
   * - REPUTATION => 20
   * - MECHANIC_COUNT => 2
   * - MOTOR_CLASS => "UNDER_125"
   * - MOTOR_CATEGORY => "UNDERBONE"
   * - MOTOR_CONDITION => 60
   * - PART => "engine-basic"
   * - RACE_CLASS => "UNDER_125"
   */
  value: string | number;
}

export interface OrderReward {
  type: OrderRewardType;
  amount: number;
}

export interface OrderDuration {
  /**
   * Base work duration in game hours.
   */
  baseHours: number;

  /**
   * Minimum possible duration after modifiers.
   */
  minimumHours: number;

  /**
   * Maximum allowed duration.
   */
  maximumHours: number;
}

export interface OrderDefinition {
  id: string;

  /**
   * Human-readable job title.
   *
   * Example:
   * "Servis NUSA 125"
   */
  title: string;

  /**
   * Compact UI label.
   *
   * Example:
   * "SERVICE"
   */
  shortTitle: string;

  type: OrderType;
  difficulty: OrderDifficulty;

  /**
   * Who is bringing the job.
   */
  customerType: OrderCustomerType;

  /**
   * Customer display name.
   */
  customerName: string;

  /**
   * Short description shown to player.
   */
  description: string;

  /**
   * Additional flavor/context.
   */
  note?: string;

  priority: OrderPriority;

  duration: OrderDuration;

  rewards: OrderReward[];

  requirements: OrderRequirement[];

  /**
   * Maximum number of times this order can exist
   * simultaneously in a generated pool.
   *
   * 1 = unique job.
   * 0 = unlimited.
   */
  poolLimit: number;

  /**
   * Chance weight when generating random jobs.
   *
   * Higher = more likely.
   */
  generationWeight: number;

  /**
   * Whether the order can appear in the normal public job board.
   */
  publicBoard: boolean;

  /**
   * Whether it can appear during early game.
   */
  earlyGame: boolean;

  /**
   * Optional motor requirement.
   *
   * Usually an ID from motors.ts.
   */
  motorId?: string;

  /**
   * Optional compatible motor classes.
   */
  motorClasses?: string[];

  /**
   * Optional parts expected by the job.
   *
   * These are catalog IDs from parts.ts.
   */
  requiredParts?: string[];

  /**
   * UI metadata.
   */
  visual: {
    label: string;
    accent: "NORMAL" | "IMPORTANT" | "DANGER";
    icon:
      | "wrench"
      | "motor"
      | "engine"
      | "helmet"
      | "flag"
      | "toolbox"
      | "bolt"
      | "clipboard";
  };
}

/* -------------------------------------------------------------------------- */
/* ORDER CATALOG                                                              */
/* -------------------------------------------------------------------------- */

export const ORDERS: OrderDefinition[] = [
  {
    id: "job-service-basic-001",

    title: "Servis NUSA 125",
    shortTitle: "SERVICE",

    type: "SERVICE",
    difficulty: "EASY",

    customerType: "REGULAR",
    customerName: "Pak Ardi",

    description:
      "Servis rutin untuk NUSA 125 harian. Ganti oli, cek drivetrain, rem, dan lakukan pemeriksaan umum.",

    note:
      "Motor dipakai setiap hari. Pemilik tidak mencari performa maksimal, yang penting kembali siap jalan.",

    priority: "NORMAL",

    duration: {
      baseHours: 4,
      minimumHours: 3,
      maximumHours: 6,
    },

    rewards: [
      {
        type: "CASH",
        amount: 450_000,
      },
      {
        type: "REPUTATION",
        amount: 2,
      },
      {
        type: "XP",
        amount: 20,
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
    ],

    poolLimit: 1,
    generationWeight: 100,
    publicBoard: true,
    earlyGame: true,

    motorId: "nusa-125",
    motorClasses: ["UNDER_125"],

    visual: {
      label: "BASIC SERVICE",
      accent: "NORMAL",
      icon: "wrench",
    },
  },

  {
    id: "job-repair-brake-001",

    title: "Perbaikan Rem Garuda 105",
    shortTitle: "BRAKE REPAIR",

    type: "REPAIR",
    difficulty: "EASY",

    customerType: "REGULAR",
    customerName: "Mas Rian",

    description:
      "Sistem pengereman mulai menurun. Pemeriksaan rem depan, belakang, dan komponen pendukung diperlukan.",

    note:
      "Pemilik minta selesai cepat karena motor dipakai untuk kerja besok pagi.",

    priority: "HIGH",

    duration: {
      baseHours: 5,
      minimumHours: 4,
      maximumHours: 7,
    },

    rewards: [
      {
        type: "CASH",
        amount: 575_000,
      },
      {
        type: "REPUTATION",
        amount: 2,
      },
      {
        type: "XP",
        amount: 25,
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_110",
      },
    ],

    poolLimit: 1,
    generationWeight: 90,
    publicBoard: true,
    earlyGame: true,

    motorId: "garuda-105",
    motorClasses: ["UNDER_110"],

    visual: {
      label: "BRAKE",
      accent: "IMPORTANT",
      icon: "wrench",
    },
  },

  {
    id: "job-service-performance-001",

    title: "Service Performance NUSA 125",
    shortTitle: "PERFORMANCE SERVICE",

    type: "SERVICE",
    difficulty: "NORMAL",

    customerType: "ENTHUSIAST",
    customerName: "Bang Dika",

    description:
      "Pemeriksaan menyeluruh untuk NUSA 125 yang sering digunakan dalam kegiatan akhir pekan dan latihan.",

    note:
      "Pemilik mulai mengejar respons throttle yang lebih baik tetapi belum siap masuk full build.",

    priority: "NORMAL",

    duration: {
      baseHours: 7,
      minimumHours: 5,
      maximumHours: 10,
    },

    rewards: [
      {
        type: "CASH",
        amount: 850_000,
      },
      {
        type: "REPUTATION",
        amount: 4,
      },
      {
        type: "XP",
        amount: 40,
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
    ],

    poolLimit: 1,
    generationWeight: 75,
    publicBoard: true,
    earlyGame: true,

    motorId: "nusa-125",
    motorClasses: ["UNDER_125"],

    visual: {
      label: "PERFORMANCE",
      accent: "IMPORTANT",
      icon: "engine",
    },
  },

  {
    id: "job-custom-cub-001",

    title: "Custom Cub Harian",
    shortTitle: "CUSTOM",

    type: "CUSTOMIZATION",
    difficulty: "NORMAL",

    customerType: "ENTHUSIAST",
    customerName: "Yoga",

    description:
      "Ubah tampilan motor bebek harian agar lebih rapi dan berkarakter tanpa mengorbankan fungsi penggunaan sehari-hari.",

    note:
      "Pelanggan lebih peduli hasil akhir dan kerapian pengerjaan daripada angka performa.",

    priority: "NORMAL",

    duration: {
      baseHours: 10,
      minimumHours: 8,
      maximumHours: 14,
    },

    rewards: [
      {
        type: "CASH",
        amount: 1_250_000,
      },
      {
        type: "REPUTATION",
        amount: 5,
      },
      {
        type: "XP",
        amount: 55,
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 1,
      },
      {
        type: "MOTOR_CATEGORY",
        value: "UNDERBONE",
      },
    ],

    poolLimit: 1,
    generationWeight: 70,
    publicBoard: true,
    earlyGame: true,

    motorClasses: ["UNDER_110", "UNDER_125", "UNDER_150"],

    visual: {
      label: "CUSTOM",
      accent: "IMPORTANT",
      icon: "motor",
    },
  },

  {
    id: "job-race-prep-125-001",

    title: "Persiapan Balap Kelas 125",
    shortTitle: "RACE PREP",

    type: "RACE_PREP",
    difficulty: "HARD",

    customerType: "RACER",
    customerName: "Fajar \"Gaspol\"",

    description:
      "Persiapan motor kelas 125 untuk event resmi. Fokus pada performa, reliability, dan kesiapan start.",

    note:
      "Pelanggan tidak meminta motor jalanan. Semua pekerjaan diarahkan untuk kebutuhan race.",

    priority: "HIGH",

    duration: {
      baseHours: 14,
      minimumHours: 11,
      maximumHours: 20,
    },

    rewards: [
      {
        type: "CASH",
        amount: 2_500_000,
      },
      {
        type: "REPUTATION",
        amount: 8,
      },
      {
        type: "XP",
        amount: 100,
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 2,
      },
      {
        type: "REPUTATION",
        value: 15,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
      {
        type: "RACE_CLASS",
        value: "UNDER_125",
      },
    ],

    poolLimit: 1,
    generationWeight: 45,
    publicBoard: true,
    earlyGame: false,

    motorClasses: ["UNDER_125"],

    visual: {
      label: "RACE PREP",
      accent: "IMPORTANT",
      icon: "flag",
    },
  },

  {
    id: "job-engine-build-125-001",

    title: "Build Mesin 125",
    shortTitle: "ENGINE BUILD",

    type: "ENGINE_BUILD",
    difficulty: "HARD",

    customerType: "RACER",
    customerName: "Raka \"Siku\"",

    description:
      "Bangun ulang sisi mesin untuk mengejar output lebih tinggi dari motor kelas 125 tanpa mengabaikan reliability.",

    note:
      "Job ini membutuhkan mekanik dengan kemampuan lebih baik dan ruang kerja yang tidak sedang penuh.",

    priority: "HIGH",

    duration: {
      baseHours: 20,
      minimumHours: 16,
      maximumHours: 28,
    },

    rewards: [
      {
        type: "CASH",
        amount: 3_750_000,
      },
      {
        type: "REPUTATION",
        amount: 10,
      },
      {
        type: "XP",
        amount: 140,
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
        type: "MECHANIC_COUNT",
        value: 2,
      },
      {
        type: "MOTOR_CLASS",
        value: "UNDER_125",
      },
    ],

    poolLimit: 1,
    generationWeight: 35,
    publicBoard: true,
    earlyGame: false,

    motorClasses: ["UNDER_125"],

    requiredParts: [
      "engine-basic",
    ],

    visual: {
      label: "ENGINE",
      accent: "IMPORTANT",
      icon: "engine",
    },
  },

  {
    id: "job-restoration-classic-001",

    title: "Restorasi Jawa 110 Classic",
    shortTitle: "RESTORATION",

    type: "RESTORATION",
    difficulty: "EXPERT",

    customerType: "COLLECTOR",
    customerName: "Om Bowo",

    description:
      "Restorasi motor klasik yang sudah lama tersimpan. Fokus pada kondisi, kelengkapan, dan hasil akhir.",

    note:
      "Kesalahan kecil dapat membuat biaya material melonjak. Pekerjaan harus dilakukan bertahap.",

    priority: "NORMAL",

    duration: {
      baseHours: 30,
      minimumHours: 24,
      maximumHours: 42,
    },

    rewards: [
      {
        type: "CASH",
        amount: 6_500_000,
      },
      {
        type: "REPUTATION",
        amount: 15,
      },
      {
        type: "XP",
        amount: 220,
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
        value: "UNDER_125",
      },
      {
        type: "MOTOR_CONDITION",
        value: 50,
      },
    ],

    poolLimit: 1,
    generationWeight: 20,
    publicBoard: true,
    earlyGame: false,

    motorId: "jawa-110-classic",
    motorClasses: ["UNDER_125"],

    visual: {
      label: "CLASSIC",
      accent: "IMPORTANT",
      icon: "motor",
    },
  },

  {
    id: "job-project-revival-001",

    title: "Bangkitkan Project 125",
    shortTitle: "PROJECT REVIVAL",

    type: "RESTORATION",
    difficulty: "HARD",

    customerType: "TRADER",
    customerName: "Doni",

    description:
      "Project mangkrak perlu dihidupkan kembali agar bisa dijual atau digunakan sebagai basis build baru.",

    note:
      "Nilai project sangat tergantung kondisi awal dan keputusan part selama pengerjaan.",

    priority: "NORMAL",

    duration: {
      baseHours: 24,
      minimumHours: 20,
      maximumHours: 34,
    },

    rewards: [
      {
        type: "CASH",
        amount: 4_750_000,
      },
      {
        type: "REPUTATION",
        amount: 10,
      },
      {
        type: "XP",
        amount: 170,
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
        type: "MOTOR_CONDITION",
        value: 40,
      },
    ],

    poolLimit: 1,
    generationWeight: 30,
    publicBoard: true,
    earlyGame: false,

    motorId: "bali-project-125",
    motorClasses: ["UNDER_125"],

    visual: {
      label: "PROJECT",
      accent: "IMPORTANT",
      icon: "toolbox",
    },
  },

  {
    id: "job-race-prep-open-001",

    title: "Full Race Preparation",
    shortTitle: "FULL RACE PREP",

    type: "RACE_PREP",
    difficulty: "EXPERT",

    customerType: "RACER",
    customerName: "Gilang \"Garis\"",

    description:
      "Persiapan penuh motor open class untuk event besar dengan target performa tinggi dan reliability yang tetap terjaga.",

    note:
      "Waktu pengerjaan panjang. Job ini sebaiknya dikerjakan saat kapasitas workshop cukup.",

    priority: "URGENT",

    duration: {
      baseHours: 40,
      minimumHours: 32,
      maximumHours: 56,
    },

    rewards: [
      {
        type: "CASH",
        amount: 12_500_000,
      },
      {
        type: "REPUTATION",
        amount: 25,
      },
      {
        type: "XP",
        amount: 350,
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
        type: "MECHANIC_COUNT",
        value: 3,
      },
      {
        type: "MOTOR_CLASS",
        value: "OPEN",
      },
      {
        type: "RACE_CLASS",
        value: "OPEN",
      },
    ],

    poolLimit: 1,
    generationWeight: 8,
    publicBoard: true,
    earlyGame: false,

    motorClasses: ["OPEN"],

    visual: {
      label: "OPEN CLASS",
      accent: "DANGER",
      icon: "flag",
    },
  },

  {
    id: "job-full-build-vip-001",

    title: "Full Build Pesanan VIP",
    shortTitle: "FULL BUILD",

    type: "FULL_BUILD",
    difficulty: "LEGENDARY",

    customerType: "VIP",
    customerName: "CUSTOMER // VIP",

    description:
      "Pesanan build lengkap dari motor dasar sampai siap digunakan. Spesifikasi bebas selama hasil akhir memenuhi target pelanggan.",

    note:
      "Budget besar, ekspektasi tinggi. Kualitas hasil akan memengaruhi reputasi bengkel.",

    priority: "HIGH",

    duration: {
      baseHours: 60,
      minimumHours: 48,
      maximumHours: 84,
    },

    rewards: [
      {
        type: "CASH",
        amount: 25_000_000,
      },
      {
        type: "REPUTATION",
        amount: 40,
      },
      {
        type: "XP",
        amount: 600,
      },
    ],

    requirements: [
      {
        type: "GARAGE_LEVEL",
        value: 5,
      },
      {
        type: "REPUTATION",
        value: 100,
      },
      {
        type: "MECHANIC_COUNT",
        value: 4,
      },
    ],

    poolLimit: 1,
    generationWeight: 2,
    publicBoard: true,
    earlyGame: false,

    visual: {
      label: "VIP CONTRACT",
      accent: "DANGER",
      icon: "bolt",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Return all order definitions.
 *
 * A fresh array is returned so callers cannot accidentally mutate
 * the master catalog by push/splice/sort.
 */
export function getOrders(): OrderDefinition[] {
  return [...ORDERS];
}

/**
 * Return one order definition by ID.
 */
export function getOrderById(id: string): OrderDefinition | undefined {
  return ORDERS.find((order) => order.id === id);
}

/**
 * Return orders by type.
 */
export function getOrdersByType(
  type: OrderType,
): OrderDefinition[] {
  return ORDERS.filter((order) => order.type === type);
}

/**
 * Return orders by difficulty.
 */
export function getOrdersByDifficulty(
  difficulty: OrderDifficulty,
): OrderDefinition[] {
  return ORDERS.filter(
    (order) => order.difficulty === difficulty,
  );
}

/**
 * Return orders by customer type.
 */
export function getOrdersByCustomerType(
  customerType: OrderCustomerType,
): OrderDefinition[] {
  return ORDERS.filter(
    (order) => order.customerType === customerType,
  );
}

/**
 * Return orders by priority.
 */
export function getOrdersByPriority(
  priority: OrderPriority,
): OrderDefinition[] {
  return ORDERS.filter(
    (order) => order.priority === priority,
  );
}

/**
 * Return public-board jobs.
 */
export function getPublicOrders(): OrderDefinition[] {
  return ORDERS.filter((order) => order.publicBoard);
}

/**
 * Return jobs that are marked as early-game compatible.
 */
export function getEarlyGameOrders(): OrderDefinition[] {
  return ORDERS.filter((order) => order.earlyGame);
}

/**
 * Return jobs that require a particular motor class.
 */
export function getOrdersForMotorClass(
  motorClass: string,
): OrderDefinition[] {
  return ORDERS.filter((order) =>
    order.motorClasses?.includes(motorClass),
  );
}

/**
 * Calculate total cash reward.
 */
export function getOrderCashReward(
  order: OrderDefinition,
): number {
  return order.rewards
    .filter((reward) => reward.type === "CASH")
    .reduce((total, reward) => total + reward.amount, 0);
}

/**
 * Calculate total reputation reward.
 */
export function getOrderReputationReward(
  order: OrderDefinition,
): number {
  return order.rewards
    .filter((reward) => reward.type === "REPUTATION")
    .reduce((total, reward) => total + reward.amount, 0);
}

/**
 * Calculate total XP reward.
 */
export function getOrderXpReward(
  order: OrderDefinition,
): number {
  return order.rewards
    .filter((reward) => reward.type === "XP")
    .reduce((total, reward) => total + reward.amount, 0);
}

/**
 * Convenience helper for UI.
 */
export function getOrderRewardSummary(
  order: OrderDefinition,
): {
  cash: number;
  reputation: number;
  xp: number;
} {
  return {
    cash: getOrderCashReward(order),
    reputation: getOrderReputationReward(order),
    xp: getOrderXpReward(order),
  };
}

/**
 * Return shortest possible duration for an order.
 */
export function getOrderMinimumHours(
  order: OrderDefinition,
): number {
  return order.duration.minimumHours;
}

/**
 * Return base duration for an order.
 */
export function getOrderBaseHours(
  order: OrderDefinition,
): number {
  return order.duration.baseHours;
}

/**
 * Return maximum duration for an order.
 */
export function getOrderMaximumHours(
  order: OrderDefinition,
): number {
  return order.duration.maximumHours;
}

/**
 * Human-readable type label.
 */
export function getOrderTypeLabel(
  type: OrderType,
): string {
  const labels: Record<OrderType, string> = {
    SERVICE: "SERVICE",
    REPAIR: "REPAIR",
    CUSTOMIZATION: "CUSTOM",
    ENGINE_BUILD: "ENGINE BUILD",
    RESTORATION: "RESTORATION",
    RACE_PREP: "RACE PREP",
    FULL_BUILD: "FULL BUILD",
  };

  return labels[type];
}

/**
 * Human-readable difficulty label.
 */
export function getOrderDifficultyLabel(
  difficulty: OrderDifficulty,
): string {
  const labels: Record<OrderDifficulty, string> = {
    EASY: "EASY",
    NORMAL: "NORMAL",
    HARD: "HARD",
    EXPERT: "EXPERT",
    LEGENDARY: "LEGENDARY",
  };

  return labels[difficulty];
}

/**
 * Human-readable priority label.
 */
export function getOrderPriorityLabel(
  priority: OrderPriority,
): string {
  const labels: Record<OrderPriority, string> = {
    LOW: "LOW",
    NORMAL: "NORMAL",
    HIGH: "HIGH",
    URGENT: "URGENT",
  };

  return labels[priority];
}

/**
 * Return all unique order types currently present in the catalog.
 */
export function getOrderTypes(): OrderType[] {
  return [...new Set(ORDERS.map((order) => order.type))];
}

/**
 * Validate the static order catalog.
 *
 * Useful during development/tests.
 */
export function validateOrderCatalog(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const order of ORDERS) {
    /* Duplicate IDs */
    if (ids.has(order.id)) {
      errors.push(`Duplicate order ID: ${order.id}`);
    }

    ids.add(order.id);

    /* Basic fields */
    if (!order.title.trim()) {
      errors.push(`Order ${order.id}: missing title`);
    }

    if (!order.shortTitle.trim()) {
      errors.push(`Order ${order.id}: missing shortTitle`);
    }

    if (!order.customerName.trim()) {
      errors.push(`Order ${order.id}: missing customerName`);
    }

    if (!order.description.trim()) {
      errors.push(`Order ${order.id}: missing description`);
    }

    /* Duration */
    const {
      baseHours,
      minimumHours,
      maximumHours,
    } = order.duration;

    if (minimumHours < 0) {
      errors.push(
        `Order ${order.id}: minimumHours cannot be negative`,
      );
    }

    if (baseHours < minimumHours) {
      errors.push(
        `Order ${order.id}: baseHours must be >= minimumHours`,
      );
    }

    if (maximumHours < baseHours) {
      errors.push(
        `Order ${order.id}: maximumHours must be >= baseHours`,
      );
    }

    /* Generation */
    if (order.generationWeight < 0) {
      errors.push(
        `Order ${order.id}: generationWeight cannot be negative`,
      );
    }

    if (order.poolLimit < 0) {
      errors.push(
        `Order ${order.id}: poolLimit cannot be negative`,
      );
    }

    /* Rewards */
    for (const reward of order.rewards) {
      if (reward.amount < 0) {
        errors.push(
          `Order ${order.id}: reward amount cannot be negative`,
        );
      }
    }

    /* Requirements */
    for (const requirement of order.requirements) {
      if (
        requirement.value === "" ||
        requirement.value === null ||
        requirement.value === undefined
      ) {
        errors.push(
          `Order ${order.id}: empty requirement value`,
        );
      }
    }

    /* Motor classes */
    if (order.motorClasses) {
      const uniqueClasses = new Set(order.motorClasses);

      if (uniqueClasses.size !== order.motorClasses.length) {
        errors.push(
          `Order ${order.id}: duplicate motor class`,
        );
      }
    }

    /* Public jobs should normally have generation weight */
    if (order.publicBoard && order.generationWeight === 0) {
      errors.push(
        `Order ${order.id}: publicBoard order has zero generationWeight`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

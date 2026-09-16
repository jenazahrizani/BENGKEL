/**
 * BENGKEL MALAM
 * Motor Game Logic
 *
 * RESPONSIBILITY:
 * - Membentuk instance motor milik pemain.
 * - Menghitung kondisi motor.
 * - Menghitung performa motor dari base stats + installed parts.
 * - Install / remove part.
 * - Repair motor.
 * - Menghitung nilai motor.
 * - Validasi build motor.
 *
 * IMPORTANT:
 * - Tidak menggunakan localStorage.
 * - Tidak mengetahui storage implementation.
 * - Tidak melakukan mutation terhadap object input.
 * - Semua function menghasilkan object / value baru.
 *
 * MASTER DATA:
 * - ../data/motors.ts
 * - ../data/parts.ts
 */

import {
  getMotorById,
  getMotorConditionTier,
  type MotorDefinition,
  type MotorConditionTier,
  type MotorBaseStats,
  type MotorPerformanceProfile,
} from "../data/motors";

import {
  getPartById,
  isPartCompatible,
  getPartConditionTier,
  type PartDefinition,
  type PartConditionTier,
  type PartPerformanceModifier,
} from "../data/parts";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface InstalledPartInstance {
  /**
   * Unique player-owned part instance ID.
   */
  instanceId: string;

  /**
   * Static catalog ID from parts.ts.
   */
  definitionId: string;

  /**
   * Condition of this particular part.
   * 0-100.
   */
  condition: number;

  /**
   * Game-time when installed.
   */
  installedAt: number;

  /**
   * Optional source information.
   */
  source?: string;
}

export interface MotorInstance {
  /**
   * Unique player-owned motor ID.
   */
  id: string;

  /**
   * Static catalog ID from motors.ts.
   */
  definitionId: string;

  /**
   * Current motor condition.
   * 0-100.
   */
  condition: number;

  /**
   * Current installed part instances.
   *
   * Key = part category.
   *
   * Example:
   * {
   *   ENGINE: {...},
   *   BRAKE: {...},
   *   TIRE: {...}
   * }
   */
  installedParts: Partial<
    Record<
      string,
      InstalledPartInstance
    >
  >;

  /**
   * Player-defined motor nickname.
   */
  nickname?: string;

  /**
   * Current odometer / usage count.
   *
   * This is intentionally abstract game mileage.
   */
  mileage: number;

  /**
   * Number of races completed with this motor.
   */
  raceCount: number;

  /**
   * Number of workshop jobs completed.
   */
  serviceCount: number;

  /**
   * Game-time when motor was acquired.
   */
  acquiredAt: number;

  /**
   * Whether motor is currently busy.
   *
   * Examples:
   * - workshop
   * - race
   * - market listing
   */
  status:
    | "READY"
    | "WORKSHOP"
    | "RACE"
    | "LISTED"
    | "LOCKED";
}

/**
 * Computed motor stats shown to player.
 */
export interface ComputedMotorStats {
  power: number;
  acceleration: number;
  grip: number;
  reliability: number;

  topSpeed: number;
  launch: number;
  braking: number;
  handling: number;
}

/**
 * Result for mutating motor state.
 */
export interface MotorOperationResult {
  success: boolean;

  motor?: MotorInstance;

  error?: MotorErrorCode;
  message?: string;
}

export type MotorErrorCode =
  | "MOTOR_NOT_FOUND"
  | "PART_NOT_FOUND"
  | "PART_ALREADY_INSTALLED"
  | "PART_CATEGORY_OCCUPIED"
  | "PART_INCOMPATIBLE"
  | "PART_LOCKED"
  | "INVALID_CONDITION"
  | "INVALID_QUANTITY"
  | "MOTOR_NOT_READY"
  | "MOTOR_BUSY"
  | "MOTOR_FULL_CONDITION"
  | "MISSING_PREREQUISITE"
  | "INVALID_BUILD";

/**
 * Repair cost result.
 */
export interface RepairCost {
  conditionLost: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  hours: number;
}

/**
 * Motor value breakdown.
 */
export interface MotorValueBreakdown {
  baseValue: number;
  conditionValue: number;
  partValue: number;
  wearPenalty: number;
  totalValue: number;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_CONDITION = 100;

const CONDITION_WEAR_THRESHOLD = 60;

const DEFAULT_PART_VALUE_RETURN_RATIO = 0.55;

const DEFAULT_REPAIR_MATERIAL_RATE = 0.075;

const DEFAULT_REPAIR_LABOR_RATE = 0.045;

const DEFAULT_REPAIR_HOURS = 2;

/**
 * Category names are intentionally strings here instead of importing
 * a separate category enum so the instance remains easy to serialize.
 */
export const MOTOR_PART_SLOTS = [
  "ENGINE",
  "FUEL",
  "IGNITION",
  "TRANSMISSION",
  "CLUTCH",
  "DRIVETRAIN",
  "BRAKE",
  "SUSPENSION",
  "WHEEL",
  "TIRE",
  "ELECTRICAL",
  "EXHAUST",
  "BODY",
  "FRAME",
  "COOLING",
  "UTILITY",
] as const;

export type MotorPartSlot =
  (typeof MOTOR_PART_SLOTS)[number];

/* -------------------------------------------------------------------------- */
/* GENERAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clamp condition/stat into 0-100.
 */
export function clampPercent(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(
    Math.min(
      MAX_CONDITION,
      Math.max(0, value),
    ),
  );
}

/**
 * Clamp money.
 */
export function clampMoney(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(value),
  );
}

/**
 * Round money to nearest 1,000.
 */
export function roundMotorMoney(
  value: number,
): number {
  return (
    Math.round(
      clampMoney(value) / 1_000,
    ) * 1_000
  );
}

/**
 * Determine whether an object is a valid motor instance.
 */
export function isMotorInstance(
  value: unknown,
): value is MotorInstance {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const motor =
    value as Partial<MotorInstance>;

  return (
    typeof motor.id === "string" &&
    typeof motor.definitionId === "string" &&
    typeof motor.condition === "number" &&
    typeof motor.mileage === "number" &&
    typeof motor.raceCount === "number" &&
    typeof motor.serviceCount === "number" &&
    typeof motor.acquiredAt === "number" &&
    typeof motor.status === "string" &&
    typeof motor.installedParts === "object"
  );
}

/* -------------------------------------------------------------------------- */
/* MOTOR INSTANCE CREATION                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Create a new player-owned motor instance.
 *
 * This does not add the motor to GameState.
 */
export function createMotorInstance(
  definitionId: string,
  options?: {
    id?: string;
    condition?: number;
    acquiredAt?: number;
    nickname?: string;
    mileage?: number;
    raceCount?: number;
    serviceCount?: number;
    status?: MotorInstance["status"];
    installedParts?: MotorInstance["installedParts"];
  },
): MotorInstance | undefined {
  const definition =
    getMotorById(
      definitionId,
    );

  if (!definition) {
    return undefined;
  }

  const now =
    options?.acquiredAt ??
    Date.now();

  return {
    id:
      options?.id ??
      createMotorInstanceId(
        definitionId,
        now,
      ),

    definitionId,

    condition:
      clampPercent(
        options?.condition ??
        definition.factoryCondition,
      ),

    installedParts:
      cloneInstalledParts(
        options?.installedParts,
      ),

    nickname:
      options?.nickname,

    mileage:
      Math.max(
        0,
        Math.floor(
          options?.mileage ?? 0,
        ),
      ),

    raceCount:
      Math.max(
        0,
        Math.floor(
          options?.raceCount ?? 0,
        ),
      ),

    serviceCount:
      Math.max(
        0,
        Math.floor(
          options?.serviceCount ?? 0,
        ),
      ),

    acquiredAt: now,

    status:
      options?.status ??
      "READY",
  };
}

/**
 * Create deterministic-enough local ID.
 *
 * Uniqueness should still be guaranteed by GameState layer.
 */
export function createMotorInstanceId(
  definitionId: string,
  timestamp = Date.now(),
): string {
  return `motor-${definitionId}-${timestamp}-${Math.floor(
    Math.random() * 1_000_000,
  )}`;
}

/**
 * Clone installed parts.
 */
export function cloneInstalledParts(
  installedParts:
    | MotorInstance["installedParts"]
    | undefined,
): MotorInstance["installedParts"] {
  if (!installedParts) {
    return {};
  }

  const output:
    MotorInstance["installedParts"] = {};

  for (
    const [category, part] of
      Object.entries(
        installedParts,
      )
  ) {
    if (!part) {
      continue;
    }

    output[category] = {
      ...part,
    };
  }

  return output;
}

/**
 * Get motor definition from an instance.
 */
export function getMotorDefinition(
  motor:
    | MotorInstance
    | undefined,
): MotorDefinition | undefined {
  if (!motor) {
    return undefined;
  }

  return getMotorById(
    motor.definitionId,
  );
}

/* -------------------------------------------------------------------------- */
/* CONDITION                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get motor condition tier.
 */
export function getMotorInstanceConditionTier(
  motor:
    | MotorInstance
    | undefined,
): MotorConditionTier {
  if (!motor) {
    return "SALVAGE";
  }

  return getMotorConditionTier(
    motor.condition,
  );
}

/**
 * Return numeric condition.
 */
export function getMotorCondition(
  motor:
    | MotorInstance
    | undefined,
): number {
  return clampPercent(
    motor?.condition ?? 0,
  );
}

/**
 * Check whether motor is in safe condition.
 */
export function isMotorOperational(
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (!motor) {
    return false;
  }

  return motor.condition > 0;
}

/**
 * Check whether a motor needs service.
 */
export function needsMotorService(
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (!motor) {
    return true;
  }

  return (
    motor.condition <
    CONDITION_WEAR_THRESHOLD
  );
}

/**
 * Return condition percentage as a display string.
 */
export function formatMotorCondition(
  motor:
    | MotorInstance
    | undefined,
): string {
  return `${getMotorCondition(
    motor,
  )}%`;
}

/* -------------------------------------------------------------------------- */
/* PART LOOKUP                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Return installed part by category.
 */
export function getInstalledPart(
  motor:
    | MotorInstance
    | undefined,
  category: MotorPartSlot | string,
): InstalledPartInstance | undefined {
  if (!motor) {
    return undefined;
  }

  return motor.installedParts[
    category
  ];
}

/**
 * Return static part definition installed in a slot.
 */
export function getInstalledPartDefinition(
  motor:
    | MotorInstance
    | undefined,
  category: MotorPartSlot | string,
): PartDefinition | undefined {
  const installed =
    getInstalledPart(
      motor,
      category,
    );

  if (!installed) {
    return undefined;
  }

  return getPartById(
    installed.definitionId,
  );
}

/**
 * Return all installed parts.
 */
export function getInstalledParts(
  motor:
    | MotorInstance
    | undefined,
): InstalledPartInstance[] {
  if (!motor) {
    return [];
  }

  return Object.values(
    motor.installedParts,
  ).filter(
    (
      part,
    ): part is InstalledPartInstance =>
      Boolean(part),
  );
}

/**
 * Return part count.
 */
export function getInstalledPartCount(
  motor:
    | MotorInstance
    | undefined,
): number {
  return getInstalledParts(
    motor,
  ).length;
}

/* -------------------------------------------------------------------------- */
/* BUILD COMPATIBILITY                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Check if the motor can receive a specific part.
 */
export function canInstallPart(
  motor:
    | MotorInstance
    | undefined,
  part:
    | PartDefinition
    | undefined,
): boolean {
  if (!motor || !part) {
    return false;
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    return false;
  }

  if (
    motor.status !==
    "READY"
  ) {
    return false;
  }

  const category =
    part.category;

  const occupied =
    motor.installedParts[
      category
    ];

  if (occupied) {
    return false;
  }

  return isPartCompatible(
    part,
    {
      id:
        definition.id,

      class:
        definition.class,

      category:
        definition.category,

      engineType:
        definition.engineType,
    },
  );
}

/**
 * Validate part prerequisites.
 *
 * Checks only part-to-part prerequisites.
 * Progression requirements belong to player/game state.
 */
export function arePartPrerequisitesInstalled(
  motor:
    | MotorInstance
    | undefined,
  part:
    | PartDefinition
    | undefined,
): boolean {
  if (!motor || !part) {
    return false;
  }

  const requiredParts =
    part.requirements
      .requiredParts ??
    [];

  for (
    const requiredPartId of
      requiredParts
  ) {
    const found =
      getInstalledParts(
        motor,
      ).some(
        (installed) =>
          installed.definitionId ===
          requiredPartId,
      );

    if (!found) {
      return false;
    }
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* INSTALL / REMOVE                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Install a part on the motor.
 *
 * The caller must separately decrement player inventory.
 */
export function installPart(
  motor:
    | MotorInstance
    | undefined,
  part:
    | PartDefinition
    | undefined,
  options?: {
    instanceId?: string;
    condition?: number;
    installedAt?: number;
    source?: string;
  },
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (!part) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan.",
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    return {
      success: false,
      error: "MOTOR_BUSY",
      message:
        "Motor sedang digunakan dan belum siap menerima pengerjaan.",
    };
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Definisi motor tidak ditemukan.",
    };
  }

  if (
    !isPartCompatible(
      part,
      {
        id:
          definition.id,
        class:
          definition.class,
        category:
          definition.category,
        engineType:
          definition.engineType,
      },
    )
  ) {
    return {
      success: false,
      error: "PART_INCOMPATIBLE",
      message:
        "Part tidak kompatibel dengan motor ini.",
    };
  }

  const existing =
    motor.installedParts[
      part.category
    ];

  if (existing) {
    return {
      success: false,
      error: "PART_CATEGORY_OCCUPIED",
      message:
        `Slot ${part.category} sudah terisi.`,
    };
  }

  if (
    !arePartPrerequisitesInstalled(
      motor,
      part,
    )
  ) {
    return {
      success: false,
      error: "MISSING_PREREQUISITE",
      message:
        "Part yang dibutuhkan belum terpasang.",
    };
  }

  const partCondition =
    clampPercent(
      options?.condition ??
      part.defaultCondition,
    );

  const instance: InstalledPartInstance =
    {
      instanceId:
        options?.instanceId ??
        createPartInstanceId(
          part.id,
        ),

      definitionId:
        part.id,

      condition:
        partCondition,

      installedAt:
        options?.installedAt ??
        Date.now(),

      source:
        options?.source,
    };

  return {
    success: true,

    motor: {
      ...motor,

      installedParts: {
        ...cloneInstalledParts(
          motor.installedParts,
        ),

        [part.category]:
          instance,
      },

      condition:
        calculateMotorConditionAfterPartInstall(
          motor,
          part,
        ),
    },
  };
}

/**
 * Create an owned-part instance ID.
 */
export function createPartInstanceId(
  definitionId: string,
  timestamp = Date.now(),
): string {
  return `part-${definitionId}-${timestamp}-${Math.floor(
    Math.random() * 1_000_000,
  )}`;
}

/**
 * Remove a part from the motor.
 *
 * Returns removed part separately because the caller
 * may need to return it to inventory.
 */
export interface RemovePartResult
  extends MotorOperationResult {
  removedPart?:
    | InstalledPartInstance;
}

/**
 * Remove installed part.
 */
export function removePart(
  motor:
    | MotorInstance
    | undefined,
  category: MotorPartSlot | string,
): RemovePartResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    return {
      success: false,
      error: "MOTOR_BUSY",
      message:
        "Motor sedang digunakan.",
    };
  }

  const installed =
    motor.installedParts[
      category
    ];

  if (!installed) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Tidak ada part terpasang di slot tersebut.",
    };
  }

  const nextParts =
    cloneInstalledParts(
      motor.installedParts,
    );

  delete nextParts[
    category
  ];

  return {
    success: true,

    motor: {
      ...motor,

      installedParts:
        nextParts,
    },

    removedPart:
      installed,
  };
}

/* -------------------------------------------------------------------------- */
/* MOTOR CONDITION / WEAR                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Installing a performance part may slightly affect condition
 * depending on component tier.
 *
 * Most installations preserve motor condition.
 * This helper exists to centralize the rule.
 */
export function calculateMotorConditionAfterPartInstall(
  motor: MotorInstance,
  part: PartDefinition,
): number {
  let delta = 0;

  if (
    part.tier ===
    "RACE"
  ) {
    delta = -1;
  }

  if (
    part.tier ===
    "ELITE"
  ) {
    delta = -1;
  }

  if (
    part.tier ===
    "LEGENDARY"
  ) {
    delta = -2;
  }

  return clampPercent(
    motor.condition +
      delta,
  );
}

/**
 * Apply race wear.
 *
 * This does not inspect actual race outcome.
 * Race engine decides how much wear to apply.
 */
export function applyRaceWear(
  motor:
    | MotorInstance
    | undefined,
  wear: number,
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (
    !Number.isFinite(wear) ||
    wear < 0
  ) {
    return {
      success: false,
      error: "INVALID_CONDITION",
      message:
        "Nilai wear tidak valid.",
    };
  }

  const nextCondition =
    clampPercent(
      motor.condition -
        wear,
    );

  return {
    success: true,

    motor: {
      ...motor,

      condition:
        nextCondition,

      mileage:
        motor.mileage +
        Math.max(
          0,
          Math.round(
            wear * 10,
          ),
        ),

      raceCount:
        motor.raceCount + 1,

      status:
        "READY",
    },
  };
}

/**
 * Apply service usage.
 *
 * Useful after workshop service.
 */
export function applyServiceResult(
  motor:
    | MotorInstance
    | undefined,
  conditionGain = 0,
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (
    !Number.isFinite(
      conditionGain,
    ) ||
    conditionGain < 0
  ) {
    return {
      success: false,
      error: "INVALID_CONDITION",
      message:
        "Condition gain tidak valid.",
    };
  }

  return {
    success: true,

    motor: {
      ...motor,

      condition:
        clampPercent(
          motor.condition +
            conditionGain,
        ),

      serviceCount:
        motor.serviceCount + 1,

      status:
        "READY",
    },
  };
}

/* -------------------------------------------------------------------------- */
/* REPAIR                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Calculate repair cost.
 *
 * Cost scales with:
 * - condition lost
 * - installed parts
 * - motor base value
 */
export function calculateRepairCost(
  motor:
    | MotorInstance
    | undefined,
  targetCondition = 100,
  options?: {
    materialRate?: number;
    laborRate?: number;
    hoursPerTenCondition?: number;
  },
): RepairCost {
  if (!motor) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const target =
    clampPercent(
      targetCondition,
    );

  const current =
    clampPercent(
      motor.condition,
    );

  const conditionLost =
    Math.max(
      0,
      target - current,
    );

  if (
    conditionLost <= 0
  ) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const materialRate =
    options?.materialRate ??
    DEFAULT_REPAIR_MATERIAL_RATE;

  const laborRate =
    options?.laborRate ??
    DEFAULT_REPAIR_LABOR_RATE;

  const hoursPerTen =
    options?.hoursPerTenCondition ??
    DEFAULT_REPAIR_HOURS;

  const installedParts =
    getInstalledParts(
      motor,
    );

  const partValue =
    installedParts.reduce(
      (
        total,
        installed,
      ) => {
        const part =
          getPartById(
            installed.definitionId,
          );

        return (
          total +
          (part?.economy.baseValue ??
            0)
        );
      },
      0,
    );

  const combinedValue =
    definition.economy.baseValue +
    partValue;

  const materialCost =
    combinedValue *
    materialRate *
    (conditionLost / 100);

  const laborCost =
    combinedValue *
    laborRate *
    (conditionLost / 100);

  const hours =
    Math.max(
      1,
      Math.ceil(
        (conditionLost /
          10) *
          hoursPerTen,
      ),
    );

  return {
    conditionLost,

    materialCost:
      roundMotorMoney(
        materialCost,
      ),

    laborCost:
      roundMotorMoney(
        laborCost,
      ),

    totalCost:
      roundMotorMoney(
        materialCost +
          laborCost,
      ),

    hours,
  };
}

/**
 * Repair motor to target condition.
 *
 * Money deduction happens outside this module.
 */
export function repairMotor(
  motor:
    | MotorInstance
    | undefined,
  targetCondition = 100,
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    return {
      success: false,
      error: "MOTOR_BUSY",
      message:
        "Motor sedang digunakan.",
    };
  }

  const target =
    clampPercent(
      targetCondition,
    );

  if (
    target <=
    motor.condition
  ) {
    return {
      success: false,
      error: "MOTOR_FULL_CONDITION",
      message:
        "Tidak ada repair yang diperlukan.",
    };
  }

  return {
    success: true,

    motor: {
      ...motor,

      condition:
        target,

      serviceCount:
        motor.serviceCount + 1,

      status:
        "READY",
    },
  };
}

/* -------------------------------------------------------------------------- */
/* STAT CALCULATION                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Get empty base stats.
 */
export function createEmptyMotorStats(): ComputedMotorStats {
  return {
    power: 0,
    acceleration: 0,
    grip: 0,
    reliability: 0,

    topSpeed: 0,
    launch: 0,
    braking: 0,
    handling: 0,
  };
}

/**
 * Copy base motor stats into computed stats.
 */
export function getBaseMotorStats(
  definition:
    | MotorDefinition
    | undefined,
): ComputedMotorStats {
  if (!definition) {
    return createEmptyMotorStats();
  }

  return {
    power:
      definition.baseStats.power,

    acceleration:
      definition.baseStats.acceleration,

    grip:
      definition.baseStats.grip,

    reliability:
      definition.baseStats.reliability,

    topSpeed:
      definition.performance.topSpeed,

    launch:
      definition.performance.launch,

    braking:
      definition.performance.braking,

    handling:
      definition.performance.handling,
  };
}

/**
 * Apply one part modifier.
 */
export function applyPartModifier(
  stats: ComputedMotorStats,
  modifier:
    | PartPerformanceModifier
    | undefined,
  condition = 100,
): ComputedMotorStats {
  if (!modifier) {
    return {
      ...stats,
    };
  }

  /**
   * Part effectiveness scales slightly with condition.
   *
   * 100 condition => 100% modifier
   * 50 condition  => 75% modifier
   * 0 condition   => 50% modifier
   *
   * This prevents a damaged part from becoming completely useless
   * while still making maintenance meaningful.
   */
  const effectiveness =
    0.5 +
    clampPercent(
      condition,
    ) /
      200;

  const add =
    (
      value: number | undefined,
    ) =>
      (value ?? 0) *
      effectiveness;

  return {
    power:
      stats.power +
      add(modifier.power),

    acceleration:
      stats.acceleration +
      add(
        modifier.acceleration,
      ),

    grip:
      stats.grip +
      add(modifier.grip),

    reliability:
      stats.reliability +
      add(
        modifier.reliability,
      ),

    topSpeed:
      stats.topSpeed +
      add(modifier.topSpeed),

    launch:
      stats.launch +
      add(modifier.launch),

    braking:
      stats.braking +
      add(modifier.braking),

    handling:
      stats.handling +
      add(modifier.handling),
  };
}

/**
 * Apply all installed parts.
 */
export function calculateMotorStats(
  motor:
    | MotorInstance
    | undefined,
): ComputedMotorStats {
  const definition =
    getMotorDefinition(
      motor,
    );

  if (!motor || !definition) {
    return createEmptyMotorStats();
  }

  let stats =
    getBaseMotorStats(
      definition,
    );

  for (
    const installed of
      getInstalledParts(motor)
  ) {
    const part =
      getPartById(
        installed.definitionId,
      );

    if (!part) {
      continue;
    }

    stats =
      applyPartModifier(
        stats,
        part.performance,
        installed.condition,
      );
  }

  /**
   * Motor condition affects final performance.
   *
   * Above 85%:
   *   normal
   *
   * 60-84%:
   *   mild penalty
   *
   * 40-59%:
   *   moderate penalty
   *
   * 20-39%:
   *   heavy penalty
   *
   * below 20%:
   *   severe penalty
   */
  const conditionFactor =
    getMotorConditionPerformanceFactor(
      motor.condition,
    );

  stats = scaleMotorStats(
    stats,
    conditionFactor,
  );

  return normalizeMotorStats(
    stats,
  );
}

/**
 * Condition performance factor.
 *
 * Returned as multiplier.
 */
export function getMotorConditionPerformanceFactor(
  condition: number,
): number {
  const value =
    clampPercent(
      condition,
    );

  if (value >= 85) {
    return 1;
  }

  if (value >= 60) {
    return 0.97;
  }

  if (value >= 40) {
    return 0.92;
  }

  if (value >= 20) {
    return 0.84;
  }

  return 0.72;
}

/**
 * Scale performance stats.
 */
export function scaleMotorStats(
  stats: ComputedMotorStats,
  factor: number,
): ComputedMotorStats {
  const safeFactor =
    Math.max(
      0,
      Number.isFinite(factor)
        ? factor
        : 1,
    );

  return {
    power:
      stats.power *
      safeFactor,

    acceleration:
      stats.acceleration *
      safeFactor,

    grip:
      stats.grip *
      safeFactor,

    reliability:
      stats.reliability *
      safeFactor,

    topSpeed:
      stats.topSpeed *
      safeFactor,

    launch:
      stats.launch *
      safeFactor,

    braking:
      stats.braking *
      safeFactor,

    handling:
      stats.handling *
      safeFactor,
  };
}

/**
 * Normalize computed stats to 0-100.
 */
export function normalizeMotorStats(
  stats: ComputedMotorStats,
): ComputedMotorStats {
  return {
    power:
      clampPercent(stats.power),

    acceleration:
      clampPercent(
        stats.acceleration,
      ),

    grip:
      clampPercent(stats.grip),

    reliability:
      clampPercent(
        stats.reliability,
      ),

    topSpeed:
      clampPercent(
        stats.topSpeed,
      ),

    launch:
      clampPercent(stats.launch),

    braking:
      clampPercent(
        stats.braking,
      ),

    handling:
      clampPercent(
        stats.handling,
      ),
  };
}

/**
 * Average of the four main garage stats.
 */
export function getMotorBuildScore(
  motor:
    | MotorInstance
    | undefined,
): number {
  const stats =
    calculateMotorStats(
      motor,
    );

  const total =
    stats.power +
    stats.acceleration +
    stats.grip +
    stats.reliability;

  return Math.round(
    total / 4,
  );
}

/**
 * Average of race-facing stats.
 */
export function getMotorRaceScore(
  motor:
    | MotorInstance
    | undefined,
): number {
  const stats =
    calculateMotorStats(
      motor,
    );

  const total =
    stats.topSpeed +
    stats.launch +
    stats.acceleration +
    stats.braking +
    stats.handling;

  return Math.round(
    total / 5,
  );
}

/* -------------------------------------------------------------------------- */
/* BUILD SCORE / LABELS                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Return strongest main stat.
 */
export function getMotorPrimaryStat(
  motor:
    | MotorInstance
    | undefined,
): {
  stat:
    | "power"
    | "acceleration"
    | "grip"
    | "reliability";
  value: number;
} {
  const stats =
    calculateMotorStats(
      motor,
    );

  const candidates = [
    ["power", stats.power],
    [
      "acceleration",
      stats.acceleration,
    ],
    ["grip", stats.grip],
    [
      "reliability",
      stats.reliability,
    ],
  ] as const;

  return candidates.reduce(
    (
      best,
      current,
    ) =>
      current[1] >
      best[1]
        ? current
        : best,
  );
}

/**
 * Return strongest race stat.
 */
export function getMotorPrimaryRaceStat(
  motor:
    | MotorInstance
    | undefined,
): {
  stat:
    | "topSpeed"
    | "launch"
    | "acceleration"
    | "braking"
    | "handling";
  value: number;
} {
  const stats =
    calculateMotorStats(
      motor,
    );

  const candidates = [
    ["topSpeed", stats.topSpeed],
    ["launch", stats.launch],
    [
      "acceleration",
      stats.acceleration,
    ],
    ["braking", stats.braking],
    ["handling", stats.handling],
  ] as const;

  return candidates.reduce(
    (
      best,
      current,
    ) =>
      current[1] >
      best[1]
        ? current
        : best,
  );
}

/**
 * Return display name.
 */
export function getMotorInstanceDisplayName(
  motor:
    | MotorInstance
    | undefined,
): string {
  if (!motor) {
    return "UNKNOWN MOTOR";
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    return "UNKNOWN MOTOR";
  }

  return (
    motor.nickname?.trim() ||
    `${definition.brand} ${definition.shortName}`
  );
}

/* -------------------------------------------------------------------------- */
/* MOTOR VALUE                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Calculate current market value of an owned motor.
 *
 * Includes:
 * - motor base value
 * - current condition
 * - installed part value
 * - mileage / wear penalty
 */
export function calculateMotorValueBreakdown(
  motor:
    | MotorInstance
    | undefined,
): MotorValueBreakdown {
  const definition =
    getMotorDefinition(
      motor,
    );

  if (!motor || !definition) {
    return {
      baseValue: 0,
      conditionValue: 0,
      partValue: 0,
      wearPenalty: 0,
      totalValue: 0,
    };
  }

  const baseValue =
    definition.economy.baseValue;

  const conditionMultiplier =
    getMotorValueConditionMultiplier(
      motor.condition,
    );

  const conditionValue =
    baseValue *
    conditionMultiplier;

  const partValue =
    getInstalledParts(
      motor,
    ).reduce(
      (
        total,
        installed,
      ) => {
        const part =
          getPartById(
            installed.definitionId,
          );

        if (!part) {
          return total;
        }

        const partCondition =
          clampPercent(
            installed.condition,
          ) / 100;

        return (
          total +
          part.economy.baseValue *
            DEFAULT_PART_VALUE_RETURN_RATIO *
            partCondition
        );
      },
      0,
    );

  const wearPenalty =
    calculateMileagePenalty(
      motor.mileage,
      baseValue,
    );

  const totalValue =
    roundMotorMoney(
      Math.max(
        0,
        conditionValue +
          partValue -
          wearPenalty,
      ),
    );

  return {
    baseValue,
    conditionValue:
      roundMotorMoney(
        conditionValue,
      ),

    partValue:
      roundMotorMoney(
        partValue,
      ),

    wearPenalty:
      roundMotorMoney(
        wearPenalty,
      ),

    totalValue,
  };
}

/**
 * Calculate total current motor value.
 */
export function calculateMotorValue(
  motor:
    | MotorInstance
    | undefined,
): number {
  return calculateMotorValueBreakdown(
    motor,
  ).totalValue;
}

/**
 * Condition multiplier used by value calculation.
 */
export function getMotorValueConditionMultiplier(
  condition: number,
): number {
  const value =
    clampPercent(
      condition,
    );

  if (value < 20) {
    return 0.3;
  }

  if (value < 40) {
    return 0.5;
  }

  if (value < 60) {
    return 0.7;
  }

  if (value < 85) {
    return 0.9;
  }

  return 1;
}

/**
 * Calculate abstract mileage value penalty.
 */
export function calculateMileagePenalty(
  mileage: number,
  baseValue: number,
): number {
  const safeMileage =
    Math.max(
      0,
      Number.isFinite(
        mileage,
      )
        ? mileage
        : 0,
    );

  /**
   * Every 1,000 game-km applies a very small penalty.
   * Capped at 25% of base motor value.
   */
  const penaltyRatio =
    Math.min(
      0.25,
      safeMileage /
        1_000_000,
    );

  return (
    Math.max(
      0,
      baseValue,
    ) *
    penaltyRatio
  );
}

/* -------------------------------------------------------------------------- */
/* RACE PREPARATION                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Check if motor is race-ready.
 */
export function isMotorRaceReady(
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (!motor) {
    return false;
  }

  if (
    motor.status !==
    "READY"
  ) {
    return false;
  }

  if (
    motor.condition <=
    0
  ) {
    return false;
  }

  return true;
}

/**
 * Return a race readiness summary.
 */
export interface MotorRaceReadiness {
  ready: boolean;
  condition: number;
  buildScore: number;
  raceScore: number;
  reliability: number;
  issues: string[];
}

/**
 * Calculate race readiness.
 */
export function getMotorRaceReadiness(
  motor:
    | MotorInstance
    | undefined,
): MotorRaceReadiness {
  const issues: string[] = [];

  if (!motor) {
    return {
      ready: false,
      condition: 0,
      buildScore: 0,
      raceScore: 0,
      reliability: 0,
      issues: [
        "Motor tidak ditemukan.",
      ],
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    issues.push(
      "Motor sedang tidak ready.",
    );
  }

  if (
    motor.condition <=
    0
  ) {
    issues.push(
      "Condition motor habis.",
    );
  }

  if (
    motor.condition <
    40
  ) {
    issues.push(
      "Condition terlalu rendah untuk race berisiko tinggi.",
    );
  }

  const stats =
    calculateMotorStats(
      motor,
    );

  if (
    stats.reliability <
    30
  ) {
    issues.push(
      "Reliability motor rendah.",
    );
  }

  return {
    ready:
      issues.length === 0,

    condition:
      motor.condition,

    buildScore:
      getMotorBuildScore(
        motor,
      ),

    raceScore:
      getMotorRaceScore(
        motor,
      ),

    reliability:
      stats.reliability,

    issues,
  };
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Create a new motor with a different status.
 */
export function setMotorStatus(
  motor:
    | MotorInstance
    | undefined,
  status:
    | MotorInstance["status"],
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  return {
    success: true,

    motor: {
      ...motor,
      status,
    },
  };
}

/**
 * Increment race count / mileage from external race logic.
 *
 * Race result details remain in race.ts.
 */
export function recordMotorRaceUsage(
  motor:
    | MotorInstance
    | undefined,
  options?: {
    mileage?: number;
    wear?: number;
  },
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  const mileage =
    Math.max(
      0,
      Math.floor(
        options?.mileage ?? 0,
      ),
    );

  const wear =
    Math.max(
      0,
      options?.wear ?? 0,
    );

  return {
    success: true,

    motor: {
      ...motor,

      mileage:
        motor.mileage +
        mileage,

      raceCount:
        motor.raceCount + 1,

      condition:
        clampPercent(
          motor.condition -
            wear,
        ),

      status:
        "READY",
    },
  };
}

/* -------------------------------------------------------------------------- */
/* BUILD VALIDATION                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Result of complete motor build validation.
 */
export interface MotorBuildValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a motor instance.
 */
export function validateMotorBuild(
  motor:
    | MotorInstance
    | undefined,
): MotorBuildValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!motor) {
    return {
      valid: false,
      errors: [
        "Motor tidak ditemukan.",
      ],
      warnings: [],
    };
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    errors.push(
      "Definisi motor tidak ditemukan.",
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  /* Instance fields */
  if (!motor.id.trim()) {
    errors.push(
      "Motor instance ID kosong.",
    );
  }

  if (
    motor.condition < 0 ||
    motor.condition > 100
  ) {
    errors.push(
      "Motor condition harus 0-100.",
    );
  }

  if (
    motor.mileage < 0
  ) {
    errors.push(
      "Motor mileage tidak boleh negatif.",
    );
  }

  if (
    motor.raceCount < 0
  ) {
    errors.push(
      "Motor raceCount tidak boleh negatif.",
    );
  }

  if (
    motor.serviceCount < 0
  ) {
    errors.push(
      "Motor serviceCount tidak boleh negatif.",
    );
  }

  /* Installed parts */
  for (
    const [
      category,
      installed,
    ] of Object.entries(
      motor.installedParts,
    )
  ) {
    if (!installed) {
      continue;
    }

    const part =
      getPartById(
        installed.definitionId,
      );

    if (!part) {
      errors.push(
        `Part ${installed.definitionId} tidak ditemukan.`,
      );

      continue;
    }

    if (
      installed.condition <
        0 ||
      installed.condition >
        100
    ) {
      errors.push(
        `Condition part ${part.id} harus 0-100.`,
      );
    }

    if (
      part.category !==
      category
    ) {
      errors.push(
        `Part ${part.id} berada pada slot ${category} yang salah.`,
      );
    }

    if (
      !isPartCompatible(
        part,
        {
          id:
            definition.id,
          class:
            definition.class,
          category:
            definition.category,
          engineType:
            definition.engineType,
        },
      )
    ) {
      errors.push(
        `Part ${part.id} tidak kompatibel dengan ${definition.id}.`,
      );
    }

    if (
      !arePartPrerequisitesInstalled(
        motor,
        part,
      )
    ) {
      errors.push(
        `Prerequisite part ${part.id} belum terpenuhi.`,
      );
    }

    if (
      installed.condition <
      40
    ) {
      warnings.push(
        `Part ${part.id} dalam kondisi rendah.`,
      );
    }
  }

  /* Motor state */
  if (
    motor.condition <
    20
  ) {
    warnings.push(
      "Motor berada pada kondisi salvage.",
    );
  } else if (
    motor.condition <
    40
  ) {
    warnings.push(
      "Motor condition sangat rendah.",
    );
  }

  if (
    motor.condition <
    60
  ) {
    warnings.push(
      "Motor membutuhkan service.",
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,

    warnings,
  };
}

/* -------------------------------------------------------------------------- */
/* SERIALIZATION / NORMALIZATION                                              */
/* -------------------------------------------------------------------------- */

/**
 * Normalize a motor instance loaded from localStorage.
 *
 * This is intentionally defensive because saved data can be older
 * or partially malformed.
 */
export function normalizeMotorInstance(
  input:
    | Partial<MotorInstance>
    | undefined,
): MotorInstance | undefined {
  if (!input) {
    return undefined;
  }

  const definitionId =
    input.definitionId;

  if (
    !definitionId ||
    !getMotorById(
      definitionId,
    )
  ) {
    return undefined;
  }

  return {
    id:
      input.id ??
      createMotorInstanceId(
        definitionId,
      ),

    definitionId,

    condition:
      clampPercent(
        input.condition ??
        getMotorById(
          definitionId,
        )!
          .factoryCondition,
      ),

    installedParts:
      cloneInstalledParts(
        input.installedParts,
      ),

    nickname:
      typeof input.nickname ===
      "string"
        ? input.nickname
        : undefined,

    mileage:
      Math.max(
        0,
        Math.floor(
          input.mileage ?? 0,
        ),
      ),

    raceCount:
      Math.max(
        0,
        Math.floor(
          input.raceCount ?? 0,
        ),
      ),

    serviceCount:
      Math.max(
        0,
        Math.floor(
          input.serviceCount ?? 0,
        ),
      ),

    acquiredAt:
      Number.isFinite(
        input.acquiredAt,
      )
        ? input.acquiredAt!
        : Date.now(),

    status:
      input.status ??
      "READY",
  };
}

/**
 * Clone a motor instance.
 */
export function cloneMotorInstance(
  motor:
    | MotorInstance
    | undefined,
): MotorInstance | undefined {
  if (!motor) {
    return undefined;
  }

  return {
    ...motor,

    installedParts:
      cloneInstalledParts(
        motor.installedParts,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* STATIC TYPE HELPERS                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Map a motor definition's original base/performance profile.
 *
 * Useful when another game system needs only static motor stats.
 */
export function getMotorStaticStats(
  definition:
    | MotorDefinition
    | undefined,
): {
  base: MotorBaseStats;
  performance: MotorPerformanceProfile;
} | undefined {
  if (!definition) {
    return undefined;
  }

  return {
    base: {
      ...definition.baseStats,
    },

    performance: {
      ...definition.performance,
    },
  };
}

/**
 * Get installed-part condition tier.
 */
export function getInstalledPartConditionTier(
  motor:
    | MotorInstance
    | undefined,
  category: MotorPartSlot | string,
): PartConditionTier | undefined {
  const installed =
    getInstalledPart(
      motor,
      category,
    );

  if (!installed) {
    return undefined;
  }

  return getPartConditionTier(
    installed.condition,
  );
}

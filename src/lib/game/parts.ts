/**
 * BENGKEL MALAM
 * Parts Game Logic
 *
 * RESPONSIBILITY:
 * - Mengelola inventory part milik pemain.
 * - Menambah / mengurangi quantity.
 * - Membuat owned-part instance.
 * - Validasi kompatibilitas part dengan motor.
 * - Install / remove melalui motor.ts.
 * - Repair part.
 * - Menghitung nilai inventory.
 * - Menyiapkan data untuk market / workshop.
 *
 * IMPORTANT:
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan GameState global.
 * - Tidak melakukan mutation terhadap object input.
 *
 * MASTER DATA:
 * - ../data/parts.ts
 * - ../data/motors.ts
 *
 * MOTOR RULES:
 * - ../game/motor.ts
 */

import {
  getPartById,
  isPartCompatible,
  getPartsForMotor,
  type PartDefinition,
  type PartCategory,
  type PartSource,
  type PartConditionTier,
} from "../data/parts";

import {
  getMotorDefinition,
  getInstalledParts,
  installPart as installMotorPart,
  removePart as removeMotorPart,
  type MotorInstance,
  type InstalledPartInstance,
  type MotorOperationResult,
} from "./motor";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface PartInventoryEntry {
  /**
   * Static catalog ID from data/parts.ts.
   *
   * Example:
   * "engine-basic"
   */
  definitionId: string;

  /**
   * Quantity currently owned.
   */
  quantity: number;
}

export type PartInventory =
  Record<string, PartInventoryEntry>;

export interface OwnedPartInstance {
  /**
   * Unique instance ID.
   *
   * Reusable parts may be tracked individually when installed.
   */
  instanceId: string;

  /**
   * Static catalog ID.
   */
  definitionId: string;

  /**
   * Condition 0-100.
   */
  condition: number;

  /**
   * When acquired.
   */
  acquiredAt: number;

  /**
   * Original acquisition source.
   */
  source?: PartSource | string;
}

export interface PartOperationResult {
  success: boolean;

  inventory?: PartInventory;

  part?: OwnedPartInstance;

  motor?: MotorInstance;

  removedPart?: InstalledPartInstance;

  error?: PartErrorCode;
  message?: string;
}

export type PartErrorCode =
  | "PART_NOT_FOUND"
  | "INVALID_QUANTITY"
  | "INSUFFICIENT_INVENTORY"
  | "PART_LOCKED"
  | "PART_ALREADY_INSTALLED"
  | "PART_INCOMPATIBLE"
  | "PART_PREREQUISITE_MISSING"
  | "MOTOR_NOT_FOUND"
  | "MOTOR_BUSY"
  | "INVALID_CONDITION"
  | "INVALID_INSTANCE"
  | "REPAIR_NOT_NEEDED";

/**
 * Minimum player progression required by part logic.
 */
export interface PartPlayerContext {
  garageLevel: number;
  reputation: number;
}

/**
 * Material/labor repair calculation.
 */
export interface PartRepairCost {
  conditionLost: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  hours: number;
}

/**
 * Inventory value breakdown.
 */
export interface PartInventoryValue {
  totalValue: number;
  uniqueParts: number;
  totalUnits: number;
}

/**
 * Result of installing an inventory part on a motor.
 */
export interface InstallInventoryPartResult
  extends PartOperationResult {
  consumedFromInventory?: number;
  installedPart?: InstalledPartInstance;
}

/**
 * Minimal inventory structure accepted by helpers.
 *
 * This allows GameState to use either:
 *
 * {
 *   "engine-basic": { definitionId: "engine-basic", quantity: 2 }
 * }
 *
 * or another compatible structure after normalization.
 */

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_CONDITION = 100;

const PART_REPAIR_MATERIAL_RATE = 0.08;

const PART_REPAIR_LABOR_RATE = 0.04;

const PART_REPAIR_BASE_HOURS = 1;

const PART_SELL_VALUE_RATIO = 0.55;

/* -------------------------------------------------------------------------- */
/* GENERAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clamp condition to 0-100.
 */
export function clampPartCondition(
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
 * Normalize quantity.
 */
export function normalizePartQuantity(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

/**
 * Create unique owned-part instance ID.
 */
export function createOwnedPartInstanceId(
  definitionId: string,
  timestamp = Date.now(),
): string {
  return `part-${definitionId}-${timestamp}-${Math.floor(
    Math.random() * 1_000_000,
  )}`;
}

/**
 * Clone inventory without mutating source.
 */
export function clonePartInventory(
  inventory:
    | PartInventory
    | undefined,
): PartInventory {
  if (!inventory) {
    return {};
  }

  const output: PartInventory = {};

  for (
    const [
      key,
      entry,
    ] of Object.entries(
      inventory,
    )
  ) {
    if (!entry) {
      continue;
    }

    output[key] = {
      definitionId:
        entry.definitionId ?? key,

      quantity:
        normalizePartQuantity(
          entry.quantity,
        ),
    };
  }

  return output;
}

/**
 * Normalize inventory loaded from save.
 *
 * This is useful because save data may contain an older format.
 */
export function normalizePartInventory(
  input:
    | PartInventory
    | Record<
        string,
        number
      >
    | undefined,
): PartInventory {
  if (!input) {
    return {};
  }

  const output: PartInventory = {};

  for (
    const [
      key,
      value,
    ] of Object.entries(
      input,
    )
  ) {
    if (
      typeof value ===
      "number"
    ) {
      if (
        getPartById(key) &&
        value > 0
      ) {
        output[key] = {
          definitionId: key,
          quantity:
            normalizePartQuantity(
              value,
            ),
        };
      }

      continue;
    }

    if (
      typeof value ===
      "object" &&
      value !== null
    ) {
      const entry =
        value as Partial<PartInventoryEntry>;

      const definitionId =
        entry.definitionId ??
        key;

      const quantity =
        normalizePartQuantity(
          entry.quantity ?? 0,
        );

      if (
        getPartById(
          definitionId,
        ) &&
        quantity > 0
      ) {
        output[
          definitionId
        ] = {
          definitionId,
          quantity,
        };
      }
    }
  }

  return output;
}

/* -------------------------------------------------------------------------- */
/* INVENTORY QUERIES                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Return quantity of a part.
 */
export function getPartQuantity(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
): number {
  const normalized =
    normalizePartInventory(
      inventory,
    );

  return (
    normalized[
      definitionId
    ]?.quantity ?? 0
  );
}

/**
 * Check whether the player owns a part.
 */
export function hasPart(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity = 1,
): boolean {
  if (
    quantity <= 0
  ) {
    return true;
  }

  return (
    getPartQuantity(
      inventory,
      definitionId,
    ) >=
    quantity
  );
}

/**
 * Return all inventory entries with quantity > 0.
 */
export function getInventoryEntries(
  inventory:
    | PartInventory
    | undefined,
): PartInventoryEntry[] {
  const normalized =
    normalizePartInventory(
      inventory,
    );

  return Object.values(
    normalized,
  ).filter(
    (entry) =>
      entry.quantity > 0,
  );
}

/**
 * Return all static part definitions currently owned.
 */
export function getOwnedPartDefinitions(
  inventory:
    | PartInventory
    | undefined,
): PartDefinition[] {
  const entries =
    getInventoryEntries(
      inventory,
    );

  return entries
    .map(
      (entry) =>
        getPartById(
          entry.definitionId,
        ),
    )
    .filter(
      (
        part,
      ): part is PartDefinition =>
        Boolean(part),
    );
}

/**
 * Number of unique part types owned.
 */
export function getUniquePartCount(
  inventory:
    | PartInventory
    | undefined,
): number {
  return getInventoryEntries(
    inventory,
  ).length;
}

/**
 * Total number of physical units represented in inventory.
 */
export function getTotalPartUnits(
  inventory:
    | PartInventory
    | undefined,
): number {
  return getInventoryEntries(
    inventory,
  ).reduce(
    (
      total,
      entry,
    ) =>
      total +
      entry.quantity,
    0,
  );
}

/* -------------------------------------------------------------------------- */
/* INVENTORY MUTATIONS                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Add quantity of a catalog part.
 *
 * This does not check money.
 * Market logic is responsible for price / transaction validation.
 */
export function addPartToInventory(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity: number,
): PartOperationResult {
  const part =
    getPartById(
      definitionId,
    );

  if (!part) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      quantity,
    ) ||
    quantity <= 0
  ) {
    return {
      success: false,
      error: "INVALID_QUANTITY",
      message:
        "Jumlah part tidak valid.",
    };
  }

  const next =
    clonePartInventory(
      inventory,
    );

  const current =
    next[
      definitionId
    ]?.quantity ?? 0;

  next[
    definitionId
  ] = {
    definitionId,
    quantity:
      current + quantity,
  };

  return {
    success: true,
    inventory: next,
  };
}

/**
 * Remove quantity of a catalog part.
 */
export function removePartFromInventory(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity: number,
): PartOperationResult {
  const part =
    getPartById(
      definitionId,
    );

  if (!part) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      quantity,
    ) ||
    quantity <= 0
  ) {
    return {
      success: false,
      error: "INVALID_QUANTITY",
      message:
        "Jumlah part tidak valid.",
    };
  }

  const current =
    getPartQuantity(
      inventory,
      definitionId,
    );

  if (
    current <
    quantity
  ) {
    return {
      success: false,
      error: "INSUFFICIENT_INVENTORY",
      message:
        "Jumlah part di inventory tidak mencukupi.",
    };
  }

  const next =
    clonePartInventory(
      inventory,
    );

  const remaining =
    current - quantity;

  if (
    remaining <= 0
  ) {
    delete next[
      definitionId
    ];
  } else {
    next[
      definitionId
    ] = {
      definitionId,
      quantity:
        remaining,
    };
  }

  return {
    success: true,
    inventory: next,
  };
}

/**
 * Set exact quantity.
 *
 * Quantity 0 removes the entry.
 */
export function setPartQuantity(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity: number,
): PartOperationResult {
  const part =
    getPartById(
      definitionId,
    );

  if (!part) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      quantity,
    ) ||
    quantity < 0
  ) {
    return {
      success: false,
      error: "INVALID_QUANTITY",
      message:
        "Jumlah part tidak valid.",
    };
  }

  const next =
    clonePartInventory(
      inventory,
    );

  if (
    quantity === 0
  ) {
    delete next[
      definitionId
    ];
  } else {
    next[
      definitionId
    ] = {
      definitionId,
      quantity,
    };
  }

  return {
    success: true,
    inventory: next,
  };
}

/* -------------------------------------------------------------------------- */
/* PLAYER ACCESS / UNLOCK                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Check progression requirement.
 */
export function isPartUnlockedForPlayer(
  part:
    | PartDefinition
    | undefined,
  context:
    | PartPlayerContext
    | undefined,
): boolean {
  if (!part || !context) {
    return false;
  }

  return (
    context.garageLevel >=
      part.requirements
        .minimumGarageLevel &&
    context.reputation >=
      part.requirements
        .minimumReputation
  );
}

/**
 * Return unlocked parts.
 */
export function getUnlockedInventoryParts(
  inventory:
    | PartInventory
    | undefined,
  context:
    | PartPlayerContext
    | undefined,
): PartInventoryEntry[] {
  if (!context) {
    return [];
  }

  return getInventoryEntries(
    inventory,
  ).filter(
    (entry) => {
      const part =
        getPartById(
          entry.definitionId,
        );

      return isPartUnlockedForPlayer(
        part,
        context,
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* OWNED PART INSTANCE                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Create a physical owned part instance.
 *
 * Inventory generally stores quantity.
 * Once a part is installed, motor.ts stores the physical instance.
 */
export function createOwnedPartInstance(
  definitionId: string,
  options?: {
    instanceId?: string;
    condition?: number;
    acquiredAt?: number;
    source?: PartSource | string;
  },
): OwnedPartInstance | undefined {
  const part =
    getPartById(
      definitionId,
    );

  if (!part) {
    return undefined;
  }

  const acquiredAt =
    options?.acquiredAt ??
    Date.now();

  return {
    instanceId:
      options?.instanceId ??
      createOwnedPartInstanceId(
        definitionId,
        acquiredAt,
      ),

    definitionId,

    condition:
      clampPartCondition(
        options?.condition ??
        part.defaultCondition,
      ),

    acquiredAt,

    source:
      options?.source,
  };
}

/**
 * Clone owned part.
 */
export function cloneOwnedPart(
  part:
    | OwnedPartInstance
    | undefined,
): OwnedPartInstance | undefined {
  if (!part) {
    return undefined;
  }

  return {
    ...part,
  };
}

/* -------------------------------------------------------------------------- */
/* COMPATIBILITY                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Check part compatibility against motor.
 */
export function canPartBeUsedOnMotor(
  part:
    | PartDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (!part || !motor) {
    return false;
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
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
 * Return compatible inventory parts for motor.
 */
export function getCompatibleInventoryParts(
  inventory:
    | PartInventory
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): PartDefinition[] {
  if (!motor) {
    return [];
  }

  const definitions =
    getOwnedPartDefinitions(
      inventory,
    );

  return definitions.filter(
    (part) =>
      canPartBeUsedOnMotor(
        part,
        motor,
      ),
  );
}

/**
 * Check whether a part category slot is free.
 */
export function isPartSlotFree(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
): boolean {
  if (!motor) {
    return false;
  }

  return !Boolean(
    motor.installedParts[
      category
    ],
  );
}

/**
 * Check part prerequisites against installed motor parts.
 */
export function hasPartPrerequisites(
  part:
    | PartDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (!part) {
    return false;
  }

  const required =
    part.requirements
      .requiredParts ??
    [];

  if (
    required.length === 0
  ) {
    return true;
  }

  if (!motor) {
    return false;
  }

  const installed =
    getInstalledParts(
      motor,
    );

  return required.every(
    (requiredId) =>
      installed.some(
        (entry) =>
          entry.definitionId ===
          requiredId,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* INSTALL PART FROM INVENTORY                                                */
/* -------------------------------------------------------------------------- */

/**
 * Install one part from inventory.
 *
 * IMPORTANT TRANSACTION RULE:
 *
 * 1. Validate inventory.
 * 2. Validate player progression.
 * 3. Validate compatibility.
 * 4. Validate prerequisites.
 * 5. Ask motor.ts to install.
 * 6. Only after successful motor install,
 *    decrement inventory.
 *
 * This prevents inventory loss when motor installation fails.
 */
export function installInventoryPart(
  inventory:
    | PartInventory
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  definitionId: string,
  context:
    | PartPlayerContext
    | undefined,
  options?: {
    condition?: number;
    source?: string;
    instanceId?: string;
    installedAt?: number;
  },
): InstallInventoryPartResult {
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

  const part =
    getPartById(
      definitionId,
    );

  if (!part) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan.",
    };
  }

  if (
    !context ||
    !isPartUnlockedForPlayer(
      part,
      context,
    )
  ) {
    return {
      success: false,
      error: "PART_LOCKED",
      message:
        "Part belum terbuka untuk progres pemain.",
    };
  }

  if (
    !hasPart(
      inventory,
      definitionId,
      1,
    )
  ) {
    return {
      success: false,
      error:
        "INSUFFICIENT_INVENTORY",
      message:
        "Part tidak tersedia di inventory.",
    };
  }

  if (
    !canPartBeUsedOnMotor(
      part,
      motor,
    )
  ) {
    return {
      success: false,
      error:
        "PART_INCOMPATIBLE",
      message:
        "Part tidak kompatibel dengan motor.",
    };
  }

  if (
    !isPartSlotFree(
      motor,
      part.category,
    )
  ) {
    return {
      success: false,
      error:
        "PART_ALREADY_INSTALLED",
      message:
        `Slot ${part.category} sudah terisi.`,
    };
  }

  if (
    !hasPartPrerequisites(
      part,
      motor,
    )
  ) {
    return {
      success: false,
      error:
        "PART_PREREQUISITE_MISSING",
      message:
        "Part prerequisite belum terpasang.",
    };
  }

  const motorResult =
    installMotorPart(
      motor,
      part,
      {
        instanceId:
          options?.instanceId,

        condition:
          options?.condition,

        installedAt:
          options?.installedAt,

        source:
          options?.source,
      },
    );

  if (
    !motorResult.success ||
    !motorResult.motor
  ) {
    return {
      success: false,

      error:
        motorResult.error ??
        "INVALID_INSTANCE",

      message:
        motorResult.message ??
        "Part gagal dipasang.",
    };
  }

  const inventoryResult =
    removePartFromInventory(
      inventory,
      definitionId,
      1,
    );

  if (
    !inventoryResult.success ||
    !inventoryResult.inventory
  ) {
    /**
     * This should theoretically be impossible because
     * inventory was already checked.
     *
     * We do not return the mutated motor as a partially
     * committed transaction.
     */
    return {
      success: false,
      error:
        "INSUFFICIENT_INVENTORY",
      message:
        "Inventory berubah sebelum transaksi selesai.",
    };
  }

  const installedPart =
    motorResult.motor.installedParts[
      part.category
    ];

  return {
    success: true,

    inventory:
      inventoryResult.inventory,

    motor:
      motorResult.motor,

    consumedFromInventory: 1,

    installedPart,
  };
}

/* -------------------------------------------------------------------------- */
/* REMOVE PART FROM MOTOR                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Remove a part from a motor and optionally return it to inventory.
 *
 * Because player inventory and motor state live in separate structures,
 * this function returns both updated objects.
 */
export function removePartFromMotor(
  inventory:
    | PartInventory
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
): InstallInventoryPartResult {
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
        "Tidak ada part di slot tersebut.",
    };
  }

  const motorResult =
    removeMotorPart(
      motor,
      category,
    );

  if (
    !motorResult.success ||
    !motorResult.motor ||
    !motorResult.removedPart
  ) {
    return {
      success: false,

      error:
        motorResult.error ??
        "INVALID_INSTANCE",

      message:
        motorResult.message ??
        "Part gagal dilepas.",
    };
  }

  const addResult =
    addPartToInventory(
      inventory,
      motorResult.removedPart
        .definitionId,
      1,
    );

  if (
    !addResult.success ||
    !addResult.inventory
  ) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Part berhasil dilepas tetapi inventory gagal diperbarui.",
    };
  }

  return {
    success: true,

    inventory:
      addResult.inventory,

    motor:
      motorResult.motor,

    removedPart:
      motorResult.removedPart,
  };
}

/* -------------------------------------------------------------------------- */
/* PART CONDITION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Get condition of a physical installed part.
 */
export function getInstalledPartCondition(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
): number {
  if (!motor) {
    return 0;
  }

  return clampPartCondition(
    motor.installedParts[
      category
    ]?.condition ?? 0,
  );
}

/**
 * Return installed part condition tier.
 */
export function getInstalledPartConditionTier(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
): PartConditionTier
  | undefined {
  const installed =
    motor?.installedParts[
      category
    ];

  if (!installed) {
    return undefined;
  }

  const value =
    clampPartCondition(
      installed.condition,
    );

  if (value < 20) {
    return "SALVAGE";
  }

  if (value < 40) {
    return "POOR";
  }

  if (value < 60) {
    return "FAIR";
  }

  if (value < 85) {
    return "GOOD";
  }

  return "EXCELLENT";
}

/**
 * Apply wear to an installed part.
 *
 * The race/workshop system decides the actual wear amount.
 */
export function applyPartWear(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
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
        "Wear part tidak valid.",
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
        "Part tidak ditemukan di motor.",
    };
  }

  const nextInstalled: InstalledPartInstance =
    {
      ...installed,

      condition:
        clampPartCondition(
          installed.condition -
            wear,
        ),
    };

  return {
    success: true,

    motor: {
      ...motor,

      installedParts: {
        ...motor.installedParts,

        [category]:
          nextInstalled,
      },
    },
  };
}

/**
 * Apply wear to all installed parts.
 */
export function applyWearToInstalledParts(
  motor:
    | MotorInstance
    | undefined,
  wearByCategory:
    | Partial<
        Record<
          string,
          number
        >
      >
    | undefined,
): MotorOperationResult {
  if (!motor) {
    return {
      success: false,
      error: "MOTOR_NOT_FOUND",
      message:
        "Motor tidak ditemukan.",
    };
  }

  if (!wearByCategory) {
    return {
      success: true,
      motor: {
        ...motor,
        installedParts: {
          ...motor.installedParts,
        },
      },
    };
  }

  let nextMotor =
    motor;

  for (
    const [
      category,
      wear,
    ] of Object.entries(
      wearByCategory,
    )
  ) {
    if (
      !Number.isFinite(
        wear,
      ) ||
      wear <= 0
    ) {
      continue;
    }

    const result =
      applyPartWear(
        nextMotor,
        category,
        wear,
      );

    if (
      !result.success ||
      !result.motor
    ) {
      return result;
    }

    nextMotor =
      result.motor;
  }

  return {
    success: true,
    motor: nextMotor,
  };
}

/* -------------------------------------------------------------------------- */
/* REPAIR                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Calculate repair cost for one installed part.
 */
export function calculatePartRepairCost(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
  targetCondition = 100,
): PartRepairCost {
  if (!motor) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const installed =
    motor.installedParts[
      category
    ];

  if (!installed) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const part =
    getPartById(
      installed.definitionId,
    );

  if (!part) {
    return {
      conditionLost: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      hours: 0,
    };
  }

  const current =
    clampPartCondition(
      installed.condition,
    );

  const target =
    clampPartCondition(
      targetCondition,
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

  const partValue =
    part.economy.baseValue;

  const materialCost =
    partValue *
    PART_REPAIR_MATERIAL_RATE *
    (conditionLost / 100);

  const laborCost =
    partValue *
    PART_REPAIR_LABOR_RATE *
    (conditionLost / 100);

  const hours =
    Math.max(
      1,
      Math.ceil(
        conditionLost /
          20,
      ) *
        PART_REPAIR_BASE_HOURS,
    );

  return {
    conditionLost,

    materialCost:
      roundPartMoney(
        materialCost,
      ),

    laborCost:
      roundPartMoney(
        laborCost,
      ),

    totalCost:
      roundPartMoney(
        materialCost +
          laborCost,
      ),

    hours,
  };
}

/**
 * Repair one installed part.
 *
 * Money is not deducted here.
 */
export function repairInstalledPart(
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
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

  const installed =
    motor.installedParts[
      category
    ];

  if (!installed) {
    return {
      success: false,
      error: "PART_NOT_FOUND",
      message:
        "Part tidak ditemukan di motor.",
    };
  }

  const target =
    clampPartCondition(
      targetCondition,
    );

  if (
    installed.condition >=
    target
  ) {
    return {
      success: false,
      error:
        "REPAIR_NOT_NEEDED",
      message:
        "Part tidak memerlukan repair.",
    };
  }

  return {
    success: true,

    motor: {
      ...motor,

      installedParts: {
        ...motor.installedParts,

        [category]: {
          ...installed,

          condition:
            target,
        },
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/* INVENTORY VALUE                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Calculate theoretical inventory value.
 */
export function calculatePartInventoryValue(
  inventory:
    | PartInventory
    | undefined,
): PartInventoryValue {
  const entries =
    getInventoryEntries(
      inventory,
    );

  let totalValue = 0;
  let totalUnits = 0;

  for (
    const entry of entries
  ) {
    const part =
      getPartById(
        entry.definitionId,
      );

    if (!part) {
      continue;
    }

    totalUnits +=
      entry.quantity;

    totalValue +=
      part.economy.baseValue *
      entry.quantity;
  }

  return {
    totalValue:
      roundPartMoney(
        totalValue,
      ),

    uniqueParts:
      entries.length,

    totalUnits,
  };
}

/**
 * Calculate theoretical sell value.
 */
export function calculatePartInventorySellValue(
  inventory:
    | PartInventory
    | undefined,
): number {
  const value =
    calculatePartInventoryValue(
      inventory,
    ).totalValue;

  return roundPartMoney(
    value *
      PART_SELL_VALUE_RATIO,
  );
}

/* -------------------------------------------------------------------------- */
/* INVENTORY FILTERING                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Filter inventory by category.
 */
export function getInventoryByCategory(
  inventory:
    | PartInventory
    | undefined,
  category: PartCategory,
): PartInventoryEntry[] {
  return getInventoryEntries(
    inventory,
  ).filter(
    (entry) =>
      getPartById(
        entry.definitionId,
      )?.category ===
      category,
  );
}

/**
 * Filter inventory by tier.
 */
export function getInventoryByTier(
  inventory:
    | PartInventory
    | undefined,
  tier: PartDefinition["tier"],
): PartInventoryEntry[] {
  return getInventoryEntries(
    inventory,
  ).filter(
    (entry) =>
      getPartById(
        entry.definitionId,
      )?.tier === tier,
  );
}

/**
 * Filter inventory by source availability.
 */
export function getInventoryByMarketSource(
  inventory:
    | PartInventory
    | undefined,
  source: PartSource,
): PartInventoryEntry[] {
  return getInventoryEntries(
    inventory,
  ).filter(
    (entry) =>
      getPartById(
        entry.definitionId,
      )?.marketSources.includes(
        source,
      ),
  );
}

/**
 * Return inventory parts usable on a specific motor category/slot.
 */
export function getInventoryForSlot(
  inventory:
    | PartInventory
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  category:
    | PartCategory
    | string,
): PartDefinition[] {
  if (!motor) {
    return [];
  }

  return getCompatibleInventoryParts(
    inventory,
    motor,
  ).filter(
    (part) =>
      part.category ===
      category,
  );
}

/* -------------------------------------------------------------------------- */
/* SORTING                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Sort inventory by part price ascending.
 */
export function sortInventoryByValue(
  inventory:
    | PartInventory
    | undefined,
): PartInventoryEntry[] {
  return [
    ...getInventoryEntries(
      inventory,
    ),
  ].sort(
    (a, b) => {
      const aValue =
        getPartById(
          a.definitionId,
        )?.economy
          .baseValue ?? 0;

      const bValue =
        getPartById(
          b.definitionId,
        )?.economy
          .baseValue ?? 0;

      return aValue - bValue;
    },
  );
}

/**
 * Sort inventory by price descending.
 */
export function sortInventoryByValueDesc(
  inventory:
    | PartInventory
    | undefined,
): PartInventoryEntry[] {
  return [
    ...getInventoryEntries(
      inventory,
    ),
  ].sort(
    (a, b) => {
      const aValue =
        getPartById(
          a.definitionId,
        )?.economy
          .baseValue ?? 0;

      const bValue =
        getPartById(
          b.definitionId,
        )?.economy
          .baseValue ?? 0;

      return bValue - aValue;
    },
  );
}

/* -------------------------------------------------------------------------- */
/* FORMATTING                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Format money for UI.
 */
export function formatPartMoney(
  amount: number,
): string {
  const value =
    Math.max(
      0,
      amount,
    );

  if (
    value >=
    1_000_000_000
  ) {
    return `Rp ${(
      value /
      1_000_000_000
    ).toFixed(1)} M`;
  }

  if (
    value >=
    1_000_000
  ) {
    return `Rp ${(
      value /
      1_000_000
    ).toFixed(1)} JT`;
  }

  if (
    value >=
    1_000
  ) {
    return `Rp ${Math.round(
      value / 1_000,
    )} RB`;
  }

  return `Rp ${Math.round(
    value,
  )}`;
}

/**
 * Round part-related money.
 */
export function roundPartMoney(
  value: number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return (
    Math.round(
      Math.max(
        0,
        value,
      ) / 1_000,
    ) * 1_000
  );
}

/* -------------------------------------------------------------------------- */
/* TRANSACTION HELPERS                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Create inventory change for a successful market purchase.
 *
 * This function is intentionally independent from market.ts.
 */
export function applyPartPurchase(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity: number,
): PartOperationResult {
  return addPartToInventory(
    inventory,
    definitionId,
    quantity,
  );
}

/**
 * Create inventory change for a successful sale.
 */
export function applyPartSale(
  inventory:
    | PartInventory
    | undefined,
  definitionId: string,
  quantity: number,
): PartOperationResult {
  return removePartFromInventory(
    inventory,
    definitionId,
    quantity,
  );
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate a complete inventory.
 */
export function validatePartInventory(
  inventory:
    | PartInventory
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!inventory) {
    return {
      valid: true,
      errors: [],
    };
  }

  for (
    const [
      key,
      entry,
    ] of Object.entries(
      inventory,
    )
  ) {
    if (!entry) {
      continue;
    }

    const definitionId =
      entry.definitionId ??
      key;

    const part =
      getPartById(
        definitionId,
      );

    if (!part) {
      errors.push(
        `Unknown part definition: ${definitionId}`,
      );

      continue;
    }

    if (
      !Number.isInteger(
        entry.quantity,
      ) ||
      entry.quantity < 0
    ) {
      errors.push(
        `Invalid quantity for ${definitionId}`,
      );
    }

    if (
      key !== definitionId
    ) {
      errors.push(
        `Inventory key mismatch: ${key} -> ${definitionId}`,
      );
    }
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}

/**
 * Validate an installed part instance.
 */
export function validateOwnedPartInstance(
  instance:
    | OwnedPartInstance
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!instance) {
    return {
      valid: false,
      errors: [
        "Part instance tidak ditemukan.",
      ],
    };
  }

  if (
    !instance.instanceId ||
    !instance.instanceId.trim()
  ) {
    errors.push(
      "instanceId kosong.",
    );
  }

  if (
    !instance.definitionId ||
    !getPartById(
      instance.definitionId,
    )
  ) {
    errors.push(
      `Part definition tidak ditemukan: ${instance.definitionId}`,
    );
  }

  if (
    instance.condition < 0 ||
    instance.condition > 100
  ) {
    errors.push(
      `Invalid condition: ${instance.definitionId}`,
    );
  }

  if (
    !Number.isFinite(
      instance.acquiredAt,
    ) ||
    instance.acquiredAt <= 0
  ) {
    errors.push(
      `Invalid acquiredAt: ${instance.definitionId}`,
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}

/**
 * Validate inventory + a motor together.
 *
 * Useful before committing a save or loading a build screen.
 */
export function validatePartsAgainstMotor(
  inventory:
    | PartInventory
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const inventoryValidation =
    validatePartInventory(
      inventory,
    );

  errors.push(
    ...inventoryValidation.errors,
  );

  if (!motor) {
    return {
      valid:
        errors.length === 0,
      errors,
    };
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    errors.push(
      "Motor definition tidak ditemukan.",
    );

    return {
      valid:
        errors.length === 0,
      errors,
    };
  }

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
        `Installed part tidak ditemukan: ${installed.definitionId}`,
      );

      continue;
    }

    if (
      part.category !==
      category
    ) {
      errors.push(
        `Installed part ${part.id} memiliki slot ${category} yang salah.`,
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
        `Installed part ${part.id} tidak kompatibel dengan ${definition.id}.`,
      );
    }

    if (
      installed.condition <
        0 ||
      installed.condition >
        100
    ) {
      errors.push(
        `Condition installed part ${installed.definitionId} tidak valid.`,
      );
    }
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}

/* -------------------------------------------------------------------------- */
/* DEVELOPMENT TEST HELPERS                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Return a small starter inventory.
 *
 * This is useful for creating a new game.
 *
 * It is still pure data logic and does not write to storage.
 */
export function createStarterPartInventory(): PartInventory {
  const starterIds = [
    "engine-basic",
    "fuel-carb-basic",
    "ignition-basic",
    "clutch-basic",
    "brake-basic",
    "suspension-stock",
    "wheel-basic",
    "battery-basic",
    "toolkit-basic",
  ];

  const inventory:
    PartInventory = {};

  for (
    const id of starterIds
  ) {
    if (
      getPartById(id)
    ) {
      inventory[id] = {
        definitionId: id,
        quantity: 1,
      };
    }
  }

  return inventory;
}

/**
 * Create an empty inventory.
 */
export function createEmptyPartInventory(): PartInventory {
  return {};
}

/**
 * BENGKEL MALAM
 * Workshop / Job Game Logic
 *
 * RESPONSIBILITY:
 * - Validate order eligibility.
 * - Accept customer orders.
 * - Assign mechanic.
 * - Assign motor.
 * - Calculate work duration.
 * - Calculate estimated material / labor cost.
 * - Track job progress.
 * - Complete / cancel / fail jobs.
 * - Calculate job rewards.
 * - Apply motor condition / wear.
 *
 * IMPORTANT:
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan GameState global.
 * - Tidak mutate input object.
 * - Persistence dilakukan oleh save.ts / GameState layer.
 *
 * MASTER DATA:
 * - ../data/orders.ts
 * - ../data/parts.ts
 * - ../data/motors.ts
 *
 * OTHER GAME LOGIC:
 * - ./motor.ts
 * - ./parts.ts
 */

/* -------------------------------------------------------------------------- */
/* IMPORTS                                                                    */
/* -------------------------------------------------------------------------- */

import {
  getOrderById,
  type OrderDefinition,
  type OrderDifficulty,
  type OrderPriority,
  type OrderReward,
  type OrderType,
} from "../data/orders";

import {
  getPartById,
  type PartDefinition,
  type PartCategory,
} from "../data/parts";

import {
  getMotorDefinition,
  getInstalledParts,
  calculateMotorValue,
  calculateMotorBuildScore,
  type MotorInstance,
  type InstalledPartInstance,
} from "./motor";

import {
  getDriverDefinition,
  type DriverInstance,
} from "./team";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface MechanicDefinition {
  /**
   * Unique player-owned mechanic ID.
   */
  id: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Skill level.
   */
  level: number;

  /**
   * General mechanical skill.
   * 0-100.
   */
  skill: number;

  /**
   * Engine specialization.
   * 0-100.
   */
  engineSkill: number;

  /**
   * Electrical specialization.
   * 0-100.
   */
  electricalSkill: number;

  /**
   * Fabrication / customization skill.
   * 0-100.
   */
  fabricationSkill: number;

  /**
   * Reliability / workmanship.
   * 0-100.
   */
  consistency: number;

  /**
   * Current condition / fatigue.
   * 0-100.
   */
  condition: number;

  /**
   * Weekly salary.
   */
  salary: number;

  /**
   * Whether mechanic is actively employed.
   */
  active: boolean;
}

export type WorkshopJobStatus =
  | "AVAILABLE"
  | "QUEUED"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export type WorkshopJobPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export interface WorkshopJob {
  /**
   * Unique player-owned job instance ID.
   */
  id: string;

  /**
   * Static order definition ID.
   */
  orderId: string;

  status: WorkshopJobStatus;

  priority: WorkshopJobPriority;

  /**
   * Customer display name copied from catalog.
   */
  customerName: string;

  /**
   * Player's selected motor.
   */
  motorId?: string;

  /**
   * Player's assigned mechanic.
   */
  mechanicId?: string;

  /**
   * Optional assigned secondary mechanic.
   */
  assistantMechanicId?: string;

  /**
   * Game clock timestamp.
   */
  acceptedAt: number;

  /**
   * Expected completion timestamp.
   */
  estimatedCompletionAt: number;

  /**
   * Actual completion timestamp.
   */
  completedAt?: number;

  /**
   * Total base work hours before modifiers.
   */
  baseHours: number;

  /**
   * Final expected work hours.
   */
  workHours: number;

  /**
   * Current completed work hours.
   */
  progressHours: number;

  /**
   * Progress 0-100.
   */
  progress: number;

  /**
   * Material cost paid/required from player.
   */
  materialCost: number;

  /**
   * Labor cost paid/required from player.
   */
  laborCost: number;

  /**
   * Total cost.
   */
  totalCost: number;

  /**
   * Customer reward if completed.
   */
  rewardCash: number;

  /**
   * Reputation reward.
   */
  rewardReputation: number;

  /**
   * XP reward.
   */
  rewardXp: number;

  /**
   * Number of work sessions.
   */
  workSessions: number;

  /**
   * Whether customer is waiting for motor.
   */
  customerWaiting: boolean;

  /**
   * Optional failure reason.
   */
  failureReason?: string;

  /**
   * Optional notes for UI.
   */
  notes?: string[];
}

export interface WorkshopState {
  /**
   * All active / historical jobs owned by player.
   */
  jobs: WorkshopJob[];

  /**
   * Maximum simultaneous active jobs.
   */
  orderCapacity: number;

  /**
   * Maximum active mechanics.
   */
  mechanicCapacity: number;

  /**
   * Current workbench availability.
   */
  workbenchAvailable: boolean;

  /**
   * Total workshop jobs completed.
   */
  completedJobs: number;

  /**
   * Total workshop jobs failed.
   */
  failedJobs: number;

  /**
   * Total workshop revenue from customer rewards.
   */
  revenue: number;
}

export interface WorkshopPlayerContext {
  garageLevel: number;
  reputation: number;
  cash: number;

  orderCapacity: number;
  mechanicCapacity: number;
}

export interface WorkshopMechanicContext {
  mechanics: MechanicDefinition[];
}

export interface WorkshopMotorContext {
  motors: MotorInstance[];
}

export interface WorkshopOperationResult {
  success: boolean;

  workshop?: WorkshopState;

  job?: WorkshopJob;

  motor?: MotorInstance;

  mechanic?: MechanicDefinition;

  error?: WorkshopErrorCode;

  message?: string;
}

export type WorkshopErrorCode =
  | "ORDER_NOT_FOUND"
  | "ORDER_LOCKED"
  | "ORDER_CAPACITY_FULL"
  | "ORDER_ALREADY_ACTIVE"
  | "MOTOR_NOT_FOUND"
  | "MOTOR_BUSY"
  | "MOTOR_CLASS_MISMATCH"
  | "MOTOR_CONDITION_TOO_LOW"
  | "MECHANIC_NOT_FOUND"
  | "MECHANIC_BUSY"
  | "MECHANIC_CAPACITY_FULL"
  | "INSUFFICIENT_CASH"
  | "WORKBENCH_BUSY"
  | "INVALID_PROGRESS"
  | "INVALID_TIME"
  | "INVALID_JOB"
  | "JOB_NOT_FOUND"
  | "JOB_NOT_ACTIVE"
  | "JOB_NOT_PAUSED"
  | "JOB_ALREADY_COMPLETE"
  | "MISSING_REQUIRED_PART"
  | "PART_NOT_FOUND"
  | "INVALID_COST"
  | "INVALID_RESULT";

export interface WorkshopCost {
  materialCost: number;
  laborCost: number;
  totalCost: number;
}

export interface WorkshopDuration {
  baseHours: number;
  mechanicHours: number;
  conditionHours: number;
  complexityHours: number;
  totalHours: number;
}

export interface WorkshopCompletionResult {
  success: boolean;

  job?: WorkshopJob;

  motor?: MotorInstance;

  rewards: {
    cash: number;
    reputation: number;
    xp: number;
  };

  wear: number;

  error?: WorkshopErrorCode;

  message?: string;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_PERCENT = 100;

const MIN_WORK_HOURS = 1;

const MAX_WORK_HOURS = 240;

const LOW_CONDITION_THRESHOLD = 50;

const VERY_LOW_CONDITION_THRESHOLD = 25;

const MATERIAL_COST_RATIO: Record<
  OrderDifficulty,
  number
> = {
  EASY: 0.04,
  NORMAL: 0.06,
  HARD: 0.1,
  EXPERT: 0.15,
  LEGENDARY: 0.22,
};

const LABOR_COST_RATIO: Record<
  OrderDifficulty,
  number
> = {
  EASY: 0.025,
  NORMAL: 0.04,
  HARD: 0.06,
  EXPERT: 0.09,
  LEGENDARY: 0.13,
};

const MECHANIC_SPEED_MULTIPLIER = 0.8;

const MAX_MECHANIC_SPEED_BONUS = 0.45;

const JOB_COMPLETION_CONDITION_PENALTY = 1;

const DEFAULT_WORKSHOP_ORDER_CAPACITY = 1;

const DEFAULT_WORKSHOP_MECHANIC_CAPACITY = 1;

/* -------------------------------------------------------------------------- */
/* GENERAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clamp percentage.
 */
export function clampWorkshopPercent(
  value: number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.round(
    Math.max(
      0,
      Math.min(
        MAX_PERCENT,
        value,
      ),
    ),
  );
}

/**
 * Clamp game hours.
 */
export function clampWorkHours(
  value: number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return MIN_WORK_HOURS;
  }

  return Math.max(
    MIN_WORK_HOURS,
    Math.min(
      MAX_WORK_HOURS,
      value,
    ),
  );
}

/**
 * Normalize money.
 */
export function roundWorkshopMoney(
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

/**
 * Clone job.
 */
export function cloneWorkshopJob(
  job:
    | WorkshopJob
    | undefined,
): WorkshopJob | undefined {
  if (!job) {
    return undefined;
  }

  return {
    ...job,

    notes:
      job.notes
        ? [...job.notes]
        : undefined,
  };
}

/**
 * Clone workshop state.
 */
export function cloneWorkshopState(
  workshop:
    | WorkshopState
    | undefined,
): WorkshopState {
  if (!workshop) {
    return createEmptyWorkshopState();
  }

  return {
    ...workshop,

    jobs:
      workshop.jobs.map(
        (job) =>
          cloneWorkshopJob(
            job,
          )!,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* WORKSHOP CREATION                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Create an empty workshop state.
 */
export function createEmptyWorkshopState(
  orderCapacity =
    DEFAULT_WORKSHOP_ORDER_CAPACITY,
  mechanicCapacity =
    DEFAULT_WORKSHOP_MECHANIC_CAPACITY,
): WorkshopState {
  return {
    jobs: [],

    orderCapacity:
      Math.max(
        0,
        Math.floor(
          orderCapacity,
        ),
      ),

    mechanicCapacity:
      Math.max(
        0,
        Math.floor(
          mechanicCapacity,
        ),
      ),

    workbenchAvailable:
      true,

    completedJobs: 0,

    failedJobs: 0,

    revenue: 0,
  };
}

/**
 * Create new workshop job from catalog order.
 *
 * This does not add it to WorkshopState.
 */
export function createWorkshopJob(
  order:
    | OrderDefinition
    | undefined,
  options?: {
    id?: string;
    acceptedAt?: number;
    workHours?: number;
    materialCost?: number;
    laborCost?: number;
    totalCost?: number;
    customerWaiting?: boolean;
    notes?: string[];
  },
): WorkshopJob
  | undefined {
  if (!order) {
    return undefined;
  }

  const acceptedAt =
    options?.acceptedAt ??
    Date.now();

  const duration =
    options?.workHours ??
    order.duration.baseHours;

  const reward =
    getOrderRewards(
      order,
    );

  const materialCost =
    options?.materialCost ??
    0;

  const laborCost =
    options?.laborCost ??
    0;

  const totalCost =
    options?.totalCost ??
    materialCost +
      laborCost;

  return {
    id:
      options?.id ??
      createWorkshopJobId(
        order.id,
        acceptedAt,
      ),

    orderId:
      order.id,

    status:
      "AVAILABLE",

    priority:
      mapOrderPriorityToWorkshopPriority(
        order.priority,
      ),

    customerName:
      order.customerName,

    motorId:
      undefined,

    mechanicId:
      undefined,

    assistantMechanicId:
      undefined,

    acceptedAt,

    estimatedCompletionAt:
      acceptedAt +
      duration * 60 * 60 * 1_000,

    completedAt:
      undefined,

    baseHours:
      order.duration.baseHours,

    workHours:
      clampWorkHours(
        duration,
      ),

    progressHours:
      0,

    progress:
      0,

    materialCost:
      roundWorkshopMoney(
        materialCost,
      ),

    laborCost:
      roundWorkshopMoney(
        laborCost,
      ),

    totalCost:
      roundWorkshopMoney(
        totalCost,
      ),

    rewardCash:
      reward.cash,

    rewardReputation:
      reward.reputation,

    rewardXp:
      reward.xp,

    workSessions:
      0,

    customerWaiting:
      options?.customerWaiting ??
      true,

    notes:
      options?.notes
        ? [...options.notes]
        : [],
  };
}

/**
 * Create unique job ID.
 */
export function createWorkshopJobId(
  orderId: string,
  timestamp = Date.now(),
): string {
  return `job-${orderId}-${timestamp}-${Math.floor(
    Math.random() * 1_000_000,
  )}`;
}

/* -------------------------------------------------------------------------- */
/* ORDER HELPERS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Map order priority.
 */
export function mapOrderPriorityToWorkshopPriority(
  priority: OrderPriority,
): WorkshopJobPriority {
  switch (
    priority
  ) {
    case "LOW":
      return "LOW";

    case "NORMAL":
      return "NORMAL";

    case "HIGH":
      return "HIGH";

    case "URGENT":
      return "URGENT";
  }
}

/**
 * Return order rewards.
 */
export function getOrderRewards(
  order:
    | OrderDefinition
    | undefined,
): {
  cash: number;
  reputation: number;
  xp: number;
} {
  if (!order) {
    return {
      cash: 0,
      reputation: 0,
      xp: 0,
    };
  }

  const rewards =
    order.rewards;

  return {
    cash:
      sumRewardType(
        rewards,
        "CASH",
      ),

    reputation:
      sumRewardType(
        rewards,
        "REPUTATION",
      ),

    xp:
      sumRewardType(
        rewards,
        "XP",
      ),
  };
}

/**
 * Sum reward type.
 */
export function sumRewardType(
  rewards:
    | readonly OrderReward[]
    | undefined,
  type:
    | OrderReward["type"],
): number {
  if (!rewards) {
    return 0;
  }

  return rewards
    .filter(
      (reward) =>
        reward.type ===
        type,
    )
    .reduce(
      (
        total,
        reward,
      ) =>
        total +
        reward.amount,
      0,
    );
}

/* -------------------------------------------------------------------------- */
/* CAPACITY                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Count active jobs.
 */
export function getActiveWorkshopJobCount(
  workshop:
    | WorkshopState
    | undefined,
): number {
  if (!workshop) {
    return 0;
  }

  return workshop.jobs.filter(
    (job) =>
      job.status ===
        "QUEUED" ||
      job.status ===
        "ACTIVE" ||
      job.status ===
        "PAUSED",
  ).length;
}

/**
 * Return free order slots.
 */
export function getFreeOrderSlots(
  workshop:
    | WorkshopState
    | undefined,
): number {
  if (!workshop) {
    return 0;
  }

  return Math.max(
    0,
    workshop.orderCapacity -
      getActiveWorkshopJobCount(
        workshop,
      ),
  );
}

/**
 * Whether another job can be accepted.
 */
export function hasWorkshopCapacity(
  workshop:
    | WorkshopState
    | undefined,
): boolean {
  return (
    getFreeOrderSlots(
      workshop,
    ) > 0
  );
}

/**
 * Count active mechanics.
 */
export function getActiveMechanicCount(
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
): number {
  if (!mechanics) {
    return 0;
  }

  return mechanics.filter(
    (mechanic) =>
      mechanic.active,
  ).length;
}

/**
 * Return whether mechanic is currently assigned to active work.
 */
export function isMechanicBusy(
  mechanicId: string,
  workshop:
    | WorkshopState
    | undefined,
): boolean {
  if (!workshop) {
    return false;
  }

  return workshop.jobs.some(
    (job) =>
      (
        job.mechanicId ===
          mechanicId ||
        job.assistantMechanicId ===
          mechanicId
      ) &&
      (
        job.status ===
          "ACTIVE" ||
        job.status ===
          "QUEUED"
      ),
  );
}

/**
 * Return whether motor is currently occupied by a workshop job.
 */
export function isMotorBusyInWorkshop(
  motorId: string,
  workshop:
    | WorkshopState
    | undefined,
): boolean {
  if (!workshop) {
    return false;
  }

  return workshop.jobs.some(
    (job) =>
      job.motorId ===
        motorId &&
      (
        job.status ===
          "ACTIVE" ||
        job.status ===
          "QUEUED" ||
        job.status ===
          "PAUSED"
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* ORDER ELIGIBILITY                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Validate whether a customer order can be accepted.
 */
export function validateOrderAcceptance(
  order:
    | OrderDefinition
    | undefined,
  workshop:
    | WorkshopState
    | undefined,
  context:
    | WorkshopPlayerContext
    | undefined,
): {
  valid: boolean;
  error?: WorkshopErrorCode;
  message?: string;
} {
  if (!order) {
    return {
      valid: false,

      error:
        "ORDER_NOT_FOUND",

      message:
        "Order tidak ditemukan.",
    };
  }

  if (!workshop) {
    return {
      valid: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  if (!context) {
    return {
      valid: false,

      error:
        "INVALID_JOB",

      message:
        "Player context tidak tersedia.",
    };
  }

  if (
    !hasWorkshopCapacity(
      workshop,
    )
  ) {
    return {
      valid: false,

      error:
        "ORDER_CAPACITY_FULL",

      message:
        "Kapasitas order bengkel sudah penuh.",
    };
  }

  /**
   * Prevent the exact catalog job from being active twice.
   */
  const duplicate =
    workshop.jobs.some(
      (job) =>
        job.orderId ===
          order.id &&
        (
          job.status ===
            "AVAILABLE" ||
          job.status ===
            "QUEUED" ||
          job.status ===
            "ACTIVE" ||
          job.status ===
            "PAUSED"
        ),
    );

  if (duplicate) {
    return {
      valid: false,

      error:
        "ORDER_ALREADY_ACTIVE",

      message:
        "Order tersebut sudah aktif.",
    };
  }

  const requiredGarage =
    getNumericOrderRequirement(
      order,
      "GARAGE_LEVEL",
    );

  if (
    context.garageLevel <
    requiredGarage
  ) {
    return {
      valid: false,

      error:
        "ORDER_LOCKED",

      message:
        `Garage minimal level ${requiredGarage}.`,
    };
  }

  const requiredReputation =
    getNumericOrderRequirement(
      order,
      "REPUTATION",
    );

  if (
    context.reputation <
    requiredReputation
  ) {
    return {
      valid: false,

      error:
        "ORDER_LOCKED",

      message:
        `Reputation minimal ${requiredReputation}.`,
    };
  }

  return {
    valid: true,
  };
}

/**
 * Get numeric requirement.
 */
export function getNumericOrderRequirement(
  order:
    | OrderDefinition
    | undefined,
  type:
    | "GARAGE_LEVEL"
    | "REPUTATION"
    | "MECHANIC_COUNT"
    | "MOTOR_CONDITION",
): number {
  if (!order) {
    return 0;
  }

  const requirement =
    order.requirements.find(
      (item) =>
        item.type ===
        type,
    );

  if (
    typeof requirement?.value ===
    "number"
  ) {
    return requirement.value;
  }

  return 0;
}

/* -------------------------------------------------------------------------- */
/* ACCEPT ORDER                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Accept a customer order.
 *
 * Does not charge cash or mutate the workshop directly.
 */
export function acceptOrder(
  workshop:
    | WorkshopState
    | undefined,
  order:
    | OrderDefinition
    | undefined,
  context:
    | WorkshopPlayerContext
    | undefined,
): WorkshopOperationResult {
  const validation =
    validateOrderAcceptance(
      order,
      workshop,
      context,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        validation.error,

      message:
        validation.message,
    };
  }

  if (!order) {
    return {
      success: false,

      error:
        "ORDER_NOT_FOUND",

      message:
        "Order tidak ditemukan.",
    };
  }

  const cost =
    calculateWorkshopCost(
      order,
      undefined,
    );

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const job =
    createWorkshopJob(
      order,
      {
        materialCost:
          cost.materialCost,

        laborCost:
          cost.laborCost,

        totalCost:
          cost.totalCost,

        acceptedAt:
          Date.now(),
      },
    );

  if (!job) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Job gagal dibuat.",
    };
  }

  job.status =
    "QUEUED";

  nextWorkshop.jobs.push(
    job,
  );

  return {
    success: true,

    workshop:
      nextWorkshop,

    job,
  };
}

/* -------------------------------------------------------------------------- */
/* MOTOR ASSIGNMENT                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Validate motor for an order.
 */
export function validateMotorForOrder(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  workshop:
    | WorkshopState
    | undefined,
): {
  valid: boolean;
  error?: WorkshopErrorCode;
  message?: string;
} {
  if (!order) {
    return {
      valid: false,

      error:
        "ORDER_NOT_FOUND",

      message:
        "Order tidak ditemukan.",
    };
  }

  if (!motor) {
    return {
      valid: false,

      error:
        "MOTOR_NOT_FOUND",

      message:
        "Motor tidak ditemukan.",
    };
  }

  if (!workshop) {
    return {
      valid: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    return {
      valid: false,

      error:
        "MOTOR_BUSY",

      message:
        "Motor tidak dalam kondisi READY.",
    };
  }

  if (
    isMotorBusyInWorkshop(
      motor.id,
      workshop,
    )
  ) {
    return {
      valid: false,

      error:
        "MOTOR_BUSY",

      message:
        "Motor sedang digunakan pada job lain.",
    };
  }

  const definition =
    getMotorDefinition(
      motor,
    );

  if (!definition) {
    return {
      valid: false,

      error:
        "MOTOR_NOT_FOUND",

      message:
        "Definisi motor tidak ditemukan.",
    };
  }

  if (
    order.motorClasses &&
    order.motorClasses.length > 0 &&
    !order.motorClasses.includes(
      definition.class,
    )
  ) {
    return {
      valid: false,

      error:
        "MOTOR_CLASS_MISMATCH",

      message:
        "Kelas motor tidak sesuai dengan order.",
    };
  }

  if (
    order.motorId &&
    order.motorId !==
      definition.id
  ) {
    return {
      valid: false,

      error:
        "MOTOR_CLASS_MISMATCH",

      message:
        "Order membutuhkan motor tertentu.",
    };
  }

  const requiredCondition =
    getNumericOrderRequirement(
      order,
      "MOTOR_CONDITION",
    );

  if (
    requiredCondition > 0 &&
    motor.condition <
      requiredCondition
  ) {
    return {
      valid: false,

      error:
        "MOTOR_CONDITION_TOO_LOW",

      message:
        `Condition motor minimal ${requiredCondition}%.`,
    };
  }

  return {
    valid: true,
  };
}

/**
 * Assign a motor to a job.
 */
export function assignMotorToJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  motor:
    | MotorInstance
    | undefined,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  const order =
    getOrderById(
      job.orderId,
    );

  const validation =
    validateMotorForOrder(
      order,
      motor,
      workshop,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        validation.error,

      message:
        validation.message,
    };
  }

  if (!motor) {
    return {
      success: false,

      error:
        "MOTOR_NOT_FOUND",

      message:
        "Motor tidak ditemukan.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!nextJob) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  nextJob.motorId =
    motor.id;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,

    motor,
  };
}

/* -------------------------------------------------------------------------- */
/* MECHANIC ASSIGNMENT                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Validate mechanic for a job.
 */
export function validateMechanicForJob(
  job:
    | WorkshopJob
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
  workshop:
    | WorkshopState
    | undefined,
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
): {
  valid: boolean;
  error?: WorkshopErrorCode;
  message?: string;
} {
  if (!job) {
    return {
      valid: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (!mechanic) {
    return {
      valid: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic tidak ditemukan.",
    };
  }

  if (!mechanic.active) {
    return {
      valid: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic tidak aktif.",
    };
  }

  if (
    workshop &&
    isMechanicBusy(
      mechanic.id,
      workshop,
    )
  ) {
    return {
      valid: false,

      error:
        "MECHANIC_BUSY",

      message:
        "Mechanic sedang mengerjakan job lain.",
    };
  }

  if (
    mechanics &&
    getActiveMechanicCount(
      mechanics,
    ) >
      (
        workshop?.mechanicCapacity ??
        mechanics.length
      )
  ) {
    return {
      valid: false,

      error:
        "MECHANIC_CAPACITY_FULL",

      message:
        "Kapasitas mechanic bengkel penuh.",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Assign mechanic to job.
 */
export function assignMechanicToJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  mechanic:
    | MechanicDefinition
    | undefined,
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  const validation =
    validateMechanicForJob(
      job,
      mechanic,
      workshop,
      mechanics,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        validation.error,

      message:
        validation.message,
    };
  }

  if (!job || !mechanic) {
    return {
      success: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic tidak ditemukan.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!nextJob) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  nextJob.mechanicId =
    mechanic.id;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,

    mechanic,
  };
}

/**
 * Assign assistant mechanic.
 */
export function assignAssistantMechanicToJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  mechanic:
    | MechanicDefinition
    | undefined,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (!mechanic) {
    return {
      success: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic tidak ditemukan.",
    };
  }

  if (!mechanic.active) {
    return {
      success: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic tidak aktif.",
    };
  }

  if (
    mechanic.id ===
    job.mechanicId
  ) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Mechanic utama tidak dapat menjadi assistant.",
    };
  }

  if (
    isMechanicBusy(
      mechanic.id,
      workshop,
    )
  ) {
    return {
      success: false,

      error:
        "MECHANIC_BUSY",

      message:
        "Mechanic sedang mengerjakan job lain.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!nextJob) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  nextJob.assistantMechanicId =
    mechanic.id;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,

    mechanic,
  };
}

/* -------------------------------------------------------------------------- */
/* COST CALCULATION                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Calculate expected workshop cost.
 *
 * Motor value is included when available.
 */
export function calculateWorkshopCost(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): WorkshopCost {
  if (!order) {
    return {
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
    };
  }

  const motorValue =
    motor
      ? calculateMotorValue(
          motor,
        )
      : 0;

  /**
   * The value basis combines:
   * - motor value if supplied
   * - order base reward otherwise
   *
   * This allows customer jobs to exist before
   * a motor is assigned.
   */
  const reward =
    getOrderRewards(
      order,
    );

  const valueBasis =
    Math.max(
      motorValue,
      reward.cash * 3,
      1_000_000,
    );

  const materialRatio =
    MATERIAL_COST_RATIO[
      order.difficulty
    ];

  const laborRatio =
    LABOR_COST_RATIO[
      order.difficulty
    ];

  const materialCost =
    roundWorkshopMoney(
      valueBasis *
        materialRatio,
    );

  const laborCost =
    roundWorkshopMoney(
      valueBasis *
        laborRatio,
    );

  return {
    materialCost,

    laborCost,

    totalCost:
      materialCost +
      laborCost,
  };
}

/**
 * Calculate cost after mechanic efficiency.
 */
export function calculateAdjustedWorkshopCost(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
): WorkshopCost {
  const base =
    calculateWorkshopCost(
      order,
      motor,
    );

  if (!mechanic) {
    return base;
  }

  const skill =
    clampWorkshopPercent(
      mechanic.skill,
    );

  /**
   * Better mechanic = slightly lower waste/labor.
   */
  const efficiency =
    1 -
    Math.min(
      0.3,
      skill /
        1000,
    );

  return {
    materialCost:
      roundWorkshopMoney(
        base.materialCost *
          efficiency,
      ),

    laborCost:
      roundWorkshopMoney(
        base.laborCost *
          efficiency,
      ),

    totalCost:
      roundWorkshopMoney(
        (
          base.materialCost +
          base.laborCost
        ) *
          efficiency,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* DURATION CALCULATION                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Calculate workshop job duration.
 */
export function calculateWorkshopDuration(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
  assistantMechanic?:
    | MechanicDefinition,
): WorkshopDuration {
  if (!order) {
    return {
      baseHours: 0,
      mechanicHours: 0,
      conditionHours: 0,
      complexityHours: 0,
      totalHours: 0,
    };
  }

  const baseHours =
    order.duration.baseHours;

  let mechanicHours =
    baseHours;

  if (mechanic) {
    const skill =
      clampWorkshopPercent(
        mechanic.skill,
      );

    const normalized =
      skill / 100;

    const bonus =
      Math.min(
        MAX_MECHANIC_SPEED_BONUS,
        normalized *
          MECHANIC_SPEED_MULTIPLIER,
      );

    mechanicHours *=
      1 -
      bonus;
  }

  if (assistantMechanic) {
    const assistantSkill =
      clampWorkshopPercent(
        assistantMechanic.skill,
      );

    mechanicHours *=
      1 -
      Math.min(
        0.18,
        assistantSkill /
          1000,
      );
  }

  let conditionHours = 0;

  if (motor) {
    if (
      motor.condition <
      VERY_LOW_CONDITION_THRESHOLD
    ) {
      conditionHours =
        baseHours *
        0.25;
    } else if (
      motor.condition <
      LOW_CONDITION_THRESHOLD
    ) {
      conditionHours =
        baseHours *
        0.12;
    }
  }

  const complexityHours =
    calculateOrderComplexityHours(
      order,
      motor,
    );

  const totalHours =
    clampWorkHours(
      Math.ceil(
        mechanicHours +
          conditionHours +
          complexityHours,
      ),
    );

  return {
    baseHours,

    mechanicHours:
      Number(
        mechanicHours.toFixed(
          2,
        ),
      ),

    conditionHours:
      Number(
        conditionHours.toFixed(
          2,
        ),
      ),

    complexityHours:
      Number(
        complexityHours.toFixed(
          2,
        ),
      ),

    totalHours,
  };
}

/**
 * Calculate additional complexity.
 */
export function calculateOrderComplexityHours(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): number {
  if (!order) {
    return 0;
  }

  let complexity = 0;

  switch (
    order.type
  ) {
    case "SERVICE":
      complexity += 0;
      break;

    case "REPAIR":
      complexity += 1;
      break;

    case "CUSTOMIZATION":
      complexity += 2;
      break;

    case "ENGINE_BUILD":
      complexity += 5;
      break;

    case "RESTORATION":
      complexity += 8;
      break;

    case "RACE_PREP":
      complexity += 4;
      break;

    case "FULL_BUILD":
      complexity += 12;
      break;
  }

  if (
    motor &&
    motor.condition <
    40
  ) {
    complexity += 3;
  }

  return complexity;
}

/**
 * Recalculate a job after assigning mechanic/motor.
 */
export function recalculateWorkshopJob(
  job:
    | WorkshopJob
    | undefined,
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
  assistantMechanic?:
    | MechanicDefinition,
): WorkshopJob
  | undefined {
  if (!job || !order) {
    return undefined;
  }

  const duration =
    calculateWorkshopDuration(
      order,
      motor,
      mechanic,
      assistantMechanic,
    );

  const cost =
    calculateAdjustedWorkshopCost(
      order,
      motor,
      mechanic,
    );

  const next =
    cloneWorkshopJob(
      job,
    )!;

  next.workHours =
    duration.totalHours;

  next.materialCost =
    cost.materialCost;

  next.laborCost =
    cost.laborCost;

  next.totalCost =
    cost.totalCost;

  next.estimatedCompletionAt =
    next.acceptedAt +
    duration.totalHours *
      60 *
      60 *
      1_000;

  return next;
}

/* -------------------------------------------------------------------------- */
/* JOB START                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Validate whether job can start.
 */
export function canStartWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  job:
    | WorkshopJob
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
  context:
    | WorkshopPlayerContext
    | undefined,
): {
  valid: boolean;
  error?: WorkshopErrorCode;
  message?: string;
} {
  if (!workshop) {
    return {
      valid: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  if (!job) {
    return {
      valid: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
    "QUEUED"
  ) {
    return {
      valid: false,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Job belum berada dalam queue.",
    };
  }

  if (!motor) {
    return {
      valid: false,

      error:
        "MOTOR_NOT_FOUND",

      message:
        "Motor belum dipilih.",
    };
  }

  if (!mechanic) {
    return {
      valid: false,

      error:
        "MECHANIC_NOT_FOUND",

      message:
        "Mechanic belum dipilih.",
    };
  }

  if (!context) {
    return {
      valid: false,

      error:
        "INVALID_JOB",

      message:
        "Player context tidak tersedia.",
    };
  }

  if (
    context.cash <
    job.totalCost
  ) {
    return {
      valid: false,

      error:
        "INSUFFICIENT_CASH",

      message:
        "Cash tidak mencukupi untuk mengerjakan job.",
    };
  }

  if (
    !workshop.workbenchAvailable
  ) {
    return {
      valid: false,

      error:
        "WORKBENCH_BUSY",

      message:
        "Workbench sedang digunakan.",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Start queued job.
 *
 * Cash deduction happens in the GameState/economy layer.
 */
export function startWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
  context:
    | WorkshopPlayerContext
    | undefined,
  assistantMechanic?:
    | MechanicDefinition,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  const validation =
    canStartWorkshopJob(
      workshop,
      job,
      motor,
      mechanic,
      context,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        validation.error,

      message:
        validation.message,
    };
  }

  if (
    !job ||
    !motor ||
    !mechanic
  ) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Data job tidak lengkap.",
    };
  }

  const order =
    getOrderById(
      job.orderId,
    );

  if (!order) {
    return {
      success: false,

      error:
        "ORDER_NOT_FOUND",

      message:
        "Order definition tidak ditemukan.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  let nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.motorId =
    motor.id;

  nextJob.mechanicId =
    mechanic.id;

  if (
    assistantMechanic
  ) {
    nextJob.assistantMechanicId =
      assistantMechanic.id;
  }

  nextJob =
    recalculateWorkshopJob(
      nextJob,
      order,
      motor,
      mechanic,
      assistantMechanic,
    )!;

  nextJob.status =
    "ACTIVE";

  nextJob.workSessions +=
    1;

  nextWorkshop.workbenchAvailable =
    false;

  nextWorkshop.jobs =
    nextWorkshop.jobs.map(
      (item) =>
        item.id ===
        jobId
          ? nextJob
          : item,
    );

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,

    motor,
  };
}

/* -------------------------------------------------------------------------- */
/* PROGRESS                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Work result.
 */
export interface WorkshopProgressResult {
  success: boolean;

  workshop?: WorkshopState;

  job?: WorkshopJob;

  progressDeltaHours: number;

  completed: boolean;

  error?: WorkshopErrorCode;

  message?: string;
}

/**
 * Advance a workshop job by game hours.
 *
 * This does not mutate the motor yet.
 * Completion is handled by completeWorkshopJob().
 */
export function advanceWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  hours: number,
): WorkshopProgressResult {
  if (!workshop) {
    return {
      success: false,

      progressDeltaHours: 0,

      completed: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  if (
    !Number.isFinite(
      hours,
    ) ||
    hours <= 0
  ) {
    return {
      success: false,

      progressDeltaHours: 0,

      completed: false,

      error:
        "INVALID_TIME",

      message:
        "Waktu kerja tidak valid.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      progressDeltaHours: 0,

      completed: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
    "ACTIVE"
  ) {
    return {
      success: false,

      progressDeltaHours: 0,

      completed: false,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Job tidak sedang aktif.",
    };
  }

  const remaining =
    Math.max(
      0,
      job.workHours -
        job.progressHours,
    );

  const delta =
    Math.min(
      remaining,
      hours,
    );

  const nextProgressHours =
    job.progressHours +
    delta;

  const nextProgress =
    clampWorkshopPercent(
      (
        nextProgressHours /
        Math.max(
          1,
          job.workHours,
        )
      ) *
        100,
    );

  const completed =
    nextProgressHours >=
    job.workHours;

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.progressHours =
    nextProgressHours;

  nextJob.progress =
    completed
      ? 100
      : nextProgress;

  if (completed) {
    nextJob.status =
      "COMPLETED";

    nextJob.completedAt =
      Date.now();

    nextWorkshop.workbenchAvailable =
      true;

    nextWorkshop.completedJobs +=
      1;

    nextWorkshop.revenue +=
      nextJob.rewardCash;
  }

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,

    progressDeltaHours:
      delta,

    completed,
  };
}

/**
 * Convert elapsed milliseconds into work hours.
 */
export function elapsedWorkshopHours(
  startedAt: number,
  currentTime =
    Date.now(),
): number {
  if (
    !Number.isFinite(
      startedAt,
    ) ||
    !Number.isFinite(
      currentTime,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    (
      currentTime -
      startedAt
    ) /
      (
        60 *
        60 *
        1_000
      ),
  );
}

/**
 * Calculate current progress based on timestamps.
 */
export function calculateTimedJobProgress(
  job:
    | WorkshopJob
    | undefined,
  currentTime =
    Date.now(),
): number {
  if (!job) {
    return 0;
  }

  if (
    job.status ===
    "COMPLETED"
  ) {
    return 100;
  }

  const totalMs =
    Math.max(
      1,
      job.workHours *
        60 *
        60 *
        1_000,
    );

  const elapsedMs =
    Math.max(
      0,
      currentTime -
        job.acceptedAt,
    );

  return clampWorkshopPercent(
    (
      elapsedMs /
      totalMs
    ) *
      100,
  );
}

/* -------------------------------------------------------------------------- */
/* COMPLETE / CANCEL / FAIL                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Calculate expected motor wear after workshop.
 *
 * Repair/service jobs can recover condition later through motor.ts.
 */
export function calculateWorkshopMotorWear(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): number {
  if (!order || !motor) {
    return 0;
  }

  let wear = 0;

  switch (
    order.type
  ) {
    case "SERVICE":
      wear = 0;
      break;

    case "REPAIR":
      wear = 0;
      break;

    case "CUSTOMIZATION":
      wear = 1;
      break;

    case "ENGINE_BUILD":
      wear = 2;
      break;

    case "RESTORATION":
      wear = 1;
      break;

    case "RACE_PREP":
      wear = 2;
      break;

    case "FULL_BUILD":
      wear = 3;
      break;
  }

  if (
    motor.condition <
    40
  ) {
    wear +=
      JOB_COMPLETION_CONDITION_PENALTY;
  }

  return Math.max(
    0,
    Number(
      wear.toFixed(
        2,
      ),
    ),
  );
}

/**
 * Apply service/recovery based on order type.
 */
export function calculateWorkshopConditionGain(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): number {
  if (!order || !motor) {
    return 0;
  }

  switch (
    order.type
  ) {
    case "SERVICE":
      return 12;

    case "REPAIR":
      return 20;

    case "RESTORATION":
      return 28;

    case "CUSTOMIZATION":
      return 2;

    case "ENGINE_BUILD":
      return 3;

    case "RACE_PREP":
      return 5;

    case "FULL_BUILD":
      return 8;

    default:
      return 0;
  }
}

/**
 * Complete a job and return rewards + resulting motor.
 *
 * Cash/reputation/XP should still be committed by state/economy layer.
 */
export function completeWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  motor:
    | MotorInstance
    | undefined,
): WorkshopCompletionResult {
  if (!workshop) {
    return {
      success: false,

      rewards: {
        cash: 0,
        reputation: 0,
        xp: 0,
      },

      wear: 0,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      rewards: {
        cash: 0,
        reputation: 0,
        xp: 0,
      },

      wear: 0,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
    "COMPLETED"
  ) {
    return {
      success: false,

      rewards: {
        cash: 0,
        reputation: 0,
        xp: 0,
      },

      wear: 0,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Job belum selesai.",
    };
  }

  const order =
    getOrderById(
      job.orderId,
    );

  if (!order) {
    return {
      success: false,

      rewards: {
        cash: 0,
        reputation: 0,
        xp: 0,
      },

      wear: 0,

      error:
        "ORDER_NOT_FOUND",

      message:
        "Order definition tidak ditemukan.",
    };
  }

  const wear =
    calculateWorkshopMotorWear(
      order,
      motor,
    );

  const conditionGain =
    calculateWorkshopConditionGain(
      order,
      motor,
    );

  let nextMotor =
    motor;

  if (motor) {
    nextMotor = {
      ...motor,

      condition:
        clampWorkshopPercent(
          motor.condition +
            conditionGain -
            wear,
        ),

      serviceCount:
        motor.serviceCount +
        1,

      status:
        "READY",
    };
  }

  return {
    success: true,

    job:
      cloneWorkshopJob(
        job,
      ),

    motor:
      nextMotor,

    rewards: {
      cash:
        job.rewardCash,

      reputation:
        job.rewardReputation,

      xp:
        job.rewardXp,
    },

    wear,
  };
}

/**
 * Cancel a queued/paused job.
 */
export function cancelWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
      "QUEUED" &&
    job.status !==
      "PAUSED"
  ) {
    return {
      success: false,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Job tidak dapat dibatalkan pada status ini.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.status =
    "CANCELLED";

  nextJob.customerWaiting =
    false;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,
  };
}

/**
 * Pause active job.
 */
export function pauseWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
    "ACTIVE"
  ) {
    return {
      success: false,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Hanya job aktif yang dapat dipause.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.status =
    "PAUSED";

  nextWorkshop.workbenchAvailable =
    true;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,
  };
}

/**
 * Resume paused job.
 */
export function resumeWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
    "PAUSED"
  ) {
    return {
      success: false,

      error:
        "JOB_NOT_PAUSED",

      message:
        "Job tidak dalam status paused.",
    };
  }

  if (
    !workshop.workbenchAvailable
  ) {
    return {
      success: false,

      error:
        "WORKBENCH_BUSY",

      message:
        "Workbench sedang digunakan.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.status =
    "ACTIVE";

  nextWorkshop.workbenchAvailable =
    false;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,
  };
}

/**
 * Fail an active job.
 */
export function failWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
  jobId: string,
  reason: string,
): WorkshopOperationResult {
  if (!workshop) {
    return {
      success: false,

      error:
        "INVALID_JOB",

      message:
        "Workshop state tidak tersedia.",
    };
  }

  const job =
    workshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    );

  if (!job) {
    return {
      success: false,

      error:
        "JOB_NOT_FOUND",

      message:
        "Job tidak ditemukan.",
    };
  }

  if (
    job.status !==
      "ACTIVE" &&
    job.status !==
      "PAUSED"
  ) {
    return {
      success: false,

      error:
        "JOB_NOT_ACTIVE",

      message:
        "Job tidak sedang dikerjakan.",
    };
  }

  const nextWorkshop =
    cloneWorkshopState(
      workshop,
    );

  const nextJob =
    nextWorkshop.jobs.find(
      (item) =>
        item.id ===
        jobId,
    )!;

  nextJob.status =
    "FAILED";

  nextJob.failureReason =
    reason.trim() ||
    "Pekerjaan gagal diselesaikan.";

  nextJob.customerWaiting =
    false;

  nextWorkshop.workbenchAvailable =
    true;

  nextWorkshop.failedJobs +=
    1;

  return {
    success: true,

    workshop:
      nextWorkshop,

    job:
      nextJob,
  };
}

/* -------------------------------------------------------------------------- */
/* REQUIRED PARTS                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Return required part definitions from order.
 */
export function getRequiredPartsForOrder(
  order:
    | OrderDefinition
    | undefined,
): PartDefinition[] {
  if (!order) {
    return [];
  }

  return (
    order.requiredParts ??
    []
  )
    .map(
      (id) =>
        getPartById(
          id,
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
 * Validate that a motor has the parts required by the order.
 */
export function validateOrderRequiredParts(
  order:
    | OrderDefinition
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] =
    [];

  if (!order) {
    return {
      valid: false,

      missing: [],
    };
  }

  const requiredIds =
    order.requiredParts ??
    [];

  if (
    requiredIds.length ===
    0
  ) {
    return {
      valid: true,

      missing: [],
    };
  }

  if (!motor) {
    return {
      valid: false,

      missing:
        [...requiredIds],
    };
  }

  const installedIds =
    new Set(
      getInstalledParts(
        motor,
      ).map(
        (
          part,
        ) =>
          part.definitionId,
      ),
    );

  for (
    const requiredId of
      requiredIds
  ) {
    if (
      !installedIds.has(
        requiredId,
      )
    ) {
      missing.push(
        requiredId,
      );
    }
  }

  return {
    valid:
      missing.length ===
      0,

    missing,
  };
}

/* -------------------------------------------------------------------------- */
/* MECHANIC PERFORMANCE                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Calculate mechanic speed modifier.
 *
 * 0.0 = no bonus.
 * Negative = slower.
 */
export function getMechanicSpeedModifier(
  mechanic:
    | MechanicDefinition
    | undefined,
): number {
  if (!mechanic) {
    return 0;
  }

  const skill =
    clampWorkshopPercent(
      mechanic.skill,
    );

  const consistency =
    clampWorkshopPercent(
      mechanic.consistency,
    );

  const condition =
    clampWorkshopPercent(
      mechanic.condition,
    );

  const raw =
    (
      skill *
        0.55 +
      consistency *
        0.25 +
      condition *
        0.2
    ) /
    100;

  return Math.min(
    MAX_MECHANIC_SPEED_BONUS,
    raw *
      MECHANIC_SPEED_MULTIPLIER,
  );
}

/**
 * Calculate mechanic quality score.
 */
export function getMechanicQualityScore(
  mechanic:
    | MechanicDefinition
    | undefined,
): number {
  if (!mechanic) {
    return 0;
  }

  return Math.round(
    (
      clampWorkshopPercent(
        mechanic.skill,
      ) *
        0.35 +
      clampWorkshopPercent(
        mechanic.engineSkill,
      ) *
        0.2 +
      clampWorkshopPercent(
        mechanic.electricalSkill,
      ) *
        0.1 +
      clampWorkshopPercent(
        mechanic.fabricationSkill,
      ) *
        0.1 +
      clampWorkshopPercent(
        mechanic.consistency,
      ) *
        0.15 +
      clampWorkshopPercent(
        mechanic.condition,
      ) *
        0.1
    ),
  );
}

/**
 * Return specialized mechanic score by order type.
 */
export function getMechanicOrderSkill(
  mechanic:
    | MechanicDefinition
    | undefined,
  order:
    | OrderDefinition
    | undefined,
): number {
  if (
    !mechanic ||
    !order
  ) {
    return 0;
  }

  switch (
    order.type
  ) {
    case "ENGINE_BUILD":
      return Math.round(
        mechanic.engineSkill *
          0.7 +
        mechanic.skill *
          0.3,
      );

    case "CUSTOMIZATION":
      return Math.round(
        mechanic.fabricationSkill *
          0.7 +
        mechanic.skill *
          0.3,
      );

    case "RESTORATION":
      return Math.round(
        mechanic.consistency *
          0.5 +
        mechanic.fabricationSkill *
          0.25 +
        mechanic.skill *
          0.25,
      );

    case "RACE_PREP":
      return Math.round(
        mechanic.engineSkill *
          0.45 +
        mechanic.skill *
          0.35 +
        mechanic.consistency *
          0.2,
      );

    case "FULL_BUILD":
      return Math.round(
        mechanic.skill *
          0.4 +
        mechanic.engineSkill *
          0.25 +
        mechanic.fabricationSkill *
          0.2 +
        mechanic.consistency *
          0.15,
      );

    case "REPAIR":
    case "SERVICE":
    default:
      return Math.round(
        mechanic.skill *
          0.6 +
        mechanic.consistency *
          0.4,
      );
  }
}

/* -------------------------------------------------------------------------- */
/* JOB DISPLAY                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get job display state.
 */
export function getWorkshopJobDisplayState(
  job:
    | WorkshopJob
    | undefined,
): {
  status: WorkshopJobStatus;
  progress: number;
  statusLabel: string;
  progressLabel: string;
} {
  if (!job) {
    return {
      status:
        "FAILED",

      progress: 0,

      statusLabel:
        "UNKNOWN",

      progressLabel:
        "0%",
    };
  }

  const statusLabels:
    Record<
      WorkshopJobStatus,
      string
    > = {
      AVAILABLE:
        "AVAILABLE",

      QUEUED:
        "QUEUED",

      ACTIVE:
        "IN PROGRESS",

      PAUSED:
        "PAUSED",

      COMPLETED:
        "COMPLETED",

      CANCELLED:
        "CANCELLED",

      FAILED:
        "FAILED",
    };

  return {
    status:
      job.status,

    progress:
      clampWorkshopPercent(
        job.progress,
      ),

    statusLabel:
      statusLabels[
        job.status
      ],

    progressLabel:
      `${clampWorkshopPercent(
        job.progress,
      )}%`,
  };
}

/**
 * Get job priority label.
 */
export function getWorkshopJobPriorityLabel(
  priority:
    | WorkshopJobPriority,
): string {
  const labels:
    Record<
      WorkshopJobPriority,
      string
    > = {
      LOW: "LOW",

      NORMAL: "NORMAL",

      HIGH: "HIGH",

      URGENT: "URGENT",
    };

  return labels[
    priority
  ];
}

/**
 * Get active job.
 */
export function getActiveWorkshopJob(
  workshop:
    | WorkshopState
    | undefined,
): WorkshopJob
  | undefined {
  return workshop?.jobs.find(
    (job) =>
      job.status ===
      "ACTIVE",
  );
}

/**
 * Get queued jobs.
 */
export function getQueuedWorkshopJobs(
  workshop:
    | WorkshopState
    | undefined,
): WorkshopJob[] {
  return (
    workshop?.jobs ?? []
  )
    .filter(
      (job) =>
        job.status ===
        "QUEUED",
    )
    .map(
      (job) => ({
        ...job,
      }),
    );
}

/**
 * Get completed jobs.
 */
export function getCompletedWorkshopJobs(
  workshop:
    | WorkshopState
    | undefined,
): WorkshopJob[] {
  return (
    workshop?.jobs ?? []
  )
    .filter(
      (job) =>
        job.status ===
        "COMPLETED",
    )
    .map(
      (job) => ({
        ...job,
      }),
    );
}

/* -------------------------------------------------------------------------- */
/* JOB CLEANUP                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Remove old finished jobs from active state.
 *
 * Historical records can be moved elsewhere later.
 */
export function archiveWorkshopJobs(
  workshop:
    | WorkshopState
    | undefined,
  keepLast = 10,
): WorkshopState {
  if (!workshop) {
    return createEmptyWorkshopState();
  }

  const finished =
    workshop.jobs.filter(
      (job) =>
        job.status ===
          "COMPLETED" ||
        job.status ===
          "FAILED" ||
        job.status ===
          "CANCELLED",
    );

  const active =
    workshop.jobs.filter(
      (job) =>
        job.status ===
          "QUEUED" ||
        job.status ===
          "ACTIVE" ||
        job.status ===
          "PAUSED",
    );

  const recent =
    finished
      .sort(
        (
          a,
          b,
        ) =>
          (
            b.completedAt ??
            b.acceptedAt
          ) -
          (
            a.completedAt ??
            a.acceptedAt
          ),
      )
      .slice(
        0,
        Math.max(
          0,
          Math.floor(
            keepLast,
          ),
        ),
      );

  return {
    ...workshop,

    jobs: [
      ...active,
      ...recent,
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* SERIALIZATION                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Normalize loaded mechanic.
 */
export function normalizeMechanic(
  input:
    | Partial<MechanicDefinition>
    | undefined,
): MechanicDefinition
  | undefined {
  if (!input) {
    return undefined;
  }

  if (
    !input.id ||
    !input.name
  ) {
    return undefined;
  }

  return {
    id:
      input.id,

    name:
      input.name,

    level:
      Math.max(
        1,
        Math.floor(
          input.level ?? 1,
        ),
      ),

    skill:
      clampWorkshopPercent(
        input.skill ?? 0,
      ),

    engineSkill:
      clampWorkshopPercent(
        input.engineSkill ??
          input.skill ??
          0,
      ),

    electricalSkill:
      clampWorkshopPercent(
        input.electricalSkill ??
          input.skill ??
          0,
      ),

    fabricationSkill:
      clampWorkshopPercent(
        input.fabricationSkill ??
          input.skill ??
          0,
      ),

    consistency:
      clampWorkshopPercent(
        input.consistency ??
          input.skill ??
          0,
      ),

    condition:
      clampWorkshopPercent(
        input.condition ??
          100,
      ),

    salary:
      roundWorkshopMoney(
        input.salary ??
          0,
      ),

    active:
      input.active ??
      true,
  };
}

/**
 * Normalize workshop job.
 */
export function normalizeWorkshopJob(
  input:
    | Partial<WorkshopJob>
    | undefined,
): WorkshopJob
  | undefined {
  if (!input) {
    return undefined;
  }

  if (
    !input.id ||
    !input.orderId
  ) {
    return undefined;
  }

  const order =
    getOrderById(
      input.orderId,
    );

  if (!order) {
    return undefined;
  }

  const reward =
    getOrderRewards(
      order,
    );

  const workHours =
    clampWorkHours(
      input.workHours ??
        order.duration.baseHours,
    );

  const progressHours =
    Math.max(
      0,
      Math.min(
        workHours,
        Number(
          input.progressHours ??
            0,
        ),
      ),
    );

  const progress =
    clampWorkshopPercent(
      input.progress ??
        (
          progressHours /
          workHours
        ) *
          100,
    );

  return {
    id:
      input.id,

    orderId:
      input.orderId,

    status:
      input.status ??
      "QUEUED",

    priority:
      input.priority ??
      mapOrderPriorityToWorkshopPriority(
        order.priority,
      ),

    customerName:
      input.customerName ??
      order.customerName,

    motorId:
      input.motorId,

    mechanicId:
      input.mechanicId,

    assistantMechanicId:
      input.assistantMechanicId,

    acceptedAt:
      Number.isFinite(
        input.acceptedAt,
      )
        ? input.acceptedAt!
        : Date.now(),

    estimatedCompletionAt:
      Number.isFinite(
        input.estimatedCompletionAt,
      )
        ? input.estimatedCompletionAt!
        : Date.now() +
          workHours *
            60 *
            60 *
            1_000,

    completedAt:
      Number.isFinite(
        input.completedAt,
      )
        ? input.completedAt
        : undefined,

    baseHours:
      order.duration.baseHours,

    workHours,

    progressHours,

    progress,

    materialCost:
      roundWorkshopMoney(
        input.materialCost ??
          0,
      ),

    laborCost:
      roundWorkshopMoney(
        input.laborCost ??
          0,
      ),

    totalCost:
      roundWorkshopMoney(
        input.totalCost ??
          0,
      ),

    rewardCash:
      input.rewardCash ??
      reward.cash,

    rewardReputation:
      input.rewardReputation ??
      reward.reputation,

    rewardXp:
      input.rewardXp ??
      reward.xp,

    workSessions:
      Math.max(
        0,
        Math.floor(
          input.workSessions ??
            0,
        ),
      ),

    customerWaiting:
      input.customerWaiting ??
      (
        input.status ===
        "ACTIVE"
      ),

    failureReason:
      input.failureReason,

    notes:
      input.notes
        ? [...input.notes]
        : [],
  };
}

/**
 * Normalize workshop state.
 */
export function normalizeWorkshopState(
  input:
    | Partial<WorkshopState>
    | undefined,
): WorkshopState {
  if (!input) {
    return createEmptyWorkshopState();
  }

  const jobs =
    (input.jobs ??
      [])
      .map(
        (job) =>
          normalizeWorkshopJob(
            job,
          ),
      )
      .filter(
        (
          job,
        ): job is WorkshopJob =>
          Boolean(job),
      );

  return {
    jobs,

    orderCapacity:
      Math.max(
        0,
        Math.floor(
          input.orderCapacity ??
            DEFAULT_WORKSHOP_ORDER_CAPACITY,
        ),
      ),

    mechanicCapacity:
      Math.max(
        0,
        Math.floor(
          input.mechanicCapacity ??
            DEFAULT_WORKSHOP_MECHANIC_CAPACITY,
        ),
      ),

    workbenchAvailable:
      input.workbenchAvailable ??
      !jobs.some(
        (job) =>
          job.status ===
          "ACTIVE",
      ),

    completedJobs:
      Math.max(
        0,
        Math.floor(
          input.completedJobs ??
            jobs.filter(
              (job) =>
                job.status ===
                "COMPLETED",
            ).length,
        ),
      ),

    failedJobs:
      Math.max(
        0,
        Math.floor(
          input.failedJobs ??
            jobs.filter(
              (job) =>
                job.status ===
                "FAILED",
            ).length,
        ),
      ),

    revenue:
      roundWorkshopMoney(
        input.revenue ??
          0,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate one mechanic.
 */
export function validateMechanic(
  mechanic:
    | MechanicDefinition
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] =
    [];

  if (!mechanic) {
    return {
      valid: false,

      errors: [
        "Mechanic tidak ditemukan.",
      ],
    };
  }

  if (!mechanic.id.trim()) {
    errors.push(
      "Mechanic ID kosong.",
    );
  }

  if (!mechanic.name.trim()) {
    errors.push(
      "Mechanic name kosong.",
    );
  }

  if (
    mechanic.level < 1
  ) {
    errors.push(
      "Mechanic level harus minimal 1.",
    );
  }

  const fields = [
    [
      "skill",
      mechanic.skill,
    ],

    [
      "engineSkill",
      mechanic.engineSkill,
    ],

    [
      "electricalSkill",
      mechanic.electricalSkill,
    ],

    [
      "fabricationSkill",
      mechanic.fabricationSkill,
    ],

    [
      "consistency",
      mechanic.consistency,
    ],

    [
      "condition",
      mechanic.condition,
    ],
  ] as const;

  for (
    const [
      key,
      value,
    ] of fields
  ) {
    if (
      value < 0 ||
      value > 100
    ) {
      errors.push(
        `Mechanic ${key} harus 0-100.`,
      );
    }
  }

  if (
    mechanic.salary < 0
  ) {
    errors.push(
      "Mechanic salary tidak boleh negatif.",
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
  };
}

/**
 * Validate one workshop job.
 */
export function validateWorkshopJob(
  job:
    | WorkshopJob
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] =
    [];

  if (!job) {
    return {
      valid: false,

      errors: [
        "Job tidak ditemukan.",
      ],
    };
  }

  if (
    !job.id.trim()
  ) {
    errors.push(
      "Job ID kosong.",
    );
  }

  if (
    !job.orderId.trim()
  ) {
    errors.push(
      "Order ID kosong.",
    );
  }

  if (
    !getOrderById(
      job.orderId,
    )
  ) {
    errors.push(
      `Order definition tidak ditemukan: ${job.orderId}`,
    );
  }

  if (
    job.baseHours <= 0
  ) {
    errors.push(
      "baseHours harus lebih besar dari 0.",
    );
  }

  if (
    job.workHours <= 0
  ) {
    errors.push(
      "workHours harus lebih besar dari 0.",
    );
  }

  if (
    job.progressHours < 0 ||
    job.progressHours >
      job.workHours
  ) {
    errors.push(
      "progressHours tidak valid.",
    );
  }

  if (
    job.progress < 0 ||
    job.progress > 100
  ) {
    errors.push(
      "progress harus 0-100.",
    );
  }

  if (
    job.materialCost < 0 ||
    job.laborCost < 0 ||
    job.totalCost < 0
  ) {
    errors.push(
      "Workshop cost tidak boleh negatif.",
    );
  }

  if (
    job.rewardCash < 0 ||
    job.rewardReputation < 0 ||
    job.rewardXp < 0
  ) {
    errors.push(
      "Workshop reward tidak boleh negatif.",
    );
  }

  if (
    job.status ===
      "COMPLETED" &&
    job.progress <
      100
  ) {
    errors.push(
      "Job completed harus memiliki progress 100%.",
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
  };
}

/**
 * Validate complete workshop state.
 */
export function validateWorkshopState(
  workshop:
    | WorkshopState
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] =
    [];

  if (!workshop) {
    return {
      valid: false,

      errors: [
        "Workshop state tidak ditemukan.",
      ],
    };
  }

  if (
    workshop.orderCapacity <
    0
  ) {
    errors.push(
      "orderCapacity tidak boleh negatif.",
    );
  }

  if (
    workshop.mechanicCapacity <
    0
  ) {
    errors.push(
      "mechanicCapacity tidak boleh negatif.",
    );
  }

  if (
    workshop.completedJobs <
      0 ||
    workshop.failedJobs <
      0 ||
    workshop.revenue <
      0
  ) {
    errors.push(
      "Workshop statistic tidak boleh negatif.",
    );
  }

  const jobIds =
    new Set<string>();

  for (
    const job of
      workshop.jobs
  ) {
    const validation =
      validateWorkshopJob(
        job,
      );

    errors.push(
      ...validation.errors,
    );

    if (
      jobIds.has(
        job.id,
      )
    ) {
      errors.push(
        `Duplicate job ID: ${job.id}`,
      );
    }

    jobIds.add(
      job.id,
    );
  }

  if (
    getActiveWorkshopJobCount(
      workshop,
    ) >
    workshop.orderCapacity
  ) {
    errors.push(
      "Active workshop jobs melebihi order capacity.",
    );
  }

  const activeJobs =
    workshop.jobs.filter(
      (job) =>
        job.status ===
        "ACTIVE",
    );

  if (
    !workshop.workbenchAvailable &&
    activeJobs.length ===
      0
  ) {
    errors.push(
      "Workbench ditandai busy tetapi tidak ada active job.",
    );
  }

  if (
    workshop.workbenchAvailable &&
    activeJobs.length >
      0
  ) {
    errors.push(
      "Workbench ditandai available tetapi masih ada active job.",
    );
  }

  return {
    valid:
      errors.length ===
      0,

    errors,
  };
}

/* -------------------------------------------------------------------------- */
/* SIMPLE STARTER DATA                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Create a starter mechanic.
 *
 * This stays pure; the GameState layer decides whether to use it.
 */
export function createStarterMechanic(): MechanicDefinition {
  return {
    id:
      "mechanic-starter-001",

    name:
      "Bang Udin",

    level:
      1,

    skill:
      65,

    engineSkill:
      58,

    electricalSkill:
      52,

    fabricationSkill:
      45,

    consistency:
      70,

    condition:
      100,

    salary:
      350_000,

    active:
      true,
  };
}

/**
 * Create starter workshop.
 */
export function createStarterWorkshop(): WorkshopState {
  return createEmptyWorkshopState(
    1,
    1,
  );
}

/* -------------------------------------------------------------------------- */
/* OPTIONAL ORDER HELPERS                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Find order definition from job.
 */
export function getJobOrder(
  job:
    | WorkshopJob
    | undefined,
): OrderDefinition
  | undefined {
  if (!job) {
    return undefined;
  }

  return getOrderById(
    job.orderId,
  );
}

/**
 * Get motor linked to job.
 */
export function getJobMotor(
  job:
    | WorkshopJob
    | undefined,
  motors:
    | readonly MotorInstance[]
    | undefined,
): MotorInstance
  | undefined {
  if (
    !job ||
    !job.motorId ||
    !motors
  ) {
    return undefined;
  }

  return motors.find(
    (motor) =>
      motor.id ===
      job.motorId,
  );
}

/**
 * Get mechanic linked to job.
 */
export function getJobMechanic(
  job:
    | WorkshopJob
    | undefined,
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
): MechanicDefinition
  | undefined {
  if (
    !job ||
    !job.mechanicId ||
    !mechanics
  ) {
    return undefined;
  }

  return mechanics.find(
    (mechanic) =>
      mechanic.id ===
      job.mechanicId,
  );
}

/**
 * Get assistant mechanic linked to job.
 */
export function getJobAssistantMechanic(
  job:
    | WorkshopJob
    | undefined,
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
): MechanicDefinition
  | undefined {
  if (
    !job ||
    !job.assistantMechanicId ||
    !mechanics
  ) {
    return undefined;
  }

  return mechanics.find(
    (mechanic) =>
      mechanic.id ===
      job.assistantMechanicId,
  );
}

/* -------------------------------------------------------------------------- */
/* SPECIALIZED SKILLS                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Determine whether mechanic is appropriate for order.
 */
export function isMechanicSuitableForOrder(
  mechanic:
    | MechanicDefinition
    | undefined,
  order:
    | OrderDefinition
    | undefined,
): boolean {
  if (
    !mechanic ||
    !order
  ) {
    return false;
  }

  const score =
    getMechanicOrderSkill(
      mechanic,
      order,
    );

  switch (
    order.difficulty
  ) {
    case "EASY":
      return score >= 25;

    case "NORMAL":
      return score >= 40;

    case "HARD":
      return score >= 55;

    case "EXPERT":
      return score >= 68;

    case "LEGENDARY":
      return score >= 80;

    default:
      return false;
  }
}

/**
 * Recommend a mechanic for an order.
 */
export function recommendMechanicForOrder(
  mechanics:
    | readonly MechanicDefinition[]
    | undefined,
  order:
    | OrderDefinition
    | undefined,
  workshop:
    | WorkshopState
    | undefined,
): MechanicDefinition
  | undefined {
  if (
    !mechanics ||
    !order
  ) {
    return undefined;
  }

  const candidates =
    mechanics.filter(
      (mechanic) =>
        mechanic.active &&
        !isMechanicBusy(
          mechanic.id,
          workshop,
        ),
    );

  if (
    candidates.length ===
    0
  ) {
    return undefined;
  }

  return [...candidates]
    .sort(
      (
        a,
        b,
      ) =>
        getMechanicOrderSkill(
          b,
          order,
        ) -
        getMechanicOrderSkill(
          a,
          order,
        ),
    )[0];
}

/* -------------------------------------------------------------------------- */
/* FINAL JOB SUMMARY                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Get complete job summary for UI.
 */
export function getWorkshopJobSummary(
  job:
    | WorkshopJob
    | undefined,
  motor:
    | MotorInstance
    | undefined,
  mechanic:
    | MechanicDefinition
    | undefined,
): {
  order?: OrderDefinition;
  motorName: string;
  mechanicName: string;
  progress: number;
  status: WorkshopJobStatus | "UNKNOWN";
  totalCost: number;
  rewardCash: number;
  netReward: number;
  efficiency: number;
} {
  if (!job) {
    return {
      motorName:
        "NO MOTOR",

      mechanicName:
        "NO MECHANIC",

      progress: 0,

      status:
        "UNKNOWN",

      totalCost: 0,

      rewardCash: 0,

      netReward: 0,

      efficiency: 0,
    };
  }

  const order =
    getOrderById(
      job.orderId,
    );

  const motorValue =
    motor
      ? calculateMotorBuildScore(
          motor,
        )
      : 0;

  const mechanicScore =
    mechanic
      ? getMechanicQualityScore(
          mechanic,
        )
      : 0;

  const efficiency =
    Math.round(
      clampWorkshopPercent(
        (
          motorValue +
          mechanicScore
        ) /
          2,
      ),
    );

  return {
    order,

    motorName:
      motor
        ? (
            getMotorDefinition(
              motor,
            )?.shortName ??
            motor.id
          )
        : "NO MOTOR",

    mechanicName:
      mechanic?.name ??
      "NO MECHANIC",

    progress:
      clampWorkshopPercent(
        job.progress,
      ),

    status:
      job.status,

    totalCost:
      job.totalCost,

    rewardCash:
      job.rewardCash,

    netReward:
      Math.max(
        0,
        job.rewardCash -
          job.totalCost,
      ),

    efficiency,
  };
}

/* -------------------------------------------------------------------------- */
/* KEEP TYPES USED BY FUTURE STATE LAYER                                      */
/* -------------------------------------------------------------------------- */

void (
  getDriverDefinition as unknown
);

void (
  getPartById as unknown
);

void (
  getInstalledParts as unknown
);

void (
  typeInstalledPartPlaceholder as unknown
);

/**
 * Type-only placeholder.
 *
 * Keeps this file compatible with TS isolatedModules without
 * introducing runtime dependencies for future part-aware jobs.
 */
function typeInstalledPartPlaceholder(
  value?: InstalledPartInstance,
): void {
  void value;
}
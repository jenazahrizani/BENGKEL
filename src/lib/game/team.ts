/**
 * BENGKEL MALAM
 * Team / Driver Game Logic
 *
 * RESPONSIBILITY:
 * - Driver instance milik player.
 * - Recruit / release driver.
 * - Driver level + XP.
 * - Driver salary.
 * - Driver assignment ke motor.
 * - Team capacity.
 * - Driver readiness.
 * - Driver race modifiers.
 * - Team statistics.
 *
 * IMPORTANT:
 * - Tidak menggunakan localStorage.
 * - Tidak menyimpan GameState global.
 * - Tidak melakukan mutation terhadap input.
 * - Static driver definitions tetap berada di data/drivers.ts.
 *
 * MASTER DATA:
 * - ../data/drivers.ts
 *
 * MOTOR:
 * - ./motor.ts
 */

import {
  getDriverById,
  getDrivers,
  getDriversForClass,
  getDriverAverageStat,
  type DriverDefinition,
  type DriverClass,
  type DriverTier,
  type DriverStyle,
} from "../data/drivers";

import {
  getMotorDefinition,
  type MotorInstance,
} from "./motor";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface DriverInstance {
  /**
   * Unique player-owned driver ID.
   */
  id: string;

  /**
   * Static catalog ID.
   */
  definitionId: string;

  /**
   * Current driver level.
   */
  level: number;

  /**
   * Current XP within current level.
   */
  xp: number;

  /**
   * Total career XP.
   */
  totalXp: number;

  /**
   * Driver morale.
   *
   * 0-100.
   */
  morale: number;

  /**
   * Driver condition / fatigue.
   *
   * 0-100.
   *
   * 100 = fresh.
   * 0 = exhausted.
   */
  condition: number;

  /**
   * Current contract salary per game week.
   */
  salary: number;

  /**
   * Contract duration in game weeks.
   *
   * Remaining weeks.
   */
  contractWeeksRemaining: number;

  /**
   * Whether driver currently belongs to player team.
   */
  active: boolean;

  /**
   * Optional assigned motor.
   */
  assignedMotorId?: string;

  /**
   * Number of races.
   */
  raceCount: number;

  /**
   * Wins.
   */
  wins: number;

  /**
   * Podiums.
   */
  podiums: number;

  /**
   * DNF count.
   */
  dnfs: number;

  /**
   * Career cash earned.
   */
  earnings: number;

  /**
   * Game time when recruited.
   */
  recruitedAt: number;
}

export interface TeamState {
  /**
   * Driver instances owned by player.
   */
  drivers: DriverInstance[];

  /**
   * Maximum number of active drivers.
   */
  driverCapacity: number;

  /**
   * Optional team level.
   */
  level: number;

  /**
   * Team XP.
   */
  xp: number;

  /**
   * Total races completed by team.
   */
  races: number;

  /**
   * Total team wins.
   */
  wins: number;

  /**
   * Total team podiums.
   */
  podiums: number;
}

export interface TeamPlayerContext {
  garageLevel: number;
  reputation: number;
  cash: number;
}

export interface DriverContract {
  salary: number;
  weeks: number;
}

export interface DriverOperationResult {
  success: boolean;

  team?: TeamState;

  driver?: DriverInstance;

  error?: TeamErrorCode;

  message?: string;
}

export type TeamErrorCode =
  | "DRIVER_NOT_FOUND"
  | "DRIVER_ALREADY_OWNED"
  | "DRIVER_NOT_OWNED"
  | "DRIVER_LOCKED"
  | "TEAM_FULL"
  | "INVALID_LEVEL"
  | "INVALID_XP"
  | "INVALID_CONDITION"
  | "INVALID_MORALE"
  | "INVALID_CONTRACT"
  | "INSUFFICIENT_CASH"
  | "MOTOR_NOT_FOUND"
  | "MOTOR_CLASS_MISMATCH"
  | "DRIVER_CLASS_MISMATCH"
  | "DRIVER_BUSY"
  | "MOTOR_BUSY"
  | "INVALID_ASSIGNMENT"
  | "INVALID_INSTANCE";

/**
 * Race-facing driver attributes.
 */
export interface DriverRaceAttributes {
  reaction: number;
  launch: number;
  shifting: number;
  consistency: number;
  control: number;
  focus: number;
  aggression: number;
}

/**
 * Driver performance after morale / condition modifiers.
 */
export interface EffectiveDriverStats
  extends DriverRaceAttributes {
  average: number;
  performanceFactor: number;
}

/**
 * Team statistics.
 */
export interface TeamStatistics {
  totalDrivers: number;
  activeDrivers: number;

  averageLevel: number;
  averageMorale: number;
  averageCondition: number;
  averageSkill: number;

  totalRaces: number;
  totalWins: number;
  totalPodiums: number;
  totalDnfs: number;

  winRate: number;
  podiumRate: number;
  dnfRate: number;

  totalSalary: number;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_PERCENT = 100;

const DEFAULT_STARTING_LEVEL = 1;

const DEFAULT_STARTING_XP = 0;

const DEFAULT_STARTING_MORALE = 80;

const DEFAULT_STARTING_CONDITION = 100;

const DEFAULT_CONTRACT_WEEKS = 8;

const DEFAULT_BASE_SALARY = 250_000;

const LEVEL_XP_BASE = 100;

const LEVEL_XP_GROWTH = 1.25;

const MAX_LEVEL = 20;

const MORALE_MIN = 0;

const MORALE_MAX = 100;

const CONDITION_MIN = 0;

const CONDITION_MAX = 100;

/* -------------------------------------------------------------------------- */
/* GENERAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clamp a percentage.
 */
export function clampTeamPercent(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.round(
    Math.max(
      0,
      Math.min(
        100,
        value,
      ),
    ),
  );
}

/**
 * Clamp level.
 */
export function clampDriverLevel(
  level: number,
): number {
  if (
    !Number.isFinite(level)
  ) {
    return DEFAULT_STARTING_LEVEL;
  }

  return Math.max(
    1,
    Math.min(
      MAX_LEVEL,
      Math.floor(level),
    ),
  );
}

/**
 * Normalize XP.
 */
export function normalizeDriverXp(
  xp: number,
): number {
  if (
    !Number.isFinite(xp)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(xp),
  );
}

/**
 * Round monetary values.
 */
export function roundTeamMoney(
  value: number,
): number {
  if (
    !Number.isFinite(value)
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
 * Clone driver instance.
 */
export function cloneDriverInstance(
  driver:
    | DriverInstance
    | undefined,
): DriverInstance | undefined {
  if (!driver) {
    return undefined;
  }

  return {
    ...driver,
  };
}

/**
 * Clone team state.
 */
export function cloneTeamState(
  team:
    | TeamState
    | undefined,
): TeamState {
  if (!team) {
    return createEmptyTeamState();
  }

  return {
    ...team,

    drivers:
      team.drivers.map(
        (driver) => ({
          ...driver,
        }),
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* TEAM CREATION                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Create empty team state.
 */
export function createEmptyTeamState(
  driverCapacity = 1,
): TeamState {
  return {
    drivers: [],

    driverCapacity:
      Math.max(
        0,
        Math.floor(
          driverCapacity,
        ),
      ),

    level: 1,

    xp: 0,

    races: 0,

    wins: 0,

    podiums: 0,
  };
}

/**
 * Create a player-owned driver instance.
 *
 * Does not add the driver to a team.
 */
export function createDriverInstance(
  definitionId: string,
  options?: {
    id?: string;
    level?: number;
    xp?: number;
    totalXp?: number;
    morale?: number;
    condition?: number;
    salary?: number;
    contractWeeksRemaining?: number;
    active?: boolean;
    assignedMotorId?: string;
    raceCount?: number;
    wins?: number;
    podiums?: number;
    dnfs?: number;
    earnings?: number;
    recruitedAt?: number;
  },
): DriverInstance
  | undefined {
  const definition =
    getDriverById(
      definitionId,
    );

  if (!definition) {
    return undefined;
  }

  const recruitedAt =
    options?.recruitedAt ??
    Date.now();

  const level =
    clampDriverLevel(
      options?.level ??
        DEFAULT_STARTING_LEVEL,
    );

  return {
    id:
      options?.id ??
      createDriverInstanceId(
        definitionId,
        recruitedAt,
      ),

    definitionId,

    level,

    xp:
      normalizeDriverXp(
        options?.xp ??
          DEFAULT_STARTING_XP,
      ),

    totalXp:
      normalizeDriverXp(
        options?.totalXp ??
          DEFAULT_STARTING_XP,
      ),

    morale:
      clampTeamPercent(
        options?.morale ??
          DEFAULT_STARTING_MORALE,
      ),

    condition:
      clampTeamPercent(
        options?.condition ??
          DEFAULT_STARTING_CONDITION,
      ),

    salary:
      roundTeamMoney(
        options?.salary ??
          calculateRecommendedSalary(
            definition,
            level,
          ),
      ),

    contractWeeksRemaining:
      Math.max(
        0,
        Math.floor(
          options?.contractWeeksRemaining ??
            DEFAULT_CONTRACT_WEEKS,
        ),
      ),

    active:
      options?.active ??
      true,

    assignedMotorId:
      options?.assignedMotorId,

    raceCount:
      Math.max(
        0,
        Math.floor(
          options?.raceCount ?? 0,
        ),
      ),

    wins:
      Math.max(
        0,
        Math.floor(
          options?.wins ?? 0,
        ),
      ),

    podiums:
      Math.max(
        0,
        Math.floor(
          options?.podiums ?? 0,
        ),
      ),

    dnfs:
      Math.max(
        0,
        Math.floor(
          options?.dnfs ?? 0,
        ),
      ),

    earnings:
      roundTeamMoney(
        options?.earnings ?? 0,
      ),

    recruitedAt,
  };
}

/**
 * Create driver instance ID.
 */
export function createDriverInstanceId(
  definitionId: string,
  timestamp = Date.now(),
): string {
  return `driver-${definitionId}-${timestamp}-${Math.floor(
    Math.random() * 1_000_000,
  )}`;
}

/**
 * Get driver static definition.
 */
export function getDriverDefinition(
  driver:
    | DriverInstance
    | undefined,
): DriverDefinition
  | undefined {
  if (!driver) {
    return undefined;
  }

  return getDriverById(
    driver.definitionId,
  );
}

/* -------------------------------------------------------------------------- */
/* TEAM CAPACITY                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Count active drivers.
 */
export function getActiveDriverCount(
  team:
    | TeamState
    | undefined,
): number {
  if (!team) {
    return 0;
  }

  return team.drivers.filter(
    (driver) =>
      driver.active,
  ).length;
}

/**
 * Return free driver slots.
 */
export function getFreeDriverSlots(
  team:
    | TeamState
    | undefined,
): number {
  if (!team) {
    return 0;
  }

  return Math.max(
    0,
    team.driverCapacity -
      getActiveDriverCount(
        team,
      ),
  );
}

/**
 * Check team capacity.
 */
export function hasDriverCapacity(
  team:
    | TeamState
    | undefined,
): boolean {
  return (
    getFreeDriverSlots(
      team,
    ) > 0
  );
}

/* -------------------------------------------------------------------------- */
/* DRIVER LOOKUP                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Get team driver by player-owned instance ID.
 */
export function getTeamDriverById(
  team:
    | TeamState
    | undefined,
  driverInstanceId: string,
): DriverInstance
  | undefined {
  return team?.drivers.find(
    (driver) =>
      driver.id ===
      driverInstanceId,
  );
}

/**
 * Find team driver by static definition ID.
 */
export function getTeamDriverByDefinitionId(
  team:
    | TeamState
    | undefined,
  definitionId: string,
): DriverInstance
  | undefined {
  return team?.drivers.find(
    (driver) =>
      driver.definitionId ===
      definitionId,
  );
}

/**
 * Check whether player owns static driver.
 */
export function ownsDriverDefinition(
  team:
    | TeamState
    | undefined,
  definitionId: string,
): boolean {
  return Boolean(
    getTeamDriverByDefinitionId(
      team,
      definitionId,
    ),
  );
}

/**
 * Return active drivers.
 */
export function getActiveDrivers(
  team:
    | TeamState
    | undefined,
): DriverInstance[] {
  if (!team) {
    return [];
  }

  return team.drivers
    .filter(
      (driver) =>
        driver.active,
    )
    .map(
      (driver) => ({
        ...driver,
      }),
    );
}

/* -------------------------------------------------------------------------- */
/* RECRUITMENT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Check whether a driver can be recruited.
 */
export function canRecruitDriver(
  team:
    | TeamState
    | undefined,
  driver:
    | DriverDefinition
    | undefined,
  context:
    | TeamPlayerContext
    | undefined,
): {
  valid: boolean;
  error?: TeamErrorCode;
  message?: string;
} {
  if (!team) {
    return {
      valid: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Team tidak tersedia.",
    };
  }

  if (!driver) {
    return {
      valid: false,

      error:
        "DRIVER_NOT_FOUND",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (!context) {
    return {
      valid: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Player context tidak tersedia.",
    };
  }

  if (
    ownsDriverDefinition(
      team,
      driver.id,
    )
  ) {
    return {
      valid: false,

      error:
        "DRIVER_ALREADY_OWNED",

      message:
        "Driver sudah menjadi anggota tim.",
    };
  }

  if (
    !hasDriverCapacity(
      team,
    )
  ) {
    return {
      valid: false,

      error:
        "TEAM_FULL",

      message:
        "Kapasitas joki tim sudah penuh.",
    };
  }

  const requirement =
    getDriverRecruitmentRequirement(
      driver,
    );

  if (
    context.garageLevel <
    requirement.garageLevel
  ) {
    return {
      valid: false,

      error:
        "DRIVER_LOCKED",

      message:
        `Garage minimal level ${requirement.garageLevel}.`,
    };
  }

  if (
    context.reputation <
    requirement.reputation
  ) {
    return {
      valid: false,

      error:
        "DRIVER_LOCKED",

      message:
        `Reputation minimal ${requirement.reputation}.`,
    };
  }

  if (
    context.cash <
    requirement.signingBonus
  ) {
    return {
      valid: false,

      error:
        "INSUFFICIENT_CASH",

      message:
        "Cash tidak mencukupi untuk merekrut driver.",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Recruitment requirement derived from driver tier.
 */
export function getDriverRecruitmentRequirement(
  driver:
    | DriverDefinition
    | undefined,
): {
  garageLevel: number;
  reputation: number;
  signingBonus: number;
} {
  if (!driver) {
    return {
      garageLevel: 99,
      reputation: 999,
      signingBonus:
        Number.MAX_SAFE_INTEGER,
    };
  }

  const tier =
    driver.tier;

  switch (tier) {
    case "ROOKIE":
      return {
        garageLevel: 1,
        reputation: 0,
        signingBonus:
          250_000,
      };

    case "LOCAL":
      return {
        garageLevel: 1,
        reputation: 5,
        signingBonus:
          600_000,
      };

    case "KNOWN":
      return {
        garageLevel: 2,
        reputation: 15,
        signingBonus:
          1_500_000,
      };

    case "PRO":
      return {
        garageLevel: 3,
        reputation: 30,
        signingBonus:
          4_000_000,
      };

    case "ELITE":
      return {
        garageLevel: 4,
        reputation: 60,
        signingBonus:
          10_000_000,
      };
  }
}

/**
 * Calculate recommended salary.
 */
export function calculateRecommendedSalary(
  driver:
    | DriverDefinition
    | undefined,
  level = 1,
): number {
  if (!driver) {
    return DEFAULT_BASE_SALARY;
  }

  const average =
    getDriverAverageStat(
      driver,
    );

  const tierMultiplier =
    getDriverTierMultiplier(
      driver.tier,
    );

  const levelMultiplier =
    1 +
    (
      Math.max(
        1,
        level,
      ) -
      1
    ) *
      0.08;

  const value =
    DEFAULT_BASE_SALARY *
    (
      0.75 +
      average /
        100
    ) *
    tierMultiplier *
    levelMultiplier;

  return roundTeamMoney(
    value,
  );
}

/**
 * Tier salary multiplier.
 */
export function getDriverTierMultiplier(
  tier:
    | DriverTier
    | undefined,
): number {
  if (!tier) {
    return 1;
  }

  const multipliers:
    Record<
      DriverTier,
      number
    > = {
      ROOKIE: 0.65,
      LOCAL: 0.9,
      KNOWN: 1.25,
      PRO: 1.75,
      ELITE: 2.5,
    };

  return (
    multipliers[tier] ??
    1
  );
}

/**
 * Recruit driver.
 *
 * Signing fee is NOT deducted here.
 * The economy / GameState layer handles cash.
 */
export function recruitDriver(
  team:
    | TeamState
    | undefined,
  driver:
    | DriverDefinition
    | undefined,
  context:
    | TeamPlayerContext
    | undefined,
  options?: {
    salary?: number;
    contractWeeks?: number;
    signingPaid?: boolean;
  },
): DriverOperationResult {
  const validation =
    canRecruitDriver(
      team,
      driver,
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
    !team ||
    !driver
  ) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Data recruitment tidak valid.",
    };
  }

  /**
   * salary / contract are derived here.
   */
  const salary =
    options?.salary ??
    calculateRecommendedSalary(
      driver,
      1,
    );

  const instance =
    createDriverInstance(
      driver.id,
      {
        salary,

        contractWeeksRemaining:
          options?.contractWeeks ??
          DEFAULT_CONTRACT_WEEKS,
      },
    );

  if (!instance) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Driver instance gagal dibuat.",
    };
  }

  const nextTeam =
    cloneTeamState(
      team,
    );

  nextTeam.drivers.push(
    instance,
  );

  return {
    success: true,

    team:
      nextTeam,

    driver:
      instance,
  };
}

/* -------------------------------------------------------------------------- */
/* RELEASE                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Release driver from team.
 *
 * This does not refund signing bonus.
 */
export function releaseDriver(
  team:
    | TeamState
    | undefined,
  driverInstanceId: string,
): DriverOperationResult {
  if (!team) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Team tidak tersedia.",
    };
  }

  const driver =
    getTeamDriverById(
      team,
      driverInstanceId,
    );

  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak dimiliki tim.",
    };
  }

  const nextTeam =
    cloneTeamState(
      team,
    );

  nextTeam.drivers =
    nextTeam.drivers.map(
      (item) => {
        if (
          item.id !==
          driverInstanceId
        ) {
          return item;
        }

        return {
          ...item,

          active:
            false,

          assignedMotorId:
            undefined,

          contractWeeksRemaining:
            0,
        };
      },
    );

  const released =
    nextTeam.drivers.find(
      (item) =>
        item.id ===
        driverInstanceId,
    );

  return {
    success: true,

    team:
      nextTeam,

    driver:
      released,
  };
}

/* -------------------------------------------------------------------------- */
/* ASSIGNMENT                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Check if driver and motor are class compatible.
 */
export function isDriverEligibleForMotor(
  driver:
    | DriverInstance
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): boolean {
  if (
    !driver ||
    !motor
  ) {
    return false;
  }

  const driverDefinition =
    getDriverDefinition(
      driver,
    );

  const motorDefinition =
    getMotorDefinition(
      motor,
    );

  if (
    !driverDefinition ||
    !motorDefinition
  ) {
    return false;
  }

  return isDriverClassCompatibleWithMotor(
    driverDefinition.class,
    motorDefinition.class,
  );
}

/**
 * Driver class -> motor class compatibility.
 */
export function isDriverClassCompatibleWithMotor(
  driverClass:
    | DriverClass
    | string,
  motorClass:
    | string,
): boolean {
  if (
    motorClass ===
    "OPEN"
  ) {
    return (
      driverClass ===
      "OPEN"
    );
  }

  if (
    motorClass ===
      "UNDER_110" ||
    motorClass ===
      "UNDER_125"
  ) {
    return (
      driverClass ===
        "UNDER_125" ||
      driverClass ===
        "UNDER_110"
    );
  }

  if (
    motorClass ===
    "UNDER_150"
  ) {
    return (
      driverClass ===
        "UNDER_125" ||
      driverClass ===
        "UNDER_150" ||
      driverClass ===
        "OPEN"
    );
  }

  return false;
}

/**
 * Assign a driver to a motor.
 *
 * Motor itself is not mutated here.
 */
export function assignDriverToMotor(
  team:
    | TeamState
    | undefined,
  driverInstanceId: string,
  motor:
    | MotorInstance
    | undefined,
): DriverOperationResult {
  if (!team) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Team tidak tersedia.",
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

  const driver =
    getTeamDriverById(
      team,
      driverInstanceId,
    );

  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak dimiliki tim.",
    };
  }

  if (!driver.active) {
    return {
      success: false,

      error:
        "DRIVER_BUSY",

      message:
        "Driver tidak aktif di tim.",
    };
  }

  if (!isDriverEligibleForMotor(
    driver,
    motor,
  )) {
    return {
      success: false,

      error:
        "MOTOR_CLASS_MISMATCH",

      message:
        "Kelas driver dan motor tidak cocok.",
    };
  }

  if (
    motor.status !==
    "READY"
  ) {
    return {
      success: false,

      error:
        "MOTOR_BUSY",

      message:
        "Motor tidak dalam kondisi READY.",
    };
  }

  /**
   * One motor can only be assigned to one driver.
   */
  const alreadyAssigned =
    team.drivers.some(
      (item) =>
        item.active &&
        item.id !==
          driverInstanceId &&
        item.assignedMotorId ===
          motor.id,
    );

  if (
    alreadyAssigned
  ) {
    return {
      success: false,

      error:
        "INVALID_ASSIGNMENT",

      message:
        "Motor sudah digunakan driver lain.",
    };
  }

  const nextTeam =
    cloneTeamState(
      team,
    );

  nextTeam.drivers =
    nextTeam.drivers.map(
      (item) => {
        if (
          item.id !==
          driverInstanceId
        ) {
          return item;
        }

        return {
          ...item,

          assignedMotorId:
            motor.id,
        };
      },
    );

  const updatedDriver =
    getTeamDriverById(
      nextTeam,
      driverInstanceId,
    );

  return {
    success: true,

    team:
      nextTeam,

    driver:
      updatedDriver,
  };
}

/**
 * Remove a driver's motor assignment.
 */
export function unassignDriverFromMotor(
  team:
    | TeamState
    | undefined,
  driverInstanceId: string,
): DriverOperationResult {
  if (!team) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Team tidak tersedia.",
    };
  }

  const driver =
    getTeamDriverById(
      team,
      driverInstanceId,
    );

  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak dimiliki tim.",
    };
  }

  const nextTeam =
    cloneTeamState(
      team,
    );

  nextTeam.drivers =
    nextTeam.drivers.map(
      (item) => {
        if (
          item.id !==
          driverInstanceId
        ) {
          return item;
        }

        return {
          ...item,

          assignedMotorId:
            undefined,
        };
      },
    );

  return {
    success: true,

    team:
      nextTeam,

    driver:
      getTeamDriverById(
        nextTeam,
        driverInstanceId,
      ),
  };
}

/**
 * Return driver assigned to motor.
 */
export function getDriverAssignedToMotor(
  team:
    | TeamState
    | undefined,
  motorId: string,
): DriverInstance
  | undefined {
  return team?.drivers.find(
    (driver) =>
      driver.active &&
      driver.assignedMotorId ===
        motorId,
  );
}

/* -------------------------------------------------------------------------- */
/* DRIVER EFFECTIVE STATS                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Return raw driver stats.
 */
export function getDriverRaceAttributes(
  driver:
    | DriverInstance
    | undefined,
): DriverRaceAttributes {
  const definition =
    getDriverDefinition(
      driver,
    );

  if (!definition) {
    return {
      reaction: 0,
      launch: 0,
      shifting: 0,
      consistency: 0,
      control: 0,
      focus: 0,
      aggression: 0,
    };
  }

  return {
    reaction:
      clampTeamPercent(
        definition.stats
          .reaction,
      ),

    launch:
      clampTeamPercent(
        definition.stats
          .launch,
      ),

    shifting:
      clampTeamPercent(
        definition.stats
          .shifting,
      ),

    consistency:
      clampTeamPercent(
        definition.stats
          .consistency,
      ),

    control:
      clampTeamPercent(
        definition.stats
          .control,
      ),

    focus:
      clampTeamPercent(
        definition.stats
          .focus,
      ),

    aggression:
      clampTeamPercent(
        definition.stats
          .aggression,
      ),
  };
}

/**
 * Calculate driver performance factor from morale + condition + level.
 */
export function calculateDriverPerformanceFactor(
  driver:
    | DriverInstance
    | undefined,
): number {
  if (!driver) {
    return 0;
  }

  const morale =
    clampTeamPercent(
      driver.morale,
    );

  const condition =
    clampTeamPercent(
      driver.condition,
    );

  const level =
    clampDriverLevel(
      driver.level,
    );

  const moraleFactor =
    0.75 +
    (
      morale /
      100
    ) *
      0.25;

  const conditionFactor =
    0.7 +
    (
      condition /
      100
    ) *
      0.3;

  const levelFactor =
    1 +
    (
      level - 1
    ) *
      0.012;

  return Math.min(
    1.15,
    moraleFactor *
      conditionFactor *
      levelFactor,
  );
}

/**
 * Calculate effective race stats.
 */
export function calculateEffectiveDriverStats(
  driver:
    | DriverInstance
    | undefined,
): EffectiveDriverStats {
  const raw =
    getDriverRaceAttributes(
      driver,
    );

  const factor =
    calculateDriverPerformanceFactor(
      driver,
    );

  return {
    reaction:
      clampTeamPercent(
        raw.reaction *
          factor,
      ),

    launch:
      clampTeamPercent(
        raw.launch *
          factor,
      ),

    shifting:
      clampTeamPercent(
        raw.shifting *
          factor,
      ),

    consistency:
      clampTeamPercent(
        raw.consistency *
          factor,
      ),

    control:
      clampTeamPercent(
        raw.control *
          factor,
      ),

    focus:
      clampTeamPercent(
        raw.focus *
          factor,
      ),

    aggression:
      clampTeamPercent(
        raw.aggression *
          factor,
      ),

    average:
      Math.round(
        (
          raw.reaction +
          raw.launch +
          raw.shifting +
          raw.consistency +
          raw.control +
          raw.focus +
          raw.aggression
        ) /
          7 *
          factor,
      ),

    performanceFactor:
      Number(
        factor.toFixed(3),
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* DRIVER XP / LEVEL                                                          */
/* -------------------------------------------------------------------------- */

/**
 * XP required to enter a level.
 */
export function getDriverXpForLevel(
  level: number,
): number {
  const safeLevel =
    Math.max(
      1,
      Math.floor(
        level,
      ),
    );

  if (
    safeLevel <= 1
  ) {
    return 0;
  }

  return Math.round(
    LEVEL_XP_BASE *
      Math.pow(
        LEVEL_XP_GROWTH,
        safeLevel - 1,
      ),
  );
}

/**
 * XP required for next level.
 */
export function getDriverXpToNextLevel(
  level: number,
): number {
  const safeLevel =
    clampDriverLevel(
      level,
    );

  if (
    safeLevel >=
    MAX_LEVEL
  ) {
    return 0;
  }

  return (
    getDriverXpForLevel(
      safeLevel + 1,
    ) -
    getDriverXpForLevel(
      safeLevel,
    )
  );
}

/**
 * Current progress inside level.
 */
export function getDriverLevelProgress(
  driver:
    | DriverInstance
    | undefined,
): {
  currentXp: number;
  requiredXp: number;
  progress: number;
} {
  if (!driver) {
    return {
      currentXp: 0,
      requiredXp: 0,
      progress: 0,
    };
  }

  const level =
    clampDriverLevel(
      driver.level,
    );

  const levelStart =
    getDriverXpForLevel(
      level,
    );

  const nextLevelStart =
    getDriverXpForLevel(
      level + 1,
    );

  const total =
    normalizeDriverXp(
      driver.totalXp,
    );

  if (
    level >=
    MAX_LEVEL
  ) {
    return {
      currentXp:
        Math.max(
          0,
          total -
            levelStart,
        ),

      requiredXp: 0,

      progress: 100,
    };
  }

  const currentXp =
    Math.max(
      0,
      total -
        levelStart,
    );

  const requiredXp =
    Math.max(
      1,
      nextLevelStart -
        levelStart,
    );

  return {
    currentXp,

    requiredXp,

    progress:
      Math.round(
        Math.min(
          1,
          currentXp /
            requiredXp,
        ) *
          100,
      ),
  };
}

/**
 * Add XP to driver.
 *
 * Handles multiple level-ups.
 */
export function addDriverXp(
  driver:
    | DriverInstance
    | undefined,
  amount: number,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isFinite(
      amount,
    ) ||
    amount < 0
  ) {
    return {
      success: false,

      error:
        "INVALID_XP",

      message:
        "Jumlah XP tidak valid.",
    };
  }

  let totalXp =
    normalizeDriverXp(
      driver.totalXp,
    ) +
    Math.floor(
      amount,
    );

  let level =
    clampDriverLevel(
      driver.level,
    );

  while (
    level <
      MAX_LEVEL &&
    totalXp >=
      getDriverXpForLevel(
        level + 1,
      )
  ) {
    level +=
      1;
  }

  const nextDriver: DriverInstance =
    {
      ...driver,

      level,

      totalXp,

      xp:
        Math.max(
          0,
          totalXp -
            getDriverXpForLevel(
              level,
            ),
        ),
    };

  return {
    success: true,

    driver:
      nextDriver,
  };
}

/* -------------------------------------------------------------------------- */
/* MORALE / CONDITION                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Modify morale.
 */
export function modifyDriverMorale(
  driver:
    | DriverInstance
    | undefined,
  delta: number,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isFinite(
      delta,
    )
  ) {
    return {
      success: false,

      error:
        "INVALID_MORALE",

      message:
        "Perubahan morale tidak valid.",
    };
  }

  return {
    success: true,

    driver: {
      ...driver,

      morale:
        clampTeamPercent(
          driver.morale +
            delta,
        ),
    },
  };
}

/**
 * Modify driver condition.
 */
export function modifyDriverCondition(
  driver:
    | DriverInstance
    | undefined,
  delta: number,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isFinite(
      delta,
    )
  ) {
    return {
      success: false,

      error:
        "INVALID_CONDITION",

      message:
        "Perubahan condition tidak valid.",
    };
  }

  return {
    success: true,

    driver: {
      ...driver,

      condition:
        clampTeamPercent(
          driver.condition +
            delta,
        ),
    },
  };
}

/**
 * Recover driver condition.
 */
export function restDriver(
  driver:
    | DriverInstance
    | undefined,
  recovery = 25,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  return {
    success: true,

    driver: {
      ...driver,

      condition:
        clampTeamPercent(
          driver.condition +
            Math.max(
              0,
              recovery,
            ),
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* RACE RESULT RECORDING                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Record race result to driver.
 *
 * This does not calculate the race itself.
 * race.ts supplies position / finish information.
 */
export function recordDriverRaceResult(
  driver:
    | DriverInstance
    | undefined,
  result: {
    position: number;
    fieldSize?: number;
    dnf?: boolean;
    earnings?: number;
    xp?: number;
    moraleDelta?: number;
    conditionDelta?: number;
  },
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      result.position,
    ) ||
    result.position <
      1
  ) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Position race tidak valid.",
    };
  }

  const dnf =
    result.dnf ??
    false;

  const position =
    result.position;

  const podium =
    !dnf &&
    position <= 3;

  const win =
    !dnf &&
    position === 1;

  const xpResult =
    addDriverXp(
      driver,
      result.xp ??
        calculateRaceXpReward(
          position,
          result.fieldSize ??
            8,
          dnf,
        ),
    );

  if (
    !xpResult.success ||
    !xpResult.driver
  ) {
    return xpResult;
  }

  const nextDriver =
    xpResult.driver;

  return {
    success: true,

    driver: {
      ...nextDriver,

      raceCount:
        driver.raceCount +
        1,

      wins:
        driver.wins +
        (
          win
            ? 1
            : 0
        ),

      podiums:
        driver.podiums +
        (
          podium
            ? 1
            : 0
        ),

      dnfs:
        driver.dnfs +
        (
          dnf
            ? 1
            : 0
        ),

      earnings:
        roundTeamMoney(
          driver.earnings +
            (
              result.earnings ??
              0
            ),
        ),

      morale:
        clampTeamPercent(
          driver.morale +
            (
              result.moraleDelta ??
              calculateRaceMoraleDelta(
                position,
                dnf,
              )
            ),
        ),

      condition:
        clampTeamPercent(
          driver.condition +
            (
              result.conditionDelta ??
              -calculateRaceDriverFatigue(
                position,
                dnf,
              )
            ),
        ),
    },
  };
}

/**
 * XP reward for race.
 */
export function calculateRaceXpReward(
  position: number,
  fieldSize: number,
  dnf = false,
): number {
  if (dnf) {
    return 15;
  }

  const safeField =
    Math.max(
      1,
      fieldSize,
    );

  const safePosition =
    Math.max(
      1,
      position,
    );

  const placementRatio =
    Math.max(
      0,
      1 -
        (
          safePosition -
          1
        ) /
          safeField,
    );

  return Math.round(
    20 +
      placementRatio *
        80,
  );
}

/**
 * Calculate morale change after race.
 */
export function calculateRaceMoraleDelta(
  position: number,
  dnf = false,
): number {
  if (dnf) {
    return -8;
  }

  if (
    position === 1
  ) {
    return 8;
  }

  if (
    position <= 3
  ) {
    return 5;
  }

  if (
    position <= 5
  ) {
    return 2;
  }

  return -2;
}

/**
 * Calculate driver fatigue after race.
 */
export function calculateRaceDriverFatigue(
  position: number,
  dnf = false,
): number {
  const base =
    dnf
      ? 15
      : 8;

  return Math.max(
    1,
    base +
      Math.min(
        7,
        Math.max(
          0,
          position - 1,
        ),
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* TEAM RESULT RECORDING                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Record team-wide race result.
 */
export function recordTeamRaceResult(
  team:
    | TeamState
    | undefined,
  result: {
    position: number;
    dnf?: boolean;
  },
): DriverOperationResult {
  if (!team) {
    return {
      success: false,

      error:
        "INVALID_INSTANCE",

      message:
        "Team tidak tersedia.",
    };
  }

  const dnf =
    result.dnf ??
    false;

  const nextTeam =
    cloneTeamState(
      team,
    );

  nextTeam.races += 1;

  if (
    !dnf &&
    result.position ===
      1
  ) {
    nextTeam.wins += 1;
  }

  if (
    !dnf &&
    result.position <=
      3
  ) {
    nextTeam.podiums += 1;
  }

  return {
    success: true,

    team:
      nextTeam,
  };
}

/* -------------------------------------------------------------------------- */
/* CONTRACTS                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Decrease contract weeks.
 */
export function tickDriverContract(
  driver:
    | DriverInstance
    | undefined,
  weeks = 1,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      weeks,
    ) ||
    weeks <= 0
  ) {
    return {
      success: false,

      error:
        "INVALID_CONTRACT",

      message:
        "Jumlah minggu contract tidak valid.",
    };
  }

  const remaining =
    Math.max(
      0,
      driver.contractWeeksRemaining -
        weeks,
    );

  return {
    success: true,

    driver: {
      ...driver,

      contractWeeksRemaining:
        remaining,

      /**
       * Expired contract automatically becomes inactive.
       */
      active:
        remaining > 0
          ? driver.active
          : false,

      assignedMotorId:
        remaining > 0
          ? driver.assignedMotorId
          : undefined,
    },
  };
}

/**
 * Extend a driver contract.
 *
 * Cash payment is handled by the economy/state layer.
 */
export function extendDriverContract(
  driver:
    | DriverInstance
    | undefined,
  weeks: number,
  salary?: number,
): DriverOperationResult {
  if (!driver) {
    return {
      success: false,

      error:
        "DRIVER_NOT_OWNED",

      message:
        "Driver tidak ditemukan.",
    };
  }

  if (
    !Number.isInteger(
      weeks,
    ) ||
    weeks <= 0
  ) {
    return {
      success: false,

      error:
        "INVALID_CONTRACT",

      message:
        "Durasi contract tidak valid.",
    };
  }

  const nextSalary =
    salary !== undefined
      ? roundTeamMoney(
          salary,
        )
      : driver.salary;

  return {
    success: true,

    driver: {
      ...driver,

      active:
        true,

      salary:
        nextSalary,

      contractWeeksRemaining:
        driver.contractWeeksRemaining +
        weeks,
    },
  };
}

/**
 * Calculate contract renewal cost.
 */
export function calculateContractRenewalCost(
  driver:
    | DriverInstance
    | undefined,
  weeks = DEFAULT_CONTRACT_WEEKS,
): number {
  if (!driver) {
    return 0;
  }

  const safeWeeks =
    Math.max(
      1,
      Math.floor(
        weeks,
      ),
    );

  return roundTeamMoney(
    driver.salary *
      safeWeeks *
      0.35,
  );
}

/* -------------------------------------------------------------------------- */
/* TEAM SALARY                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Total active weekly salary.
 */
export function calculateTeamWeeklySalary(
  team:
    | TeamState
    | undefined,
): number {
  if (!team) {
    return 0;
  }

  return roundTeamMoney(
    team.drivers
      .filter(
        (driver) =>
          driver.active,
      )
      .reduce(
        (
          total,
          driver,
        ) =>
          total +
          driver.salary,
        0,
      ),
  );
}

/**
 * Calculate salary for selected drivers.
 */
export function calculateDriverPayroll(
  drivers:
    | readonly DriverInstance[]
    | undefined,
): number {
  if (!drivers) {
    return 0;
  }

  return roundTeamMoney(
    drivers
      .filter(
        (driver) =>
          driver.active,
      )
      .reduce(
        (
          total,
          driver,
        ) =>
          total +
          driver.salary,
        0,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* DRIVER RANKING / SELECTION                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Calculate a driver recruitment / skill score.
 */
export function calculateDriverValueScore(
  driver:
    | DriverInstance
    | undefined,
): number {
  if (!driver) {
    return 0;
  }

  const definition =
    getDriverDefinition(
      driver,
    );

  if (!definition) {
    return 0;
  }

  const average =
    getDriverAverageStat(
      definition,
    );

  const experience =
    Math.min(
      15,
      driver.level *
        1.5,
    );

  const morale =
    driver.morale *
    0.08;

  const condition =
    driver.condition *
    0.04;

  return Math.round(
    average +
      experience +
      morale +
      condition,
  );
}

/**
 * Return strongest active driver.
 */
export function getBestActiveDriver(
  team:
    | TeamState
    | undefined,
): DriverInstance
  | undefined {
  if (!team) {
    return undefined;
  }

  return getActiveDrivers(
    team,
  ).sort(
    (
      a,
      b,
    ) =>
      calculateDriverValueScore(
        b,
      ) -
      calculateDriverValueScore(
        a,
      ),
  )[0];
}

/**
 * Return active drivers compatible with motor.
 */
export function getDriversForMotor(
  team:
    | TeamState
    | undefined,
  motor:
    | MotorInstance
    | undefined,
): DriverInstance[] {
  if (
    !team ||
    !motor
  ) {
    return [];
  }

  return getActiveDrivers(
    team,
  ).filter(
    (driver) =>
      isDriverEligibleForMotor(
        driver,
        motor,
      ),
  );
}

/**
 * Return unassigned active drivers.
 */
export function getUnassignedDrivers(
  team:
    | TeamState
    | undefined,
): DriverInstance[] {
  return getActiveDrivers(
    team,
  ).filter(
    (driver) =>
      !driver.assignedMotorId,
  );
}

/* -------------------------------------------------------------------------- */
/* TEAM STATISTICS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Calculate team statistics.
 */
export function calculateTeamStatistics(
  team:
    | TeamState
    | undefined,
): TeamStatistics {
  if (
    !team ||
    team.drivers.length ===
      0
  ) {
    return {
      totalDrivers: 0,
      activeDrivers: 0,

      averageLevel: 0,
      averageMorale: 0,
      averageCondition: 0,
      averageSkill: 0,

      totalRaces:
        team?.races ?? 0,

      totalWins:
        team?.wins ?? 0,

      totalPodiums:
        team?.podiums ?? 0,

      totalDnfs: 0,

      winRate: 0,
      podiumRate: 0,
      dnfRate: 0,

      totalSalary: 0,
    };
  }

  const active =
    getActiveDrivers(
      team,
    );

  const totalRaces =
    team.races;

  const totalWins =
    team.wins;

  const totalPodiums =
    team.podiums;

  const totalDnfs =
    team.drivers.reduce(
      (
        total,
        driver,
      ) =>
        total +
        driver.dnfs,
      0,
    );

  const averageLevel =
    team.drivers.reduce(
      (
        total,
        driver,
      ) =>
        total +
        driver.level,
      0,
    ) /
    team.drivers.length;

  const averageMorale =
    team.drivers.reduce(
      (
        total,
        driver,
      ) =>
        total +
        driver.morale,
      0,
    ) /
    team.drivers.length;

  const averageCondition =
    team.drivers.reduce(
      (
        total,
        driver,
      ) =>
        total +
        driver.condition,
      0,
    ) /
    team.drivers.length;

  const averageSkill =
    team.drivers.reduce(
      (
        total,
        driver,
      ) =>
        total +
        getDriverEffectiveAverage(
          driver,
        ),
      0,
    ) /
    team.drivers.length;

  return {
    totalDrivers:
      team.drivers.length,

    activeDrivers:
      active.length,

    averageLevel:
      Number(
        averageLevel.toFixed(
          1,
        ),
      ),

    averageMorale:
      Math.round(
        averageMorale,
      ),

    averageCondition:
      Math.round(
        averageCondition,
      ),

    averageSkill:
      Math.round(
        averageSkill,
      ),

    totalRaces,

    totalWins,

    totalPodiums,

    totalDnfs,

    winRate:
      totalRaces > 0
        ? Number(
            (
              totalWins /
              totalRaces
            ).toFixed(3),
          )
        : 0,

    podiumRate:
      totalRaces > 0
        ? Number(
            (
              totalPodiums /
              totalRaces
            ).toFixed(3),
          )
        : 0,

    dnfRate:
      totalRaces > 0
        ? Number(
            (
              totalDnfs /
              totalRaces
            ).toFixed(3),
          )
        : 0,

    totalSalary:
      calculateTeamWeeklySalary(
        team,
      ),
  };
}

/**
 * Effective driver average.
 */
export function getDriverEffectiveAverage(
  driver:
    | DriverInstance
    | undefined,
): number {
  return Math.round(
    calculateEffectiveDriverStats(
      driver,
    ).average,
  );
}

/* -------------------------------------------------------------------------- */
/* DRIVER MARKET / RECRUITABLE LIST                                           */
/* -------------------------------------------------------------------------- */

/**
 * Return available static drivers for recruitment.
 */
export function getRecruitableDrivers(
  team:
    | TeamState
    | undefined,
  context:
    | TeamPlayerContext
    | undefined,
): DriverDefinition[] {
  if (!team || !context) {
    return [];
  }

  return getDrivers().filter(
    (driver) =>
      !ownsDriverDefinition(
        team,
        driver.id,
      ) &&
      canRecruitDriver(
        team,
        driver,
        context,
      ).valid,
  );
}

/**
 * Return drivers for a specific motor class.
 */
export function getRecruitableDriversForClass(
  team:
    | TeamState
    | undefined,
  context:
    | TeamPlayerContext
    | undefined,
  motorClass: string,
): DriverDefinition[] {
  return getRecruitableDrivers(
    team,
    context,
  ).filter(
    (driver) =>
      isDriverClassCompatibleWithMotor(
        driver.class,
        motorClass,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* SERIALIZATION / NORMALIZATION                                              */
/* -------------------------------------------------------------------------- */

/**
 * Normalize loaded driver instance.
 */
export function normalizeDriverInstance(
  input:
    | Partial<DriverInstance>
    | undefined,
): DriverInstance
  | undefined {
  if (!input) {
    return undefined;
  }

  if (
    !input.definitionId ||
    !getDriverById(
      input.definitionId,
    )
  ) {
    return undefined;
  }

  const level =
    clampDriverLevel(
      input.level ??
        DEFAULT_STARTING_LEVEL,
    );

  const totalXp =
    normalizeDriverXp(
      input.totalXp ??
        input.xp ??
        0,
    );

  return {
    id:
      input.id ??
      createDriverInstanceId(
        input.definitionId,
      ),

    definitionId:
      input.definitionId,

    level,

    xp:
      Math.max(
        0,
        totalXp -
          getDriverXpForLevel(
            level,
          ),
      ),

    totalXp,

    morale:
      clampTeamPercent(
        input.morale ??
          DEFAULT_STARTING_MORALE,
      ),

    condition:
      clampTeamPercent(
        input.condition ??
          DEFAULT_STARTING_CONDITION,
      ),

    salary:
      roundTeamMoney(
        input.salary ??
          calculateRecommendedSalary(
            getDriverById(
              input.definitionId,
            ),
            level,
          ),
      ),

    contractWeeksRemaining:
      Math.max(
        0,
        Math.floor(
          input.contractWeeksRemaining ??
            DEFAULT_CONTRACT_WEEKS,
        ),
      ),

    active:
      input.active ??
      true,

    assignedMotorId:
      input.assignedMotorId,

    raceCount:
      Math.max(
        0,
        Math.floor(
          input.raceCount ??
            0,
        ),
      ),

    wins:
      Math.max(
        0,
        Math.floor(
          input.wins ??
            0,
        ),
      ),

    podiums:
      Math.max(
        0,
        Math.floor(
          input.podiums ??
            0,
        ),
      ),

    dnfs:
      Math.max(
        0,
        Math.floor(
          input.dnfs ??
            0,
        ),
      ),

    earnings:
      roundTeamMoney(
        input.earnings ??
          0,
      ),

    recruitedAt:
      Number.isFinite(
        input.recruitedAt,
      )
        ? input.recruitedAt!
        : Date.now(),
  };
}

/**
 * Normalize complete team state.
 */
export function normalizeTeamState(
  input:
    | Partial<TeamState>
    | undefined,
): TeamState {
  if (!input) {
    return createEmptyTeamState();
  }

  const drivers =
    (input.drivers ??
      [])
      .map(
        (driver) =>
          normalizeDriverInstance(
            driver,
          ),
      )
      .filter(
        (
          driver,
        ): driver is DriverInstance =>
          Boolean(driver),
      );

  return {
    drivers,

    driverCapacity:
      Math.max(
        0,
        Math.floor(
          input.driverCapacity ??
            1,
        ),
      ),

    level:
      Math.max(
        1,
        Math.floor(
          input.level ?? 1,
        ),
      ),

    xp:
      Math.max(
        0,
        Math.floor(
          input.xp ?? 0,
        ),
      ),

    races:
      Math.max(
        0,
        Math.floor(
          input.races ?? 0,
        ),
      ),

    wins:
      Math.max(
        0,
        Math.floor(
          input.wins ?? 0,
        ),
      ),

    podiums:
      Math.max(
        0,
        Math.floor(
          input.podiums ?? 0,
        ),
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate one driver instance.
 */
export function validateDriverInstance(
  driver:
    | DriverInstance
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!driver) {
    return {
      valid: false,

      errors: [
        "Driver instance tidak ditemukan.",
      ],
    };
  }

  const definition =
    getDriverById(
      driver.definitionId,
    );

  if (!definition) {
    errors.push(
      `Unknown driver definition: ${driver.definitionId}`,
    );
  }

  if (
    !driver.id ||
    !driver.id.trim()
  ) {
    errors.push(
      "Driver instance ID kosong.",
    );
  }

  if (
    driver.level < 1 ||
    driver.level >
      MAX_LEVEL
  ) {
    errors.push(
      "Driver level berada di luar range.",
    );
  }

  if (
    driver.xp < 0 ||
    driver.totalXp < 0
  ) {
    errors.push(
      "Driver XP tidak boleh negatif.",
    );
  }

  if (
    driver.morale <
      MORALE_MIN ||
    driver.morale >
      MORALE_MAX
  ) {
    errors.push(
      "Driver morale harus 0-100.",
    );
  }

  if (
    driver.condition <
      CONDITION_MIN ||
    driver.condition >
      CONDITION_MAX
  ) {
    errors.push(
      "Driver condition harus 0-100.",
    );
  }

  if (
    driver.salary < 0
  ) {
    errors.push(
      "Driver salary tidak boleh negatif.",
    );
  }

  if (
    driver.contractWeeksRemaining <
      0
  ) {
    errors.push(
      "Contract duration tidak boleh negatif.",
    );
  }

  if (
    driver.raceCount < 0 ||
    driver.wins < 0 ||
    driver.podiums < 0 ||
    driver.dnfs < 0
  ) {
    errors.push(
      "Career statistic tidak boleh negatif.",
    );
  }

  if (
    driver.wins >
    driver.raceCount
  ) {
    errors.push(
      "Wins tidak boleh lebih banyak dari race count.",
    );
  }

  if (
    driver.podiums >
    driver.raceCount
  ) {
    errors.push(
      "Podiums tidak boleh lebih banyak dari race count.",
    );
  }

  if (
    driver.dnfs >
    driver.raceCount
  ) {
    errors.push(
      "DNF tidak boleh lebih banyak dari race count.",
    );
  }

  if (
    driver.earnings < 0
  ) {
    errors.push(
      "Driver earnings tidak boleh negatif.",
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
  };
}

/**
 * Validate entire team state.
 */
export function validateTeamState(
  team:
    | TeamState
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!team) {
    return {
      valid: false,

      errors: [
        "Team state tidak ditemukan.",
      ],
    };
  }

  if (
    team.driverCapacity <
    0
  ) {
    errors.push(
      "driverCapacity tidak boleh negatif.",
    );
  }

  if (
    team.level < 1
  ) {
    errors.push(
      "team level harus minimal 1.",
    );
  }

  if (
    team.xp < 0
  ) {
    errors.push(
      "team XP tidak boleh negatif.",
    );
  }

  if (
    team.races < 0 ||
    team.wins < 0 ||
    team.podiums < 0
  ) {
    errors.push(
      "team statistics tidak boleh negatif.",
    );
  }

  if (
    team.wins >
    team.races
  ) {
    errors.push(
      "team wins tidak boleh melebihi races.",
    );
  }

  if (
    team.podiums >
    team.races
  ) {
    errors.push(
      "team podiums tidak boleh melebihi races.",
    );
  }

  const driverIds =
    new Set<string>();

  const definitionIds =
    new Set<string>();

  for (
    const driver of
      team.drivers
  ) {
    const validation =
      validateDriverInstance(
        driver,
      );

    errors.push(
      ...validation.errors,
    );

    if (
      driverIds.has(
        driver.id,
      )
    ) {
      errors.push(
        `Duplicate driver instance ID: ${driver.id}`,
      );
    }

    driverIds.add(
      driver.id,
    );

    if (
      definitionIds.has(
        driver.definitionId,
      )
    ) {
      errors.push(
        `Duplicate owned driver definition: ${driver.definitionId}`,
      );
    }

    definitionIds.add(
      driver.definitionId,
    );
  }

  if (
    getActiveDriverCount(
      team,
    ) >
    team.driverCapacity
  ) {
    errors.push(
      "Active driver count melebihi team capacity.",
    );
  }

  /**
   * A motor assignment should be unique inside team.
   */
  const assignedMotorIds =
    new Set<string>();

  for (
    const driver of
      team.drivers
  ) {
    if (
      !driver.active ||
      !driver.assignedMotorId
    ) {
      continue;
    }

    if (
      assignedMotorIds.has(
        driver.assignedMotorId,
      )
    ) {
      errors.push(
        `Motor assigned ke lebih dari satu driver: ${driver.assignedMotorId}`,
      );
    }

    assignedMotorIds.add(
      driver.assignedMotorId,
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
  };
}

/* -------------------------------------------------------------------------- */
/* DISPLAY HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get driver display name.
 */
export function getDriverDisplayName(
  driver:
    | DriverInstance
    | undefined,
): string {
  const definition =
    getDriverDefinition(
      driver,
    );

  if (!definition) {
    return "UNKNOWN DRIVER";
  }

  return definition.name;
}

/**
 * Get driver tier.
 */
export function getDriverTier(
  driver:
    | DriverInstance
    | undefined,
): DriverTier
  | undefined {
  return getDriverDefinition(
    driver,
  )?.tier;
}

/**
 * Get driver style.
 */
export function getDriverStyle(
  driver:
    | DriverInstance
    | undefined,
): DriverStyle
  | undefined {
  return getDriverDefinition(
    driver,
  )?.style;
}

/**
 * Format salary.
 */
export function formatDriverSalary(
  salary: number,
): string {
  const value =
    Math.max(
      0,
      salary,
    );

  if (
    value >=
    1_000_000
  ) {
    return `Rp ${(
      value /
      1_000_000
    ).toFixed(1)} JT/MINGGU`;
  }

  if (
    value >=
    1_000
  ) {
    return `Rp ${Math.round(
      value / 1_000,
    )} RB/MINGGU`;
  }

  return `Rp ${Math.round(
    value,
  )}/MINGGU`;
}

/**
 * Return morale label.
 */
export function getDriverMoraleLabel(
  morale: number,
): "LOW" | "NORMAL" | "HIGH" | "EXCELLENT" {
  const value =
    clampTeamPercent(
      morale,
    );

  if (
    value < 35
  ) {
    return "LOW";
  }

  if (
    value < 65
  ) {
    return "NORMAL";
  }

  if (
    value < 85
  ) {
    return "HIGH";
  }

  return "EXCELLENT";
}

/**
 * Return condition label.
 */
export function getDriverConditionLabel(
  condition: number,
): "EXHAUSTED" | "TIRED" | "FIT" | "FRESH" {
  const value =
    clampTeamPercent(
      condition,
    );

  if (
    value < 25
  ) {
    return "EXHAUSTED";
  }

  if (
    value < 55
  ) {
    return "TIRED";
  }

  if (
    value < 80
  ) {
    return "FIT";
  }

  return "FRESH";
}

/* -------------------------------------------------------------------------- */
/* STARTER DRIVER                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create the default starter driver.
 *
 * Bimo "Kilat" is aligned with the current race design.
 */
export function createStarterDriver(): DriverInstance
  | undefined {
  const driver =
    getDriverById(
      "bimo-kilat",
    );

  if (!driver) {
    return undefined;
  }

  return createDriverInstance(
    driver.id,
    {
      salary:
        calculateRecommendedSalary(
          driver,
          1,
        ),

      contractWeeksRemaining:
        DEFAULT_CONTRACT_WEEKS,
    },
  );
}

/**
 * Create starter team.
 */
export function createStarterTeam(
  driverCapacity = 1,
): TeamState {
  const team =
    createEmptyTeamState(
      driverCapacity,
    );

  const starter =
    createStarterDriver();

  if (starter) {
    team.drivers.push(
      starter,
    );
  }

  return team;
}

/* -------------------------------------------------------------------------- */
/* UTILITY                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get all driver definitions by class.
 *
 * Exposed here so team UI does not need direct data imports.
 */
export function getTeamDriversForClass(
  driverClass:
    | DriverClass
    | string,
): DriverDefinition[] {
  return getDriversForClass(
    driverClass as DriverClass,
  );
}

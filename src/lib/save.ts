/**
 * BENGKEL MALAM
 * Save / Load System
 *
 * RESPONSIBILITY:
 * - Persist GameState to browser localStorage.
 * - Load and normalize saved state.
 * - Validate saved data before use.
 * - Handle schema versioning.
 * - Support migration between save versions.
 * - Backup / restore.
 * - Export / import JSON.
 * - Reset save.
 *
 * IMPORTANT:
 * - Hanya file ini yang berhubungan langsung dengan localStorage.
 * - Data catalog tidak boleh membaca localStorage.
 * - Game logic tidak boleh membaca localStorage.
 * - Astro SSR harus tetap aman.
 *
 * CURRENT STORAGE KEY:
 *   bengkel-malam-save
 *
 * BACKUP KEY:
 *   bengkel-malam-save-backup
 */

import {
  normalizePartInventory,
  validatePartInventory,
  type PartInventory,
} from "./game/parts";

import {
  normalizeTeamState,
  validateTeamState,
  type TeamState,
} from "./game/team";

import {
  normalizeWorkshopState,
  validateWorkshopState,
  type WorkshopState,
} from "./game/workshop";

import {
  normalizeMotorInstance,
  isMotorInstance,
  type MotorInstance,
} from "./game/motor";

import type {
  MarketSnapshot,
} from "./game/market";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

export const SAVE_STORAGE_KEY =
  "bengkel-malam-save";

export const SAVE_BACKUP_STORAGE_KEY =
  "bengkel-malam-save-backup";

export const SAVE_EXPORT_PREFIX =
  "BENGKEL-MALAM-SAVE";

export const CURRENT_SAVE_VERSION =
  1;

/**
 * Maximum JSON size we are willing to load.
 *
 * This prevents accidentally storing huge corrupted data.
 */
const MAX_SAVE_SIZE_BYTES =
  2_000_000;

/**
 * Version history.
 */
export const SUPPORTED_SAVE_VERSIONS =
  [1] as const;

/* -------------------------------------------------------------------------- */
/* STATE TYPES                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Garage progression.
 *
 * Kept here temporarily until game/state.ts becomes the central
 * canonical state-definition file.
 */
export interface GarageState {
  level: number;

  motorCapacity: number;
  mechanicCapacity: number;
  driverCapacity: number;
  orderCapacity: number;

  /**
   * Optional upgrade flags.
   */
  upgrades: string[];
}

/**
 * Player economy.
 */
export interface EconomyState {
  cash: number;

  totalEarned: number;
  totalSpent: number;
}

/**
 * Player progression.
 */
export interface ProgressionState {
  level: number;
  xp: number;

  reputation: number;

  /**
   * Unlock IDs.
   */
  unlocks: string[];

  /**
   * License IDs.
   */
  licenses: string[];
}

/**
 * Race history stored by player.
 *
 * This is intentionally compact. The full simulation result
 * does not need to be persisted forever.
 */
export interface RaceHistoryEntry {
  id: string;

  raceId: string;

  motorId: string;

  driverId: string;

  position: number;

  fieldSize: number;

  finishTimeMs: number;

  finished: boolean;

  championshipPoints: number;

  cashEarned: number;

  xpEarned: number;

  reputationEarned: number;

  motorWear: number;

  simulatedAt: number;
}

/**
 * Championship progress.
 */
export interface ChampionshipState {
  id: string;

  points: number;

  racesEntered: number;

  wins: number;

  podiums: number;

  completedRounds: number;

  active: boolean;

  completed: boolean;
}

/**
 * Player market state.
 *
 * MarketSnapshot contains generated listings and should be saved
 * so refreshes do not regenerate a completely different market
 * on every page load.
 */
export interface MarketState {
  snapshot?: MarketSnapshot;

  marketDay: number;

  lastRefreshAt: number;
}

/**
 * Career record.
 */
export interface CareerStats {
  races: number;

  wins: number;

  podiums: number;

  dnfs: number;

  workshopJobs: number;

  workshopJobsFailed: number;

  motorsBought: number;

  motorsSold: number;

  partsBought: number;

  partsSold: number;

  moneyEarned: number;

  moneySpent: number;
}

/**
 * Complete mutable player state.
 *
 * This is the canonical persistence shape for save.ts.
 *
 * Later, src/lib/game/state.ts can simply re-export this type
 * or become the canonical owner of this interface.
 */
export interface GameState {
  /**
   * Schema version of the logical state.
   */
  version: number;

  /**
   * Save metadata.
   */
  meta: {
    saveId: string;

    createdAt: number;

    updatedAt: number;

    lastPlayedAt: number;
  };

  /**
   * Simple in-game clock.
   */
  clock: {
    day: number;

    hour: number;

    minute: number;

    totalHours: number;
  };

  /**
   * Player profile.
   */
  profile: {
    name: string;

    garageName: string;
  };

  garage: GarageState;

  economy: EconomyState;

  progression: ProgressionState;

  /**
   * Player-owned motor instances.
   */
  motors: MotorInstance[];

  /**
   * Catalog inventory.
   */
  parts: PartInventory;

  /**
   * Driver/team state.
   */
  team: TeamState;

  /**
   * Workshop / customer jobs.
   */
  workshop: WorkshopState;

  /**
   * Current generated market.
   */
  market: MarketState;

  /**
   * Race history.
   */
  raceHistory: RaceHistoryEntry[];

  /**
   * Championship progress.
   */
  championships: ChampionshipState[];

  /**
   * Career counters.
   */
  career: CareerStats;
}

/**
 * Envelope stored in localStorage.
 */
export interface SaveEnvelope {
  app: "BENGKEL_MALAM";

  schema: number;

  savedAt: number;

  data: GameState;
}

/* -------------------------------------------------------------------------- */
/* RESULT TYPES                                                               */
/* -------------------------------------------------------------------------- */

export type SaveErrorCode =
  | "SSR_UNAVAILABLE"
  | "STORAGE_UNAVAILABLE"
  | "STORAGE_WRITE_FAILED"
  | "STORAGE_READ_FAILED"
  | "INVALID_SAVE"
  | "INVALID_JSON"
  | "UNSUPPORTED_VERSION"
  | "VALIDATION_FAILED"
  | "SAVE_TOO_LARGE"
  | "IMPORT_FAILED"
  | "RESET_FAILED";

export interface SaveResult {
  success: boolean;

  error?: SaveErrorCode;

  message?: string;

  state?: GameState;
}

export interface LoadResult {
  success: boolean;

  state?: GameState;

  error?: SaveErrorCode;

  message?: string;

  migrated?: boolean;
}

export interface SaveValidationResult {
  valid: boolean;

  errors: string[];

  warnings: string[];
}

export interface SaveMetadata {
  saveId: string;

  createdAt: number;

  updatedAt: number;

  lastPlayedAt: number;

  version: number;

  sizeBytes: number;
}

/* -------------------------------------------------------------------------- */
/* ENVIRONMENT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Check whether browser storage is available.
 */
export function isBrowserStorageAvailable(): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  if (
    typeof window.localStorage ===
    "undefined"
  ) {
    return false;
  }

  try {
    const testKey =
      "__bengkel_malam_storage_test__";

    window.localStorage.setItem(
      testKey,
      "1",
    );

    window.localStorage.removeItem(
      testKey,
    );

    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* DEFAULT STATE                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Create unique save ID.
 */
export function createSaveId(): string {
  const timestamp =
    Date.now();

  let random =
    Math.floor(
      Math.random() *
        1_000_000,
    );

  /**
   * Make sure random is always finite.
   */
  if (
    !Number.isFinite(
      random,
    )
  ) {
    random = 0;
  }

  return `save-${timestamp}-${random}`;
}

/**
 * Create default garage state.
 */
export function createDefaultGarageState(): GarageState {
  return {
    level: 1,

    motorCapacity: 2,

    mechanicCapacity: 1,

    driverCapacity: 1,

    orderCapacity: 1,

    upgrades: [],
  };
}

/**
 * Create default economy.
 */
export function createDefaultEconomyState(): EconomyState {
  return {
    cash: 25_000_000,

    totalEarned: 0,

    totalSpent: 0,
  };
}

/**
 * Create default progression.
 */
export function createDefaultProgressionState(): ProgressionState {
  return {
    level: 1,

    xp: 0,

    reputation: 0,

    unlocks: [],

    licenses: ["D"],
  };
}

/**
 * Create default clock.
 */
export function createDefaultClockState(): GameState["clock"] {
  return {
    day: 1,

    hour: 8,

    minute: 0,

    totalHours: 0,
  };
}

/**
 * Create default career stats.
 */
export function createDefaultCareerStats(): CareerStats {
  return {
    races: 0,

    wins: 0,

    podiums: 0,

    dnfs: 0,

    workshopJobs: 0,

    workshopJobsFailed: 0,

    motorsBought: 0,

    motorsSold: 0,

    partsBought: 0,

    partsSold: 0,

    moneyEarned: 0,

    moneySpent: 0,
  };
}

/**
 * Create a new empty market state.
 */
export function createDefaultMarketState(): MarketState {
  return {
    snapshot: undefined,

    marketDay: 1,

    lastRefreshAt: 0,
  };
}

/**
 * Create a new game state.
 *
 * This is intentionally independent from localStorage.
 */
export function createDefaultGameState(): GameState {
  const now =
    Date.now();

  return {
    version:
      CURRENT_SAVE_VERSION,

    meta: {
      saveId:
        createSaveId(),

      createdAt:
        now,

      updatedAt:
        now,

      lastPlayedAt:
        now,
    },

    clock:
      createDefaultClockState(),

    profile: {
      name:
        "PLAYER",

      garageName:
        "BENGKEL MALAM",
    },

    garage:
      createDefaultGarageState(),

    economy:
      createDefaultEconomyState(),

    progression:
      createDefaultProgressionState(),

    motors: [],

    parts: {},

    /**
     * Team/workshop helpers create their own empty state.
     */
    team: {
      drivers: [],

      driverCapacity: 1,

      level: 1,

      xp: 0,

      races: 0,

      wins: 0,

      podiums: 0,
    },

    workshop: {
      jobs: [],

      orderCapacity: 1,

      mechanicCapacity: 1,

      workbenchAvailable: true,

      completedJobs: 0,

      failedJobs: 0,

      revenue: 0,
    },

    market:
      createDefaultMarketState(),

    raceHistory: [],

    championships: [],

    career:
      createDefaultCareerStats(),
  };
}

/* -------------------------------------------------------------------------- */
/* SANITIZATION                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Clamp integer.
 */
export function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const numeric =
    typeof value ===
    "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(
      numeric,
    )
  ) {
    return fallback;
  }

  return Math.max(
    min,
    Math.min(
      max,
      Math.floor(
        numeric,
      ),
    ),
  );
}

/**
 * Clamp non-negative integer.
 */
export function nonNegativeInteger(
  value: unknown,
  fallback = 0,
): number {
  return clampInteger(
    value,
    0,
    Number.MAX_SAFE_INTEGER,
    fallback,
  );
}

/**
 * Sanitize string.
 */
export function sanitizeString(
  value: unknown,
  fallback: string,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return fallback;
  }

  const trimmed =
    value.trim();

  return trimmed ||
    fallback;
}

/**
 * Sanitize unique string array.
 */
export function sanitizeStringArray(
  value: unknown,
): string[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter(
          (
            item,
          ): item is string =>
            typeof item ===
            "string",
        )
        .map(
          (item) =>
            item.trim(),
        )
        .filter(
          Boolean,
        ),
    ),
  ];
}

/**
 * Sanitize timestamp.
 */
export function sanitizeTimestamp(
  value: unknown,
  fallback: number,
): number {
  const numeric =
    typeof value ===
    "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(
      numeric,
    ) ||
    numeric <= 0
  ) {
    return fallback;
  }

  return Math.floor(
    numeric,
  );
}

/* -------------------------------------------------------------------------- */
/* GAME STATE NORMALIZATION                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Normalize a full GameState.
 *
 * This is intentionally defensive.
 */
export function normalizeGameState(
  input:
    | Partial<GameState>
    | undefined,
): GameState {
  const fallback =
    createDefaultGameState();

  if (!input) {
    return fallback;
  }

  const now =
    Date.now();

  /* ---------------------------------------------------------------------- */
  /* MOTOR STATE                                                            */
  /* ---------------------------------------------------------------------- */

  const motors =
    Array.isArray(
      input.motors,
    )
      ? input.motors
          .map(
            (motor) =>
              normalizeMotorInstance(
                motor,
              ),
          )
          .filter(
            (
              motor,
            ): motor is MotorInstance =>
              Boolean(motor) &&
              isMotorInstance(
                motor,
              ),
          )
      : [];

  /* ---------------------------------------------------------------------- */
  /* BASIC STATE                                                            */
  /* ---------------------------------------------------------------------- */

  const garageInput =
    input.garage ??
    {};

  const economyInput =
    input.economy ??
    {};

  const progressionInput =
    input.progression ??
    {};

  const clockInput =
    input.clock ??
    {};

  const profileInput =
    input.profile ??
    {};

  const metaInput =
    input.meta ??
    {};

  /* ---------------------------------------------------------------------- */
  /* NORMALIZED                                                              */
  /* ---------------------------------------------------------------------- */

  const state: GameState = {
    version:
      CURRENT_SAVE_VERSION,

    meta: {
      saveId:
        sanitizeString(
          metaInput.saveId,
          createSaveId(),
        ),

      createdAt:
        sanitizeTimestamp(
          metaInput.createdAt,
          now,
        ),

      updatedAt:
        sanitizeTimestamp(
          metaInput.updatedAt,
          now,
        ),

      lastPlayedAt:
        sanitizeTimestamp(
          metaInput.lastPlayedAt,
          now,
        ),
    },

    clock: {
      day:
        clampInteger(
          clockInput.day,
          1,
          Number.MAX_SAFE_INTEGER,
          1,
        ),

      hour:
        clampInteger(
          clockInput.hour,
          0,
          23,
          8,
        ),

      minute:
        clampInteger(
          clockInput.minute,
          0,
          59,
          0,
        ),

      totalHours:
        nonNegativeInteger(
          clockInput.totalHours,
          0,
        ),
    },

    profile: {
      name:
        sanitizeString(
          profileInput.name,
          "PLAYER",
        ),

      garageName:
        sanitizeString(
          profileInput.garageName,
          "BENGKEL MALAM",
        ),
    },

    garage: {
      level:
        clampInteger(
          garageInput.level,
          1,
          99,
          1,
        ),

      motorCapacity:
        clampInteger(
          garageInput.motorCapacity,
          0,
          999,
          2,
        ),

      mechanicCapacity:
        clampInteger(
          garageInput.mechanicCapacity,
          0,
          999,
          1,
        ),

      driverCapacity:
        clampInteger(
          garageInput.driverCapacity,
          0,
          999,
          1,
        ),

      orderCapacity:
        clampInteger(
          garageInput.orderCapacity,
          0,
          999,
          1,
        ),

      upgrades:
        sanitizeStringArray(
          garageInput.upgrades,
        ),
    },

    economy: {
      cash:
        sanitizeMoney(
          economyInput.cash,
        ),

      totalEarned:
        sanitizeMoney(
          economyInput.totalEarned,
        ),

      totalSpent:
        sanitizeMoney(
          economyInput.totalSpent,
        ),
    },

    progression: {
      level:
        clampInteger(
          progressionInput.level,
          1,
          999,
          1,
        ),

      xp:
        nonNegativeInteger(
          progressionInput.xp,
          0,
        ),

      reputation:
        nonNegativeInteger(
          progressionInput.reputation,
          0,
        ),

      unlocks:
        sanitizeStringArray(
          progressionInput.unlocks,
        ),

      licenses:
        sanitizeStringArray(
          progressionInput.licenses,
        ),
    },

    motors,

    parts:
      normalizePartInventory(
        input.parts,
      ),

    team:
      normalizeTeamState(
        input.team,
      ),

    workshop:
      normalizeWorkshopState(
        input.workshop,
      ),

    market:
      normalizeMarketState(
        input.market,
      ),

    raceHistory:
      normalizeRaceHistory(
        input.raceHistory,
      ),

    championships:
      normalizeChampionships(
        input.championships,
      ),

    career:
      normalizeCareerStats(
        input.career,
      ),
  };

  /**
   * Garage capacity should always be represented in actual
   * state objects too.
   */
  state.team.driverCapacity =
    state.garage.driverCapacity;

  state.workshop.orderCapacity =
    state.garage.orderCapacity;

  state.workshop.mechanicCapacity =
    state.garage.mechanicCapacity;

  /**
   * Never allow negative cash.
   */
  state.economy.cash =
    Math.max(
      0,
      state.economy.cash,
    );

  /**
   * Mark current save as current schema.
   */
  state.version =
    CURRENT_SAVE_VERSION;

  return state;
}

/**
 * Sanitize money.
 */
export function sanitizeMoney(
  value: unknown,
): number {
  const numeric =
    typeof value ===
    "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(
      numeric,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(
      numeric,
    ),
  );
}

/**
 * Normalize market state.
 */
export function normalizeMarketState(
  input:
    | Partial<MarketState>
    | undefined,
): MarketState {
  if (!input) {
    return createDefaultMarketState();
  }

  return {
    snapshot:
      input.snapshot,

    marketDay:
      nonNegativeInteger(
        input.marketDay,
        1,
      ),

    lastRefreshAt:
      sanitizeTimestamp(
        input.lastRefreshAt,
        0,
      ),
  };
}

/**
 * Normalize race history.
 */
export function normalizeRaceHistory(
  input:
    | readonly Partial<RaceHistoryEntry>[]
    | undefined,
): RaceHistoryEntry[] {
  if (
    !Array.isArray(
      input,
    )
  ) {
    return [];
  }

  return input
    .map(
      (entry) => {
        if (
          !entry ||
          typeof entry !==
            "object"
        ) {
          return undefined;
        }

        if (
          typeof entry.id !==
            "string" ||
          typeof entry.raceId !==
            "string" ||
          typeof entry.motorId !==
            "string" ||
          typeof entry.driverId !==
            "string"
        ) {
          return undefined;
        }

        return {
          id:
            entry.id,

          raceId:
            entry.raceId,

          motorId:
            entry.motorId,

          driverId:
            entry.driverId,

          position:
            clampInteger(
              entry.position,
              1,
              999,
              1,
            ),

          fieldSize:
            clampInteger(
              entry.fieldSize,
              1,
              999,
              1,
            ),

          finishTimeMs:
            nonNegativeInteger(
              entry.finishTimeMs,
              0,
            ),

          finished:
            Boolean(
              entry.finished,
            ),

          championshipPoints:
            nonNegativeInteger(
              entry.championshipPoints,
              0,
            ),

          cashEarned:
            sanitizeMoney(
              entry.cashEarned,
            ),

          xpEarned:
            nonNegativeInteger(
              entry.xpEarned,
              0,
            ),

          reputationEarned:
            nonNegativeInteger(
              entry.reputationEarned,
              0,
            ),

          motorWear:
            Math.max(
              0,
              Number.isFinite(
                Number(
                  entry.motorWear,
                ),
              )
                ? Number(
                    entry.motorWear,
                  )
                : 0,
            ),

          simulatedAt:
            sanitizeTimestamp(
              entry.simulatedAt,
              Date.now(),
            ),
        } satisfies RaceHistoryEntry;
      },
    )
    .filter(
      (
        entry,
      ): entry is RaceHistoryEntry =>
        Boolean(entry),
    );
}

/**
 * Normalize championships.
 */
export function normalizeChampionships(
  input:
    | readonly Partial<ChampionshipState>[]
    | undefined,
): ChampionshipState[] {
  if (
    !Array.isArray(
      input,
    )
  ) {
    return [];
  }

  return input
    .map(
      (entry) => {
        if (
          !entry ||
          typeof entry.id !==
            "string"
        ) {
          return undefined;
        }

        return {
          id:
            entry.id,

          points:
            nonNegativeInteger(
              entry.points,
              0,
            ),

          racesEntered:
            nonNegativeInteger(
              entry.racesEntered,
              0,
            ),

          wins:
            nonNegativeInteger(
              entry.wins,
              0,
            ),

          podiums:
            nonNegativeInteger(
              entry.podiums,
              0,
            ),

          completedRounds:
            nonNegativeInteger(
              entry.completedRounds,
              0,
            ),

          active:
            Boolean(
              entry.active,
            ),

          completed:
            Boolean(
              entry.completed,
            ),
        } satisfies ChampionshipState;
      },
    )
    .filter(
      (
        entry,
      ): entry is ChampionshipState =>
        Boolean(entry),
    );
}

/**
 * Normalize career statistics.
 */
export function normalizeCareerStats(
  input:
    | Partial<CareerStats>
    | undefined,
): CareerStats {
  const source =
    input ?? {};

  return {
    races:
      nonNegativeInteger(
        source.races,
      ),

    wins:
      nonNegativeInteger(
        source.wins,
      ),

    podiums:
      nonNegativeInteger(
        source.podiums,
      ),

    dnfs:
      nonNegativeInteger(
        source.dnfs,
      ),

    workshopJobs:
      nonNegativeInteger(
        source.workshopJobs,
      ),

    workshopJobsFailed:
      nonNegativeInteger(
        source.workshopJobsFailed,
      ),

    motorsBought:
      nonNegativeInteger(
        source.motorsBought,
      ),

    motorsSold:
      nonNegativeInteger(
        source.motorsSold,
      ),

    partsBought:
      nonNegativeInteger(
        source.partsBought,
      ),

    partsSold:
      nonNegativeInteger(
        source.partsSold,
      ),

    moneyEarned:
      sanitizeMoney(
        source.moneyEarned,
      ),

    moneySpent:
      sanitizeMoney(
        source.moneySpent,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Validate complete state before writing to storage.
 */
export function validateGameState(
  state:
    | GameState
    | undefined,
): SaveValidationResult {
  const errors: string[] =
    [];

  const warnings: string[] =
    [];

  if (!state) {
    return {
      valid: false,

      errors: [
        "GameState tidak tersedia.",
      ],

      warnings: [],
    };
  }

  if (
    state.version !==
    CURRENT_SAVE_VERSION
  ) {
    warnings.push(
      `GameState version ${state.version} akan dinormalisasi ke ${CURRENT_SAVE_VERSION}.`,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* META                                                                   */
  /* ---------------------------------------------------------------------- */

  if (
    !state.meta.saveId.trim()
  ) {
    errors.push(
      "meta.saveId kosong.",
    );
  }

  if (
    state.meta.createdAt <= 0
  ) {
    errors.push(
      "meta.createdAt tidak valid.",
    );
  }

  if (
    state.meta.updatedAt <= 0
  ) {
    errors.push(
      "meta.updatedAt tidak valid.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ECONOMY                                                                */
  /* ---------------------------------------------------------------------- */

  if (
    state.economy.cash <
    0
  ) {
    errors.push(
      "Cash tidak boleh negatif.",
    );
  }

  if (
    state.economy.totalEarned <
    0
  ) {
    errors.push(
      "totalEarned tidak boleh negatif.",
    );
  }

  if (
    state.economy.totalSpent <
    0
  ) {
    errors.push(
      "totalSpent tidak boleh negatif.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PROGRESSION                                                             */
  /* ---------------------------------------------------------------------- */

  if (
    state.progression.level <
    1
  ) {
    errors.push(
      "Progression level harus minimal 1.",
    );
  }

  if (
    state.progression.xp <
    0
  ) {
    errors.push(
      "Progression XP tidak boleh negatif.",
    );
  }

  if (
    state.progression.reputation <
    0
  ) {
    errors.push(
      "Reputation tidak boleh negatif.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* GARAGE                                                                  */
  /* ---------------------------------------------------------------------- */

  if (
    state.garage.level <
    1
  ) {
    errors.push(
      "Garage level harus minimal 1.",
    );
  }

  if (
    state.garage.motorCapacity <
    0
  ) {
    errors.push(
      "Motor capacity tidak boleh negatif.",
    );
  }

  if (
    state.garage.mechanicCapacity <
    0
  ) {
    errors.push(
      "Mechanic capacity tidak boleh negatif.",
    );
  }

  if (
    state.garage.driverCapacity <
    0
  ) {
    errors.push(
      "Driver capacity tidak boleh negatif.",
    );
  }

  if (
    state.garage.orderCapacity <
    0
  ) {
    errors.push(
      "Order capacity tidak boleh negatif.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* MOTORS                                                                  */
  /* ---------------------------------------------------------------------- */

  const motorIds =
    new Set<string>();

  for (
    const motor of
      state.motors
  ) {
    if (
      motorIds.has(
        motor.id,
      )
    ) {
      errors.push(
        `Duplicate motor ID: ${motor.id}`,
      );
    }

    motorIds.add(
      motor.id,
    );

    const definition =
      normalizeMotorInstance(
        motor,
      );

    if (!definition) {
      errors.push(
        `Invalid motor instance: ${motor.id}`,
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /* PARTS                                                                   */
  /* ---------------------------------------------------------------------- */

  const partValidation =
    validatePartInventory(
      state.parts,
    );

  errors.push(
    ...partValidation.errors,
  );

  /* ---------------------------------------------------------------------- */
  /* TEAM                                                                    */
  /* ---------------------------------------------------------------------- */

  const teamValidation =
    validateTeamState(
      state.team,
    );

  errors.push(
    ...teamValidation.errors,
  );

  /* ---------------------------------------------------------------------- */
  /* WORKSHOP                                                                */
  /* ---------------------------------------------------------------------- */

  const workshopValidation =
    validateWorkshopState(
      state.workshop,
    );

  errors.push(
    ...workshopValidation.errors,
  );

  /* ---------------------------------------------------------------------- */
  /* CAREER                                                                  */
  /* ---------------------------------------------------------------------- */

  if (
    state.career.wins >
    state.career.races
  ) {
    errors.push(
      "Career wins tidak boleh melebihi races.",
    );
  }

  if (
    state.career.podiums >
    state.career.races
  ) {
    errors.push(
      "Career podiums tidak boleh melebihi races.",
    );
  }

  if (
    state.career.dnfs >
    state.career.races
  ) {
    errors.push(
      "Career dnfs tidak boleh melebihi races.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* CAPACITY CROSS-CHECK                                                    */
  /* ---------------------------------------------------------------------- */

  if (
    state.motors.length >
    state.garage.motorCapacity
  ) {
    warnings.push(
      "Jumlah motor melebihi current garage capacity.",
    );
  }

  if (
    state.team.driverCapacity !==
    state.garage.driverCapacity
  ) {
    warnings.push(
      "Team driver capacity berbeda dari garage capacity.",
    );
  }

  if (
    state.workshop.orderCapacity !==
    state.garage.orderCapacity
  ) {
    warnings.push(
      "Workshop order capacity berbeda dari garage capacity.",
    );
  }

  if (
    state.workshop.mechanicCapacity !==
    state.garage.mechanicCapacity
  ) {
    warnings.push(
      "Workshop mechanic capacity berbeda dari garage capacity.",
    );
  }

  return {
    valid:
      errors.length ===
      0,

    errors,

    warnings,
  };
}

/* -------------------------------------------------------------------------- */
/* ENVELOPE                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Create save envelope.
 */
export function createSaveEnvelope(
  state:
    | GameState
    | undefined,
): SaveEnvelope
  | undefined {
  if (!state) {
    return undefined;
  }

  const normalized =
    normalizeGameState(
      state,
    );

  const now =
    Date.now();

  normalized.meta.updatedAt =
    now;

  normalized.meta.lastPlayedAt =
    now;

  return {
    app:
      "BENGKEL_MALAM",

    schema:
      CURRENT_SAVE_VERSION,

    savedAt:
      now,

    data:
      normalized,
  };
}

/**
 * Serialize save envelope.
 */
export function serializeSave(
  envelope:
    | SaveEnvelope
    | undefined,
): string
  | undefined {
  if (!envelope) {
    return undefined;
  }

  try {
    return JSON.stringify(
      envelope,
    );
  } catch {
    return undefined;
  }
}

/**
 * Estimate string size in bytes.
 */
export function getUtf8ByteSize(
  value: string,
): number {
  if (
    typeof TextEncoder !==
    "undefined"
  ) {
    return new TextEncoder()
      .encode(
        value,
      ).byteLength;
  }

  /**
   * Fallback for older browser environments.
   */
  return unescape(
    encodeURIComponent(
      value,
    ),
  ).length;
}

/* -------------------------------------------------------------------------- */
/* VERSION MIGRATION                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Migrate raw parsed save to current schema.
 */
export function migrateSave(
  input:
    | unknown
    | undefined,
): {
  success: boolean;

  envelope?: SaveEnvelope;

  migrated: boolean;

  error?: SaveErrorCode;

  message?: string;
} {
  if (
    !input ||
    typeof input !==
      "object"
  ) {
    return {
      success: false,

      migrated: false,

      error:
        "INVALID_SAVE",

      message:
        "Save object tidak valid.",
    };
  }

  const raw =
    input as Partial<
      SaveEnvelope
    >;

  if (
    raw.app !==
    "BENGKEL_MALAM"
  ) {
    return {
      success: false,

      migrated: false,

      error:
        "INVALID_SAVE",

      message:
        "Format save BENGKEL MALAM tidak dikenali.",
    };
  }

  const schema =
    Number(
      raw.schema,
    );

  if (
    !Number.isFinite(
      schema,
    )
  ) {
    return {
      success: false,

      migrated: false,

      error:
        "INVALID_SAVE",

      message:
        "Schema save tidak valid.",
    };
  }

  if (
    !SUPPORTED_SAVE_VERSIONS.includes(
      schema as
        (typeof SUPPORTED_SAVE_VERSIONS)[number],
    )
  ) {
    return {
      success: false,

      migrated: false,

      error:
        "UNSUPPORTED_VERSION",

      message:
        `Save schema ${schema} tidak didukung.`,
    };
  }

  let data =
    raw.data as
      | Partial<GameState>
      | undefined;

  let migrated =
    false;

  /**
   * Version 1 is current.
   *
   * Future versions should be handled explicitly here:
   *
   * if (schema === 1) {
   *   data = migrateV1ToV2(data);
   *   migrated = true;
   * }
   */

  if (!data) {
    data =
      createDefaultGameState();
  }

  const normalized =
    normalizeGameState(
      data,
    );

  if (
    schema !==
    CURRENT_SAVE_VERSION
  ) {
    migrated =
      true;
  }

  const envelope:
    SaveEnvelope = {
      app:
        "BENGKEL_MALAM",

      schema:
        CURRENT_SAVE_VERSION,

      savedAt:
        sanitizeTimestamp(
          raw.savedAt,
          Date.now(),
        ),

      data:
        normalized,
    };

  return {
    success: true,

    envelope,

    migrated,
  };
}

/* -------------------------------------------------------------------------- */
/* SAVE                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Save current GameState.
 *
 * Before writing:
 * 1. Normalize.
 * 2. Validate.
 * 3. Serialize.
 * 4. Size-check.
 * 5. Backup current save.
 * 6. Write new save.
 */
export function saveGame(
  state:
    | GameState
    | undefined,
): SaveResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Save hanya dapat dilakukan di browser.",
    };
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return {
      success: false,

      error:
        "STORAGE_UNAVAILABLE",

      message:
        "localStorage tidak tersedia.",
    };
  }

  if (!state) {
    return {
      success: false,

      error:
        "INVALID_SAVE",

      message:
        "GameState tidak tersedia.",
    };
  }

  const normalized =
    normalizeGameState(
      state,
    );

  const validation =
    validateGameState(
      normalized,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        "VALIDATION_FAILED",

      message:
        validation.errors.join(
          " | ",
        ),
    };
  }

  const envelope =
    createSaveEnvelope(
      normalized,
    );

  if (!envelope) {
    return {
      success: false,

      error:
        "INVALID_SAVE",

      message:
        "Save envelope gagal dibuat.",
    };
  }

  const serialized =
    serializeSave(
      envelope,
    );

  if (!serialized) {
    return {
      success: false,

      error:
        "STORAGE_WRITE_FAILED",

      message:
        "GameState gagal diserialisasi.",
    };
  }

  const size =
    getUtf8ByteSize(
      serialized,
    );

  if (
    size >
    MAX_SAVE_SIZE_BYTES
  ) {
    return {
      success: false,

      error:
        "SAVE_TOO_LARGE",

      message:
        `Save terlalu besar (${size} bytes).`,
    };
  }

  try {
    /**
     * Backup existing save first.
     *
     * If there is no previous save, nothing happens.
     */
    const previous =
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      );

    if (previous) {
      try {
        window.localStorage.setItem(
          SAVE_BACKUP_STORAGE_KEY,
          previous,
        );
      } catch {
        /**
         * Backup failure should not prevent the primary save.
         */
      }
    }

    window.localStorage.setItem(
      SAVE_STORAGE_KEY,
      serialized,
    );

    return {
      success: true,

      state:
        envelope.data,
    };
  } catch {
    return {
      success: false,

      error:
        "STORAGE_WRITE_FAILED",

      message:
        "Gagal menulis save ke localStorage.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* LOAD                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Load GameState from localStorage.
 */
export function loadGame(): LoadResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Load hanya dapat dilakukan di browser.",
    };
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return {
      success: false,

      error:
        "STORAGE_UNAVAILABLE",

      message:
        "localStorage tidak tersedia.",
    };
  }

  let raw: string
    | null = null;

  try {
    raw =
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      );
  } catch {
    return {
      success: false,

      error:
        "STORAGE_READ_FAILED",

      message:
        "Gagal membaca localStorage.",
    };
  }

  /**
   * No save = new game.
   *
   * This is reported as success because the caller can safely
   * continue with default state.
   */
  if (!raw) {
    return {
      success: true,

      state:
        createDefaultGameState(),

      migrated: false,
    };
  }

  const size =
    getUtf8ByteSize(
      raw,
    );

  if (
    size >
    MAX_SAVE_SIZE_BYTES
  ) {
    return {
      success: false,

      error:
        "SAVE_TOO_LARGE",

      message:
        "Data save melebihi batas ukuran.",
    };
  }

  let parsed:
    | unknown;

  try {
    parsed =
      JSON.parse(
        raw,
      );
  } catch {
    return {
      success: false,

      error:
        "INVALID_JSON",

      message:
        "Save JSON rusak atau tidak valid.",
    };
  }

  const migration =
    migrateSave(
      parsed,
    );

  if (
    !migration.success ||
    !migration.envelope
  ) {
    return {
      success: false,

      error:
        migration.error ??
        "INVALID_SAVE",

      message:
        migration.message ??
        "Save tidak dapat dimuat.",
    };
  }

  const state =
    normalizeGameState(
      migration.envelope.data,
    );

  const validation =
    validateGameState(
      state,
    );

  if (
    !validation.valid
  ) {
    /**
     * We try backup recovery before giving up.
     */
    const backup =
      loadBackupGame();

    if (
      backup.success &&
      backup.state
    ) {
      return {
        success: true,

        state:
          backup.state,

        migrated:
          backup.migrated,
      };
    }

    return {
      success: false,

      error:
        "VALIDATION_FAILED",

      message:
        validation.errors.join(
          " | ",
        ),
    };
  }

  /**
   * Keep last-played timestamp current.
   */
  state.meta.lastPlayedAt =
    Date.now();

  return {
    success: true,

    state,

    migrated:
      migration.migrated,
  };
}

/* -------------------------------------------------------------------------- */
/* BACKUP                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Load backup save.
 */
export function loadBackupGame(): LoadResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Backup hanya dapat dibaca di browser.",
    };
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return {
      success: false,

      error:
        "STORAGE_UNAVAILABLE",

      message:
        "localStorage tidak tersedia.",
    };
  }

  let raw:
    | string
    | null = null;

  try {
    raw =
      window.localStorage.getItem(
        SAVE_BACKUP_STORAGE_KEY,
      );
  } catch {
    return {
      success: false,

      error:
        "STORAGE_READ_FAILED",

      message:
        "Gagal membaca backup save.",
    };
  }

  if (!raw) {
    return {
      success: false,

      error:
        "INVALID_SAVE",

      message:
        "Backup save tidak tersedia.",
    };
  }

  let parsed:
    | unknown;

  try {
    parsed =
      JSON.parse(
        raw,
      );
  } catch {
    return {
      success: false,

      error:
        "INVALID_JSON",

      message:
        "Backup JSON rusak.",
    };
  }

  const migration =
    migrateSave(
      parsed,
    );

  if (
    !migration.success ||
    !migration.envelope
  ) {
    return {
      success: false,

      error:
        migration.error ??
        "INVALID_SAVE",

      message:
        migration.message ??
        "Backup save tidak valid.",
    };
  }

  return {
    success: true,

    state:
      normalizeGameState(
        migration.envelope.data,
      ),

    migrated:
      migration.migrated,
  };
}

/* -------------------------------------------------------------------------- */
/* RESTORE BACKUP                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Replace primary save with backup save.
 */
export function restoreBackupGame(): LoadResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Restore hanya dapat dilakukan di browser.",
    };
  }

  const backup =
    loadBackupGame();

  if (
    !backup.success ||
    !backup.state
  ) {
    return backup;
  }

  const saveResult =
    saveGame(
      backup.state,
    );

  if (
    !saveResult.success
  ) {
    return {
      success: false,

      error:
        saveResult.error ??
        "STORAGE_WRITE_FAILED",

      message:
        saveResult.message ??
        "Backup gagal direstore.",
    };
  }

  return {
    success: true,

    state:
      saveResult.state,

    migrated:
      backup.migrated,
  };
}

/* -------------------------------------------------------------------------- */
/* EXISTS                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Check whether a primary save exists.
 */
export function hasSaveGame(): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      ) !== null
    );
  } catch {
    return false;
  }
}

/**
 * Check whether backup exists.
 */
export function hasBackupGame(): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(
        SAVE_BACKUP_STORAGE_KEY,
      ) !== null
    );
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE / RESET                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Reset player save.
 *
 * Creates a fresh default GameState and writes it as primary save.
 */
export function resetGame(): SaveResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Reset hanya dapat dilakukan di browser.",
    };
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return {
      success: false,

      error:
        "STORAGE_UNAVAILABLE",

      message:
        "localStorage tidak tersedia.",
    };
  }

  try {
    /**
     * Preserve current save as backup before reset.
     */
    const current =
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      );

    if (current) {
      window.localStorage.setItem(
        SAVE_BACKUP_STORAGE_KEY,
        current,
      );
    }

    const fresh =
      createDefaultGameState();

    return saveGame(
      fresh,
    );
  } catch {
    return {
      success: false,

      error:
        "RESET_FAILED",

      message:
        "Gagal membuat save baru.",
    };
  }
}

/**
 * Remove save completely.
 *
 * Usually not needed by gameplay.
 */
export function deleteGame(): SaveResult {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      success: false,

      error:
        "SSR_UNAVAILABLE",

      message:
        "Delete hanya dapat dilakukan di browser.",
    };
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return {
      success: false,

      error:
        "STORAGE_UNAVAILABLE",

      message:
        "localStorage tidak tersedia.",
    };
  }

  try {
    window.localStorage.removeItem(
      SAVE_STORAGE_KEY,
    );

    return {
      success: true,
    };
  } catch {
    return {
      success: false,

      error:
        "RESET_FAILED",

      message:
        "Gagal menghapus save.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* METADATA                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get save metadata without fully trusting it.
 */
export function getSaveMetadata(): SaveMetadata
  | undefined {
  if (
    typeof window ===
    "undefined"
  ) {
    return undefined;
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return undefined;
  }

  let raw:
    | string
    | null = null;

  try {
    raw =
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      );
  } catch {
    return undefined;
  }

  if (!raw) {
    return undefined;
  }

  try {
    const parsed =
      JSON.parse(
        raw,
      ) as Partial<
        SaveEnvelope
      >;

    const data =
      parsed.data as
        | Partial<GameState>
        | undefined;

    if (!data) {
      return undefined;
    }

    return {
      saveId:
        sanitizeString(
          data.meta?.saveId,
          "UNKNOWN",
        ),

      createdAt:
        sanitizeTimestamp(
          data.meta?.createdAt,
          0,
        ),

      updatedAt:
        sanitizeTimestamp(
          data.meta?.updatedAt,
          0,
        ),

      lastPlayedAt:
        sanitizeTimestamp(
          data.meta?.lastPlayedAt,
          0,
        ),

      version:
        Number(
          parsed.schema,
        ) || 0,

      sizeBytes:
        getUtf8ByteSize(
          raw,
        ),
    };
  } catch {
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Export save as plain JSON string.
 *
 * Useful for manual backup / transfer.
 */
export function exportGame(
  state:
    | GameState
    | undefined,
): string
  | undefined {
  const envelope =
    createSaveEnvelope(
      state,
    );

  if (!envelope) {
    return undefined;
  }

  return serializeSave(
    envelope,
  );
}

/**
 * Import save from JSON text.
 *
 * Does not write automatically.
 */
export function importGame(
  json: string,
): LoadResult {
  if (
    typeof json !==
    "string" ||
    !json.trim()
  ) {
    return {
      success: false,

      error:
        "IMPORT_FAILED",

      message:
        "JSON import kosong.",
    };
  }

  const size =
    getUtf8ByteSize(
      json,
    );

  if (
    size >
    MAX_SAVE_SIZE_BYTES
  ) {
    return {
      success: false,

      error:
        "SAVE_TOO_LARGE",

      message:
        "File save terlalu besar.",
    };
  }

  let parsed:
    | unknown;

  try {
    parsed =
      JSON.parse(
        json,
      );
  } catch {
    return {
      success: false,

      error:
        "INVALID_JSON",

      message:
        "JSON import tidak valid.",
    };
  }

  const migration =
    migrateSave(
      parsed,
    );

  if (
    !migration.success ||
    !migration.envelope
  ) {
    return {
      success: false,

      error:
        migration.error ??
        "IMPORT_FAILED",

      message:
        migration.message ??
        "Save gagal diimport.",
    };
  }

  const state =
    normalizeGameState(
      migration.envelope.data,
    );

  const validation =
    validateGameState(
      state,
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,

      error:
        "VALIDATION_FAILED",

      message:
        validation.errors.join(
          " | ",
        ),
    };
  }

  return {
    success: true,

    state,

    migrated:
      migration.migrated,
  };
}

/**
 * Import JSON and immediately persist.
 */
export function importAndSaveGame(
  json: string,
): SaveResult {
  const imported =
    importGame(
      json,
    );

  if (
    !imported.success ||
    !imported.state
  ) {
    return {
      success: false,

      error:
        imported.error ??
        "IMPORT_FAILED",

      message:
        imported.message ??
        "Import gagal.",
    };
  }

  return saveGame(
    imported.state,
  );
}

/* -------------------------------------------------------------------------- */
/* SAFE STATE UPDATE                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Apply a pure updater and save the result.
 *
 * This gives UI / state layer a simple persistence helper:
 *
 * saveGameUpdate(state, (draft) => ({
 *   ...draft,
 *   economy: {
 *     ...draft.economy,
 *     cash: draft.economy.cash - 500_000,
 *   },
 * }));
 *
 * IMPORTANT:
 * The updater should return a new state.
 * Do not mutate the input directly.
 */
export function saveGameUpdate(
  state:
    | GameState
    | undefined,
  updater:
    | ((
        current: GameState,
      ) => GameState)
    | undefined,
): SaveResult {
  if (
    !state ||
    !updater
  ) {
    return {
      success: false,

      error:
        "INVALID_SAVE",

      message:
        "State atau updater tidak tersedia.",
    };
  }

  let nextState:
    | GameState;

  try {
    nextState =
      updater(
        normalizeGameState(
          state,
        ),
      );
  } catch {
    return {
      success: false,

      error:
        "INVALID_SAVE",

      message:
        "Updater GameState gagal dijalankan.",
    };
  }

  return saveGame(
    nextState,
  );
}

/* -------------------------------------------------------------------------- */
/* STORAGE INSPECTION                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Get raw save size.
 */
export function getSaveSizeBytes(): number {
  if (
    typeof window ===
    "undefined"
  ) {
    return 0;
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return 0;
  }

  try {
    const raw =
      window.localStorage.getItem(
        SAVE_STORAGE_KEY,
      );

    if (!raw) {
      return 0;
    }

    return getUtf8ByteSize(
      raw,
    );
  } catch {
    return 0;
  }
}

/**
 * Get all BENGKEL MALAM storage keys.
 */
export function getSaveStorageKeys(): string[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  if (
    !isBrowserStorageAvailable()
  ) {
    return [];
  }

  const keys: string[] =
    [];

  try {
    for (
      let i = 0;
      i <
        window.localStorage
          .length;
      i += 1
    ) {
      const key =
        window.localStorage.key(
          i,
        );

      if (
        key &&
        key.startsWith(
          "bengkel-malam",
        )
      ) {
        keys.push(
          key,
        );
      }
    }
  } catch {
    return [];
  }

  return keys;
}

/* -------------------------------------------------------------------------- */
/* DEBUG                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Validate currently stored save.
 *
 * Useful during development.
 */
export function validateStoredSave(): SaveValidationResult {
  const loaded =
    loadGame();

  if (
    !loaded.success ||
    !loaded.state
  ) {
    return {
      valid: false,

      errors: [
        loaded.message ??
          "Save tidak dapat dimuat.",
      ],

      warnings: [],
    };
  }

  return validateGameState(
    loaded.state,
  );
}

/**
 * Get developer-friendly save report.
 */
export function getSaveDebugReport(): {
  exists: boolean;
  backupExists: boolean;
  sizeBytes: number;
  metadata?: SaveMetadata;
  validation?: SaveValidationResult;
} {
  return {
    exists:
      hasSaveGame(),

    backupExists:
      hasBackupGame(),

    sizeBytes:
      getSaveSizeBytes(),

    metadata:
      getSaveMetadata(),

    validation:
      hasSaveGame()
        ? validateStoredSave()
        : undefined,
  };
}

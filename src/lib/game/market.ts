/**
 * BENGKEL MALAM
 * Market Game Logic
 *
 * RESPONSIBILITY:
 * - Generate market listings dari static catalog.
 * - Menghitung harga beli/jual.
 * - Memvalidasi transaksi.
 * - Membuat hasil transaksi.
 * - Tidak menyimpan localStorage.
 * - Tidak melakukan mutation terhadap GameState.
 *
 * DATA MASTER:
 * - src/lib/data/motors.ts
 * - src/lib/data/parts.ts
 *
 * PLAYER STATE:
 * - cash
 * - motor ownership
 * - parts inventory
 * - market stock / refresh state
 *
 * disimpan di GameState / save.ts.
 */

import {
  getMotorById,
  getMotors,
  getAvailableMarketMotors,
  type MotorDefinition,
  type MotorSource,
} from "../data/motors";

import {
  getPartById,
  getParts,
  getMarketParts,
  type PartDefinition,
  type PartSource,
} from "../data/parts";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type MarketListingType =
  | "MOTOR"
  | "PART";

export type MarketListingCondition =
  | "SALVAGE"
  | "POOR"
  | "FAIR"
  | "GOOD"
  | "EXCELLENT";

export interface MarketPlayerContext {
  cash: number;
  garageLevel: number;
  reputation: number;
}

export interface MarketMotorListing {
  id: string;
  listingType: "MOTOR";

  /**
   * Static catalog ID.
   */
  itemId: string;

  /**
   * Unique listing ID.
   *
   * This matters because the same motor definition can appear
   * with different conditions/prices.
   */
  listingId: string;

  source: MotorSource;

  condition: number;
  conditionTier: MarketListingCondition;

  price: number;

  /**
   * Original calculated market value before condition adjustment.
   */
  referenceValue: number;

  available: boolean;
}

export interface MarketPartListing {
  id: string;
  listingType: "PART";

  /**
   * Static catalog ID.
   */
  itemId: string;

  listingId: string;

  source: PartSource;

  condition: number;
  conditionTier: MarketListingCondition;

  price: number;

  referenceValue: number;

  available: boolean;

  /**
   * Number of units available in this listing.
   */
  quantity: number;
}

export type MarketListing =
  | MarketMotorListing
  | MarketPartListing;

export interface MarketSnapshot {
  generatedAt: number;

  /**
   * Current market day.
   *
   * A caller can derive this from the game clock.
   */
  marketDay: number;

  motors: MarketMotorListing[];
  parts: MarketPartListing[];
}

export type MarketTransactionType =
  | "BUY_MOTOR"
  | "SELL_MOTOR"
  | "BUY_PART"
  | "SELL_PART";

export interface MarketTransaction {
  type: MarketTransactionType;

  listingId: string;
  itemId: string;

  quantity: number;

  unitPrice: number;
  totalPrice: number;

  /**
   * Positive amount means cash enters the player wallet.
   * Negative amount means cash leaves the player wallet.
   */
  cashDelta: number;
}

export interface MarketTransactionResult {
  success: boolean;

  transaction?: MarketTransaction;

  error?: MarketErrorCode;
  message?: string;
}

export type MarketErrorCode =
  | "INVALID_QUANTITY"
  | "LISTING_NOT_FOUND"
  | "LISTING_UNAVAILABLE"
  | "INSUFFICIENT_CASH"
  | "ITEM_NOT_OWNED"
  | "INCOMPATIBLE_SOURCE"
  | "INVALID_PRICE"
  | "LOCKED_ITEM";

export interface MarketPriceConfig {
  /**
   * Condition multiplier boundaries.
   *
   * Example:
   * SALVAGE -> 0.30
   * EXCELLENT -> 1.15
   */
  conditionMultiplier: {
    salvage: number;
    poor: number;
    fair: number;
    good: number;
    excellent: number;
  };

  /**
   * Source multiplier when buying.
   */
  sourceMultiplier: Record<MarketSourceKey, number>;

  /**
   * Seller receives this percentage of reference market value.
   */
  sellMultiplier: number;

  /**
   * Random variation range.
   *
   * 0.05 = +/- 5%.
   */
  randomSpread: number;
}

export type MarketSourceKey =
  | "STOCK"
  | "USED"
  | "PROJECT"
  | "SALVAGE"
  | "AFTERMARKET"
  | "SPECIAL";

/**
 * Minimal motor state needed for selling.
 *
 * GameState can contain a much larger MotorInstance object.
 */
export interface OwnedMotorForSale {
  id: string;
  definitionId: string;

  condition: number;
}

/**
 * Minimal part state needed for selling.
 */
export interface OwnedPartForSale {
  id: string;
  definitionId: string;

  condition: number;
  quantity?: number;
}

/**
 * Random function dependency.
 *
 * Passing RNG makes market logic deterministic in tests.
 */
export type RandomFn = () => number;

/* -------------------------------------------------------------------------- */
/* DEFAULT CONFIG                                                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_PRICE_CONFIG: MarketPriceConfig = {
  conditionMultiplier: {
    salvage: 0.3,
    poor: 0.55,
    fair: 0.75,
    good: 1,
    excellent: 1.15,
  },

  sourceMultiplier: {
    STOCK: 1,
    USED: 0.88,
    PROJECT: 0.7,
    SALVAGE: 0.55,
    AFTERMARKET: 1.08,
    SPECIAL: 1.25,
  },

  sellMultiplier: 0.72,

  randomSpread: 0.05,
};

/* -------------------------------------------------------------------------- */
/* GENERAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clamp a number into a range.
 */
export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

/**
 * Round money to the nearest thousand.
 *
 * This keeps market prices readable and avoids ugly values
 * generated by floating-point calculations.
 */
export function roundMarketPrice(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(value / 1_000) * 1_000,
  );
}

/**
 * Convert numeric condition to market condition label.
 */
export function getMarketConditionTier(
  condition: number,
): MarketListingCondition {
  const value = clamp(
    condition,
    0,
    100,
  );

  if (value < 20) return "SALVAGE";
  if (value < 40) return "POOR";
  if (value < 60) return "FAIR";
  if (value < 85) return "GOOD";

  return "EXCELLENT";
}

/**
 * Return multiplier for condition.
 */
export function getConditionMultiplier(
  condition: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const tier =
    getMarketConditionTier(condition);

  switch (tier) {
    case "SALVAGE":
      return config.conditionMultiplier.salvage;

    case "POOR":
      return config.conditionMultiplier.poor;

    case "FAIR":
      return config.conditionMultiplier.fair;

    case "GOOD":
      return config.conditionMultiplier.good;

    case "EXCELLENT":
      return config.conditionMultiplier.excellent;
  }
}

/**
 * Return multiplier for market source.
 */
export function getSourceMultiplier(
  source: MarketSourceKey,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  return (
    config.sourceMultiplier[source] ?? 1
  );
}

/**
 * Apply deterministic/random market spread.
 *
 * random = 0.0 => minimum edge.
 * random = 0.5 => no adjustment.
 * random = 1.0 => maximum edge.
 */
export function applyRandomSpread(
  price: number,
  randomValue: number,
  spread: number,
): number {
  const safeRandom = clamp(
    randomValue,
    0,
    1,
  );

  const delta =
    (safeRandom * 2 - 1) *
    spread;

  return price * (1 + delta);
}

/**
 * Return a safe random condition around a source-specific baseline.
 */
export function generateMarketCondition(
  source: MarketSourceKey,
  random: RandomFn = Math.random,
): number {
  let minimum = 65;
  let maximum = 100;

  switch (source) {
    case "STOCK":
      minimum = 85;
      maximum = 100;
      break;

    case "USED":
      minimum = 45;
      maximum = 90;
      break;

    case "PROJECT":
      minimum = 20;
      maximum = 70;
      break;

    case "SALVAGE":
      minimum = 5;
      maximum = 40;
      break;

    case "AFTERMARKET":
      minimum = 80;
      maximum = 100;
      break;

    case "SPECIAL":
      minimum = 85;
      maximum = 100;
      break;
  }

  const value =
    minimum +
    (maximum - minimum) *
      clamp(random(), 0, 1);

  return Math.round(value);
}

/* -------------------------------------------------------------------------- */
/* MOTOR PRICING                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Calculate the reference price of a motor listing.
 *
 * This is deliberately separate from final generated listing price.
 */
export function calculateMotorReferencePrice(
  motor: MotorDefinition,
  source: MotorSourceKey,
  condition: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const baseValue = motor.economy.baseValue;

  const conditionMultiplier =
    getConditionMultiplier(
      condition,
      config,
    );

  const sourceMultiplier =
    getSourceMultiplier(
      source,
      config,
    );

  const raw =
    baseValue *
    conditionMultiplier *
    sourceMultiplier;

  return roundMarketPrice(raw);
}

/**
 * Calculate a motor's final market listing price.
 */
export function calculateMotorMarketPrice(
  motor: MotorDefinition,
  source: MotorSourceKey,
  condition: number,
  randomValue = 0.5,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const referencePrice =
    calculateMotorReferencePrice(
      motor,
      source,
      condition,
      config,
    );

  const withSpread =
    applyRandomSpread(
      referencePrice,
      randomValue,
      config.randomSpread *
        motor.economy.marketVolatility,
    );

  const bounded =
    clamp(
      withSpread,
      motor.economy.minimumValue *
        getConditionMultiplier(
          condition,
          config,
        ),
      motor.economy.maximumValue *
        Math.max(
          0.5,
          getConditionMultiplier(
            condition,
            config,
          ),
        ),
    );

  return roundMarketPrice(
    bounded,
  );
}

/**
 * Calculate how much the player receives when selling a motor.
 */
export function calculateMotorSellPrice(
  motor: MotorDefinition,
  condition: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const reference =
    calculateMotorReferencePrice(
      motor,
      "USED",
      condition,
      config,
    );

  return roundMarketPrice(
    reference *
      config.sellMultiplier,
  );
}

/* -------------------------------------------------------------------------- */
/* PART PRICING                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Calculate reference price for a part listing.
 */
export function calculatePartReferencePrice(
  part: PartDefinition,
  source: PartSource,
  condition: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const conditionMultiplier =
    getConditionMultiplier(
      condition,
      config,
    );

  const sourceMultiplier =
    getSourceMultiplier(
      source,
      config,
    );

  const raw =
    part.economy.baseValue *
    conditionMultiplier *
    sourceMultiplier;

  return roundMarketPrice(
    raw,
  );
}

/**
 * Calculate final part market price.
 */
export function calculatePartMarketPrice(
  part: PartDefinition,
  source: PartSource,
  condition: number,
  randomValue = 0.5,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const reference =
    calculatePartReferencePrice(
      part,
      source,
      condition,
      config,
    );

  const withSpread =
    applyRandomSpread(
      reference,
      randomValue,
      config.randomSpread *
        part.economy.marketVolatility,
    );

  const bounded =
    clamp(
      withSpread,
      part.economy.minimumValue *
        getConditionMultiplier(
          condition,
          config,
        ),
      part.economy.maximumValue *
        Math.max(
          0.5,
          getConditionMultiplier(
            condition,
            config,
          ),
        ),
    );

  return roundMarketPrice(
    bounded,
  );
}

/**
 * Calculate how much the player receives when selling a part.
 */
export function calculatePartSellPrice(
  part: PartDefinition,
  condition: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): number {
  const reference =
    calculatePartReferencePrice(
      part,
      "USED",
      condition,
      config,
    );

  return roundMarketPrice(
    reference *
      config.sellMultiplier,
  );
}

/* -------------------------------------------------------------------------- */
/* MARKET SOURCE SELECTION                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Select a source using weighted random.
 *
 * `sources` comes directly from the static catalog.
 */
export function selectMarketSource(
  sources: readonly MarketSourceKey[],
  random: RandomFn = Math.random,
): MarketSourceKey {
  if (sources.length === 0) {
    return "STOCK";
  }

  if (sources.length === 1) {
    return sources[0];
  }

  /**
   * Prefer normal sources over exotic sources.
   * This prevents SPECIAL / SALVAGE from appearing
   * disproportionately often when an item supports many sources.
   */
  const weights: Record<
    MarketSourceKey,
    number
  > = {
    STOCK: 50,
    USED: 35,
    PROJECT: 20,
    SALVAGE: 10,
    AFTERMARKET: 30,
    SPECIAL: 5,
  };

  const total = sources.reduce(
    (sum, source) =>
      sum +
      (weights[source] ?? 1),
    0,
  );

  let roll =
    clamp(random(), 0, 0.999999) *
    total;

  for (const source of sources) {
    roll -= weights[source] ?? 1;

    if (roll <= 0) {
      return source;
    }
  }

  return sources[
    sources.length - 1
  ];
}

/* -------------------------------------------------------------------------- */
/* LISTING GENERATORS                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Generate one motor market listing.
 */
export function generateMotorListing(
  motor: MotorDefinition,
  source?: MotorSource,
  random: RandomFn = Math.random,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): MarketMotorListing {
  const allowedSources =
    motor.marketSources as MarketSource[];

  const selectedSource =
    source ??
    selectMarketSource(
      allowedSources,
      random,
    );

  const condition =
    generateMarketCondition(
      selectedSource,
      random,
    );

  const price =
    calculateMotorMarketPrice(
      motor,
      selectedSource,
      condition,
      random(),
      config,
    );

  return {
    id: `motor-${motor.id}-${selectedSource.toLowerCase()}-${Math.round(
      random() * 999999,
    )}`,

    listingType: "MOTOR",

    itemId: motor.id,

    listingId: `motor-${motor.id}-${Math.round(
      random() * 999999,
    )}`,

    source: selectedSource,

    condition,

    conditionTier:
      getMarketConditionTier(condition),

    price,

    referenceValue:
      calculateMotorReferencePrice(
        motor,
        selectedSource,
        condition,
        config,
      ),

    available: true,
  };
}

/**
 * Generate one part listing.
 */
export function generatePartListing(
  part: PartDefinition,
  source?: PartSource,
  quantity = 1,
  random: RandomFn = Math.random,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): MarketPartListing {
  const allowedSources =
    part.marketSources as PartSource[];

  const selectedSource =
    source ??
    selectMarketSource(
      allowedSources,
      random,
    );

  const condition =
    generateMarketCondition(
      selectedSource,
      random,
    );

  const price =
    calculatePartMarketPrice(
      part,
      selectedSource,
      condition,
      random(),
      config,
    );

  return {
    id: `part-${part.id}-${selectedSource.toLowerCase()}-${Math.round(
      random() * 999999,
    )}`,

    listingType: "PART",

    itemId: part.id,

    listingId: `part-${part.id}-${Math.round(
      random() * 999999,
    )}`,

    source: selectedSource,

    condition,

    conditionTier:
      getMarketConditionTier(condition),

    price,

    referenceValue:
      calculatePartReferencePrice(
        part,
        selectedSource,
        condition,
        config,
      ),

    available: quantity > 0,

    quantity: Math.max(
      0,
      Math.floor(quantity),
    ),
  };
}

/**
 * Generate a complete market snapshot.
 *
 * This does not persist anything.
 */
export function generateMarketSnapshot(
  options: {
    marketDay: number;

    motorCount?: number;
    partCount?: number;

    random?: RandomFn;

    config?: MarketPriceConfig;
  },
): MarketSnapshot {
  const random =
    options.random ??
    Math.random;

  const config =
    options.config ??
    DEFAULT_MARKET_PRICE_CONFIG;

  const motorDefinitions =
    getAvailableMarketMotors();

  const partDefinitions =
    getMarketParts();

  const motorCount = Math.min(
    Math.max(
      options.motorCount ?? 6,
      0,
    ),
    motorDefinitions.length,
  );

  const partCount = Math.min(
    Math.max(
      options.partCount ?? 10,
      0,
    ),
    partDefinitions.length,
  );

  const motors: MarketMotorListing[] =
    [];

  const parts: MarketPartListing[] =
    [];

  const shuffledMotors =
    shuffleCopy(
      motorDefinitions,
      random,
    );

  const shuffledParts =
    shuffleCopy(
      partDefinitions,
      random,
    );

  for (
    let i = 0;
    i < motorCount;
    i += 1
  ) {
    motors.push(
      generateMotorListing(
        shuffledMotors[i],
        undefined,
        random,
        config,
      ),
    );
  }

  for (
    let i = 0;
    i < partCount;
    i += 1
  ) {
    const quantity =
      shuffledParts[i].consumable
        ? 2 +
          Math.floor(
            random() * 4,
          )
        : 1;

    parts.push(
      generatePartListing(
        shuffledParts[i],
        undefined,
        quantity,
        random,
        config,
      ),
    );
  }

  return {
    generatedAt: Date.now(),

    marketDay: Math.floor(
      options.marketDay,
    ),

    motors,
    parts,
  };
}

/**
 * Fisher-Yates shuffle on a copied array.
 */
export function shuffleCopy<T>(
  input: readonly T[],
  random: RandomFn = Math.random,
): T[] {
  const output = [...input];

  for (
    let i = output.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      clamp(random(), 0, 0.999999) *
        (i + 1),
    );

    [
      output[i],
      output[j],
    ] = [
      output[j],
      output[i],
    ];
  }

  return output;
}

/* -------------------------------------------------------------------------- */
/* LISTING LOOKUP                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Find a listing by ID.
 */
export function getMarketListingById(
  snapshot: MarketSnapshot,
  listingId: string,
): MarketListing | undefined {
  const motor =
    snapshot.motors.find(
      (listing) =>
        listing.listingId === listingId ||
        listing.id === listingId,
    );

  if (motor) {
    return motor;
  }

  return snapshot.parts.find(
    (listing) =>
      listing.listingId === listingId ||
      listing.id === listingId,
  );
}

/**
 * Find all listings for an item.
 */
export function getListingsForItem(
  snapshot: MarketSnapshot,
  itemId: string,
): MarketListing[] {
  return [
    ...snapshot.motors.filter(
      (listing) =>
        listing.itemId === itemId,
    ),

    ...snapshot.parts.filter(
      (listing) =>
        listing.itemId === itemId,
    ),
  ];
}

/* -------------------------------------------------------------------------- */
/* UNLOCK VALIDATION                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Check whether a motor is unlocked for a player.
 */
export function isMotorMarketUnlocked(
  motor: MotorDefinition,
  context: MarketPlayerContext,
): boolean {
  if (
    context.garageLevel <
    motor.restrictions.minimumGarageLevel
  ) {
    return false;
  }

  if (
    context.reputation <
    motor.restrictions.minimumReputation
  ) {
    return false;
  }

  return true;
}

/**
 * Check whether a part is unlocked for a player.
 */
export function isPartMarketUnlocked(
  part: PartDefinition,
  context: MarketPlayerContext,
): boolean {
  if (
    context.garageLevel <
    part.requirements.minimumGarageLevel
  ) {
    return false;
  }

  if (
    context.reputation <
    part.requirements.minimumReputation
  ) {
    return false;
  }

  return true;
}

/**
 * Validate a specific listing against player progression.
 */
export function isListingUnlocked(
  listing: MarketListing,
  context: MarketPlayerContext,
): boolean {
  if (
    listing.listingType === "MOTOR"
  ) {
    const motor =
      getMotorById(
        listing.itemId,
      );

    return motor
      ? isMotorMarketUnlocked(
          motor,
          context,
        )
      : false;
  }

  const part =
    getPartById(
      listing.itemId,
    );

  return part
    ? isPartMarketUnlocked(
        part,
        context,
      )
    : false;
}

/* -------------------------------------------------------------------------- */
/* BUY VALIDATION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Validate buying a listing.
 *
 * No state is mutated here.
 */
export function validateBuy(
  listing: MarketListing | undefined,
  quantity: number,
  context: MarketPlayerContext,
): MarketTransactionResult {
  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return {
      success: false,
      error: "INVALID_QUANTITY",
      message:
        "Jumlah pembelian tidak valid.",
    };
  }

  if (!listing) {
    return {
      success: false,
      error: "LISTING_NOT_FOUND",
      message:
        "Listing tidak ditemukan.",
    };
  }

  if (!listing.available) {
    return {
      success: false,
      error: "LISTING_UNAVAILABLE",
      message:
        "Listing sudah tidak tersedia.",
    };
  }

  if (
    !isListingUnlocked(
      listing,
      context,
    )
  ) {
    return {
      success: false,
      error: "LOCKED_ITEM",
      message:
        "Item belum terbuka untuk progres bengkel saat ini.",
    };
  }

  if (
    listing.listingType === "PART"
  ) {
    if (
      quantity >
      listing.quantity
    ) {
      return {
        success: false,
        error: "LISTING_UNAVAILABLE",
        message:
          "Jumlah part di market tidak mencukupi.",
      };
    }
  }

  const unitPrice =
    listing.price;

  if (
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {
    return {
      success: false,
      error: "INVALID_PRICE",
      message:
        "Harga listing tidak valid.",
    };
  }

  const totalPrice =
    roundMarketPrice(
      unitPrice * quantity,
    );

  if (
    context.cash <
    totalPrice
  ) {
    return {
      success: false,
      error: "INSUFFICIENT_CASH",
      message:
        "Cash tidak mencukupi.",
    };
  }

  const type =
    listing.listingType ===
    "MOTOR"
      ? "BUY_MOTOR"
      : "BUY_PART";

  return {
    success: true,

    transaction: {
      type,

      listingId:
        listing.listingId,

      itemId:
        listing.itemId,

      quantity,

      unitPrice,

      totalPrice,

      cashDelta:
        -totalPrice,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* SELL VALIDATION                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Validate selling a motor.
 *
 * Ownership lookup is supplied by the caller because GameState owns
 * actual player inventory.
 */
export function validateSellMotor(
  ownedMotor:
    | OwnedMotorForSale
    | undefined,
  context: MarketPlayerContext,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): MarketTransactionResult {
  if (!ownedMotor) {
    return {
      success: false,
      error: "ITEM_NOT_OWNED",
      message:
        "Motor tidak dimiliki pemain.",
    };
  }

  const motor =
    getMotorById(
      ownedMotor.definitionId,
    );

  if (!motor) {
    return {
      success: false,
      error: "LISTING_NOT_FOUND",
      message:
        "Definisi motor tidak ditemukan.",
    };
  }

  const price =
    calculateMotorSellPrice(
      motor,
      ownedMotor.condition,
      config,
    );

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return {
      success: false,
      error: "INVALID_PRICE",
      message:
        "Harga jual tidak valid.",
    };
  }

  return {
    success: true,

    transaction: {
      type: "SELL_MOTOR",

      listingId:
        ownedMotor.id,

      itemId:
        ownedMotor.definitionId,

      quantity: 1,

      unitPrice:
        price,

      totalPrice:
        price,

      cashDelta:
        price,
    },
  };
}

/**
 * Validate selling a part.
 */
export function validateSellPart(
  ownedPart:
    | OwnedPartForSale
    | undefined,
  quantity: number,
  config: MarketPriceConfig = DEFAULT_MARKET_PRICE_CONFIG,
): MarketTransactionResult {
  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return {
      success: false,
      error: "INVALID_QUANTITY",
      message:
        "Jumlah penjualan tidak valid.",
    };
  }

  if (!ownedPart) {
    return {
      success: false,
      error: "ITEM_NOT_OWNED",
      message:
        "Part tidak dimiliki pemain.",
    };
  }

  const ownedQuantity =
    ownedPart.quantity ?? 1;

  if (
    ownedQuantity <
    quantity
  ) {
    return {
      success: false,
      error: "ITEM_NOT_OWNED",
      message:
        "Jumlah part yang dimiliki tidak mencukupi.",
    };
  }

  const part =
    getPartById(
      ownedPart.definitionId,
    );

  if (!part) {
    return {
      success: false,
      error: "LISTING_NOT_FOUND",
      message:
        "Definisi part tidak ditemukan.",
    };
  }

  const unitPrice =
    calculatePartSellPrice(
      part,
      ownedPart.condition,
      config,
    );

  const totalPrice =
    roundMarketPrice(
      unitPrice * quantity,
    );

  return {
    success: true,

    transaction: {
      type: "SELL_PART",

      listingId:
        ownedPart.id,

      itemId:
        ownedPart.definitionId,

      quantity,

      unitPrice,

      totalPrice,

      cashDelta:
        totalPrice,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* APPLY TRANSACTION TO SIMPLE MARKET SNAPSHOT                               */
/* -------------------------------------------------------------------------- */

/**
 * Create a new market snapshot after a successful purchase.
 *
 * This function does NOT touch GameState.
 *
 * It is useful when market stock itself is persisted later.
 */
export function consumeMarketListing(
  snapshot: MarketSnapshot,
  transaction:
    | MarketTransaction
    | undefined,
): MarketSnapshot {
  if (!transaction) {
    return snapshot;
  }

  const nextSnapshot: MarketSnapshot = {
    ...snapshot,

    motors: snapshot.motors.map(
      (listing) => ({
        ...listing,
      }),
    ),

    parts: snapshot.parts.map(
      (listing) => ({
        ...listing,
      }),
    ),
  };

  if (
    transaction.type ===
    "BUY_MOTOR"
  ) {
    nextSnapshot.motors =
      nextSnapshot.motors.map(
        (listing) => {
          if (
            listing.listingId !==
            transaction.listingId
          ) {
            return listing;
          }

          return {
            ...listing,
            available: false,
          };
        },
      );

    return nextSnapshot;
  }

  if (
    transaction.type ===
    "BUY_PART"
  ) {
    nextSnapshot.parts =
      nextSnapshot.parts.map(
        (listing) => {
          if (
            listing.listingId !==
            transaction.listingId
          ) {
            return listing;
          }

          const remaining =
            Math.max(
              0,
              listing.quantity -
                transaction.quantity,
            );

          return {
            ...listing,

            quantity:
              remaining,

            available:
              remaining > 0,
          };
        },
      );

    return nextSnapshot;
  }

  return nextSnapshot;
}

/* -------------------------------------------------------------------------- */
/* MARKET DISPLAY HELPERS                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Format Indonesian market money.
 *
 * Example:
 * 18500000 -> "Rp 18,5 JT"
 */
export function formatMarketMoney(
  amount: number,
): string {
  const value = Math.max(
    0,
    amount,
  );

  if (value >= 1_000_000_000) {
    return `Rp ${(
      value / 1_000_000_000
    ).toFixed(1)} M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(
      value / 1_000_000
    ).toFixed(1)} JT`;
  }

  if (value >= 1_000) {
    return `Rp ${Math.round(
      value / 1_000,
    )} RB`;
  }

  return `Rp ${Math.round(
    value,
  )}`;
}

/**
 * Human-readable source label.
 */
export function getMarketSourceLabel(
  source: MarketSourceKey,
): string {
  const labels: Record<
    MarketSourceKey,
    string
  > = {
    STOCK: "STOCK",
    USED: "USED",
    PROJECT: "PROJECT",
    SALVAGE: "SALVAGE",
    AFTERMARKET: "AFTERMARKET",
    SPECIAL: "SPECIAL",
  };

  return labels[source];
}

/**
 * Human-readable buy/sell action.
 */
export function getMarketTransactionLabel(
  type: MarketTransactionType,
): string {
  const labels: Record<
    MarketTransactionType,
    string
  > = {
    BUY_MOTOR: "BUY MOTOR",
    SELL_MOTOR: "SELL MOTOR",
    BUY_PART: "BUY PART",
    SELL_PART: "SELL PART",
  };

  return labels[type];
}

/**
 * Return relative price compared with static base value.
 */
export function getMarketPriceRatio(
  listing: MarketListing,
): number {
  const definition =
    listing.listingType ===
    "MOTOR"
      ? getMotorById(
          listing.itemId,
        )
      : getPartById(
          listing.itemId,
        );

  if (!definition) {
    return 1;
  }

  const baseValue =
    definition.economy.baseValue;

  if (
    !Number.isFinite(baseValue) ||
    baseValue <= 0
  ) {
    return 1;
  }

  return (
    listing.price /
    baseValue
  );
}

/* -------------------------------------------------------------------------- */
/* MARKET FILTERS                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Filter market listings by player progression.
 */
export function getAccessibleListings(
  snapshot: MarketSnapshot,
  context: MarketPlayerContext,
): MarketListing[] {
  const all: MarketListing[] = [
    ...snapshot.motors,
    ...snapshot.parts,
  ];

  return all.filter(
    (listing) =>
      listing.available &&
      isListingUnlocked(
        listing,
        context,
      ),
  );
}

/**
 * Get motor listings only.
 */
export function getMotorListings(
  snapshot: MarketSnapshot,
): MarketMotorListing[] {
  return snapshot.motors.filter(
    (listing) =>
      listing.available,
  );
}

/**
 * Get part listings only.
 */
export function getPartListings(
  snapshot: MarketSnapshot,
): MarketPartListing[] {
  return snapshot.parts.filter(
    (listing) =>
      listing.available,
  );
}

/**
 * Sort listings by price ascending.
 */
export function sortListingsByPrice(
  listings: readonly MarketListing[],
): MarketListing[] {
  return [...listings].sort(
    (a, b) =>
      a.price - b.price,
  );
}

/**
 * Sort listings by price descending.
 */
export function sortListingsByPriceDesc(
  listings: readonly MarketListing[],
): MarketListing[] {
  return [...listings].sort(
    (a, b) =>
      b.price - a.price,
  );
}

/**
 * Sort by condition descending.
 */
export function sortListingsByCondition(
  listings: readonly MarketListing[],
): MarketListing[] {
  return [...listings].sort(
    (a, b) =>
      b.condition -
      a.condition,
  );
}

/* -------------------------------------------------------------------------- */
/* DEV VALIDATION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Validate market price config.
 */
export function validateMarketPriceConfig(
  config: MarketPriceConfig =
    DEFAULT_MARKET_PRICE_CONFIG,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const multipliers =
    Object.entries(
      config.conditionMultiplier,
    );

  for (
    const [key, value] of multipliers
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      errors.push(
        `Condition multiplier ${key} must be >= 0`,
      );
    }
  }

  const sourceMultipliers =
    Object.entries(
      config.sourceMultiplier,
    );

  for (
    const [key, value] of sourceMultipliers
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      errors.push(
        `Source multiplier ${key} must be >= 0`,
      );
    }
  }

  if (
    !Number.isFinite(
      config.sellMultiplier,
    ) ||
    config.sellMultiplier < 0
  ) {
    errors.push(
      "sellMultiplier must be >= 0",
    );
  }

  if (
    !Number.isFinite(
      config.randomSpread,
    ) ||
    config.randomSpread < 0 ||
    config.randomSpread > 1
  ) {
    errors.push(
      "randomSpread must be between 0 and 1",
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}

/**
 * Validate generated market snapshot.
 */
export function validateMarketSnapshot(
  snapshot:
    | MarketSnapshot
    | undefined,
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!snapshot) {
    return {
      valid: false,
      errors: [
        "Market snapshot is undefined.",
      ],
    };
  }

  if (
    !Number.isFinite(
      snapshot.marketDay,
    ) ||
    snapshot.marketDay < 0
  ) {
    errors.push(
      "marketDay must be >= 0",
    );
  }

  const listingIds =
    new Set<string>();

  const validateListing =
    (
      listing: MarketListing,
    ) => {
      if (
        listingIds.has(
          listing.listingId,
        )
      ) {
        errors.push(
          `Duplicate listing ID: ${listing.listingId}`,
        );
      }

      listingIds.add(
        listing.listingId,
      );

      if (
        !Number.isFinite(
          listing.price,
        ) ||
        listing.price < 0
      ) {
        errors.push(
          `Invalid price: ${listing.listingId}`,
        );
      }

      if (
        !Number.isFinite(
          listing.condition,
        ) ||
        listing.condition < 0 ||
        listing.condition > 100
      ) {
        errors.push(
          `Invalid condition: ${listing.listingId}`,
        );
      }

      if (
        !listing.itemId.trim()
      ) {
        errors.push(
          `Missing itemId: ${listing.listingId}`,
        );
      }

      if (
        listing.listingType ===
        "PART" &&
        listing.quantity < 0
      ) {
        errors.push(
          `Negative quantity: ${listing.listingId}`,
        );
      }
    };

  for (
    const listing of
      snapshot.motors
  ) {
    validateListing(
      listing,
    );
  }

  for (
    const listing of
      snapshot.parts
  ) {
    validateListing(
      listing,
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}

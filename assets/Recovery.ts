import AsyncStorage from "@react-native-async-storage/async-storage";

export const RECOVERY_TIME: Record<string, number> = {
  Chest: 36,
  Back: 48,
  Legs: 60,
  Shoulders: 36,
  Arms: 30,
  Core: 24,
};

type RecoveryEntry = {
  start: number;
  end: number;
  multiplier: number;
};

type RecoveryMap = Record<string, RecoveryEntry>;

const STORAGE_KEY = "recovery_last_worked";
const MS_PER_HOUR = 36e5;
const DEFAULT_RECOVERY = 48;

let recoveryMap: RecoveryMap = {};

function requiredHours(muscle: string) {
  return RECOVERY_TIME[muscle] ?? DEFAULT_RECOVERY;
}

function sessionMultiplier(exerciseCount: number) {
  if (exerciseCount <= 2) return 0.5;
  if (exerciseCount <= 4) return 1;
  return 1.2;
}

function normalizeEntry(muscle: string, value: any): RecoveryEntry {
  if (!value) {
    return { start: 0, end: 0, multiplier: 1 };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.start === "number" &&
    typeof value.end === "number"
  ) {
    return {
      start: value.start,
      end: value.end,
      multiplier: typeof value.multiplier === "number" ? value.multiplier : 1,
    };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.last === "number"
  ) {
    const multiplier =
      typeof value.multiplier === "number" ? value.multiplier : 1;
    const duration = requiredHours(muscle) * multiplier * MS_PER_HOUR;
    const start = value.last;
    return {
      start,
      end: start + duration,
      multiplier,
    };
  }

  if (typeof value === "number") {
    return { start: value, end: value, multiplier: 1 };
  }

  return { start: 0, end: 0, multiplier: 1 };
}

export async function loadRecovery() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      recoveryMap = Object.fromEntries(
        Object.entries(parsed).map(([muscle, entry]) => [
          muscle,
          normalizeEntry(muscle, entry),
        ])
      );
    }
  } catch (error) {
    console.log("Error loading recovery:", error);
  }
  return recoveryMap;
}

async function saveRecovery() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recoveryMap));
  } catch (error) {
    console.log("Error saving recovery:", error);
  }
}

export function isMuscleReady(muscle: string) {
  const entry = recoveryMap[muscle];
  if (!entry) return true;

  return Date.now() >= entry.end;
}

export function recoveryRemaining(muscle: string) {
  const entry = recoveryMap[muscle];
  if (!entry) return 0;

  const remainingMs = entry.end - Date.now();
  return Math.max(0, remainingMs / MS_PER_HOUR);
}

export async function markMuscleWorked(
  muscle: string,
  exerciseCount: number = 1
) {
  const now = Date.now();
  const multiplier = sessionMultiplier(exerciseCount);
  const durationMs = requiredHours(muscle) * multiplier * MS_PER_HOUR;
  const start = now;
  const end = now + durationMs;

  recoveryMap[muscle] = {
    start,
    end,
    multiplier,
  };

  await saveRecovery();
}

export function _getRecoveryMap() {
  return recoveryMap;
}

export async function resetRecovery() {
  Object.keys(RECOVERY_TIME).forEach((muscle) => {
    recoveryMap[muscle] = { start: 0, end: 0, multiplier: 1 };
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recoveryMap));
}

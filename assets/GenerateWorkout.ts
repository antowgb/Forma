import { EXERCISES } from "assets/Exercises";
import { getFavorites } from "assets/Favorites";
import { isMuscleReady } from "assets/Recovery";
import { Exercise } from "./Types";

const favs = getFavorites();

export type WorkoutModality = "both" | "weight lifting" | "calisthenics";

export function generateReps(ex: Exercise) {
  if (ex.muscle === "Core") {
    return "3 x 30 sec";
  }

  if (ex.intensity === 3) {
    return "4 x 8";
  }

  if (ex.modality === "calisthenics") {
    return "3 x 12";
  }

  if (ex.modality === "weight lifting") {
    return "3 x 10";
  }

  return "3 x 12";
}

const MAX_MUSCLES_PER_WORKOUT = 3;
const FULL_RECOVERY_NOTICE = "Rest recommended — all muscles are recovering";
const NO_SLOT_NOTICE =
  "Rest recommended — no slots available with current recovery";

type ScoredExercise = { ex: Exercise; score: number };

export function generateWorkout(
  durationMinutes: number,
  modality: WorkoutModality
) {
  const readyMuscles = listReadyMuscles();

  if (readyMuscles.length === 0) {
    return { exercises: [], notice: FULL_RECOVERY_NOTICE };
  }

  const readySet = new Set(readyMuscles);
  const scored = scoreExercises(readySet, modality);
  scored.sort((a, b) => b.score - a.score);

  const musclePools = buildMusclePools(scored, readySet);
  const musclesToUse = selectMuscles(readyMuscles, musclePools);
  const exercises = buildBalancedWorkout(
    musclePools,
    musclesToUse,
    durationMinutes
  );

  if (exercises.length === 0) {
    return { exercises: [], notice: NO_SLOT_NOTICE };
  }

  return { exercises, notice: "" };
}

function listReadyMuscles() {
  const muscles = Array.from(new Set(EXERCISES.map((ex) => ex.muscle)));
  return muscles.filter(isMuscleReady);
}

function scoreExercises(
  readySet: Set<string>,
  modality: WorkoutModality
): ScoredExercise[] {
  return EXERCISES.filter((ex) => matchesModality(ex, modality)).map((ex) => ({
    ex,
    score: scoreExercise(ex, readySet, modality),
  }));
}

function scoreExercise(
  ex: Exercise,
  readySet: Set<string>,
  modality: WorkoutModality
) {
  let score = 0;

  if (readySet.has(ex.muscle)) score += 100;
  if (
    modality === "both"
      ? ex.modality === "both"
      : ex.modality === modality || ex.modality === "both"
  ) {
    score += 20;
  }
  score += Math.max(0, 20 - ex.estMinutes);
  if (favs[ex.id]) score += 25;
  score += Math.random() * 25;

  return score;
}

function buildMusclePools(scored: ScoredExercise[], readySet: Set<string>) {
  const pools = new Map<string, ScoredExercise[]>();

  for (const entry of scored) {
    if (!readySet.has(entry.ex.muscle)) {
      continue;
    }

    if (!pools.has(entry.ex.muscle)) {
      pools.set(entry.ex.muscle, []);
    }

    pools.get(entry.ex.muscle)!.push(entry);
  }

  return pools;
}

function selectMuscles(
  readyMuscles: string[],
  pools: Map<string, ScoredExercise[]>
) {
  return readyMuscles
    .map((muscle) => ({
      muscle,
      bestScore: pools.get(muscle)?.[0]?.score ?? -Infinity,
    }))
    .filter(({ bestScore }) => bestScore > -Infinity)
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, MAX_MUSCLES_PER_WORKOUT)
    .map(({ muscle }) => muscle);
}

function buildBalancedWorkout(
  pools: Map<string, ScoredExercise[]>,
  muscles: string[],
  durationMinutes: number
) {
  const counts = new Map<string, number>();
  const active = new Set(
    muscles.filter((muscle) => (pools.get(muscle)?.length ?? 0) > 0)
  );
  const chosen: Exercise[] = [];
  let total = 0;

  while (active.size > 0) {
    const muscle = popNextMuscle(active, counts, pools);
    if (!muscle) break;

    const pool = pools.get(muscle);
    if (!pool || pool.length === 0) continue;

    const candidateIndex = findCandidateIndex(
      pool,
      total,
      durationMinutes,
      chosen.length === 0
    );

    if (candidateIndex === -1) {
      pools.set(muscle, []);
      continue;
    }

    const [{ ex }] = pool.splice(candidateIndex, 1);
    chosen.push(ex);
    total += ex.estMinutes;
    counts.set(muscle, (counts.get(muscle) ?? 0) + 1);

    if (pool.length > 0) {
      active.add(muscle);
    }

    if (total >= durationMinutes - 5) {
      break;
    }
  }

  return chosen;
}

function popNextMuscle(
  active: Set<string>,
  counts: Map<string, number>,
  pools: Map<string, ScoredExercise[]>
) {
  let next: string | null = null;
  let lowestCount = Number.POSITIVE_INFINITY;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const muscle of active) {
    const count = counts.get(muscle) ?? 0;
    const score = pools.get(muscle)?.[0]?.score ?? -Infinity;

    if (count < lowestCount || (count === lowestCount && score > bestScore)) {
      next = muscle;
      lowestCount = count;
      bestScore = score;
    }
  }

  if (next) {
    active.delete(next);
  }

  return next;
}

function findCandidateIndex(
  pool: ScoredExercise[],
  total: number,
  limit: number,
  allowOverflow: boolean
) {
  return pool.findIndex(
    ({ ex }) => allowOverflow || total + ex.estMinutes <= limit
  );
}

type WorkoutResult = {
  exercises: Exercise[];
  notice: string;
};

const dailyCache: Record<string, { date: string; result: WorkoutResult }> = {};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function matchesModality(ex: Exercise, modality: WorkoutModality) {
  if (modality === "both") return true;
  if (modality === "weight lifting") {
    return ex.modality === "weight lifting" || ex.modality === "both";
  }

  return ex.modality === "calisthenics" || ex.modality === "both";
}

function cacheKey(duration: number, modality: WorkoutModality) {
  return `${duration}-${modality}`;
}

type DailyWorkoutOptions = {
  forceNew?: boolean;
  modality?: WorkoutModality;
};

export function getDailyWorkout(
  durationMinutes: number,
  options: DailyWorkoutOptions = {}
): WorkoutResult {
  const { forceNew = false, modality = "weight lifting" } = options;
  const key = cacheKey(durationMinutes, modality);
  const today = todayKey();
  const cached = dailyCache[key];

  if (!forceNew && cached && cached.date === today) {
    return cached.result;
  }

  const result = generateWorkout(durationMinutes, modality);
  dailyCache[key] = { date: today, result };

  return result;
}

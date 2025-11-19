import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CustomWorkout,
  CustomWorkoutInput,
  WorkoutIntensity,
} from "components/custom/types";

const STORAGE_KEY = "custom_workouts_v1";

export async function loadCustomWorkouts(): Promise<CustomWorkout[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeWorkouts(raw);
  } catch {
    return [];
  }
}

export async function saveCustomWorkouts(workouts: CustomWorkout[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function createCustomWorkout(
  input: CustomWorkoutInput
): CustomWorkout {
  const now = Date.now();
  return {
    id: `cw-${now}`,
    title: input.title,
    exercises: input.exercises.map((exercise, index) => ({
      id: `cwex-${now}-${index}`,
      exerciseId: exercise.exerciseId,
    })),
    completed: false,
    createdAt: now,
    focus: input.focus?.trim() || undefined,
    intensity: input.intensity,
    estDuration: input.estDuration,
    notes: input.notes?.trim() || undefined,
  };
}

function normalizeWorkouts(raw: string): CustomWorkout[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => sanitizeWorkout(value))
      .filter((workout): workout is CustomWorkout => Boolean(workout));
  } catch {
    return [];
  }
}

function sanitizeWorkout(value: unknown): CustomWorkout | null {
  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as any).id !== "string" ||
    typeof (value as any).title !== "string" ||
    !Array.isArray((value as any).exercises)
  ) {
    return null;
  }

  const exercises = (value as any).exercises.filter(isStoredExercise);
  if (exercises.length === 0) {
    return null;
  }

  return {
    id: (value as any).id,
    title: (value as any).title,
    exercises,
    completed: Boolean((value as any).completed),
    createdAt:
      typeof (value as any).createdAt === "number"
        ? (value as any).createdAt
        : Date.now(),
    focus:
      typeof (value as any).focus === "string"
        ? (value as any).focus
        : undefined,
    intensity: isValidIntensity((value as any).intensity)
      ? (value as any).intensity
      : undefined,
    estDuration:
      typeof (value as any).estDuration === "number"
        ? (value as any).estDuration
        : undefined,
    notes:
      typeof (value as any).notes === "string"
        ? (value as any).notes
        : undefined,
  };
}

function isStoredExercise(
  entry: any
): entry is CustomWorkout["exercises"][number] {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    typeof entry.exerciseId === "string"
  );
}

function isValidIntensity(
  value: any
): value is WorkoutIntensity {
  return value === "Easy" || value === "Balanced" || value === "Beast";
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Muscle, RecoveryRules, RecoveryState } from "assets/Types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const NOW = () => Date.now();
const hoursBetween = (iso?: string) =>
  iso ? (NOW() - new Date(iso).getTime()) / 36e5 : Infinity;

// Valeurs par défaut (gros groupes plus longs)
export const DEFAULT_RECOVERY: RecoveryRules = {
  Legs: { baseHours: 72 },
  Back: { baseHours: 60 },
  Chest: { baseHours: 48 },
  Shoulders: { baseHours: 48 },
  Arms: { baseHours: 36 },
  Core: { baseHours: 36 },
};

type RecoveryStore = RecoveryState & {
  restHoursRemaining: (m: Muscle) => number;
  restDaysRemaining: (m: Muscle) => number;
  isReady: (m: Muscle) => boolean;
  nextAvailableMuscles: () => Muscle[];
  markWorked: (m: Muscle, intensity?: 1 | 2 | 3) => void;
  rules: RecoveryRules; // personnalisables plus tard si tu veux
};

export const useRecovery = create<RecoveryStore>()(
  persist(
    (set, get) => ({
      lastWorked: {},
      lastIntensity: {},
      rules: DEFAULT_RECOVERY,

      restHoursRemaining: (m) => {
        const { lastWorked, lastIntensity, rules } = get();
        const elapsed = hoursBetween(lastWorked[m]);
        const mult =
          (lastIntensity[m] ?? 2) === 1
            ? 0.8
            : (lastIntensity[m] ?? 2) === 3
            ? 1.2
            : 1.0;
        const need = rules[m].baseHours * mult;
        return Math.max(0, Math.ceil(need - elapsed));
      },

      restDaysRemaining: (m) => Math.ceil(get().restHoursRemaining(m) / 24),

      isReady: (m) => get().restHoursRemaining(m) === 0,

      nextAvailableMuscles: () => {
        const all: Muscle[] = [
          "Chest",
          "Back",
          "Legs",
          "Shoulders",
          "Arms",
          "Core",
        ];
        const ready = all.filter((m) => get().isReady(m));
        if (ready.length) return ready;
        // sinon: trier par temps restant croissant
        return all.sort(
          (a, b) => get().restHoursRemaining(a) - get().restHoursRemaining(b)
        );
      },

      markWorked: (m, intensity = 2) =>
        set((s) => ({
          lastWorked: { ...s.lastWorked, [m]: new Date().toISOString() },
          lastIntensity: { ...s.lastIntensity, [m]: intensity },
        })),
    }),
    {
      name: "recovery-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

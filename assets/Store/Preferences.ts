import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Equipment,
  Modality,
  UserPrefs,
  WorkoutDuration,
} from "assets/Types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PrefsStore = UserPrefs & {
  toggleFavorite: (id: string) => void;
  hideExercise: (id: string, hidden?: boolean) => void;
  setModality: (m: Modality) => void;
  setDuration: (d: WorkoutDuration) => void;
  setEquipment: (e: Equipment) => void;
};

export const usePrefs = create<PrefsStore>()(
  persist(
    (set, get) => ({
      modalityPref: "auto",
      favorites: {},
      hidden: {},
      durationPref: 90,
      equipment: "gym",

      toggleFavorite: (id) =>
        set((state) => {
          const favorites = { ...state.favorites };
          favorites[id] ? delete favorites[id] : (favorites[id] = true);
          return { favorites };
        }),

      hideExercise: (id, hidden = true) =>
        set((state) => {
          const next = { ...state.hidden };
          if (hidden) {
            next[id] = true;
          } else {
            delete next[id];
          }
          return { hidden: next };
        }),

      setModality: (modalityPref) => set({ modalityPref }),
      setDuration: (durationPref) => set({ durationPref }),
      setEquipment: (equipment) => set({ equipment }),
    }),
    {
      name: "prefs-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

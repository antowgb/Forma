import AsyncStorage from "@react-native-async-storage/async-storage";
import { Equipment, Modality, UserPrefs } from "assets/Types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PrefsStore = UserPrefs & {
  toggleFavorite: (id: string) => void;
  hideExercise: (id: string, hidden?: boolean) => void;
  setModality: (m: Modality) => void;
  setDuration: (d: 60 | 90 | 120) => void;
  setEquipment: (e: Equipment) => void;
};

export const usePrefs = create<PrefsStore>()(
  persist(
    (set, get) => ({
      modalityPref: "auto",
      favorites: {},
      hidden: {},
      durationPref: 90, // 👈 ton choix
      equipment: "gym", // 👈 ton choix

      toggleFavorite: (id) =>
        set((s) => {
          const fav = { ...s.favorites };
          fav[id] ? delete fav[id] : (fav[id] = true);
          return { favorites: fav };
        }),

      hideExercise: (id, hidden = true) =>
        set((s) => {
          const next = { ...s.hidden };
          if (hidden) {
            next[id] = true;
          } else {
            delete next[id];
          }
          return { hidden: next };
        }),

      setModality: (m) => set({ modalityPref: m }),
      setDuration: (d) => set({ durationPref: d }),
      setEquipment: (e) => set({ equipment: e }),
    }),
    {
      name: "prefs-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

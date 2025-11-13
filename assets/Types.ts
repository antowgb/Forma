export type Muscle = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
export type Modality = "muscu" | "calisthenics" | "auto";
export type Equipment = "none" | "basic" | "gym";
export type WorkoutDuration = 30 | 60 | 90 | 120;

export type Exercise = {
  id: string;
  name: string;
  muscle: Muscle;
  modality: Modality | "both";
  estMinutes: number; // durée moyenne, repos inclus
  intensity: 1 | 2 | 3; // impact récup (léger/normal/lourd)
  equipment: Equipment;
  icon?: string; // optionnel
};

export type Muscle = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
export type Modality = "muscu" | "calisthenics" | "auto";
export type Equipment = "none" | "basic" | "gym";
export type WorkoutDuration = 30 | 60 | 90 | 120;

export type Exercise = {
  id: string;
  name: string;
  muscle: Muscle;
  modality: Modality | "both";
  estMinutes: number; // average duration, rest included
  intensity: 1 | 2 | 3; // recovery impact (light/normal/heavy)
  equipment: Equipment;
  icon?: string; // optionnel
};

export type UserPrefs = {
  modalityPref: Modality; // muscu/calisthenics/auto
  favorites: Record<string, true>; // map of exercise IDs
  hidden: Record<string, true>; // exercises to avoid
  durationPref: WorkoutDuration; // default = 90
  equipment: Equipment; // default = "gym"
};

export type RecoveryState = {
  lastWorked: Partial<Record<Muscle, string>>; // ISO date
  lastIntensity: Partial<Record<Muscle, 1 | 2 | 3>>; // adapt recovery duration
};

export type RecoveryRules = Record<Muscle, { baseHours: number }>;

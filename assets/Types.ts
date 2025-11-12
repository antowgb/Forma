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

export type UserPrefs = {
  modalityPref: Modality; // muscu/calisthenics/auto
  favorites: Record<string, true>; // map d'IDs
  hidden: Record<string, true>; // exos à éviter
  durationPref: WorkoutDuration; // défaut = 90
  equipment: Equipment; // défaut = "gym"
};

export type RecoveryState = {
  lastWorked: Partial<Record<Muscle, string>>; // ISO date
  lastIntensity: Partial<Record<Muscle, 1 | 2 | 3>>; // pour adapter la récup
};

export type RecoveryRules = Record<Muscle, { baseHours: number }>;

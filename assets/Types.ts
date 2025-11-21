export type Muscle =
  | "Upper Chest"
  | "Lower Chest"
  | "Upper Back"
  | "Lats"
  | "Lower Back"
  | "Quads"
  | "Hamstrings"
  | "Calves"
  | "Lateral Deltoid"
  | "Front Deltoid"
  | "Rear Deltoid"
  | "Glutes"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Abs";
export type Modality = "weight lifting" | "calisthenics" | "auto";
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

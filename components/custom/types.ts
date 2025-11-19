export type CustomWorkoutExercise = {
  id: string;
  exerciseId: string;
};

export type WorkoutIntensity = "Easy" | "Balanced" | "Beast";

export type CustomWorkout = {
  id: string;
  title: string;
  exercises: CustomWorkoutExercise[];
  completed: boolean;
  createdAt: number;
  focus?: string;
  intensity?: WorkoutIntensity;
  estDuration?: number;
  notes?: string;
};

export type CustomWorkoutExerciseInput = {
  exerciseId: string;
};

export type CustomWorkoutInput = {
  title: string;
  exercises: CustomWorkoutExerciseInput[];
  focus?: string;
  intensity?: WorkoutIntensity;
  estDuration?: number;
  notes?: string;
};

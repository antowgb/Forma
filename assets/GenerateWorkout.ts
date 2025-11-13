import { EXERCISES } from "assets/Exercises";
import { isMuscleReady } from "assets/Recovery";
import { Exercise } from "./Types";

// modalité préférée (simple pour l’instant)
export const userModality = "muscu"; // plus tard: réglage utilisateur

// ---------------------------
//  Génère les reps pour un exercice
// ---------------------------
export function generateReps(ex: Exercise) {
  if (ex.muscle === "Core") {
    return "3 × 30 sec";
  }

  if (ex.intensity === 3) {
    return "4 × 8";
  }

  if (ex.modality === "calisthenics") {
    return "3 × 12";
  }

  if (ex.modality === "muscu") {
    return "3 × 10";
  }

  return "3 × 12";
}

// ---------------------------
//  Algorithme intelligent
// ---------------------------
export function generateWorkout(durationMinutes: number) {
  // Étape 1 : noter les muscles prêts
  const readyMuscles = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
  ].filter(isMuscleReady);

  const noMuscleReady = readyMuscles.length === 0;

  // Étape 2 : attribuer un score à chaque exercice
  const scored = EXERCISES.map((ex: Exercise) => {
    // 👈 type ici
    let s = 0;

    if (readyMuscles.includes(ex.muscle)) s += 100;
    if (ex.modality === userModality || ex.modality === "both") s += 20;
    s += Math.max(0, 20 - ex.estMinutes);
    s += Math.random() * 10;

    return { ex, score: s };
  });

  // Étape 3 : trier par score
  scored.sort((a, b) => b.score - a.score);

  // Étape 4 : remplir jusqu’à la durée demandée
  const chosen: any[] = [];
  let total = 0;

  for (const { ex } of scored) {
    if (total + ex.estMinutes > durationMinutes) continue;

    if (!noMuscleReady && !readyMuscles.includes(ex.muscle)) continue;

    chosen.push(ex);
    total += ex.estMinutes;

    if (total >= durationMinutes - 5) break;
  }

  // Fallback : rien n'est prêt → proposer le top 3
  if (chosen.length === 0) {
    return {
      exercises: scored.slice(0, 3).map((x) => x.ex),
      notice: "Repos conseillé — aucun muscle prêt",
    };
  }

  return { exercises: chosen, notice: "" };
}

// même type que le retour de generateWorkout
type WorkoutResult = {
  exercises: Exercise[];
  notice: string;
};

// 🧠 petit cache en mémoire : clé = durée, valeur = (date + workout)
const dailyCache: Record<number, { date: string; result: WorkoutResult }> = {};

// retourne la date du jour au format "YYYY-MM-DD"
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// 👉 fonction à utiliser dans l'app
export function getDailyWorkout(durationMinutes: number): WorkoutResult {
  const key = durationMinutes;
  const today = todayKey();

  const cached = dailyCache[key];

  // si on a déjà généré un workout pour cette durée aujourd'hui → on le réutilise
  if (cached && cached.date === today) {
    return cached.result;
  }

  // sinon on en génère un nouveau, et on le met dans le cache
  const result = generateWorkout(durationMinutes);
  dailyCache[key] = { date: today, result };

  return result;
}

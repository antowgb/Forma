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
  const scored = EXERCISES.map((ex) => {
    let s = 0;

    // 1. Muscle prêt = très important
    if (readyMuscles.includes(ex.muscle)) s += 100;

    // 2. Modalité préférée (simple)
    if (ex.modality === userModality || ex.modality === "both") s += 20;

    // 3. Exercice court = plus facile à caser
    s += Math.max(0, 20 - ex.estMinutes);

    // 4. Bonus léger random (= variété)
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

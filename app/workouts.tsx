import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EXERCISES } from "assets/Exercises";
import { loadFavorites, toggleFavorite } from "assets/Favorites"; // 👈 import
import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS } from "constants/Colors";

const MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
type FilterMode = "all" | "gym" | "calisthenics";

export default function WorkoutsScreen() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // 🔹 charger les favoris au montage
  useEffect(() => {
    loadFavorites().then((f) => setFavorites({ ...f }));
  }, []);

  // 🔹 basculer un favori + mettre à jour le state
  async function onToggle(id: string) {
    const updated = await toggleFavorite(id);
    setFavorites({ ...updated });
  }

  // Filtrage simple
  const filtered = useMemo(() => {
    return EXERCISES.filter((ex) => {
      if (filter === "all") return true;
      if (filter === "gym") return ex.modality === "muscu";
      if (filter === "calisthenics")
        return ex.modality === "calisthenics" || ex.modality === "both";
      return true;
    });
  }, [filter]);

  // Groupé par muscle
  const groups = useMemo(() => {
    const acc: Record<string, Exercise[]> = {};
    filtered.forEach((ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = [];
      acc[ex.muscle].push(ex);
    });
    return acc;
  }, [filtered]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>Browse and favorite exercises</Text>

        {/* Filtres */}
        <View style={styles.filters}>
          {(["all", "gym", "calisthenics"] as FilterMode[]).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setFilter(mode)}
              style={[styles.chip, filter === mode && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === mode && styles.chipTextActive,
                ]}
              >
                {mode === "all"
                  ? "All"
                  : mode === "gym"
                  ? "Gym"
                  : "Calisthenics"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Liste des exercices */}
        <View style={styles.card}>
          <ScrollView>
            {MUSCLES.map((muscle) => {
              const list = groups[muscle] || [];
              if (list.length === 0) return null;

              return (
                <View key={muscle} style={{ marginBottom: 16 }}>
                  <Text style={styles.muscleTitle}>{muscle}</Text>

                  {list.map((ex) => {
                    const isFav = !!favorites[ex.id];
                    return (
                      <View key={ex.id} style={styles.exerciseRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.exerciseName}>{ex.name}</Text>
                          <Text style={styles.exerciseSub}>
                            {generateReps(ex)} · {ex.modality}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => onToggle(ex.id)}
                          style={styles.favoriteButton}
                        >
                          <Text style={styles.favoriteIcon}>
                            {isFav ? "★" : "☆"}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.row}>
          <Link href="/" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Home</Text>
            </Pressable>
          </Link>
          <Link href="/recovery" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Recovery</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // (tes styles identiques)
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "40",
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  chipTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },
  card: {
    flex: 1,
    maxHeight: 350,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "55",
    padding: 16,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  exerciseSub: {
    color: COLORS.subtext,
    fontSize: 13,
  },
  favoriteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  favoriteIcon: {
    color: COLORS.accent,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  linkText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
});

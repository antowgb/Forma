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
type FilterMode = "all" | "weight lifting" | "calisthenics";

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
      if (filter === "weight lifting") return ex.modality === "weight lifting";
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

        {/* Filtres */}
        <View style={styles.filters}>
          {(["all", "weight lifting", "calisthenics"] as FilterMode[]).map(
            (mode) => (
              <Pressable
                key={mode}
                onPress={() => setFilter(mode)}
                style={({ pressed }) => [
                  styles.chip,
                  filter === mode && styles.chipActive,
                  pressed && styles.pressablePressed,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    filter === mode && styles.chipTextActive,
                  ]}
                >
                  {mode === "all"
                    ? "All"
                    : mode === "weight lifting"
                    ? "Weight Lifting"
                    : "Calisthenics"}
                </Text>
              </Pressable>
            )
          )}
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
                          style={({ pressed }) => [
                            styles.favoriteButton,
                            pressed && styles.pressablePressed,
                          ]}
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
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Home</Text>
            </Pressable>
          </Link>
          <Link href="/recovery" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Recovery</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.bannerPlaceholder} pointerEvents="none">
          <Text style={styles.bannerText}>
            Reserved space for upcoming ad banner
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    paddingBottom: 48,
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
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
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    maxHeight: 400,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "55",
    padding: 16,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
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
    borderRadius: 12,
    backgroundColor: COLORS.panel + "30",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
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
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  linkText: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  pressablePressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  bannerPlaceholder: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.accent,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panel + "40",
  },
  bannerText: {
    color: COLORS.text + "99",
    fontSize: 14,
    letterSpacing: 0.6,
  },
});

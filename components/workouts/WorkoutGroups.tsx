import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

const MUSCLE_TO_CLUSTER: Record<string, string> = {
  Quads: "Legs",
  Hamstrings: "Legs",
  Calves: "Legs",
  "Upper Back": "Back",
  Lats: "Back",
  "Lower Back": "Back",
  "Upper Chest": "Chest",
  "Lower Chest": "Chest",
  "Front Deltoid": "Shoulders",
  "Lateral Deltoid": "Shoulders",
  "Rear Deltoid": "Shoulders",
  Biceps: "Arms",
  Triceps: "Arms",
  Forearms: "Arms",
  Glutes: "Core",
  Abs: "Core",
};

const CLUSTER_ORDER = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"];

type WorkoutGroupsProps = {
  muscles: readonly string[];
  groups: Record<string, Exercise[]>;
  favorites: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function WorkoutGroups({
  muscles,
  groups,
  favorites,
  onToggle,
}: WorkoutGroupsProps) {
  const clustersWithItems = CLUSTER_ORDER.filter((cluster) =>
    muscles.some(
      (muscle) =>
        MUSCLE_TO_CLUSTER[muscle] === cluster &&
        (groups[muscle] ?? []).length > 0
    )
  );

  return (
    <View style={styles.card}>
      <ScrollView>
        {clustersWithItems.map((cluster, index) => {
          const clusterMuscles = muscles.filter(
            (muscle) => MUSCLE_TO_CLUSTER[muscle] === cluster
          );

          return (
            <View key={cluster} style={styles.clusterWrapper}>
              <View style={styles.clusterSection}>
                <Text style={styles.clusterTitle}>{cluster}</Text>
                {clusterMuscles.map((muscle) => {
                  const list = groups[muscle] || [];
                  if (list.length === 0) return null;

                  return (
                    <View key={muscle} style={styles.section}>
                      <Text style={styles.muscleTitle}>{muscle}</Text>
                      {list.map((exercise) => {
                        const isFav = !!favorites[exercise.id];
                        return (
                          <View key={exercise.id} style={styles.exerciseRow}>
                            <View style={styles.exerciseInfo}>
                              <Text style={styles.exerciseName}>
                                {exercise.name}
                              </Text>
                              <Text style={styles.exerciseSub}>
                                {generateReps(exercise)} - {exercise.modality}
                              </Text>
                            </View>

                            <Pressable
                              onPress={() => onToggle(exercise.id)}
                              style={({ pressed }) => [
                                styles.favoriteButton,
                                pressed && pressableStyles.pressed,
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
              </View>
              {index < clustersWithItems.length - 1 ? (
                <View style={styles.clusterDivider} />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.md,
    maxHeight: "65%",
    flex: 1,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    padding: SPACING.lg,
    ...SHADOWS.floating,
  },
  clusterSection: {
    marginBottom: SPACING.xl,
  },
  clusterWrapper: {
    marginBottom: SPACING.lg,
  },
  clusterDivider: {
    height: 2,
    backgroundColor: COLORS.text + "20",
    marginVertical: SPACING.sm,
  },
  clusterTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  exerciseSub: {
    color: COLORS.subtext,
    fontSize: 14,
  },
  favoriteButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.floating,
  },
  favoriteIcon: {
    color: COLORS.accent,
    fontSize: 20,
  },
});

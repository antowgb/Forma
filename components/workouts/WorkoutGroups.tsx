import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

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
  return (
    <View style={styles.card}>
      <ScrollView>
        {muscles.map((muscle) => {
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
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.md,
    maxHeight: "70%",
    flex: 1,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    padding: SPACING.lg,
    ...SHADOWS.floating,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 18,
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
    fontSize: 15,
    fontWeight: "500",
  },
  exerciseSub: {
    color: COLORS.subtext,
    fontSize: 13,
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

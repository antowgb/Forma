import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS } from "constants/Colors";
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
    marginVertical: 12,
    maxHeight: "70%",
    flex: 1,
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
  section: {
    marginBottom: 16,
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
});

import { Exercise } from "assets/Types";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS, SHADOWS } from "constants/Colors";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomWorkout } from "./types";

type WorkoutListProps = {
  workouts: CustomWorkout[];
  loading: boolean;
  exerciseMap: Record<string, Exercise>;
  onSelect: (workout: CustomWorkout) => void;
};

export default function WorkoutList({
  workouts,
  loading,
  exerciseMap,
  onSelect,
}: WorkoutListProps) {
  if (loading) {
    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateText}>Loading workouts...</Text>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateText}>Nothing saved yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {workouts.map((workout) => {
        const preview = workout.exercises
          .slice(0, 3)
          .map((entry) => exerciseMap[entry.exerciseId]?.name ?? "Exercise")
          .join(" - ");

        return (
          <Pressable
            key={workout.id}
            onPress={() => onSelect(workout)}
            style={({ pressed }) => [
              styles.workoutCard,
              pressed && pressableStyles.pressed,
            ]}
          >
            <View style={styles.workoutHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
              </View>
            </View>

            {(workout.focus || workout.intensity || workout.estDuration) && (
              <View style={styles.badgeRow}>
                {workout.focus && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{workout.focus}</Text>
                  </View>
                )}
                {workout.intensity && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{workout.intensity}</Text>
                  </View>
                )}
                {workout.estDuration && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {workout.estDuration} min
                    </Text>
                  </View>
                )}
              </View>
            )}

            {workout.notes && (
              <Text style={styles.noteText} numberOfLines={2}>
                {workout.notes}
              </Text>
            )}

            <View style={styles.previewRow}>
              <Text style={styles.previewText} numberOfLines={1}>
                {preview || "Tap to view exercises"}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  workoutCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  workoutTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: COLORS.panel + "90",
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "600",
  },
  noteText: {
    color: COLORS.subtext,
    fontSize: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  previewText: {
    color: COLORS.subtext,
    fontSize: 12,
    flex: 1,
  },
  stateCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
  },
  stateText: {
    color: COLORS.subtext,
    textAlign: "center",
  },
});

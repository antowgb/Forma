import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "assets/Types";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS } from "constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CustomWorkout } from "./types";

type WorkoutListProps = {
  workouts: CustomWorkout[];
  loading: boolean;
  exerciseMap: Record<string, Exercise>;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function WorkoutList({
  workouts,
  loading,
  exerciseMap,
  onToggleComplete,
  onDelete,
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
        <Ionicons name="flash-outline" color={COLORS.subtext} size={24} />
        <Text style={styles.stateText}>Nothing saved yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {workouts.map((workout) => (
        <View
          key={workout.id}
          style={[
            styles.workoutCard,
            workout.completed && styles.workoutCardCompleted,
          ]}
        >
          <View style={styles.workoutHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.workoutMeta}>
                {new Date(workout.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Pressable
              onPress={() => onToggleComplete(workout.id)}
              style={({ pressed }) => [
                styles.statusButton,
                workout.completed && styles.statusButtonCompleted,
                pressed && pressableStyles.pressed,
              ]}
            >
              <Ionicons
                name={workout.completed ? "checkmark-circle" : "ellipse-outline"}
                color={COLORS.text}
                size={18}
              />
              <Text style={styles.statusText}>
                {workout.completed ? "Done" : "Pending"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onDelete(workout.id)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && pressableStyles.pressed,
              ]}
            >
              <Ionicons name="trash" size={16} color={COLORS.text} />
            </Pressable>
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
            <Text style={styles.noteText}>{workout.notes}</Text>
          )}

          <View style={styles.exerciseList}>
            {workout.exercises.map((entry, index) => {
              const reference = exerciseMap[entry.exerciseId];
              return (
                <View key={entry.id} style={styles.exerciseRow}>
                  <Text style={styles.exerciseIndex}>{index + 1}.</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>
                      {reference?.name ?? "Exercise"}
                    </Text>
                    <Text style={styles.exerciseMeta}>
                      {reference?.muscle ?? "N/A"}
                      {reference?.modality ? ` • ${reference.modality}` : ""}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
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
    backgroundColor: COLORS.panel + "a0",
  },
  workoutCardCompleted: {
    borderColor: COLORS.accent,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workoutTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  workoutMeta: {
    color: COLORS.subtext,
    fontSize: 12,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusButtonCompleted: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent + "20",
  },
  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseList: {
    gap: 8,
  },
  exerciseRow: {
    flexDirection: "row",
    gap: 12,
  },
  exerciseIndex: {
    color: COLORS.subtext,
    fontWeight: "700",
  },
  exerciseName: {
    color: COLORS.text,
    fontWeight: "600",
  },
  exerciseMeta: {
    color: COLORS.subtext,
    fontSize: 12,
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
  stateCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  stateText: {
    color: COLORS.subtext,
    textAlign: "center",
  },
});

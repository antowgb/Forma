import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "assets/Types";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS, SHADOWS } from "constants/Colors";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomWorkout } from "./types";

type WorkoutListProps = {
  workouts: CustomWorkout[];
  loading: boolean;
  exerciseMap: Record<string, Exercise>;
  onSelect: (workout: CustomWorkout) => void;
  onReorder?: (next: CustomWorkout[]) => void;
};

export default function WorkoutList({
  workouts,
  loading,
  exerciseMap,
  onSelect,
  onReorder,
}: WorkoutListProps) {
  const handleMove = (index: number, direction: -1 | 1) => {
    if (!onReorder) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= workouts.length) return;
    const next = [...workouts];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    onReorder(next);
  };

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

  const cards = workouts.map((item) => {
    const index = workouts.findIndex((w) => w.id === item.id);
    const canMoveUp = index > 0;
    const canMoveDown = index < workouts.length - 1;

    const muscles: string[] = [];
    item.exercises.forEach((entry) => {
      const muscle = exerciseMap[entry.exerciseId]?.muscle;
      if (muscle && !muscles.includes(muscle)) {
        muscles.push(muscle);
      }
    });
    const preview = muscles.slice(0, 3).join(" - ");

    return (
      <Pressable
        key={item.id}
        onPress={() => onSelect(item)}
        style={({ pressed }) => [
          styles.workoutCard,
          pressed && pressableStyles.pressed,
        ]}
      >
        <View style={styles.workoutHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.workoutTitle}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.previewRow}>
          <Text style={styles.previewText} numberOfLines={1}>
            {preview || "Tap to view exercises"}
          </Text>
          {onReorder ? (
            <View style={styles.reorder}>
              <Pressable
                disabled={!canMoveUp}
                onPress={() => handleMove(index, -1)}
                style={({ pressed }) => [
                  styles.reorderButton,
                  !canMoveUp && styles.reorderDisabled,
                  pressed && pressableStyles.pressed,
                ]}
              >
                <Ionicons
                  name="arrow-up"
                  size={14}
                  color={canMoveUp ? COLORS.text : COLORS.subtext}
                />
              </Pressable>
              <Pressable
                disabled={!canMoveDown}
                onPress={() => handleMove(index, 1)}
                style={({ pressed }) => [
                  styles.reorderButton,
                  !canMoveDown && styles.reorderDisabled,
                  pressed && pressableStyles.pressed,
                ]}
              >
                <Ionicons
                  name="arrow-down"
                  size={14}
                  color={canMoveDown ? COLORS.text : COLORS.subtext}
                />
              </Pressable>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  });

  // If drag-and-drop is requested and data exists, we can consider reintroducing later.
  if (onReorder) {
    console.log("Reorder disabled temporarily");
  }

  return (
    <ScrollView
      contentContainerStyle={styles.list}
      style={styles.listWrapper}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {cards}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    height: "70%",
  },
  list: {
    flexGrow: 1,
    gap: 20,
    paddingBottom: 32,
    paddingHorizontal: 6,
    paddingTop: 4,
  },
  workoutCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
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
  separator: {
    height: 16,
  },
  reorder: {
    flexDirection: "row",
    gap: 6,
  },
  reorderButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panel,
  },
  reorderDisabled: {
    opacity: 0.4,
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

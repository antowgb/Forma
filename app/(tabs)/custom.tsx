import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { loadCustomWorkouts, saveCustomWorkouts } from "assets/CustomWorkouts";
import { EXERCISES } from "assets/Exercises";
import { loadRecovery, markMuscleWorked } from "assets/Recovery";
import { Exercise } from "assets/Types";
import { pressableStyles } from "components/common/PressableStyles";
import ScreenHeader from "components/common/ScreenHeader";
import WorkoutList from "components/custom/WorkoutList";
import { CustomWorkout } from "components/custom/types";
import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<CustomWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<CustomWorkout | null>(
    null
  );

  const lookup = useMemo(() => {
    return EXERCISES.reduce<Record<string, Exercise>>((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {});
  }, []);

  const persist = useCallback(async (next: CustomWorkout[]) => {
    setWorkouts(next);
    setSelectedWorkout((current) =>
      current ? next.find((item) => item.id === current.id) ?? null : null
    );
    await saveCustomWorkouts(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([loadCustomWorkouts(), loadRecovery()])
        .then(([data]) => {
          if (!active) return;
          setWorkouts(data);
          setSelectedWorkout((current) =>
            current ? data.find((item) => item.id === current.id) ?? null : null
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [])
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const next = workouts.filter((workout) => workout.id !== id);
      await persist(next);
    },
    [workouts, persist]
  );

  const handleSelectWorkout = useCallback((workout: CustomWorkout) => {
    setSelectedWorkout(workout);
  }, []);

  const handleCloseOverlay = useCallback(() => setSelectedWorkout(null), []);

  const handleMarkComplete = useCallback(
    async (workout: CustomWorkout) => {
      const muscleCounts = workout.exercises.reduce(
        (acc: Record<string, number>, entry) => {
          const reference = lookup[entry.exerciseId];
          const muscle = reference?.muscle;
          if (!muscle) return acc;
          acc[muscle] = (acc[muscle] ?? 0) + 1;
          return acc;
        },
        {}
      );

      await Promise.all(
        Object.entries(muscleCounts).map(([muscle, count]) =>
          markMuscleWorked(muscle, count)
        )
      );

      const next = workouts.map((item) =>
        item.id === workout.id ? { ...item, completed: true } : item
      );
      await persist(next);
    },
    [lookup, workouts, persist]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.screen}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Custom"
            actionIcon="add"
            onActionPress={() => router.push("/create")}
          />

          <WorkoutList
            workouts={workouts}
            loading={loading}
            exerciseMap={lookup}
            onSelect={handleSelectWorkout}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={Boolean(selectedWorkout)}
        transparent
        animationType="fade"
        onRequestClose={handleCloseOverlay}
      >
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            {selectedWorkout ? (
              <>
                <View style={styles.overlayHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.overlayTitle}>
                      {selectedWorkout.title}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Close workout details"
                    style={({ pressed }) => [
                      styles.closeButton,
                      pressed && pressableStyles.pressed,
                    ]}
                    onPress={handleCloseOverlay}
                  >
                    <Ionicons name="close" size={18} color={COLORS.text} />
                  </Pressable>
                </View>

                {(selectedWorkout.focus ||
                  selectedWorkout.intensity ||
                  selectedWorkout.estDuration) && (
                  <View style={styles.badgeRow}>
                    {selectedWorkout.focus && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {selectedWorkout.focus}
                        </Text>
                      </View>
                    )}
                    {selectedWorkout.intensity && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {selectedWorkout.intensity}
                        </Text>
                      </View>
                    )}
                    {selectedWorkout.estDuration && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {selectedWorkout.estDuration} min
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {selectedWorkout.notes ? (
                  <Text style={styles.noteText}>{selectedWorkout.notes}</Text>
                ) : null}

                <View style={styles.overlaySubheader}>
                  <Text style={styles.subTitle}>Exercises</Text>
                  <Text style={styles.subMeta}>
                    Scroll to view the full workout
                  </Text>
                </View>

                <ScrollView
                  style={styles.exerciseScroll}
                  contentContainerStyle={styles.exerciseList}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {selectedWorkout.exercises.map((entry, index) => {
                    const reference = lookup[entry.exerciseId];
                    return (
                      <View key={entry.id} style={styles.exerciseRow}>
                        <View style={styles.exerciseIndex}>
                          <Text style={styles.exerciseIndexText}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.exerciseName}>
                            {reference?.name ?? "Exercise"}
                          </Text>
                          <Text style={styles.exerciseMeta}>
                            {reference?.muscle ?? "N/A"}
                            {reference?.modality
                              ? ` - ${reference.modality}`
                              : ""}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={styles.overlayActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.actionDanger,
                      pressed && pressableStyles.pressed,
                    ]}
                    onPress={() => {
                      if (selectedWorkout) {
                        handleDelete(selectedWorkout.id);
                        handleCloseOverlay();
                      }
                    }}
                  >
                    <Ionicons name="trash" size={16} color={COLORS.text} />
                    <Text style={styles.actionText}>Delete</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.actionPrimary,
                      pressed && pressableStyles.pressed,
                    ]}
                    onPress={() =>
                      selectedWorkout && handleMarkComplete(selectedWorkout)
                    }
                  >
                    <Ionicons
                      name="checkmark-done"
                      size={18}
                      color={COLORS.text}
                    />
                    <Text style={styles.actionText}>Mark complete</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
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
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  overlayCard: {
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: "90%",
  },
  overlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  overlayTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    color: COLORS.subtext,
    fontSize: 13,
  },
  subTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  subMeta: {
    color: COLORS.subtext,
    fontSize: 11,
  },
  overlaySubheader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  exerciseScroll: {
    maxHeight: 360,
  },
  exerciseList: {
    gap: 12,
    paddingBottom: 6,
  },
  exerciseRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panel + "60",
  },
  exerciseIndexText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  exerciseName: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
  },
  exerciseMeta: {
    color: COLORS.subtext,
    fontSize: 12,
  },
  overlayActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionDanger: {
    backgroundColor: COLORS.panel + "80",
  },
  actionText: {
    color: COLORS.text,
    fontWeight: "700",
  },
});

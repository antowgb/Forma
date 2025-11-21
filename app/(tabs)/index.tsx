import { getDailyWorkout, WorkoutModality } from "assets/GenerateWorkout";
import { loadRecovery, markMuscleWorked } from "assets/Recovery";
import { Exercise } from "assets/Types";
import Dropdown from "components/common/Dropdown";
import PageTransition from "components/common/PageTransition";
import ScreenHeader from "components/common/ScreenHeader";
import RestTimer from "components/home/RestTimer";
import WorkoutCompletionButton from "components/home/WorkoutCompletionButton";
import WorkoutGroupsList from "components/home/WorkoutGroupsList";
import { COLORS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [duration, setDuration] = useState(90);
  const [modality, setModality] = useState<WorkoutModality>("both");
  const [workout, setWorkout] = useState<Exercise[]>([]);
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState(false);
  const [recoveryLoaded, setRecoveryLoaded] = useState(false);
  const completionResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetCompletionState() {
    if (completionResetRef.current) {
      clearTimeout(completionResetRef.current);
      completionResetRef.current = null;
    }
    setCompleted(false);
  }

  function onGenerate(force: boolean = false) {
    if (!recoveryLoaded) return;
    const result = getDailyWorkout(duration, {
      forceNew: force,
      modality,
    });
    setWorkout(result.exercises);
    setNotice(result.notice);
    resetCompletionState();
  }

  // Load recovery once on mount, then generate the daily workout
  useEffect(() => {
    loadRecovery().finally(() => setRecoveryLoaded(true));
  }, []);

  // Regenerate when duration/modality changes
  useEffect(() => {
    onGenerate();
  }, [duration, modality, recoveryLoaded]);

  // Mark workout complete and persist recovery
  async function complete() {
    const muscleCounts = workout.reduce(
      (acc: Record<string, number>, ex: Exercise) => {
        acc[ex.muscle] = (acc[ex.muscle] ?? 0) + 1;
        return acc;
      },
      {}
    );

    await Promise.all(
      Object.entries(muscleCounts).map(([muscle, count]) =>
        markMuscleWorked(muscle, count)
      )
    );

    setCompleted(true);
    if (completionResetRef.current) {
      clearTimeout(completionResetRef.current);
    }
    completionResetRef.current = setTimeout(() => {
      setCompleted(false);
      completionResetRef.current = null;
    }, 1500);

    setTimeout(() => {
      const result = getDailyWorkout(duration, { modality });
      setWorkout(result.exercises);
    }, 200);
  }

  useEffect(() => {
    return () => {
      if (completionResetRef.current) {
        clearTimeout(completionResetRef.current);
      }
    };
  }, []);

  const simpleGroups = workout.reduce((acc: Record<string, Exercise[]>, ex) => {
    (acc[ex.muscle] ||= []).push(ex);
    return acc;
  }, {});

  const durationOptions = [
    { value: 30, label: "30 min" },
    { value: 60, label: "60 min" },
    { value: 90, label: "90 min" },
    { value: 120, label: "120 min" },
  ];

  const modalityOptions = [
    { value: "both" as WorkoutModality, label: "Both" },
    { value: "weight lifting" as WorkoutModality, label: "Weight Lifting" },
    { value: "calisthenics" as WorkoutModality, label: "Calisthenics" },
  ];

  return (
    <PageTransition animateOnFirstFocus>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        edges={["top", "left", "right", "bottom"]}
      >
        <LinearGradient
          colors={["#060708", "#0B0F12", "#120606"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.container}>
          <ScreenHeader title="Forma" onReload={() => onGenerate(true)} />

          {/* Duration selection */}
          <Dropdown
            label="Duration"
            value={duration}
            options={durationOptions}
            onSelect={setDuration}
          />

          {/* Modality filter */}
          <Dropdown
            label="Modality"
            value={modality}
            options={modalityOptions}
            onSelect={setModality}
          />

          <WorkoutCompletionButton
            visible={workout.length > 0}
            completed={completed}
            onComplete={complete}
          />

          {notice ? <Text style={styles.notice}>{notice}</Text> : null}

          {/* Workout grouped by muscle */}
          <WorkoutGroupsList groups={simpleGroups} />

          <RestTimer />
        </View>
      </SafeAreaView>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  notice: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: SPACING.sm,
    fontWeight: "600",
    textAlign: "center",
  },
});

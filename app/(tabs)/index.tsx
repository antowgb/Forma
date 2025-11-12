import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "constants/Colors";
import { EXERCISES } from "assets/Exercises";
import { generateWorkout } from "assets/GenerateWorkouts";
import { markWorkoutCompleted } from "assets/WorkoutCompletion";
import { usePrefs } from "assets/Store/Preferences";
import { useRecovery } from "assets/Store/Recovery";
import { WorkoutDuration } from "assets/Types";

const DURATION_OPTIONS: { label: string; value: WorkoutDuration }[] = [
  { label: "30 min", value: 30 },
  { label: "1 h", value: 60 },
  { label: "1 h 30", value: 90 },
  { label: "2 h", value: 120 },
];

export default function HomeScreen() {
  const durationPref = usePrefs((state) => state.durationPref);
  const setDuration = usePrefs((state) => state.setDuration);
  const favorites = usePrefs((state) => state.favorites);
  const hidden = usePrefs((state) => state.hidden);
  const modalityPref = usePrefs((state) => state.modalityPref);
  const equipment = usePrefs((state) => state.equipment);
  const lastWorked = useRecovery((state) => state.lastWorked);
  const lastIntensity = useRecovery((state) => state.lastIntensity);

  const { exercises, totalMinutes, notice } = useMemo(
    () => generateWorkout(EXERCISES),
    [
      durationPref,
      favorites,
      hidden,
      modalityPref,
      equipment,
      lastWorked,
      lastIntensity,
    ]
  );

  const disabled = exercises.length === 0;

  const handleDurationPress = (value: WorkoutDuration) => {
    if (value === durationPref) return;
    setDuration(value);
  };

  const handleComplete = () => {
    if (disabled) return;
    markWorkoutCompleted(exercises);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Forma</Text>
        <Text style={styles.subtitle}>Workout generator</Text>
      </View>
      <View style={styles.timesContainer}>
        {DURATION_OPTIONS.map((option) => {
          const isActive = option.value === durationPref;
          return (
            <Pressable
              key={option.value}
              onPress={() => handleDurationPress(option.value)}
              style={[
                styles.timeButton,
                isActive && styles.timeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.time,
                  isActive && styles.timeActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutContainerTitle}>
          Workout Details ({totalMinutes}/{durationPref} min)
        </Text>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {exercises.length ? (
          exercises.map((exercise) => (
            <View key={exercise.id} style={styles.workoutItem}>
              <View>
                <Text style={styles.workoutTitle}>{exercise.name}</Text>
                <Text style={styles.workoutSubtitle}>
                  {exercise.muscle} · {exercise.estMinutes} min · Int{" "}
                  {exercise.intensity}
                </Text>
              </View>
              <Text style={styles.workoutTag}>{exercise.modality}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>
            Aucun entrainement ne convient pour cette duree pour l'instant.
          </Text>
        )}
      </View>
      <Pressable
        style={[
          styles.completeButton,
          disabled && styles.completeButtonDisabled,
        ]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>Complete Workout</Text>
      </Pressable>
      <View style={styles.exploreContainer}>
        <Text style={styles.exploreTitle}>Explore</Text>
        <View style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Exercises</Text>
          <Text style={styles.exploreButtonText}>Recovery</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.subtext,
    marginTop: 6,
  },
  timesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  timeButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeButtonActive: {
    backgroundColor: COLORS.accent,
  },
  time: {
    fontSize: 16,
    color: COLORS.text,
  },
  timeActive: {
    color: "#050506",
    fontWeight: "700",
  },
  workoutContainer: {
    marginTop: 30,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
    paddingVertical: 20,
    gap: 10,
  },
  workoutContainerTitle: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 4,
  },
  notice: {
    color: COLORS.subtext,
    fontSize: 13,
  },
  workoutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.subtext + "40",
  },
  workoutTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 2,
  },
  workoutTag: {
    alignSelf: "center",
    fontSize: 12,
    color: COLORS.panel,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  empty: {
    color: COLORS.subtext,
    textAlign: "center",
  },
  completeButton: {
    marginTop: 40,
    marginHorizontal: 50,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonDisabled: {
    opacity: 0.4,
  },
  completeButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  exploreContainer: {
    marginTop: 30,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  exploreTitle: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  exploreButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  exploreButtonText: {
    fontSize: 18,
    color: COLORS.text,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
  },
});

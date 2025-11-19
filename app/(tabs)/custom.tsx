import { useFocusEffect } from "@react-navigation/native";
import { loadCustomWorkouts, saveCustomWorkouts } from "assets/CustomWorkouts";
import { EXERCISES } from "assets/Exercises";
import { Exercise } from "assets/Types";
import ScreenHeader from "components/common/ScreenHeader";
import WorkoutList from "components/custom/WorkoutList";
import { CustomWorkout } from "components/custom/types";
import RestTimer from "components/home/RestTimer";
import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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

  const lookup = useMemo(() => {
    return EXERCISES.reduce<Record<string, Exercise>>((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {});
  }, []);

  const persist = useCallback(async (next: CustomWorkout[]) => {
    setWorkouts(next);
    await saveCustomWorkouts(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadCustomWorkouts()
        .then((data) => {
          if (active) {
            setWorkouts(data);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [])
  );

  const handleToggleComplete = useCallback(
    async (id: string) => {
      const next = workouts.map((workout) =>
        workout.id === id
          ? { ...workout, completed: !workout.completed }
          : workout
      );
      await persist(next);
    },
    [workouts, persist]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const next = workouts.filter((workout) => workout.id !== id);
      await persist(next);
    },
    [workouts, persist]
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

          <RestTimer />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved workouts</Text>
            <Text style={styles.sectionSubtitle}>{workouts.length} total</Text>
          </View>

          <WorkoutList
            workouts={workouts}
            loading={loading}
            exerciseMap={lookup}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
});

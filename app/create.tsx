import {
  createCustomWorkout,
  loadCustomWorkouts,
  saveCustomWorkouts,
} from "assets/CustomWorkouts";
import { EXERCISES } from "assets/Exercises";
import ScreenHeader from "components/common/ScreenHeader";
import PageTransition from "components/common/PageTransition";
import WorkoutBuilder from "components/custom/WorkoutBuilder";
import { CustomWorkoutInput } from "components/custom/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "constants/Colors";
import { SPACING } from "constants/Spacing";

export default function CreateCustomWorkoutScreen() {
  const router = useRouter();

  const handleCreate = useCallback(
    async (input: CustomWorkoutInput) => {
      const workout = createCustomWorkout(input);
      try {
        const existing = await loadCustomWorkouts();
        await saveCustomWorkouts([workout, ...existing]);
        router.back();
      } catch (error) {
        Alert.alert("Unable to save workout", "Please try again in a moment.");
      }
    },
    [router]
  );

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
          <ScreenHeader
            title="New workout"
            actionIcon="close"
            onActionPress={() => router.back()}
          />

          <WorkoutBuilder exercises={EXERCISES} onCreate={handleCreate} />
        </View>
      </SafeAreaView>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
});

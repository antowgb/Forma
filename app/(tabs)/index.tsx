import { getDailyWorkout, WorkoutModality } from "assets/GenerateWorkout";
import { loadRecovery, markMuscleWorked } from "assets/Recovery";
import { Exercise } from "assets/Types";
import NavLinkRow from "components/common/NavLinkRow";
import ScreenHeader from "components/common/ScreenHeader";
import DurationSelector from "components/home/DurationSelector";
import ModalityFilter from "components/home/ModalityFilter";
import RestTimer from "components/home/RestTimer";
import WorkoutCompletionButton from "components/home/WorkoutCompletionButton";
import WorkoutGroupsList from "components/home/WorkoutGroupsList";
import { COLORS } from "constants/Colors";
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
  const completionResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetCompletionState() {
    if (completionResetRef.current) {
      clearTimeout(completionResetRef.current);
      completionResetRef.current = null;
    }
    setCompleted(false);
  }

  function onGenerate(force: boolean = false) {
    const result = getDailyWorkout(duration, {
      forceNew: force,
      modality,
    });
    setWorkout(result.exercises);
    setNotice(result.notice);
    resetCompletionState();
  }

  // ?? charger la recovery une fois au lancement, puis générer le workout du jour
  useEffect(() => {
    loadRecovery().then(() => {
      onGenerate();
    });
  }, []);

  // ?? si tu veux un workout différent par durée le même jour, tu peux garder ça :
  useEffect(() => {
    onGenerate();
  }, [duration, modality]);

  // ?? marquer comme complété (et sauvegarder la recovery)
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <ScreenHeader title="Forma" onReload={() => onGenerate(true)} />

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        {/* Choix durée */}
        <DurationSelector
          value={duration}
          options={[30, 60, 90, 120]}
          onChange={setDuration}
        />

        {/* Filtre modalité */}
        <ModalityFilter value={modality} onChange={setModality} />

        {/* Workout affiché par muscle */}
        <WorkoutGroupsList groups={simpleGroups} />

        <RestTimer />

        <WorkoutCompletionButton
          visible={workout.length > 0}
          completed={completed}
          onComplete={complete}
        />

        <NavLinkRow
          links={[
            { href: "/workouts", label: "Workouts" },
            { href: "/recovery", label: "Recovery" },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  notice: {
    color: COLORS.text,
    fontSize: 20,
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});

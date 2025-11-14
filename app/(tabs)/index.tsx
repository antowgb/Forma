import { Exercise } from "assets/Types";
import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { generateReps, getDailyWorkout } from "assets/GenerateWorkout";

import { loadRecovery, markMuscleWorked } from "assets/Recovery";

export default function HomeScreen() {
  const [duration, setDuration] = useState(90);
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
    const result = getDailyWorkout(duration, force);
    setWorkout(result.exercises);
    setNotice(result.notice);
    resetCompletionState();
  }

  // 🔹 charger la recovery une fois au lancement, puis générer le workout du jour
  useEffect(() => {
    loadRecovery().then(() => {
      onGenerate();
    });
  }, []);

  // 🔹 si tu veux un workout différent par durée le même jour, tu peux garder ça :
  useEffect(() => {
    onGenerate();
  }, [duration]);

  // 🔹 marquer comme complété (et sauvegarder la recovery)
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
      const result = getDailyWorkout(duration);
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
        <View style={styles.headerTop}>
          <Text style={styles.title}>Forma</Text>

          <Pressable
            style={({ pressed }) => [
              styles.reloadButton,
              pressed && styles.pressablePressed,
            ]}
            onPress={() => onGenerate(true)}
          >
            <Ionicons name="reload" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        {/* Choix durée */}
        <View style={styles.row}>
          {[30, 60, 90, 120].map((d) => (
            <Pressable
              key={d}
              onPress={() => setDuration(d)}
              style={({ pressed }) => [
                styles.durationButton,
                duration === d && styles.durationActive,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  duration === d && styles.durationTextActive,
                ]}
              >
                {d} min
              </Text>
            </Pressable>
          ))}
        </View>

        {workout.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.done,
              pressed && styles.pressablePressed,
            ]}
            onPress={complete}
          >
            <Text style={styles.generateText}>
              {completed ? "Workout Registered" : "Mark Completed"}
            </Text>
          </Pressable>
        )}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {/* Workout affiché par muscle */}
        <View style={styles.exerciseList}>
          <ScrollView>
            {Object.entries(simpleGroups).map(([muscle, list]: any) => (
              <View key={muscle} style={{ marginBottom: 14 }}>
                <Text style={styles.muscleTitle}>{muscle}</Text>

                {list.map((ex: any) => (
                  <Text key={ex.id} style={styles.item}>
                    {ex.name} : {generateReps(ex)}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.row}>
          <Link href="/workouts" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Workouts</Text>
            </Pressable>
          </Link>
          <Link href="/recovery" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Recovery</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.bannerPlaceholder} pointerEvents="none">
          <Text style={styles.bannerText}>
            Reserved space for upcoming ad banner
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    paddingBottom: 48,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
  },
  reloadButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  debugText: {
    color: COLORS.text,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  durationButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
  },
  durationActive: {
    backgroundColor: COLORS.accent,
  },
  durationText: {
    color: COLORS.text,
  },
  durationTextActive: {
    fontWeight: "700",
  },
  generate: {
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  generateText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
  notice: {
    color: COLORS.text,
    fontSize: 20,
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  exerciseList: {
    marginTop: 20,
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  item: {
    color: COLORS.text,
    fontSize: 16,
    marginVertical: 2,
  },
  done: {
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.text + "55",
  },
  linkText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  pressablePressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  bannerPlaceholder: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.accent,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panel + "40",
  },
  bannerText: {
    color: COLORS.text + "99",
    fontSize: 14,
    letterSpacing: 0.6,
  },
});

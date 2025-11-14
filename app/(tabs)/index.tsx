import { Exercise } from "assets/Types";
import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { generateReps, getDailyWorkout } from "assets/GenerateWorkout";

import { markMuscleWorked } from "assets/Recovery";

export default function HomeScreen() {
  const [duration, setDuration] = useState(90);
  const [workout, setWorkout] = useState<Exercise[]>([]);
  const [notice, setNotice] = useState("");

  function onGenerate() {
    const result = getDailyWorkout(duration); // 👈 au lieu de generateWorkout
    setWorkout(result.exercises);
    setNotice(result.notice);
  }

  function complete() {
    workout.forEach((ex) => markMuscleWorked(ex.muscle));
    setNotice("Workout enregistré !");
  }

  const simpleGroups = workout.reduce((acc: Record<string, Exercise[]>, ex) => {
    (acc[ex.muscle] ||= []).push(ex);
    return acc;
  }, {});

  useEffect(() => {
    onGenerate();
  }, [duration]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Forma</Text>

        {/* Choix durée */}
        <View style={styles.row}>
          {[30, 60, 90, 120].map((d) => (
            <Pressable
              key={d}
              onPress={() => setDuration(d)}
              style={[
                styles.durationButton,
                duration === d && styles.durationActive,
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
          <Pressable style={styles.done} onPress={complete}>
            <Text style={styles.generateText}>Mark Completed</Text>
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
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Workouts</Text>
            </Pressable>
          </Link>
          <Link href="/recovery" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Recovery</Text>
            </Pressable>
          </Link>
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
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
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
    color: COLORS.background,
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
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  linkText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
});

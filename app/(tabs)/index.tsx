import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { generateWorkout, generateReps } from "assets/GenerateWorkout";
import { markMuscleWorked } from "assets/Recovery";

export default function HomeScreen() {
  const [duration, setDuration] = useState(90);
  const [workout, setWorkout] = useState<any[]>([]);
  const [notice, setNotice] = useState("");

  function onGenerate() {
    const result = generateWorkout(duration);
    setWorkout(result.exercises);
    setNotice(result.notice);
  }

  function complete() {
    workout.forEach((ex) => markMuscleWorked(ex.muscle));
    setWorkout([]);
    setNotice("Workout enregistré !");
  }

  // 💡 Regroupement ultra simple
  const simpleGroups = workout.reduce((acc: any, ex) => {
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
                {d < 60 ? `${d} min` : `${d / 60} h`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.generate} onPress={onGenerate}>
          <Text style={styles.generateText}>Generate workout</Text>
        </Pressable>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        {/* Workout affiché par muscle */}
        <View style={styles.exerciseList}>
          <ScrollView>
            {Object.entries(simpleGroups).map(([muscle, list]: any) => (
              <View key={muscle} style={{ marginBottom: 14 }}>
                <Text style={styles.muscleTitle}>{muscle}</Text>

                {list.map((ex: any) => (
                  <Text key={ex.id} style={styles.item}>
                    • {ex.name} : {generateReps(ex)}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        {workout.length > 0 && (
          <Pressable style={styles.done} onPress={complete}>
            <Text style={styles.generateText}>Mark Completed</Text>
          </Pressable>
        )}
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
    gap: 10,
    marginVertical: 12,
  },
  durationButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
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
    color: COLORS.text,
    fontWeight: "700",
  },
  notice: {
    color: COLORS.text,
    marginTop: 10,
  },
  exerciseList: {
    marginTop: 20,
    maxHeight: 300,
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
    backgroundColor: COLORS.panel,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
});

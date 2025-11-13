import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { generateWorkout } from "assets/GenerateWorkout";
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
                {`${d / 60} h`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.generate} onPress={onGenerate}>
          <Text style={styles.generateText}>Generate workout</Text>
        </Pressable>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        {workout.map((ex) => (
          <Text key={ex.id} style={styles.item}>
            {ex.name} — {ex.muscle}
          </Text>
        ))}

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
  container: { flex: 1, padding: 24, gap: 12 },
  title: { color: "white", fontSize: 38, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10, marginVertical: 12 },
  durationButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  durationActive: {
    backgroundColor: "#EF4444",
  },
  durationText: { color: "white" },
  durationTextActive: { color: "#0B0F12", fontWeight: "700" },
  generate: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  generateText: { color: "white", fontWeight: "700" },
  notice: { color: "#aaa", marginTop: 10 },
  item: { color: "#ddd", fontSize: 16, marginVertical: 2 },
  done: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
});

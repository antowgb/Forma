import { Ionicons } from "@expo/vector-icons";
import { WorkoutModality } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import Dropdown, {
  DropdownOption,
} from "components/common/Dropdown";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS } from "constants/Colors";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CustomWorkoutInput } from "./types";

type WorkoutBuilderProps = {
  exercises: Exercise[];
  onCreate: (input: CustomWorkoutInput) => Promise<void> | void;
};

type DraftItem = {
  id: string;
  exerciseId: string;
};

const MUSCLE_ORDER = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
const ALL = "All";
const MODALITY_OPTIONS: DropdownOption<WorkoutModality>[] = [
  { value: "both", label: "Both" },
  { value: "weight lifting", label: "Weight Lifting" },
  { value: "calisthenics", label: "Calisthenics" },
];

export default function WorkoutBuilder({
  exercises,
  onCreate,
}: WorkoutBuilderProps) {
  const [title, setTitle] = useState("");
  const [muscle, setMuscle] = useState(ALL);
  const [modality, setModality] = useState<WorkoutModality>("both");
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [saving, setSaving] = useState(false);
  const selectionScrollRef = useRef<ScrollView>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      if (modality === "both") return true;
      if (exercise.modality === "both") return true;
      return exercise.modality === modality;
    });
  }, [exercises, modality]);

  const muscles = useMemo(() => {
    const set = new Set<string>();
    filteredExercises.forEach((exercise) => set.add(exercise.muscle));
    return Array.from(set);
  }, [filteredExercises]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    filteredExercises.forEach((exercise) => {
      if (!groups[exercise.muscle]) groups[exercise.muscle] = [];
      groups[exercise.muscle].push(exercise);
    });

    Object.values(groups).forEach((list) =>
      list.sort((a, b) => a.name.localeCompare(b.name))
    );

    return groups;
  }, [filteredExercises]);

  const orderedGroupKeys = useMemo(() => {
    return Object.keys(groupedExercises)
      .sort((a, b) => {
        const indexA = MUSCLE_ORDER.indexOf(a);
        const indexB = MUSCLE_ORDER.indexOf(b);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      })
      .filter((key) => muscle === ALL || key === muscle);
  }, [groupedExercises, muscle]);

  function addExercise(exercise: Exercise) {
    const exists = draft.some((entry) => entry.exerciseId === exercise.id);
    if (exists) return;
    setDraft((prev) => [
      ...prev,
      { id: `${exercise.id}-${Date.now()}`, exerciseId: exercise.id },
    ]);
    requestAnimationFrame(() => {
      selectionScrollRef.current?.scrollToEnd({ animated: true });
    });
  }

  function removeExercise(id: string) {
    setDraft((prev) => prev.filter((entry) => entry.id !== id));
  }

  async function handleSave() {
    const name = title.trim();
    if (!name || draft.length === 0) {
      Alert.alert("Missing info", "Name your workout and pick exercises.");
      return;
    }

    setSaving(true);
    try {
      await onCreate({
        title: name,
        exercises: draft.map((entry) => ({ exerciseId: entry.exerciseId })),
      });
      setTitle("");
      setDraft([]);
    } finally {
      setSaving(false);
    }
  }

  const canSave = title.trim().length > 0 && draft.length > 0 && !saving;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Workout name"
        placeholderTextColor={COLORS.subtext}
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.selectedBlock}>
        <Text style={styles.sectionLabel}>Selection</Text>
        <ScrollView style={styles.selectionList} ref={selectionScrollRef}>
          {draft.map((entry, index) => {
            const exercise = exercises.find(
              (item) => item.id === entry.exerciseId
            );
            return (
              <View key={entry.id} style={styles.selectionRow}>
                <Text style={styles.selectionIndex}>{index + 1}.</Text>
                <Text style={styles.selectionName}>
                  {exercise?.name ?? "Exercise"}
                </Text>
                <Pressable
                  onPress={() => removeExercise(entry.id)}
                  style={({ pressed }) => [
                    styles.selectionAction,
                    pressed && pressableStyles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={14} color={COLORS.text} />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Dropdown
        label="Muscle group"
        value={muscle}
        options={[ALL, ...muscles].map((item) => ({
          value: item,
          label: item,
        }))}
        onSelect={setMuscle}
      />

      <Dropdown
        label="Modality"
        value={modality}
        options={MODALITY_OPTIONS}
        onSelect={setModality}
      />

      <View style={styles.groupsCard}>
        <ScrollView>
          {orderedGroupKeys.map((muscle) => {
            const list = groupedExercises[muscle];
            if (!list || !list.length) return null;
            return (
              <View key={muscle} style={styles.group}>
                <Text style={styles.muscleTitle}>{muscle}</Text>
                {list.map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => addExercise(exercise)}
                    style={({ pressed }) => [
                      styles.exerciseRow,
                      pressed && pressableStyles.pressed,
                    ]}
                  >
                    <View>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseMeta}>
                        {exercise.modality} • {exercise.estMinutes} min
                      </Text>
                    </View>
                    <Ionicons name="add" size={16} color={COLORS.text} />
                  </Pressable>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Pressable
        onPress={handleSave}
        disabled={!canSave}
        style={({ pressed }) => [
          styles.saveButton,
          !canSave && styles.saveButtonDisabled,
          pressed && canSave && pressableStyles.pressed,
        ]}
      >
        <Text style={styles.saveLabel}>
          {saving ? "Saving..." : "Save workout"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  selectedBlock: {
    height: 150,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  sectionLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  selectionList: {
    maxHeight: 160,
  },
  selectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  selectionIndex: {
    color: COLORS.subtext,
    fontWeight: "700",
    width: 20,
  },
  selectionName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },
  selectionAction: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    padding: 6,
  },
  groupsCard: {
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    height: 250,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    gap: 6,
  },
  group: {
    marginBottom: 12,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseMeta: {
    color: COLORS.subtext,
    fontSize: 11,
  },
  saveButton: {
    borderRadius: 999,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});

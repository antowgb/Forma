import { Ionicons } from "@expo/vector-icons";
import { WorkoutModality } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import Dropdown, { DropdownOption } from "components/common/Dropdown";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
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

const MUSCLE_TO_CLUSTER: Record<string, string> = {
  Quads: "Legs",
  Hamstrings: "Legs",
  Calves: "Legs",
  "Upper Back": "Back",
  Lats: "Back",
  "Lower Back": "Back",
  "Upper Chest": "Chest",
  "Lower Chest": "Chest",
  "Front Deltoid": "Shoulders",
  "Lateral Deltoid": "Shoulders",
  "Rear Deltoid": "Shoulders",
  Biceps: "Arms",
  Triceps: "Arms",
  Forearms: "Arms",
  Glutes: "Core",
  Abs: "Core",
};

const CLUSTER_ORDER = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"];
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
  const [clusterFilter, setClusterFilter] = useState(ALL);
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

  const availableClusters = useMemo(() => {
    const set = new Set<string>();
    muscles.forEach((muscle) => {
      const cluster = MUSCLE_TO_CLUSTER[muscle];
      if (cluster) set.add(cluster);
    });
    return CLUSTER_ORDER.filter((cluster) => set.has(cluster));
  }, [muscles]);

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
    const available = Object.keys(groupedExercises);
    const filtered =
      clusterFilter === ALL
        ? available
        : available.filter((m) => MUSCLE_TO_CLUSTER[m] === clusterFilter);
    return CLUSTER_ORDER.flatMap((cluster) =>
      filtered
        .filter((m) => MUSCLE_TO_CLUSTER[m] === cluster)
        .sort((a, b) => a.localeCompare(b))
    );
  }, [groupedExercises, clusterFilter]);

  const clustersWithItems = useMemo(() => {
    return CLUSTER_ORDER.filter((cluster) =>
      orderedGroupKeys.some((m) => MUSCLE_TO_CLUSTER[m] === cluster)
    );
  }, [orderedGroupKeys]);

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
        value={clusterFilter}
        options={[ALL, ...availableClusters].map((item) => ({
          value: item,
          label: item,
        }))}
        onSelect={setClusterFilter}
      />

      <Dropdown
        label="Modality"
        value={modality}
        options={MODALITY_OPTIONS}
        onSelect={setModality}
      />

      <View style={styles.groupsCard}>
        <ScrollView>
          {clustersWithItems.map((cluster, index) => (
            <View key={cluster} style={styles.clusterWrapper}>
              <View style={styles.group}>
                <Text style={styles.clusterTitle}>{cluster}</Text>
                {orderedGroupKeys
                  .filter((m) => MUSCLE_TO_CLUSTER[m] === cluster)
                  .map((muscleKey) => {
                    const list = groupedExercises[muscleKey];
                    if (!list || !list.length) return null;
                    return (
                      <View key={muscleKey} style={styles.subGroup}>
                        <Text style={styles.muscleTitle}>{muscleKey}</Text>
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
                              <Text style={styles.exerciseName}>
                                {exercise.name}
                              </Text>
                              <Text style={styles.exerciseMeta}>
                                {exercise.modality} · {exercise.estMinutes} min
                              </Text>
                            </View>
                            <Ionicons
                              name="add"
                              size={16}
                              color={COLORS.text}
                            />
                          </Pressable>
                        ))}
                      </View>
                    );
                  })}
              </View>
              {index < clustersWithItems.length - 1 ? (
                <View style={styles.clusterDivider} />
              ) : null}
            </View>
          ))}
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
    gap: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: 14,
  },
  selectedBlock: {
    height: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
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
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
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
    borderRadius: RADIUS.pill,
    padding: SPACING.sm,
  },
  groupsCard: {
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    height: 250,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
    gap: SPACING.sm,
  },
  group: {
    marginBottom: SPACING.md,
  },
  clusterWrapper: {
    marginBottom: SPACING.sm,
  },
  clusterDivider: {
    height: 2,
    backgroundColor: COLORS.text + "20",
    marginVertical: SPACING.sm,
  },
  clusterTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  subGroup: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text + "20",
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseMeta: {
    color: COLORS.subtext,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.floating,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveLabel: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "700",
  },
});

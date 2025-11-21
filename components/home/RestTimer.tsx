import { Ionicons } from "@expo/vector-icons";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PRESETS = [60, 90, 120];

export default function RestTimer() {
  const [selectedSeconds, setSelectedSeconds] = useState(PRESETS[1]);
  const [remainingSeconds, setRemainingSeconds] = useState(PRESETS[1]);

  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setRunning(false);
    setRemainingSeconds(selectedSeconds);
  }, [selectedSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setRunning(false);
          return selectedSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, selectedSeconds]);

  const formattedTime = useMemo(
    () => `${remainingSeconds.toString().padStart(2, "0")}s`,
    [remainingSeconds]
  );

  function handleToggle() {
    setRunning((prev) => !prev);
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.timeText}>{formattedTime}</Text>

        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [
            styles.playToggleButton,
            running && styles.playToggleButton,
            pressed && pressableStyles.pressed,
          ]}
        >
          <Ionicons
            name={running ? "pause" : "play"}
            size={36}
            color={COLORS.text}
          />
        </Pressable>
      </View>
      <View style={styles.presets}>
        {PRESETS.map((seconds) => (
          <Pressable
            key={seconds}
            onPress={() => setSelectedSeconds(seconds)}
            style={({ pressed }) => [
              styles.presetButton,
              selectedSeconds === seconds && styles.presetActive,
              pressed && pressableStyles.pressed,
            ]}
          >
            <Text
              style={[
                styles.presetText,
                selectedSeconds === seconds && styles.presetTextActive,
              ]}
            >
              {seconds}s
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  timeText: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  playToggleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.pill,
    width: 52,
    height: 52,
  },
  toggleLabel: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  presets: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  presetButton: {
    flex: 1,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
  },
  presetActive: {
    backgroundColor: COLORS.accent,
  },
  presetText: {
    color: COLORS.text,
    textAlign: "center",
    fontSize: 11,
  },
  presetTextActive: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 11,
  },
});

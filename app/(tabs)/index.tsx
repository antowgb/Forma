import { COLORS } from "constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Forma</Text>
        <Text style={styles.subtitle}>Workout generator</Text>
      </View>
      <View style={styles.timesContainer}>
        <Text style={styles.time}>30 min</Text>
        <Text style={styles.time}>1 h</Text>
        <Text style={styles.time}>1 h 30 min</Text>
        <Text style={styles.time}>2 h</Text>
      </View>
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutContainerTitle}>Workout Details</Text>
        <View style={styles.workoutItem}>
          <Text style={styles.workoutTitle}>push ups</Text>
          <Text style={styles.workoutSubtitle}>3 x 12</Text>
        </View>
        <View style={styles.workoutItem}>
          <Text style={styles.workoutTitle}>squats</Text>
          <Text style={styles.workoutSubtitle}>4 x 15</Text>
        </View>
      </View>
      <View style={styles.CompleteButton}>
        <Text style={styles.CompleteButtonText}>Complete Workout</Text>
      </View>
      <View style={styles.ExploreContainer}>
        <Text style={styles.ExploreTitle}>Explore</Text>
        <View style={styles.ExploreButton}>
          <Text style={styles.ExploreButtonText}>Exercises</Text>
          <Text style={styles.ExploreButtonText}>Recovery</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.subtext,
    marginTop: 6,
  },
  timesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  time: {
    fontSize: 16,
    color: COLORS.text,
  },
  workoutContainer: {
    marginTop: 30,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
    paddingVertical: 20,
  },
  workoutContainerTitle: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  workoutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
  },

  CompleteButton: {
    marginTop: 40,
    marginHorizontal: 50,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  CompleteButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  ExploreContainer: {
    marginTop: 30,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  ExploreTitle: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  ExploreButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  ExploreButtonText: {
    fontSize: 18,
    color: COLORS.text,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
  },
});

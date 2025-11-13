import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recovery</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Go to home screen</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  linkText: {
    color: "white",
    fontSize: 18,
  },
});

import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ImageDetectionComponent from "../components/ImageDetectionComponent";
import DetectionComponent from "../components/DetectionComponent";
import { useRouter } from "expo-router";
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={router.push("/components/DetectionComponent")}
      >
        <Text style={styles.text}>Create a new examination</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontFamily: "lexend",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    color: "#1D24CA",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 20,
    fontFamily: "lexend",
  },
  subtitle: {
    fontSize: 20,
    color: "#555555",
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24,
    fontFamily: "lexend",
  },
  button: {
    backgroundColor: "#98ABEE",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    width: "60%",
  },
  button: {
    width: "80%",
    marginVertical: 15,
    backgroundColor: "#1D24CA", // A lighter indigo to complement the title color
    padding: 15,
    borderRadius: 15, // Matching rounded corners for consistency
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0", // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF", // Maintained white for clear visibility
    fontSize: 18, // Slightly larger for emphasis
    fontWeight: "600", // Semi-bold for a balanced weight
  },
});

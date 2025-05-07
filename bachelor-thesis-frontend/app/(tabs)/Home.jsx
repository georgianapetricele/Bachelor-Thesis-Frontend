import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ImageDetectionComponent from "../components/ImageDetectionComponent";
import DetectionComponent from "./DetectionComponent";
import { useRouter } from "expo-router";
import ExaminationsListComponent from "../components/ExaminationsListComponent";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Examinations</Text>
      <ExaminationsListComponent />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/DetectionComponent")}
      >
        <MaterialIcons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    fontFamily: "lexend",
    alignItems: "center",
    justifyContent: "space-between", // puts space between list and button
    paddingVertical: 20, 
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
  addButton: {
    backgroundColor: "#1D24CA",
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginTop: 100,
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

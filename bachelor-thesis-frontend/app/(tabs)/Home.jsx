import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DetectionScreen from "./DetectionScreen";
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
        onPress={() => router.push("/(tabs)/DetectionScreen")}
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
    justifyContent: "space-between",
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
    backgroundColor: "#1D24CA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

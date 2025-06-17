import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ImageSegmentationComponent from "../components/ImageSegmentationComponent";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DetailedAnalysisScreen() {
  const params = useLocalSearchParams();
  const { imageUri, predictionId } = params;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/DetectionScreen")}
      >
        <MaterialIcons name="arrow-back" size={40} color="#5C3DAC" />
      </TouchableOpacity>
      <Text style={styles.title}>Detailed spot analysis</Text>

      <ImageSegmentationComponent
        imageUri={imageUri}
        predictionId={predictionId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 0,
    fontFamily: "lexend",
  },
  backButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 35,
    color: "#1D24CA",
    textAlign: "center",
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
});

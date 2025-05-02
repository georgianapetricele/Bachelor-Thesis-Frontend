import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ImageSegmentationComponent from "../components/ImageSegmentationComponent";
import { useLocalSearchParams } from "expo-router";


export default function DetailedAnalysisScreen() {
  const params = useLocalSearchParams();
const { imageUri } = params;

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed spot analysis</Text>
      <ImageSegmentationComponent imageUri={imageUri}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    fontFamily: "lexend",
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
});

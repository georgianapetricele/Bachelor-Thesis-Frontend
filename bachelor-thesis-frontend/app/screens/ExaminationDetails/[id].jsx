import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // ✅ correct import
import { MaterialIcons } from "@expo/vector-icons";

export default function ExaminationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [examination, setExamination] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.1.6:5000/examination/${id}`)
      .then((response) => response.json())
      .then((data) => setExamination(data))
      .catch((error) => {
        console.error("Error fetching examination details:", error);
      });
  }, [id]);

  if (!examination) {
    return <Text>Loading...</Text>;
  }

  const imageBase64 = examination.detection_prediction?.image_base64
    ? `data:image/png;base64,${examination.detection_prediction.image_base64}`
    : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="close" size={40} color="#5C3DAC" />
      </TouchableOpacity>
      <Text style={styles.title}>Examination Details</Text>
      <Text style={styles.label}>Patient: {examination.patient_name}</Text>
      <Text style={styles.label}>
        Date: {examination.created_at.slice(0, 19).replace("T", " ")}
      </Text>
      <Text style={styles.label}>
        Observations: {examination.observations || "None"}
      </Text>

      {imageBase64 ? (
        <Image source={{ uri: imageBase64 }} style={styles.image} />
      ) : (
        <Text>No detection image available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 250,
    marginTop: 20,
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../API_BASE_URL";


export default function ExaminationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [examination, setExamination] = useState(null);
  const [isZoomModalVisible, setZoomModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/examination/${id}`)
      .then((response) => response.json())
      .then((data) => setExamination(data))
      .catch((error) => {
        console.error("Error fetching examination details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const imageBase64 = examination?.detection_prediction?.image_data
    ? `data:image/png;base64,${examination.detection_prediction.image_data}`
    : null;

  const getRiskInfo = (label, value) => {
    if (value === null || value === undefined) {
      return { color: "#888", message: "No data" };
    }

    switch (label) {
      case "Asymmetry Index":
        if (value == 0.0)
          return { color: "green", message: "Shape symmetric on both axes" };
        if (value === 1.0)
          return { color: "orange", message: "Shape asymmetric on one axis" };
        return { color: "red", message: "Shape asymmetric on both axes" };

      case "Border Irregularity":
        if (value < 1.0)
          return { color: "green", message: "Smooth border (< 1.0)" };
        if (value < 1.5)
          return { color: "orange", message: "Slightly irregular (1.0 - 1.5)" };
        return { color: "red", message: "Highly irregular border (> 1.5)" };

      case "Color Variety":
        return {
          color: "#1D24CA",
          message: `Lesion contains ${value} colors out of 6 total risk colors`,
        };
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="close" size={40} color="#5C3DAC" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Examination Details</Text>

        <Text style={styles.label}>
          Patient: {examination?.patient_name || "N/A"}
        </Text>
        <Text style={styles.label}>
          Email: {examination?.patient_email || "N/A"}
        </Text>
        <Text style={styles.label}>
          Date:{" "}
          {examination?.created_at
            ? examination.created_at.slice(0, 19).replace("T", " ")
            : "N/A"}
        </Text>
        <Text style={styles.label}>
          Observations: {examination?.observations || "None"}
        </Text>

        {imageBase64 ? (
          <TouchableOpacity onPress={() => setZoomModalVisible(true)}>
            <Image source={{ uri: imageBase64 }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <Text>No detection image available</Text>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: 10 }}
          />
        )}

        {examination?.detection_prediction?.detected_lesions?.length > 0 ? (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, color: "#1D24CA" }}
            >
              Lesions with Detailed Analysis
            </Text>
            {examination.detection_prediction.detected_lesions.map(
              (lesion, index) => (
                <View key={index} style={styles.lesionContainer}>
                  <View style={styles.textBlock}>
                    {[
                      {
                        label: "Asymmetry Index",
                        value: lesion.asymmetry_index,
                      },
                      {
                        label: "Border Irregularity",
                        value: lesion.border_irregularity,
                      },
                      { label: "Color Variety", value: lesion.color_variety },
                    ].map(({ label, value }, index) => {
                      const { color, message } = getRiskInfo(label, value);
                      return (
                        <View key={index} style={{ marginBottom: 12 }}>
                          <Text style={[styles.paragraph, { color }]}>
                            {label}: {value?.toFixed(3) ?? "N/A"}
                          </Text>
                          <Text
                            style={{
                              color: "#1D24CA",
                              marginTop: 5,
                              fontSize: 15,
                            }}
                          >
                            {message}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {lesion.masked_original && (
                    <View
                      style={{ flexDirection: "row", marginTop: 10, gap: 10 }}
                    >
                      <Image
                        source={{
                          uri: `data:image/png;base64,${lesion.masked_original}`,
                        }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 10,
                        }}
                        resizeMode="contain"
                      />
                      <Image
                        source={{
                          uri: `data:image/png;base64,${lesion.segmentation_mask}`,
                        }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 10,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
              )
            )}
          </View>
        ) : (
          <Text style={{ marginTop: 50, fontSize: 18 }}>
            No lesions on which was performed detailed shape analysis
          </Text>
        )}
      </ScrollView>

      <Modal visible={isZoomModalVisible} transparent={false}>
        <TouchableOpacity
          style={styles.fullscreenContainer}
          onPress={() => setZoomModalVisible(false)}
          activeOpacity={1}
        >
          <ScrollView
            maximumZoomScale={3}
            minimumZoomScale={1}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: imageBase64 }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1D24CA",
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
    marginTop: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  lesionContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

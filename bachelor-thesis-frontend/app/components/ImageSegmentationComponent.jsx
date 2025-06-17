import * as ImagePicker from "expo-image-picker";
import {
  TouchableOpacity,
  Image,
  View,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../API_BASE_URL";

export default function ImageSegmentationComponent({ imageUri, predictionId }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [maskedOriginalImage, setMaskedOriginalImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [asymmetryIndex, setAsymmetryIndex] = useState(null);
  const [borderIrregularity, setBorderIrregularity] = useState(null);
  const [colorVariety, setColorVariety] = useState(null);
  const [matchedColors, setMatchedColors] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (imageUri) {
      setImage(imageUri);
    }
  }, [imageUri]);

  const handleUpload = async () => {
    console.debug("Prediction ID:", predictionId);
    setLoading(true);
    if (!image) {
      Alert.alert("No image", "Please pick or take an image first.");
      return;
    }

    const formData = new FormData();

    const uriParts = image.split("/");
    let fileName = uriParts[uriParts.length - 1];
    if (!fileName.includes(".")) {
      fileName += ".png";
    }

    formData.append("image", {
      uri: image,
      name: fileName,
      type: "image/png",
    });

    if (predictionId) {
      formData.append("prediction_id", predictionId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/image/segment`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      const base64Mask = `data:image/png;base64,${data.segmentation_mask}`;
      const base64MaskedOriginal = `data:image/png;base64,${data.masked_original}`;

      setFetchedImage(base64Mask);
      setMaskedOriginalImage(base64MaskedOriginal);

      setAsymmetryIndex(data.asymmetry_index);
      console.debug("Asymmetry Index:", data.asymmetry_index);
      setBorderIrregularity(data.border_irregularity);
      setColorVariety(data.color_variety);
      setMatchedColors(data.matched_color_codes);
      setLoading(false);
      Alert.alert("Success", "Detailed shape analysis saved successfully!");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Upload failed",
        "Could not generate segmentation mask, please try again."
      );
    }
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      {!fetchedImage && (
        <>
          <Image
            source={{ uri: fetchedImage || imageUri }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={{ color: "#fff" }}>Analyze spot</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      )}
      {fetchedImage && (
        <>
          <View style={styles.imageRow}>
            <Image source={{ uri: fetchedImage }} style={styles.smallImage} />
            <Image
              source={{ uri: maskedOriginalImage }}
              style={styles.smallImage}
            />
          </View>

          <View style={styles.textBlock}>
            {[
              { label: "Asymmetry Index", value: asymmetryIndex },
              { label: "Border Irregularity", value: borderIrregularity },
              { label: "Color Variety", value: colorVariety },
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
                      fontSize: 20,
                    }}
                  >
                    {message}
                  </Text>
                </View>
              );
            })}
            {matchedColors.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {matchedColors.map((rgb, index) => {
                  const [r, g, b] = rgb.map((c) => Math.round(c * 255));
                  const backgroundColor = `rgb(${r},${g},${b})`;

                  return (
                    <View
                      key={index}
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor,
                        margin: 2,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 4,
                      }}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textBlock: {
    marginTop: 50,
    paddingHorizontal: 10,
  },
  paragraph: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 10,
  },

  container: {
    alignItems: "center",
    marginTop: 20,
    padding: 0,
    backgroundColor: "#F0F4F8",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 0,
  },
  smallImage: {
    width: 200,
    height: 220,
    borderRadius: 0,
    marginHorizontal: 5,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#98ABEE",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

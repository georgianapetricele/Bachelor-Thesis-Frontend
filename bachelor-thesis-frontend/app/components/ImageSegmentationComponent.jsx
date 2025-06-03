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
import RiskBar from "./RiskBarComponent";

export default function ImageSegmentationComponent({ imageUri }) {
  const API_BASE_URL = "http://172.20.10.13:5000";
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [maskedOriginalImage, setMaskedOriginalImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [asymmetryIndex, setAsymmetryIndex] = useState(null);
  const [borderIrregularity, setBorderIrregularity] = useState(null);
  const [colorVariety, setColorVariety] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (imageUri) {
      setImage(imageUri);
      console.debug("Image URI:", imageUri);
    }
  }, [imageUri]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.debug("Image URI:", result.assets[0].uri);
      Alert.alert("Image Selected", "You have successfully selected an image.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "We need access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // var final 2 const handleUpload = async () => {
  //   if (!image) {
  //     Alert.alert("No image", "Please pick or take an image first.");
  //     return;
  //   }

  //   const formData = new FormData();

  //   const uriParts = image.split("/");
  //   const fileName = uriParts[uriParts.length - 1];

  //   formData.append("image", {
  //     uri: image,
  //     name: fileName,
  //     type: "image/jpeg",
  //   });

  //   try {
  //     console.log("Uploading image:", image);

  //     const response = await fetch("http://192.168.1.8:5000/image/upload", {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Server responded with ${response.status}: ${errorText}`
  //       );
  //     }

  //     const data = await response.json();
  //     setImageId(data.imageId);
  //     setFetchedImage(null); // Reset fetched image
  //     Alert.alert("Success", `Uploaded: ${data.filename} ${data.image_id}`);
  //     //await handleFetchImage();
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     Alert.alert("Upload failed", error.message || "Something went wrong");
  //   }
  // };

  const handleUpload = async () => {
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

    try {
      console.log("Uploading image:", image);

      const response = await fetch(`${API_BASE_URL}/image/segment`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const data = await response.json(); // 👈 parse JSON

      const base64Mask = `data:image/png;base64,${data.segmentation_mask}`;
      const base64MaskedOriginal = `data:image/png;base64,${data.masked_original}`;

      setFetchedImage(base64Mask);
      setMaskedOriginalImage(base64MaskedOriginal);

      setAsymmetryIndex(data.asymmetry_index);
      console.debug("Asymmetry Index:", data.asymmetry_index);
      setBorderIrregularity(data.border_irregularity);
      setColorVariety(data.color_variety);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", error.message || "Something went wrong");
    }
  };

  //  var final 1 const handleFetchImage = async () => {
  //   setLoading(true);
  //   try {
  //     // Simply use the URL directly
  //     setFetchedImage(`http://192.168.1.8:5000/prediction`);
  //     console.debug(fetchedImage);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     setLoading(false);
  //     Alert.alert("Error", "Failed to load image");
  //   }
  // };

  // const handleFetchImage = async (imageId) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`http://192.168.1.8:5000/${imageId}`);
  //     if (!response.ok) {
  //       throw new Error(`Server responded with ${response.status}`);
  //     }
  //     // Just check if the response was successful
  //     setFetchedImage(`http://192.168.1.8:5000/${imageId}`);
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     Alert.alert("Error", "Failed to load image");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!fetchedImage && (
        <>
          <Image
            source={{ uri: fetchedImage || imageUri }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={{ color: "#fff" }}>Generate segmentation mask</Text>
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

          {/* <RiskBar label="Asymmetry" score={asymmetryIndex} max={2.0} />
          <RiskBar
            label="Border Irregularity"
            score={borderIrregularity}
            max={3.0}
          />
          <RiskBar label="Color Variety" score={colorVariety} max={8.0} /> */}

          <View style={styles.textBlock}>
            <Text style={styles.paragraph}>
              Asymmetry Index: {asymmetryIndex}
            </Text>
            <Text style={styles.paragraph}>
              Border Irregularity: {borderIrregularity}
            </Text>
            <Text style={styles.paragraph}>Color Variety: {colorVariety}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textBlock: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  paragraph: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },

  container: {
    alignItems: "center",
    marginTop: 20,
    padding: 0,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  smallImage: {
    width: 200,
    height: 220,
    borderRadius: 10,
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

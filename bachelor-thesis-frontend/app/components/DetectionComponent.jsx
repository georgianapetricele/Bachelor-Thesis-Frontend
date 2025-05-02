import * as ImagePicker from "expo-image-picker";
import {
  TouchableOpacity,
  Image,
  View,
  Alert,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ImageDetectionComponent() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedImage, setFetchedImage] = useState(null); // base64 full image
  const [croppedImages, setCroppedImages] = useState([]); // array of base64 objects
  const [isModalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "We need access to your gallery.");
      return;
    }

    setFetchedImage(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      //console.debug("Image URI:", result.assets[0].uri);
      Alert.alert("Image Selected", "You have successfully selected an image.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "We need access to your camera.");
      return;
    }

    setFetchedImage(null);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!image) {
      Alert.alert("No image", "Please pick or take an image first.");
      return;
    }

    const formData = new FormData();
    const uriParts = image.split("/");
    const fileName = uriParts[uriParts.length - 1];

    formData.append("image", {
      uri: image,
      name: fileName,
      type: "image/png",
    });

    try {
      const response = await fetch("http://192.168.1.6:5000/image/detect", {
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

      const json = await response.json();
      //console.log("Response JSON:", json);
      const base64Image = `data:${json.mimetype};base64,${json.detected_image}`;
      const croppedImagesList = json.cropped_objects.map(
        (img) => `data:${json.mimetype};base64,${img}`
      );

      setFetchedImage(base64Image);
      setCroppedImages(croppedImagesList);
      //console.debug("Fetched image:", base64Image);
      //console.debug("Cropped images:", croppedImagesList);

      Alert.alert("Success", "Prediction received!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/DetailedAnalysis")}
      >
        <Text style={{ color: "#fff" }}>Detailed Analysis</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={{ color: "#fff" }}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>Pick from Gallery</Text>
      </TouchableOpacity>
      {/* {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={{ height: 10 }} />
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={{ color: "#fff" }}>Generate diagnosis</Text>
          </TouchableOpacity>
        </>
      )} */}

      {(fetchedImage || image) && (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: fetchedImage || image }}
              style={styles.image}
            />
          </TouchableOpacity>

          <View style={{ height: 10 }} />
          {!fetchedImage && (
            <TouchableOpacity style={styles.button} onPress={handleUpload}>
              <Text style={{ color: "#fff" }}>Generate diagnosis</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      )}
      {/* {fetchedImage && (
        <>
          <Text style={{ marginTop: 20, fontWeight: "bold" }}>
            Detected Image:
          </Text>
          <Image source={{ uri: fetchedImage }} style={styles.image} />
        </>
      )} */}

      {croppedImages.length > 0 && (
        <>
          <Text style={{ marginTop: 20, fontWeight: "bold" }}>
            Detected Objects:
          </Text>
          {croppedImages.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                router.push({
                  pathname: "/DetailedAnalysis",
                  params: { imageUri: img },
                })
              }
            >
              <Image
                source={{ uri: img }}
                style={{
                  width: 180,
                  height: 180,
                  marginTop: 10,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </>
      )}

      <Modal visible={isModalVisible} transparent={false}>
        <TouchableOpacity
          style={styles.fullscreenContainer}
          onPress={() => setModalVisible(false)}
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
              source={{ uri: fetchedImage || image }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  image: {
    width: 410,
    height: 350,
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#98ABEE",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
});

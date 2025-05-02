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

export default function SegmentationPredictionComponent({ imageUri }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [imageId, setImageId] = useState(null);

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

      const response = await fetch("http://192.168.1.6:5000/image/segment", {
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

      const blob = await response.blob();

      // Convert blob to a local URI you can use in an <Image> tag
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setFetchedImage(base64data); // base64 data URL
      };
      reader.readAsDataURL(blob); // This converts blob to data URL

      Alert.alert("Success", "Prediction received!");
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
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={{ color: "#fff" }}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>Pick from Gallery</Text>
      </TouchableOpacity>
      {/* {image && (
        <> */}
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={{ height: 10 }} />
      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={{ color: "#fff" }}>Generate segmentation mask</Text>
      </TouchableOpacity>
      {/* </>
      )} */}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      )}
      {fetchedImage && (
        <Image source={{ uri: fetchedImage }} style={styles.image} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 350,
    height: 300,
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
});

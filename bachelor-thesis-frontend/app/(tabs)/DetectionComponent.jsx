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
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../../FirebaseConfig";

export default function ImageDetectionComponent() {
  const API_BASE_URL = "http://172.20.10.13:5000";
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [croppedClasses, setCroppedClasses] = useState([]);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isZoomModalVisible, setZoomModalVisible] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [observations, setObservations] = useState("");

  const classInfo = {
    Melanoma:
      "Melanoma is a malignant neoplasm derived from melanocytes that may appear in different variants. If excised in an early stage it can be cured by simple surgical excision. Melanomas can be invasive or non-invasive (in situ), non-pigmented, subungual, ocular or mucosal melanoma. Melanomas are usually, albeit not always, chaotic, and some melanoma specific criteria depend on anatomic site.",
    "Basal Cell Carcinoma":
      "Basal cell carcinoma is a common variant of epithelial skin cancer that rarely metastasizes but grows destructively if untreated. It appears in different morphologic variants (flat, nodular, pigmented, cystic)",
    "Melanocytic nevi":
      "Melanocytic nevi are benign neoplasms of melanocytes and appear in a myriad of variants. The variants may differ significantly from a dermatoscopic point of view. In contrast to melanoma they are usually symmetric with regard to the distribution of color and structure",
    "Benign keratosis":
      '"Benign keratosis" is a generic class that includes seborrheic keratoses ("senile wart"), solar lentigo - which can be regarded a flat variant of seborrheic keratosis - and lichen-planus like keratoses (LPLK), which corresponds to a seborrheic keratosis or a solar lentigo with inflammation and regression',
    "Actinic Keratoses (Solar Keratoses)":
      "Actinic Keratoses (Solar Keratoses) and Intraepithelial Carcinoma (Bowen’s disease) are common non-invasive, variants of squamous cell carcinoma that can be treated locally without surgery. Some authors regard them as precursors of squamous cell carcinomas and not as actual carcinomas. There is, however, agreement that these lesions may progress to invasive squamous cell carcinoma – which is usually not pigmented. Both neoplasms commonly show surface scaling and commonly are devoid of pigment. Actinic keratoses are more common on the face and Bowen’s disease is more common on other body sites. Because both types are induced by UV-light the surrounding skin is usually typified by severe sun damaged except in cases of Bowen’s disease that are caused by human papilloma virus infection and not by UV.",
    Dermatofibroma:
      "Dermatofibroma is a benign skin lesion regarded as either a benign proliferation or an inflammatory reaction to minimal trauma.",
    "Vascular skin lesion":
      "Vascular skin lesions range from cherry angiomas to angiokeratomas and pyogenic granulomas. Hemorrhage is also included in this category. Angiomas are dermatoscopically characterized by red or purple color and solid, well circumscribed structures known as red clods or lacunes.",
  };

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
      const response = await fetch(`${API_BASE_URL}/image/detect`, {
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

      const base64Image = `data:${json.mimetype};base64,${json.detected_image}`;
      const croppedImagesList = json.cropped_objects.map(
        (img) => `data:${json.mimetype};base64,${img}`
      );

      const croppedClassesList = json.classes;

      setFetchedImage(base64Image);
      setCroppedImages(croppedImagesList);
      setCroppedClasses(croppedClassesList);

      Alert.alert("Success", "Prediction received!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", error.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleSaveExamination = async () => {
    if (!patientName.trim()) {
      Alert.alert("Missing name", "Please enter patient name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/examination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientName,
          patientEmail: patientEmail,
          observations: observations,
          doctorUid: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
          detectionPredictionImage: fetchedImage,
        }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      Alert.alert("Success", "Examination saved!");
      setSaveModalVisible(false);
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", err.message || "Failed to save examination");
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="close" size={40} color="#5C3DAC" />
      </TouchableOpacity>
      <Text style={styles.title}>Analyze multiple spots</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <MaterialIcons
            name="photo-camera"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <MaterialIcons
            name="photo-library"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity onPress={() => setZoomModalVisible(true)}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSaveModalVisible(true)}
          >
            <Text style={styles.buttonText}>Save Examination</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 20, fontWeight: "bold" }}>
            Select a lesion for shape analysis:
          </Text>
          {croppedImages.map((img, idx) => {
            const className = croppedClasses[idx] || "Unknown";
            const description =
              classInfo[className] || "No description available.";

            return (
              <View key={idx} style={styles.imageContainer}>
                <TouchableOpacity
                  style={styles.infoContainer}
                  onPress={() => {
                    setSelectedImageInfo({
                      className,
                      description,
                    });
                    setInfoModalVisible(true);
                  }}
                >
                  <Text style={styles.classLabel}>{className}</Text>
                  <MaterialIcons
                    name="info-outline"
                    size={20}
                    color="#1D24CA"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "../screens/DetailedAnalysisScreen",
                      params: { imageUri: img },
                    })
                  }
                >
                  <Image
                    source={{ uri: img }}
                    style={{
                      width: 280,
                      height: 230,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

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
              source={{ uri: fetchedImage || image }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isInfoModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModal}>
            <Text style={styles.modalTitle}>
              {selectedImageInfo?.className || "Class Information"}
            </Text>
            <Text>
              {selectedImageInfo?.description || "No description available."}
            </Text>
            <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isSaveModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModal}>
            <Text style={styles.modalTitle}>Save Examination</Text>

            <Text style={styles.label}>Patient Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient name"
              value={patientName}
              onChangeText={setPatientName}
            />

            <Text style={styles.label}>Patient Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient email"
              value={patientEmail}
              onChangeText={setPatientEmail}
            />

            <Text style={styles.label}>Observations:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter observations about the examination"
              value={observations}
              onChangeText={setObservations}
              multiline={true}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveExamination}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSaveModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 50,
    width: "100%",
  },
  title: {
    fontSize: 30,
    color: "#1D24CA",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "lexend",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 400,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  classLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    textAlign: "right",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#1D24CA",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeText: {
    color: "blue",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 18,
    color: "#555555",
    textAlign: "left",
    lineHeight: 24,
    fontFamily: "lexend",
    marginBottom: 5,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "90%",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 5,
    width: "90%",
    height: 100,
    textAlignVertical: "top",
  },
});

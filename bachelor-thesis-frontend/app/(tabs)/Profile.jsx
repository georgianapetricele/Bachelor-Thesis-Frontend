import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { auth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);

      AsyncStorage.multiGet(["fullName", "clinicName"])
        .then((values) => {
          const savedFullName = values[0][1];
          const savedClinicName = values[1][1];
          if (savedFullName) setFullName(savedFullName);
          if (savedClinicName) setClinicName(savedClinicName);
        })
        .catch((error) => {
          console.error("Error loading profile from storage:", error);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); //login screen
    } catch (error) {
      console.log(error);
      Alert.alert("Logout failed: " + error.message);
    }
  };

  const handleUpdateProfile = () => {
    if (!fullName.trim() || !clinicName.trim()) {
      Alert.alert(
        "Incomplete fields",
        "Please enter both your full name and clinic name before updating your profile."
      );
      return;
    }

    AsyncStorage.multiSet([
      ["fullName", fullName],
      ["clinicName", clinicName],
    ]);

    fetch("http://192.168.1.6:5000/doctor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid: auth.currentUser.uid,
        fullName: fullName,
        clinicName: clinicName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        Toast.show({
          type: "success",
          text1: "Profile updated",
          text2: "Your profile has been successfully updated.",
          topOffset: 80,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: "Could not update profile. Please try again.",
          topOffset: 80,
        });
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Logged in as:</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
        />

        <Text style={styles.label}>Clinic Name:</Text>
        <TextInput
          style={styles.input}
          value={clinicName}
          onChangeText={setClinicName}
          placeholder="Enter clinic name"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => {
              Alert.alert(
                "Confirm profile update",
                "Are you sure you want to update your profile?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Update profile",
                    style: "destructive",
                    onPress: handleUpdateProfile,
                  },
                ]
              );
            }}
          >
            <Text style={styles.logoutText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                "Confirm Logout",
                "Are you sure you want to log out?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Log Out",
                    style: "destructive",
                    onPress: handleLogout,
                  },
                ]
              );
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  card: {
    width: "98%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 50,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 35,
    color: "#1D24CA",
    textAlign: "left",
    marginBottom: 50,
    fontFamily: "lexend",
  },

  email: {
    fontSize: 18,
    color: "#3C4858",
    marginBottom: 30,
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: "#1D24CA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 20,
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 18,
    color: "#555555",
    textAlign: "left",
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: "lexend",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#1D24CA",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

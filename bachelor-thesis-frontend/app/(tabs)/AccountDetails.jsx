// app/(tabs)/Account.jsx

import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { auth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function AccountDetails() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // go back to login screen
    } catch (error) {
      console.log(error);
      Alert.alert("Logout failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.email}>Logged in as: {userEmail}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" color="#E53935" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A237E",
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    color: "#3C4858",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "60%",
  },
});

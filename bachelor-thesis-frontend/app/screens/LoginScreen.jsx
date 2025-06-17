import React from "react";
import {
  Text,
  TextInput,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "../API_BASE_URL";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.debug("User already logged in:", user);
        router.replace("/(tabs)/Home");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.debug("User signed in:", user);
      if (user) router.replace("/(tabs)/Home");
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Log in failed",
        text2: getFriendlyErrorMessage(error),
        topOffset: 80,
      });
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.debug("User created:", user);
      if (user) {
        console.debug(user.user.uid);
        console.debug(user.user.email);
        const response = await fetch(`${API_BASE_URL}/doctor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.user.email,
            uuid: user.user.uid,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          Toast.show({
            type: "error",
            text1: "Backend error",
            text2: errorData.message,
            topOffset: 80,
          });
          return;
        }

        console.log("Doctor created in backend");
        router.replace("/(tabs)/Home");
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: getFriendlyErrorMessage(error),
        topOffset: 80,
      });
    }
  };

  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/invalid-credential":
        return "No account found";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password.";
      case "auth/missing-password":
        return "Please enter a password.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.text}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
        <Toast />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1A237E",
  },
  textInput: {
    height: 50,
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 25,
    fontSize: 16,
    color: "#3C4858",
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    width: "80%",
    marginVertical: 15,
    backgroundColor: "#1D24CA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

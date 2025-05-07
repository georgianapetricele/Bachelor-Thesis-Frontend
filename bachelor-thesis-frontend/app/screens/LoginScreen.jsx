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
import { router } from "expo-router";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

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

    return unsubscribe; // clean up listener
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
        const response = await fetch("http://192.168.1.6:5000/doctor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.user.email,
            uuid: user.user.uid, // Firebase UID
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
    backgroundColor: "#FAFAFA",
    // A softer white for a modern, minimalist background
  },
  title: {
    fontSize: 30, // A bit larger for a more striking appearance
    fontWeight: "800", // Extra bold for emphasis
    marginBottom: 20, // Increased space for a more airy, open feel
    color: "#1A237E", // A deep indigo for a sophisticated, modern look
  },
  textInput: {
    height: 50, // Standard height for elegance and simplicity
    width: "80%", // Full width for a more expansive feel
    backgroundColor: "#FFFFFF", // Pure white for contrast against the container
    borderColor: "#E8EAF6", // A very light indigo border for subtle contrast
    borderWidth: 2,
    borderRadius: 15, // Softly rounded corners for a modern, friendly touch
    marginVertical: 15,
    paddingHorizontal: 25, // Generous padding for ease of text entry
    fontSize: 16, // Comfortable reading size
    color: "#3C4858", // A dark gray for readability with a hint of warmth
    shadowColor: "#9E9E9E", // A medium gray shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Slightly elevated for a subtle 3D effect
  },
  button: {
    width: "80%",
    marginVertical: 15,
    backgroundColor: "#1D24CA", // A lighter indigo to complement the title color
    padding: 15,
    borderRadius: 15, // Matching rounded corners for consistency
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0", // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF", // Maintained white for clear visibility
    fontSize: 18, // Slightly larger for emphasis
    fontWeight: "600", // Semi-bold for a balanced weight
  },
});

// import React from "react";
// import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {"\n"}
//         {"\n"}DermaScan
//       </Text>

//       <View style={styles.imageContainer}>
//         <Image
//           source={require("./../assets/images/logo.png")}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       </View>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/(tabs)/Home")}
//       >
//         <Text style={styles.buttonText}>Get started</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//     fontFamily: "lexend",
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#DFB8E5",
//     textTransform: "uppercase",
//     fontFamily: "lexend",
//     marginBottom: 15,
//     marginTop: 50,
//   },
//   title: {
//     fontSize: 50,
//     color: "#1D24CA",
//     textAlign: "left",
//     marginTop: "15%",
//     marginBottom: "30%",
//     lineHeight: 36,
//     fontFamily: "lexend",
//   },
//   imageContainer: {
//     width: "100%",
//     height: 300,
//     marginBottom: 50,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   button: {
//     backgroundColor: "#1D24CA",
//     width: 200,
//     height: 60,
//     paddingVertical: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     marginLeft: 100,
//     marginTop: 80,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontFamily: "lexend",
//   },
// });

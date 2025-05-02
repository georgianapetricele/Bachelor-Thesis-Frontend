import { useRouter } from "expo-router";
import { useEffect } from "react";
import { auth } from "../FirebaseConfig";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/(tabs)/Home");
      } else {
        router.replace("/screens/LoginScreen");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1D24CA" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

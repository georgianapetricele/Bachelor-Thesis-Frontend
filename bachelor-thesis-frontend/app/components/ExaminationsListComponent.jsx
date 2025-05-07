import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ExaminationsListComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch("http://192.168.1.6:5000/examination")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error("Error fetching examinations:", error);
          Alert.alert("Error", "Could not load examinations.");
        })
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const renderExaminationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`../screens/ExaminationDetails/${item.id}`);
      }}
    >
      <Text style={styles.title}>
        Examination: {item.created_at.slice(0, 19).replace("T", " ")}
      </Text>
      <Text style={styles.subtitle}>Patient: {item.patient_name}</Text>
      <Text style={styles.subtitle}>
        Observations: {item.observations || "None"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderExaminationCard}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    padding: 30,
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 18,
    color: "#555",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ExaminationCard({ title, patient_name }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{patient_name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 15,
    height: 150,
    width: 350,
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

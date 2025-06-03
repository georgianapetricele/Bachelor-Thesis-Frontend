import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RiskBar = ({ label, score, max = 1.0 }) => {
  const normalizedScore = Math.min(score / max, 1.0);
  const indicatorLeft = `${normalizedScore * 100}%`;

  return (
    <View style={{ marginVertical: 10, width: "90%" }}>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{label}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Text style={{ fontSize: 12, color: "green" }}>Benign</Text>
        <Text style={{ fontSize: 12, color: "orange" }}>Uncertain</Text>
        <Text style={{ fontSize: 12, color: "red" }}>Malignant</Text>
      </View>
      <View style={styles.riskBar}>
        <View style={[styles.indicator, { left: indicatorLeft }]} />
      </View>
      <Text style={{ alignSelf: "center", marginTop: 4 }}>
        Score: {score.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  riskBar: {
    height: 10,
    width: "100%",
    backgroundColor: "linear-gradient(to right, green, yellow, red)", // react-native doesn't support this directly
    backgroundColor: "#ddd", // fallback
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: -6,
    width: 10,
    height: 22,
    borderRadius: 5,
    backgroundColor: "black",
  },
});

export default RiskBar;

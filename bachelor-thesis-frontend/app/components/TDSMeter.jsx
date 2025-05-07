import { View, Text } from "react-native";
import { Svg, Rect, Line } from "react-native-svg";

export const TDSMeter = ({ score }) => {
  const barWidth = 300;
  const benignWidth = (4.75 / 10) * barWidth;
  const malignantStart = (5.45 / 10) * barWidth;
  const markerX = Math.min((score / 10) * barWidth, barWidth);

  let status = "Benign";
  if (score >= 5.45) status = "Malignant";
  else if (score >= 4.75) status = "Suspicious";

  return (
    <View style={{ alignItems: "center", margin: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Total Dermoscopy Score: {score.toFixed(2)}
      </Text>
      <Svg height="30" width={barWidth}>
        <Rect x="0" y="0" width={benignWidth} height="20" fill="green" />
        <Rect
          x={benignWidth}
          y="0"
          width={malignantStart - benignWidth}
          height="20"
          fill="yellow"
        />
        <Rect
          x={malignantStart}
          y="0"
          width={barWidth - malignantStart}
          height="20"
          fill="red"
        />
        <Line
          x1={markerX}
          x2={markerX}
          y1="0"
          y2="20"
          stroke="black"
          strokeWidth="3"
        />
      </Svg>
      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Classification: <Text style={{ fontWeight: "bold" }}>{status}</Text>
      </Text>
    </View>
  );
};

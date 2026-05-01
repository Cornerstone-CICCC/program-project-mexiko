import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import React from "react";

type SpacerProps = {
  width?: number | string;
  height?: number | string;
};

const Spacer: React.FC<SpacerProps> = ({
  width = "100%" as any,
  height = 40 as any,
}) => {
  const viewStyle: StyleProp<ViewStyle> = { width, height };
  return <View style={[viewStyle]} />;
};

export default Spacer;

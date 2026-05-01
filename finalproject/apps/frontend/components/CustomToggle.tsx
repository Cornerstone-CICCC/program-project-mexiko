import { Pressable, StyleSheet, View } from "react-native";

type CustomToggleProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export default function CustomToggle({
  value,
  onValueChange,
  disabled = false,
}: CustomToggleProps) {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        onValueChange?.(!value);
      }}
      hitSlop={10}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 54,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  track: {
    width: 54,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    position: "relative",
  },

  trackOn: {
    backgroundColor: "#34C759",
  },

  trackOff: {
    backgroundColor: "#D1D5DB",
  },

  thumb: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    top: 3,
  },

  thumbOn: {
    left: 25,
  },

  thumbOff: {
    left: 3,
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },
});
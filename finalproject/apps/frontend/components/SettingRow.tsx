import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type SettingRowProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  rightText?: string;
  danger?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

export default function SettingRow({
  label,
  icon,
  onPress,
  rightText,
  danger = false,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        danger && styles.dangerRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#FF3B30" : "#6B7280"}
          style={styles.icon}
        />
        <Text style={[styles.label, danger && styles.dangerText]}>{label}</Text>
      </View>

      {hasSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        <View style={styles.right}>
          {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={danger ? "#FF3B30" : "#B0B7C3"}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8EAF0",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dangerRow: {
    borderColor: "#FECACA",
  },
  pressed: {
    opacity: 0.9,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  dangerText: {
    color: "#FF3B30",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginRight: 6,
  },
});

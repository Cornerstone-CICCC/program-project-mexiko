import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomToggle from "@/components/CustomToggle";

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
  const isClickable = !hasSwitch;
  const hasSubtitle = Boolean(rightText && !hasSwitch);

  return (
    <Pressable
      onPress={isClickable ? onPress : undefined}
      style={({ pressed }) => [
        styles.row,
        hasSwitch
          ? styles.rowWithToggle
          : hasSubtitle
          ? styles.rowWithSubtitle
          : styles.rowSingleLine,
        pressed && isClickable && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.left,
          hasSwitch && styles.leftWithToggle,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons
            name={icon}
            size={22}
            color={danger ? "#FF453A" : "#8A94A6"}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[styles.label, danger && styles.dangerText]}
            numberOfLines={1}
          >
            {label}
          </Text>

          {hasSubtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {rightText}
            </Text>
          )}
        </View>
      </View>

      {hasSwitch && (
        <View style={styles.switchWrapper}>
          <CustomToggle
            value={switchValue}
            onValueChange={onSwitchChange}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
  },

  rowSingleLine: {
    minHeight: 86,
  },

  rowWithSubtitle: {
    minHeight: 98,
  },

  rowWithToggle: {
    minHeight: 86,
  },

  pressed: {
    opacity: 0.6,
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  leftWithToggle: {
    paddingRight: 84, // reserva espacio para el toggle
  },

  iconWrapper: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingVertical: 14,
  },

  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#9CA3AF",
  },

  dangerText: {
    color: "#FF453A",
  },

  switchWrapper: {
    position: "absolute",
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

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
        hasSubtitle ? styles.rowWithSubtitle : styles.rowSingleLine,
        pressed && isClickable && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name={icon}
            size={22}
            color={danger ? "#FF453A" : "#7C8395"}
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
          <Switch
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
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
  },

  rowSingleLine: {
    minHeight: 68,
  },

  rowWithSubtitle: {
    minHeight: 96,
  },

  pressed: {
    opacity: 0.55,
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  iconWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingVertical: 10,
  },

  label: {
    fontSize: 17,
    fontWeight: "500",
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
    marginLeft: 12,
    width: 56,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
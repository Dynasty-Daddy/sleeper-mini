import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DynastyDaddyTheme from '../models/DynastyDaddyTheme';

const Chip = ({ label, onPress, active, clickable = true, color = {}, alwaysActive = false }) => {
  const [isActive, setIsActive] = useState(active);

  const handlePress = () => {
    if (!alwaysActive)
      setIsActive(!isActive);
    onPress && onPress();
  };

  const colorStyle = styles[color] || {};

  return (
    <TouchableOpacity
      style={[styles.container,
      isActive && styles.activeContainer,
      alwaysActive && styles.alwaysActiveContainer,
      colorStyle,
      ]}
      onPress={handlePress}
      disabled={!clickable}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DynastyDaddyTheme.backgroundCard,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: DynastyDaddyTheme.accentLight,
    color: DynastyDaddyTheme.accentLight,
  },
  activeContainer: {
    backgroundColor: DynastyDaddyTheme.accent,
  },
  alwaysActiveContainer: {
    backgroundColor: DynastyDaddyTheme.primary
  },
  label: {
    color: '#333',
    fontSize: 14,
    fontWeight: "bold",
  },
  activeLabel: {
    color: DynastyDaddyTheme.primaryText,
  },
  green: {
    backgroundColor: '#9DC700',
  },
  yellow: {
    backgroundColor: '#c59700',
  },
  orange: {
    backgroundColor: '#FF5733',
  },
  red: {
    backgroundColor: '#C70039',
  },
  darkRed: {
    backgroundColor: '#900C3F',
  },
});

export default Chip;

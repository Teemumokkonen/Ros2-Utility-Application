// JoyStick.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

const Joystick = ({
  size = 120,
  onMove = () => {},
  onStart = () => {},
  onEnd = () => {},
  disabled = false,
  dragEnabled = true,
  onPress = () => {},
}) => {
  const radius = size / 2;
  const stickRadius = size / 4;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [active, setActive] = useState(false);

  const limitToCircle = (x, y) => {
    const dist = Math.sqrt(x * x + y * y);
    if (dist > radius - stickRadius) {
      const angle = Math.atan2(y, x);
      return {
        x: Math.cos(angle) * (radius - stickRadius),
        y: Math.sin(angle) * (radius - stickRadius),
      };
    }
    return { x, y };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        console.log("stick disable", disabled);
        if (disabled) return;
        setActive(true);
        onStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (disabled) return;
        let { dx, dy } = gestureState;
        // Limit dx, dy inside the circle radius
        const limited = limitToCircle(dx, dy);
        pan.setValue({ x: limited.x, y: limited.y });

        // Normalize between -1 and 1
        const normalizedX = limited.x / (radius - stickRadius);
        const normalizedY = limited.y / (radius - stickRadius);

        onMove({ x: normalizedX, y: normalizedY });
      },
      onPanResponderRelease: () => {
        if (disabled) return;
        setActive(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        onEnd();
        onMove({ x: 0, y: 0 });
      },
      onPanResponderTerminate: () => {
        if (disabled) return;
        setActive(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        onEnd();
        onMove({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: radius },
        disabled && styles.disabled,
      ]}
      {...(dragEnabled ? panResponder.panHandlers : {})}
      onStartShouldSetResponder={() => true}
      onResponderStart={onPress}
    >
      <View
        style={[
          styles.baseCircle,
          { width: size, height: size, borderRadius: radius },
          active && styles.activeBase,
        ]}
      />
      <Animated.View
        style={[
          styles.stick,
          {
            width: stickRadius * 2,
            height: stickRadius * 2,
            borderRadius: stickRadius,
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
          active && styles.activeStick,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseCircle: {
    backgroundColor: '#bbb',
  },
  activeBase: {
    backgroundColor: '#999',
  },
  stick: {
    position: 'absolute',
    backgroundColor: '#007AFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  activeStick: {
    backgroundColor: '#005BBB',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Joystick;

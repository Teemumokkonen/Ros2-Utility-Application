import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder } from 'react-native';

const Draggable = ({
  id,
  children,
  dragDisabled = false,
  position = { x: 0, y: 0 },
  onDrag,
  onPress,
  style = {},
  bounds = null,
}) => {
  const pan = useRef(new Animated.ValueXY(position)).current;
  const lastTap = useRef(0);

  // Update pan position when `position` prop changes
  useEffect(() => {
    pan.setValue(position);
  }, [position]);

  const constrainToBounds = (x, y) => {
    if (!bounds) return { x, y };
    return {
      x: Math.max(bounds.minX ?? 0, Math.min(x, bounds.maxX ?? x)),
      y: Math.max(bounds.minY ?? 0, Math.min(y, bounds.maxY ?? y)),
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if (!dragDisabled) {
          if (onPress) {
            onPress();
          }
        }
        console.log("allowed to move: ", !dragDisabled);
        return !dragDisabled;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!dragDisabled) return false;
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => false,

      onPanResponderGrant: () => {
        console.log("grant");
        if (!dragDisabled) {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
          pan.setValue({ x: 0, y: 0 });
        }
      },

      onPanResponderMove: (_, gestureState) => {
        console.log("moviong");
        if (dragDisabled) return;

        let newX = gestureState.dx;
        let newY = gestureState.dy;

        //if (bounds) {
        //  const currentX = pan.x._offset + gestureState.dx;
        //  const currentY = pan.y._offset + gestureState.dy;
        //  const constrained = constrainToBounds(currentX, currentY);
        //  newX = constrained.x - pan.x._offset;
        //  newY = constrained.y - pan.y._offset;
        //}

        pan.setValue({ x: newX, y: newY });
      },

      onPanResponderRelease: (_, gestureState) => {
        if (!dragDisabled) {
          pan.flattenOffset();

          pan.stopAnimation(({ x, y }) => {
            let finalX = x;
            let finalY = y;
            
            // Then constrain
            //const constrained = constrainToBounds(finalX, finalY);
            //finalX = constrained.x;
            //finalY = constrained.y;

            Animated.spring(pan, {
              toValue: { x: finalX, y: finalY },
              useNativeDriver: false,
            }).start();

            if (onDrag) {
              onDrag({ id, x: finalX, y: finalY });
            }
          });
        }
      },

      onPanResponderEnd: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const isTap = Math.abs(dx) < 5 && Math.abs(dy) < 5;

        if (isTap && onPress) {
          const now = Date.now();
          const isDoubleTap = now - lastTap.current < 300;
          lastTap.current = now;
          onPress({ isDoubleTap });
        }
      },

      onPanResponderTerminate: () => {
        if (dragDisabled) {
          pan.flattenOffset();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          transform: pan.getTranslateTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default Draggable;

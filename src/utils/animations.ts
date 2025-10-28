import { Animated, Easing } from 'react-native';

export const createScaleAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  duration: number = 300
) => {
  return Animated.spring(animatedValue, {
    toValue,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  });
};

export const createFadeAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  duration: number = 300
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const createSuccessAnimation = (scaleValue: Animated.Value) => {
  return Animated.sequence([
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }),
    Animated.spring(scaleValue, {
      toValue: 1.05,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }),
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }),
  ]);
};

export const createRippleAnimation = (opacityValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(opacityValue, {
        toValue: 0.3,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ])
  );
};
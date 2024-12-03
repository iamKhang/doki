import React, { useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Box } from "@/components/ui/box";

interface DoubleTapHeartProps {
  onAnimationEnd: () => void;
}

const DoubleTapHeart = ({ onAnimationEnd }: DoubleTapHeartProps) => {
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 10,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        delay: 500,
      }),
    ]).start(() => {
      onAnimationEnd();
    });
  }, []);

  return (
    <Box className="absolute inset-0 items-center justify-center">
      <Animated.View
        style={[
          styles.heart,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}>
        <Heart size={100} color="#ff2d55" fill="#ff2d55" />
      </Animated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  heart: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DoubleTapHeart;

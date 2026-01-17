import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleGetStarted = () => {
    navigation.navigate("RoleSelection");
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          },
        ]}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.illustrationContainer}
        >
          <Image
            source={require("../../assets/images/masjid-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.textContainer}
        >
          <ThemedText type="h1" style={styles.title}>
            Welcome to{" "}
            <ThemedText type="h1" style={styles.titleAccent}>
              JDSA
            </ThemedText>
          </ThemedText>
          <ThemedText type="h1" style={styles.titleAccent}>
            Administrator App
          </ThemedText>
          
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, { backgroundColor: theme.textSecondary + "40" }]} />
            <View style={[styles.dotActive, { backgroundColor: theme.textSecondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.textSecondary + "40" }]} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.buttonContainer}
        >
          <AnimatedPressable
            onPress={handleGetStarted}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.button,
              animatedButtonStyle,
            ]}
            testID="button-get-started"
          >
            <ThemedText style={styles.buttonText}>Find Your Account</ThemedText>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </AnimatedPressable>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 400,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  titleAccent: {
    textAlign: "center",
    color: "#1B7340",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: "#1B7340",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
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
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
          },
        ]}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.illustrationContainer}
        >
          <View
            style={[
              styles.illustrationBackground,
              { backgroundColor: isDark ? "#2A2C2E" : "#FDF6E3" },
            ]}
          >
            <Image
              source={require("../../assets/images/welcome-illustration.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.textContainer}
        >
          <ThemedText type="h1" style={styles.title}>
            Innovative learning
          </ThemedText>
          <ThemedText type="h1" style={[styles.title, { color: Colors.light.accent }]}>
            modern learner
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Manage your educational journey with ease. Access grades, schedules, and stay connected.
          </ThemedText>
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
            <View style={styles.buttonInner}>
              <ThemedText style={styles.buttonText}>Let's go</ThemedText>
            </View>
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
    maxHeight: 360,
  },
  illustrationBackground: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius["2xl"],
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  illustration: {
    width: "90%",
    height: "90%",
  },
  textContainer: {
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
  button: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: "#8B1538",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonInner: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "linear-gradient(180deg, #C41E3A 0%, #8B1538 100%)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

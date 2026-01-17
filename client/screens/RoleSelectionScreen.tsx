import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
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
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RoleCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  delay: number;
  color: string;
}

function RoleCard({ title, description, icon, onPress, delay, color }: RoleCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.roleCard,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
          animatedStyle,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
          <Feather name={icon} size={32} color={color} />
        </View>
        <View style={styles.roleContent}>
          <ThemedText type="h3" style={styles.roleTitle}>
            {title}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.roleDescription, { color: theme.textSecondary }]}
          >
            {description}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={24} color={theme.textSecondary} />
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

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
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.header}
        >
          <ThemedText type="h1" style={styles.title}>
            Welcome
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Choose how you would like to continue
          </ThemedText>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <RoleCard
            title="Student Login"
            description="Access your grades, schedule, and profile"
            icon="user"
            color={Colors.light.primary}
            onPress={() => navigation.navigate("StudentLogin")}
            delay={300}
          />

          <RoleCard
            title="Admin Portal"
            description="Manage students and administrative tasks"
            icon="shield"
            color={Colors.light.accent}
            onPress={() => navigation.navigate("AdminLogin")}
            delay={400}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.footer}
        >
          <ThemedText
            type="small"
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Student Administrative System
          </ThemedText>
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
  },
  header: {
    marginBottom: Spacing["4xl"],
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  cardsContainer: {
    gap: Spacing.lg,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    lineHeight: 20,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
});

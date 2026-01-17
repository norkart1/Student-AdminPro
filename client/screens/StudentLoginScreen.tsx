import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { apiRequest } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StudentLoginScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentIdFocused, setStudentIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please enter your student ID and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/student/login", {
        studentId: studentId.trim(),
        password: password.trim(),
      });
      const data = await response.json();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.reset({
        index: 0,
        routes: [{ name: "StudentDashboard", params: { student: data.student } }],
      });
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing["2xl"],
          paddingBottom: insets.bottom + Spacing["2xl"],
        },
      ]}
    >
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.header}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: Colors.light.primary + "15" },
          ]}
        >
          <Feather name="user" size={40} color={Colors.light.primary} />
        </View>
        <ThemedText type="h2" style={styles.title}>
          Student Login
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.form}
      >
        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Student ID
          </ThemedText>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: studentIdFocused ? Colors.light.primary : theme.border,
              },
            ]}
          >
            <Feather
              name="hash"
              size={20}
              color={studentIdFocused ? Colors.light.primary : theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your student ID"
              placeholderTextColor={theme.textSecondary}
              value={studentId}
              onChangeText={setStudentId}
              onFocus={() => setStudentIdFocused(true)}
              onBlur={() => setStudentIdFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              testID="input-student-id"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Password
          </ThemedText>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: passwordFocused ? Colors.light.primary : theme.border,
              },
            ]}
          >
            <Feather
              name="lock"
              size={20}
              color={passwordFocused ? Colors.light.primary : theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              testID="input-password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <AnimatedPressable
          onPress={handleLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          style={[
            styles.loginButton,
            { backgroundColor: Colors.light.primary, opacity: isLoading ? 0.7 : 1 },
            animatedButtonStyle,
          ]}
          testID="button-login"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          )}
        </AnimatedPressable>

        <View style={styles.footerLinks}>
          <Pressable 
            onPress={() => navigation.navigate("AdminLogin")}
            style={styles.adminLink}
          >
            <ThemedText style={styles.adminLinkText}>
              Admin Login
            </ThemedText>
          </Pressable>

          <View style={styles.legalLinks}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Privacy Policy</ThemedText>
            <View style={[styles.dot, { backgroundColor: theme.textSecondary + "40" }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Terms of Service</ThemedText>
          </View>
        </View>
      </Animated.View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: Spacing.xs,
    color: "#1a1a1a",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    backgroundColor: "#f8f9fa",
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: "100%",
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotPassword: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  forgotPasswordText: {
    fontWeight: "500",
  },
  footerLinks: {
    marginTop: 40,
    alignItems: "center",
    gap: Spacing.xl,
  },
  footerText: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
  adminLink: {
    paddingVertical: Spacing.sm,
  },
  adminLinkText: {
    color: "#1B7340",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

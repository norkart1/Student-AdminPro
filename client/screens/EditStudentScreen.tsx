import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
type RouteProps = RouteProp<RootStackParamList, "EditStudent">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EditStudentScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();

  const student = route.params?.student;

  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    age: student?.age || "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Name and email are required");
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("PUT", `/api/students/${student?.id}`, formData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Student updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to update student");
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
          paddingTop: headerHeight + Spacing.xl,
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
            styles.avatarContainer,
            { backgroundColor: Colors.light.primary + "15" },
          ]}
        >
          <Feather name="user" size={40} color={Colors.light.primary} />
        </View>
        <ThemedText type="small" style={{ color: Colors.light.primary }}>
          Student ID: {student?.studentId}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.form}
      >
        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Full Name
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="Enter full name"
            placeholderTextColor={theme.textSecondary}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Email
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="Enter email"
            placeholderTextColor={theme.textSecondary}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Phone
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="Enter phone number"
            placeholderTextColor={theme.textSecondary}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Age
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="Enter age"
            placeholderTextColor={theme.textSecondary}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            keyboardType="numeric"
          />
        </View>

        <AnimatedPressable
          onPress={handleUpdate}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          style={[
            styles.updateButton,
            { backgroundColor: Colors.light.primary, opacity: isLoading ? 0.7 : 1 },
            animatedButtonStyle,
          ]}
          testID="button-update"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.updateButtonText}>Save Changes</ThemedText>
          )}
        </AnimatedPressable>
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontWeight: "500",
    marginLeft: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  updateButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "StudentDashboard">;

interface InfoCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color: string;
  delay: number;
}

function InfoCard({ icon, label, value, color, delay }: InfoCardProps) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View
        style={[
          styles.infoCard,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <View style={[styles.infoIconContainer, { backgroundColor: color + "15" }]}>
          <Feather name={icon} size={20} color={color} />
        </View>
        <View style={styles.infoContent}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {label}
          </ThemedText>
          <ThemedText type="body" style={styles.infoValue}>
            {value}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

export default function StudentDashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();

  const student = route.params?.student;

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.profileHeader}
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: Colors.light.primary + "15" },
            ]}
          >
            <Feather name="user" size={48} color={Colors.light.primary} />
          </View>
          <ThemedText type="h2" style={styles.name}>
            {student?.name || "Student"}
          </ThemedText>
          <View style={styles.studentIdBadge}>
            <ThemedText
              type="small"
              style={[styles.studentIdText, { color: Colors.light.primary }]}
            >
              ID: {student?.studentId || "N/A"}
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.section}
        >
          <ThemedText type="h3" style={styles.sectionTitle}>
            Personal Information
          </ThemedText>

          <View style={styles.infoGrid}>
            <InfoCard
              icon="mail"
              label="Email"
              value={student?.email || "Not set"}
              color={Colors.light.primary}
              delay={300}
            />
            <InfoCard
              icon="phone"
              label="Phone"
              value={student?.phone || "Not set"}
              color={Colors.light.success}
              delay={350}
            />
            <InfoCard
              icon="calendar"
              label="Age"
              value={student?.age ? `${student.age} years` : "Not set"}
              color={Colors.light.accent}
              delay={400}
            />
            <InfoCard
              icon="check-circle"
              label="Status"
              value={student?.isActive ? "Active" : "Inactive"}
              color={student?.isActive ? Colors.light.success : Colors.light.error}
              delay={450}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.section}
        >
          <ThemedText type="h3" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <View style={styles.actionsGrid}>
            <Pressable
              style={[
                styles.actionCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: Colors.light.primary + "15" },
                ]}
              >
                <Feather name="book-open" size={24} color={Colors.light.primary} />
              </View>
              <ThemedText type="small" style={styles.actionText}>
                My Courses
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.actionCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: Colors.light.success + "15" },
                ]}
              >
                <Feather name="award" size={24} color={Colors.light.success} />
              </View>
              <ThemedText type="small" style={styles.actionText}>
                Grades
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.actionCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: Colors.light.accent + "15" },
                ]}
              >
                <Feather name="calendar" size={24} color={Colors.light.accent} />
              </View>
              <ThemedText type="small" style={styles.actionText}>
                Schedule
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.actionCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: Colors.light.error + "15" },
                ]}
              >
                <Feather name="bell" size={24} color={Colors.light.error} />
              </View>
              <ThemedText type="small" style={styles.actionText}>
                Notices
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.logoutSection}
        >
          <Pressable
            onPress={handleLogout}
            style={[styles.logoutButton, { borderColor: Colors.light.error }]}
          >
            <Feather name="log-out" size={20} color={Colors.light.error} />
            <ThemedText style={[styles.logoutText, { color: Colors.light.error }]}>
              Logout
            </ThemedText>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  name: {
    marginBottom: Spacing.sm,
  },
  studentIdBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.primary + "10",
    borderRadius: BorderRadius.full,
  },
  studentIdText: {
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  infoGrid: {
    gap: Spacing.md,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  infoContent: {
    flex: 1,
  },
  infoValue: {
    fontWeight: "500",
    marginTop: Spacing.xs,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  actionCard: {
    width: "47%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontWeight: "500",
    textAlign: "center",
  },
  logoutSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

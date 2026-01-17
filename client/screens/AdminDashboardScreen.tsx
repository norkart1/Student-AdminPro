import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { apiRequest, getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "AdminDashboard">;

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string | null;
  age: string | null;
  isActive: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StudentCardProps {
  student: Student;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}

function StudentCard({ student, onPress, onDelete, index }: StudentCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[
          styles.studentCard,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.studentAvatar,
            { backgroundColor: Colors.light.primary + "15" },
          ]}
        >
          <Feather name="user" size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.studentInfo}>
          <ThemedText type="body" style={styles.studentName}>
            {student.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ID: {student.studentId}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {student.email}
          </ThemedText>
        </View>
        <View style={styles.studentActions}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: student.isActive
                  ? Colors.light.success + "15"
                  : Colors.light.error + "15",
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{
                color: student.isActive ? Colors.light.success : Colors.light.error,
                fontWeight: "600",
              }}
            >
              {student.isActive ? "Active" : "Inactive"}
            </ThemedText>
          </View>
          <Pressable
            onPress={onDelete}
            hitSlop={10}
            style={styles.deleteButton}
          >
            <Feather name="trash-2" size={18} color={Colors.light.error} />
          </Pressable>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyState}>
      <Image
        source={require("../../assets/images/empty-students.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText type="h3" style={styles.emptyTitle}>
        No Students Yet
      </ThemedText>
      <ThemedText
        type="body"
        style={[styles.emptySubtitle, { color: theme.textSecondary }]}
      >
        Add your first student to get started
      </ThemedText>
    </View>
  );
}

interface AddStudentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function AddStudentModal({ visible, onClose, onSubmit, isLoading }: AddStudentModalProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
  });

  const handleSubmit = () => {
    if (!formData.studentId || !formData.name || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      name: "",
      email: "",
      phone: "",
      age: "",
      password: "",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.backgroundRoot, paddingTop: insets.top + 20 },
        ]}
      >
        <View style={styles.modalHeader}>
          <ThemedText type="h2">Add Student</ThemedText>
          <Pressable onPress={() => { resetForm(); onClose(); }}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.modalForm}>
          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.label}>
              Student ID *
            </ThemedText>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
              ]}
              placeholder="Enter student ID"
              placeholderTextColor={theme.textSecondary}
              value={formData.studentId}
              onChangeText={(text) => setFormData({ ...formData, studentId: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.label}>
              Full Name *
            </ThemedText>
            <TextInput
              style={[
                styles.modalInput,
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
              Email *
            </ThemedText>
            <TextInput
              style={[
                styles.modalInput,
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
                styles.modalInput,
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
                styles.modalInput,
                { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
              ]}
              placeholder="Enter age"
              placeholderTextColor={theme.textSecondary}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="small" style={styles.label}>
              Password *
            </ThemedText>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text },
              ]}
              placeholder="Enter password"
              placeholderTextColor={theme.textSecondary}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={[
              styles.submitButton,
              { backgroundColor: Colors.light.primary, opacity: isLoading ? 0.7 : 1 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.submitButtonText}>Add Student</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admin = route.params?.admin;

  const fetchStudents = async () => {
    try {
      const baseUrl = getApiUrl();
      const response = await fetch(new URL("/api/students", baseUrl).href);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const handleAddStudent = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/students", formData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowAddModal(false);
      fetchStudents();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    Alert.alert(
      "Delete Student",
      `Are you sure you want to delete ${student.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest("DELETE", `/api/students/${student.id}`);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              fetchStudents();
            } catch (error: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", error.message || "Failed to delete student");
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  const handleStudentPress = (student: Student) => {
    navigation.navigate("EditStudent", { student });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: headerHeight + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Welcome back,
          </ThemedText>
          <ThemedText type="h2">{admin?.name || "Admin"}</ThemedText>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutIcon}>
          <Feather name="log-out" size={22} color={Colors.light.error} />
        </Pressable>
      </View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.statsContainer}
      >
        <View
          style={[
            styles.statCard,
            { backgroundColor: Colors.light.primary + "15" },
          ]}
        >
          <Feather name="users" size={24} color={Colors.light.primary} />
          <ThemedText type="h2" style={{ color: Colors.light.primary }}>
            {students.length}
          </ThemedText>
          <ThemedText type="small" style={{ color: Colors.light.primary }}>
            Total Students
          </ThemedText>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: Colors.light.success + "15" },
          ]}
        >
          <Feather name="user-check" size={24} color={Colors.light.success} />
          <ThemedText type="h2" style={{ color: Colors.light.success }}>
            {students.filter((s) => s.isActive).length}
          </ThemedText>
          <ThemedText type="small" style={{ color: Colors.light.success }}>
            Active
          </ThemedText>
        </View>
      </Animated.View>

      <View style={styles.listHeader}>
        <ThemedText type="h3">Students</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <StudentCard
              student={item}
              onPress={() => handleStudentPress(item)}
              onDelete={() => handleDeleteStudent(item)}
              index={index}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.light.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        onPress={() => setShowAddModal(true)}
        style={[styles.fab, { bottom: insets.bottom + 24 }, Shadows.lg]}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </Pressable>

      <AddStudentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStudent}
        isLoading={isSubmitting}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  logoutIcon: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.xs,
  },
  listHeader: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  studentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontWeight: "600",
  },
  studentActions: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  modalForm: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontWeight: "500",
    marginLeft: Spacing.xs,
  },
  modalInput: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  submitButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

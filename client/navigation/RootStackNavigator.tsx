import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";

import LandingScreen from "@/screens/LandingScreen";
import RoleSelectionScreen from "@/screens/RoleSelectionScreen";
import StudentLoginScreen from "@/screens/StudentLoginScreen";
import AdminLoginScreen from "@/screens/AdminLoginScreen";
import StudentDashboardScreen from "@/screens/StudentDashboardScreen";
import AdminDashboardScreen from "@/screens/AdminDashboardScreen";
import EditStudentScreen from "@/screens/EditStudentScreen";

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string | null;
  age: string | null;
  isActive: boolean;
}

interface Admin {
  id: string;
  username: string;
  name: string;
}

export type RootStackParamList = {
  Landing: undefined;
  RoleSelection: undefined;
  StudentLogin: undefined;
  AdminLogin: undefined;
  StudentDashboard: { student: Student };
  AdminDashboard: { admin: Admin };
  EditStudent: { student: Student };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentLogin"
        component={StudentLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{ headerTitle: "Admin Login" }}
      />
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboardScreen}
        options={{ headerTitle: "My Dashboard", headerBackVisible: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditStudent"
        component={EditStudentScreen}
        options={{ headerTitle: "Edit Student" }}
      />
    </Stack.Navigator>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import type { RouteProp } from "@react-navigation/native"

import HomeScreen from "../screens/HomeScreen"
import SearchScreen from "../screens/SearchScreen"
import { COLORS } from "../constants/theme"
import React from "react"
import { SafeAreaView, View, Text, StyleSheet } from "react-native"

export type MainTabParamList = {
  Home: { userType: "passenger" | "driver" } | undefined
  Search: undefined
  CreateTrip: undefined
  Profile: { userType?: "passenger" | "driver"; userId?: string } | undefined
}

type MainNavigatorProps = {
  route: RouteProp<{ params: { userType: "passenger" | "driver" } }, "params">
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const CreateTripScreenLocal = () => (
  <SafeAreaView style={localStyles.container}>
    <View style={localStyles.inner}>
      <Text style={localStyles.title}>Publicar viaje</Text>
      <Text style={localStyles.subtitle}>Pantalla para crear un viaje (placeholder).</Text>
    </View>
  </SafeAreaView>
)

const ProfileScreenLocal = ({ route }: any) => (
  <SafeAreaView style={localStyles.container}>
    <View style={localStyles.inner}>
      <Text style={localStyles.title}>Perfil</Text>
      <Text style={localStyles.subtitle}>Tipo: {route?.params?.userType ?? "-"}</Text>
      <Text style={localStyles.subtitle}>User ID: {route?.params?.userId ?? "no disponible"}</Text>
    </View>
  </SafeAreaView>
)

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
})

export default function MainNavigator({ route }: any) {
  const { userType } = route?.params || { userType: undefined }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline"
          } else if (route.name === "CreateTrip") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen as any} options={{ tabBarLabel: "Inicio" }} initialParams={{ userType }} />
      <Tab.Screen name="Search" component={SearchScreen as any} options={{ tabBarLabel: "Buscar" }} />
      {userType === "driver" && (
        <Tab.Screen name="CreateTrip" component={CreateTripScreenLocal as any} options={{ tabBarLabel: "Publicar" }} />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreenLocal as any}
        options={{ tabBarLabel: "Perfil" }}
        initialParams={{ userType }}
      />
    </Tab.Navigator>
  )
}

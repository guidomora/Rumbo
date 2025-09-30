import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import type { RouteProp } from "@react-navigation/native"

import HomeScreen from "../screens/HomeScreen"
import SearchScreen from "../screens/SearchScreen"
import CreateTripScreen from "../screens/CreateTripScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { COLORS } from "../constants/theme"

export type MainTabParamList = {
  Home: undefined
  Search: undefined
  CreateTrip: undefined
  Profile: undefined
}

type MainNavigatorProps = {
  route: RouteProp<{ params: { userType: "passenger" | "driver" } }, "params">
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainNavigator({ route }: MainNavigatorProps) {
  const { userType } = route.params

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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Inicio" }} initialParams={{ userType }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: "Buscar" }} />
      {userType === "driver" && (
        <Tab.Screen name="CreateTrip" component={CreateTripScreen} options={{ tabBarLabel: "Publicar" }} />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil" }}
        initialParams={{ userType }}
      />
    </Tab.Navigator>
  )
}

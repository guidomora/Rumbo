import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme"

type ProfileScreenProps = {
  route: {
    params?: {
      userType?: "passenger" | "driver"
      userId?: string
    }
  }
}

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const userType = route?.params?.userType
  const userId = route?.params?.userId

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Tipo: {userType ?? "-"}</Text>
        <Text style={styles.subtitle}>User ID: {userId ?? "no disponible"}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xl, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.md },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 6 },
})

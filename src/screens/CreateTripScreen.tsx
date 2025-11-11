import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme"

export default function CreateTripScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Publicar viaje</Text>
        <Text style={styles.subtitle}>Aquí podrás crear un nuevo viaje (pantalla placeholder).</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xl, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.md },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
})

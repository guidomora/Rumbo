"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme"

export default function SearchScreen() {
  const [filters, setFilters] = useState({
    music: false,
    pets: false,
    kids: false,
    luggage: false,
  })

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar viajes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Ruta</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.input}
                placeholder="¿Desde dónde salís?"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color={COLORS.secondary} />
              <TextInput style={styles.input} placeholder="¿A dónde vas?" placeholderTextColor={COLORS.textSecondary} />
            </View>
          </View>

          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Fecha</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
              <Text style={styles.dateButtonText}>Seleccionar fecha</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Preferencias</Text>
            <View style={styles.filtersGrid}>
              <TouchableOpacity
                style={[styles.filterChip, filters.music && styles.filterChipActive]}
                onPress={() => toggleFilter("music")}
              >
                <Ionicons name="musical-notes" size={20} color={filters.music ? COLORS.white : COLORS.text} />
                <Text style={[styles.filterText, filters.music && styles.filterTextActive]}>Música</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, filters.pets && styles.filterChipActive]}
                onPress={() => toggleFilter("pets")}
              >
                <Ionicons name="paw" size={20} color={filters.pets ? COLORS.white : COLORS.text} />
                <Text style={[styles.filterText, filters.pets && styles.filterTextActive]}>Mascotas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, filters.kids && styles.filterChipActive]}
                onPress={() => toggleFilter("kids")}
              >
                <Ionicons name="happy" size={20} color={filters.kids ? COLORS.white : COLORS.text} />
                <Text style={[styles.filterText, filters.kids && styles.filterTextActive]}>Niños</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, filters.luggage && styles.filterChipActive]}
                onPress={() => toggleFilter("luggage")}
              >
                <Ionicons name="briefcase" size={20} color={filters.luggage ? COLORS.white : COLORS.text} />
                <Text style={[styles.filterText, filters.luggage && styles.filterTextActive]}>Equipaje</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Rango de precio</Text>
            <View style={styles.priceRange}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Mínimo</Text>
                <TextInput
                  style={styles.priceInputField}
                  placeholder="$0"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              <Text style={styles.priceSeparator}>-</Text>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Máximo</Text>
                <TextInput
                  style={styles.priceInputField}
                  placeholder="$20000"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchButtonText}>Buscar viajes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
  },
  content: {
    padding: SPACING.lg,
  },
  searchSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dateButtonText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterTextActive: {
    color: COLORS.white,
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  priceInputField: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  priceSeparator: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
  },
  clearButton: {
    alignItems: "center",
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  clearButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
})

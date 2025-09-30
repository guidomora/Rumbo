import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme"

type HomeScreenProps = {
  route: {
    params: {
      userType: "passenger" | "driver"
    }
  }
}

const FEATURED_TRIPS = [
  {
    id: "1",
    driver: "María González",
    rating: 4.8,
    trips: 45,
    from: "Olavarría",
    to: "Once, CABA",
    date: "Hoy 14:30",
    price: 8500,
    seats: 3,
    preferences: { music: true, pets: false, kids: true },
  },
  {
    id: "2",
    driver: "Carlos Rodríguez",
    rating: 4.9,
    trips: 78,
    from: "Chivilcoy",
    to: "Retiro, CABA",
    date: "Mañana 08:00",
    price: 7200,
    seats: 2,
    preferences: { music: true, pets: true, kids: false },
  },
  {
    id: "3",
    driver: "Ana Martínez",
    rating: 5.0,
    trips: 120,
    from: "Mercedes",
    to: "Palermo, CABA",
    date: "Hoy 16:00",
    price: 6800,
    seats: 4,
    preferences: { music: false, pets: false, kids: true },
  },
]

export default function HomeScreen({ route }: HomeScreenProps) {
  const { userType } = route.params

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola! 👋</Text>
            <Text style={styles.subtitle}>¿A dónde querés ir hoy?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <TextInput style={styles.searchInput} placeholder="Origen" placeholderTextColor={COLORS.textSecondary} />
          </View>
          <View style={styles.searchDivider} />
          <View style={styles.searchInputContainer}>
            <Ionicons name="location" size={20} color={COLORS.secondary} />
            <TextInput style={styles.searchInput} placeholder="Destino" placeholderTextColor={COLORS.textSecondary} />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchButtonText}>Buscar viajes</Text>
          </TouchableOpacity>
        </View>

        {userType === "driver" && (
          <TouchableOpacity style={styles.publishCard}>
            <View style={styles.publishIconContainer}>
              <Ionicons name="add-circle" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.publishContent}>
              <Text style={styles.publishTitle}>Publicar un viaje</Text>
              <Text style={styles.publishSubtitle}>Compartí tu próximo viaje y ahorrá en combustible</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viajes disponibles</Text>
          {FEATURED_TRIPS.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.driverInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {trip.driver
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.driverName}>{trip.driver}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color={COLORS.warning} />
                      <Text style={styles.rating}>{trip.rating}</Text>
                      <Text style={styles.trips}>• {trip.trips} viajes</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, styles.routeDotStart]} />
                  <Text style={styles.routeText}>{trip.from}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, styles.routeDotEnd]} />
                  <Text style={styles.routeText}>{trip.to}</Text>
                </View>
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{trip.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{trip.seats} asientos</Text>
                </View>
              </View>

              <View style={styles.preferencesContainer}>
                {trip.preferences.music && (
                  <View style={styles.preferenceTag}>
                    <Ionicons name="musical-notes" size={12} color={COLORS.primary} />
                    <Text style={styles.preferenceText}>Música</Text>
                  </View>
                )}
                {trip.preferences.pets && (
                  <View style={styles.preferenceTag}>
                    <Ionicons name="paw" size={12} color={COLORS.primary} />
                    <Text style={styles.preferenceText}>Mascotas</Text>
                  </View>
                )}
                {trip.preferences.kids && (
                  <View style={styles.preferenceTag}>
                    <Ionicons name="happy" size={12} color={COLORS.primary} />
                    <Text style={styles.preferenceText}>Niños</Text>
                  </View>
                )}
              </View>

              <View style={styles.tripFooter}>
                <Text style={styles.price}>${trip.price.toLocaleString()}</Text>
                <TouchableOpacity style={styles.reserveButton}>
                  <Text style={styles.reserveButtonText}>Ver detalles</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  notificationButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  searchCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  searchDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
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
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  publishCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  publishIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  publishContent: {
    flex: 1,
  },
  publishTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  publishSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tripCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
  },
  driverName: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  rating: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  trips: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  routeContainer: {
    marginBottom: SPACING.md,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeDotStart: {
    backgroundColor: COLORS.primary,
  },
  routeDotEnd: {
    backgroundColor: COLORS.secondary,
  },
  routeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "500",
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  tripDetails: {
    flexDirection: "row",
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  preferenceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  preferenceText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: "500",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  reserveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
})

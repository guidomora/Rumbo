"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { LoginScreen } from "@/components/login-screen"
import { HomeScreen } from "@/components/home-screen"
import { SearchScreen } from "@/components/search-screen"
import { CreateTripScreen } from "@/components/create-trip-screen"
import { TripDetailScreen } from "@/components/trip-detail-screen"
import { ProfileScreen } from "@/components/profile-screen"

export default function RumboApp() {
  interface Trip {
  id: string
  driverId: string
  origin: string
  destination: string
  date: string
  time: string
  availableSeats: number
  pricePerPerson: number
  music?: boolean
  pets?: boolean
  children?: boolean
  luggage?: boolean
  notes?: string
}
  const [userId, setUserId] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<
    "onboarding" | "login" | "home" | "search" | "create" | "detail" | "profile"
  >("onboarding")
  const [userType, setUserType] = useState<"passenger" | "driver">("passenger")
  const [trip, setTrip] = useState<Trip | null>(null)
  console.log("userId in RumboApp:", userId);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => setCurrentScreen("login")} />}
        {currentScreen === "login" && (
          <LoginScreen
            onLogin={(type, userId) => {
              setUserId(userId);
              setUserType(type);
              setCurrentScreen("home");
            }}
          />
        )}
        {currentScreen === "home" && (
          <HomeScreen userType={userType} onNavigate={(screen) => setCurrentScreen(screen)} />
        )}
        {currentScreen === "search" && (
          <SearchScreen onBack={() => setCurrentScreen("home")} onSelectTrip={(trip) => {
            setTrip(trip);
            setCurrentScreen("detail");
          }} />
        )}
        {currentScreen === "create" && (
          <CreateTripScreen onBack={() => setCurrentScreen("home")} onComplete={() => setCurrentScreen("home")} />
        )}
        {currentScreen === "detail" && trip && (
          <TripDetailScreen onBack={() => setCurrentScreen("search")} userId={userId} trip={trip} userType={userType} />
        )}
        {currentScreen === "profile" && <ProfileScreen onBack={() => setCurrentScreen("home")} userType={userType} />}
      </div>
    </div>
  )
}

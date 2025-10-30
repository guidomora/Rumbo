"use client"

import { useState, useEffect } from "react"
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
  const [userName, setUserName] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<
    "onboarding" | "login" | "home" | "search" | "create" | "detail" | "profile"
  >("onboarding")
  const [userType, setUserType] = useState<"passenger" | "driver">("passenger")
  const [trip, setTrip] = useState<Trip | null>(null)
  console.log("userId in RumboApp:", userId);
  
  useEffect(() => {
    if (!userId) {
      setUserName(null)
      return
    }

    const fetchUserName = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}`)
        if (!res.ok) throw new Error("Error al obtener usuario")
        const data = await res.json()
        const user = data.user || data.data || data
        setUserName(user.fullName || user.name || null)
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }

    fetchUserName()
  }, [userId])

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
          <HomeScreen userType={userType} userName={userName} onNavigate={(screen) => setCurrentScreen(screen)} />
        )}
        {currentScreen === "search" && (
          <SearchScreen userId={userId ?? ""} onBack={() => setCurrentScreen("home")} onSelectTrip={(trip) => {
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
        {currentScreen === "profile" && (
          <ProfileScreen 
            onBack={() => setCurrentScreen("home")} 
            userType={userType} 
            onLogout={() => setCurrentScreen("onboarding")}
            userId={userId}
          />
        )}
      </div>
    </div>
  )
}

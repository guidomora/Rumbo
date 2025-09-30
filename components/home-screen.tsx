"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Plus, Home, User, Star, Clock, DollarSign } from "lucide-react"

interface HomeScreenProps {
  userType: "passenger" | "driver"
  onNavigate: (screen: "search" | "create" | "profile") => void
}

const recentTrips = [
  {
    id: 1,
    driver: "María González",
    rating: 4.8,
    from: "Olavarría",
    to: "Once, CABA",
    date: "Hoy 14:30",
    price: 8500,
    seats: 2,
  },
  {
    id: 2,
    driver: "Carlos Rodríguez",
    rating: 4.9,
    from: "Chivilcoy",
    to: "Retiro, CABA",
    date: "Mañana 08:00",
    price: 7200,
    seats: 3,
  },
  {
    id: 3,
    driver: "Ana Martínez",
    rating: 5.0,
    from: "Mercedes",
    to: "Palermo, CABA",
    date: "Mañana 16:00",
    price: 6800,
    seats: 1,
  },
]

export function HomeScreen({ userType, onNavigate }: HomeScreenProps) {
  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Hola, Juan 👋</h2>
            <p className="text-sm opacity-90">{userType === "driver" ? "Conductor verificado" : "Pasajero"}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => onNavigate("profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="¿Desde dónde salís?"
              className="pl-10 bg-background text-foreground"
              onClick={() => onNavigate("search")}
              readOnly
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="¿A dónde vas?"
              className="pl-10 bg-background text-foreground"
              onClick={() => onNavigate("search")}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => onNavigate("search")}>
            <Search className="h-5 w-5" />
            <span className="text-sm">Buscar viaje</span>
          </Button>

          {userType === "driver" && (
            <Button className="h-20 flex-col gap-2" onClick={() => onNavigate("create")}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Publicar viaje</span>
            </Button>
          )}

          {userType === "passenger" && (
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Mis reservas</span>
            </Button>
          )}
        </div>

        {/* Recent Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Viajes disponibles</h3>
            <Button variant="link" className="text-sm p-0 h-auto">
              Ver todos
            </Button>
          </div>

          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <Card key={trip.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{trip.driver}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{trip.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {trip.seats} {trip.seats === 1 ? "lugar" : "lugares"}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{trip.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="font-medium">{trip.to}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{trip.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <DollarSign className="w-5 h-5" />
                    <span>{trip.price.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-card">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Button variant="ghost" className="flex-col h-16 gap-1">
            <Home className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-semibold">Inicio</span>
          </Button>
          <Button variant="ghost" className="flex-col h-16 gap-1" onClick={() => onNavigate("search")}>
            <Search className="h-5 w-5" />
            <span className="text-xs">Buscar</span>
          </Button>
          <Button variant="ghost" className="flex-col h-16 gap-1" onClick={() => onNavigate("profile")}>
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Star,
  Clock,
  DollarSign,
  User,
  Music,
  Dog,
  Baby,
  Luggage,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

interface SearchScreenProps {
  onBack: () => void
  onSelectTrip: () => void
}

const searchResults = [
  {
    id: 1,
    driver: "María González",
    rating: 4.8,
    trips: 45,
    from: "Olavarría",
    to: "Once, CABA",
    date: "Hoy 14:30",
    duration: "2h 30min",
    price: 8500,
    seats: 2,
    preferences: {
      music: true,
      pets: false,
      kids: true,
      luggage: true,
    },
  },
  {
    id: 2,
    driver: "Carlos Rodríguez",
    rating: 4.9,
    trips: 78,
    from: "Olavarría",
    to: "Retiro, CABA",
    date: "Hoy 15:00",
    duration: "2h 45min",
    price: 7800,
    seats: 3,
    preferences: {
      music: true,
      pets: true,
      kids: false,
      luggage: true,
    },
  },
  {
    id: 3,
    driver: "Ana Martínez",
    rating: 5.0,
    trips: 120,
    from: "Olavarría",
    to: "Palermo, CABA",
    date: "Hoy 16:30",
    duration: "3h",
    price: 9200,
    seats: 1,
    preferences: {
      music: false,
      pets: false,
      kids: true,
      luggage: false,
    },
  },
]

export function SearchScreen({ onBack, onSelectTrip }: SearchScreenProps) {
  const [filters, setFilters] = useState({
    music: false,
    pets: false,
    kids: false,
    luggage: false,
  })

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Buscar viaje</h1>
        </div>

        {/* Search Inputs */}
        <div className="space-y-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
            <Input placeholder="Olavarría" className="pl-10" defaultValue="Olavarría" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-secondary" />
            <Input placeholder="Once, CABA" className="pl-10" defaultValue="Once, CABA" />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="date" className="pl-10" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtros de búsqueda</SheetTitle>
                  <SheetDescription>Personalizá tu búsqueda según tus preferencias</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="music">Música durante el viaje</Label>
                    </div>
                    <Switch
                      id="music"
                      checked={filters.music}
                      onCheckedChange={(checked) => setFilters({ ...filters, music: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Dog className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="pets">Acepta mascotas</Label>
                    </div>
                    <Switch
                      id="pets"
                      checked={filters.pets}
                      onCheckedChange={(checked) => setFilters({ ...filters, pets: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Baby className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="kids">Acepta niños</Label>
                    </div>
                    <Switch
                      id="kids"
                      checked={filters.kids}
                      onCheckedChange={(checked) => setFilters({ ...filters, kids: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Luggage className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="luggage">Espacio para equipaje</Label>
                    </div>
                    <Switch
                      id="luggage"
                      checked={filters.luggage}
                      onCheckedChange={(checked) => setFilters({ ...filters, luggage: checked })}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-4">
        <p className="text-sm text-muted-foreground mb-4">{searchResults.length} viajes encontrados</p>

        <div className="space-y-3">
          {searchResults.map((trip) => (
            <Card key={trip.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onSelectTrip}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{trip.driver}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{trip.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">• {trip.trips} viajes</span>
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

              <div className="flex items-center gap-2 mb-3">
                {trip.preferences.music && (
                  <Badge variant="outline" className="text-xs">
                    <Music className="w-3 h-3 mr-1" />
                    Música
                  </Badge>
                )}
                {trip.preferences.pets && (
                  <Badge variant="outline" className="text-xs">
                    <Dog className="w-3 h-3 mr-1" />
                    Mascotas
                  </Badge>
                )}
                {trip.preferences.kids && (
                  <Badge variant="outline" className="text-xs">
                    <Baby className="w-3 h-3 mr-1" />
                    Niños
                  </Badge>
                )}
                {trip.preferences.luggage && (
                  <Badge variant="outline" className="text-xs">
                    <Luggage className="w-3 h-3 mr-1" />
                    Equipaje
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.date}</span>
                  </div>
                  <span>• {trip.duration}</span>
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
  )
}

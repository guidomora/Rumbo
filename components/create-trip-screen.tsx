"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Users, Music, Dog, Baby, Luggage, Car } from "lucide-react"

interface CreateTripScreenProps {
  onBack: () => void
  onComplete: () => void
}

export function CreateTripScreen({ onBack, onComplete }: CreateTripScreenProps) {
  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Publicar viaje</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Route */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Ruta del viaje</h2>

          <div className="space-y-2">
            <Label htmlFor="from">Origen</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input id="from" placeholder="¿Desde dónde salís?" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Destino</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-secondary" />
              <Input id="to" placeholder="¿A dónde vas?" className="pl-10" />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Fecha y hora</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="date" type="date" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="time" type="time" className="pl-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Detalles del viaje</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats">Asientos disponibles</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="seats" type="number" min="1" max="4" defaultValue="2" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio por persona</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="price" type="number" placeholder="8500" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehículo</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="vehicle" placeholder="Ej: Toyota Corolla 2020" className="pl-10" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Preferencias</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="music-pref">Música durante el viaje</Label>
              </div>
              <Switch id="music-pref" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dog className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="pets-pref">Acepto mascotas</Label>
              </div>
              <Switch id="pets-pref" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="kids-pref">Acepto niños</Label>
              </div>
              <Switch id="kids-pref" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Luggage className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="luggage-pref">Espacio para equipaje</Label>
              </div>
              <Switch id="luggage-pref" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas adicionales (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Ej: Salgo desde el centro de la ciudad, puedo pasar a buscar por la terminal..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border bg-card">
        <Button onClick={onComplete} className="w-full h-12" size="lg">
          Publicar viaje
        </Button>
      </div>
    </div>
  )
}

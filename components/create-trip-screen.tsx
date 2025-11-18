"use client"

import { useState } from "react"
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
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    availableSeats: 1,
    pricePerPerson: "",
    vehicle: "",
    music: false,
    pets: false,
    children: false,
    luggage: false,
    notes: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://rumbo-back-production.up.railway.app/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: localStorage.getItem("userId"), //  ID real del conductor logueado
          origin: formData.origin,
          destination: formData.destination,
          date: formData.date,
          time: formData.time,
          availableSeats: Number(formData.availableSeats),
          pricePerPerson: Number(formData.pricePerPerson),
          vehicle: formData.vehicle,
          music: formData.music,
          pets: formData.pets,
          children: formData.children,
          luggage: formData.luggage,
          notes: formData.notes,
        }),
      })

      if (!response.ok) throw new Error("Error al crear el viaje")

      const data = await response.json()
      console.log("Viaje creado:", data)

      alert("✅ Viaje creado correctamente")
      onComplete()
    } catch (error) {
      console.error(error)
      alert("❌ Ocurrió un error al crear el viaje")
    }
  }

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
        {/* Ruta */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Ruta del viaje</h2>

          <div className="space-y-2">
            <Label htmlFor="from">Origen</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input
                id="from"
                placeholder="¿Desde dónde salís?"
                className="pl-10"
                value={formData.origin}
                onChange={(e) => handleChange("origin", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Destino</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-secondary" />
              <Input
                id="to"
                placeholder="¿A dónde vas?"
                className="pl-10"
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Fecha y hora</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-10"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  className="pl-10"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Detalles del viaje</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats">Asientos disponibles</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  value={formData.availableSeats}
                  onChange={(e) => handleChange("availableSeats", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio por persona</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  value={formData.pricePerPerson}
                  onChange={(e) => handleChange("pricePerPerson", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehículo</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="vehicle"
                placeholder="Ej: Toyota Corolla 2020"
                className="pl-10"
                value={formData.vehicle}
                onChange={(e) => handleChange("vehicle", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Preferencias</h2>
          {[
            { label: "Música durante el viaje", icon: Music, field: "music" },
            { label: "Acepto mascotas", icon: Dog, field: "pets" },
            { label: "Acepto niños", icon: Baby, field: "children" },
            { label: "Espacio para equipaje", icon: Luggage, field: "luggage" },
          ].map((pref) => (
            <div key={pref.field} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <pref.icon className="h-5 w-5 text-muted-foreground" />
                <Label>{pref.label}</Label>
              </div>
              <Switch
                checked={formData[pref.field as keyof typeof formData] as boolean}
                onCheckedChange={(val) => handleChange(pref.field, val)}
              />
            </div>
          ))}
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas adicionales (opcional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Ej: Salgo desde el centro de la ciudad..."
            rows={3}
          />
        </div>
      </div>

      {/* Botón */}
      <div className="p-6 border-t border-border bg-card">
        <Button onClick={handleSubmit} className="w-full h-12" size="lg">
          Publicar viaje
        </Button>
      </div>
    </div>
  )
}

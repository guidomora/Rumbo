"use client"
import { useState } from "react"
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  User,
  Star,
  Phone,
  MessageCircle,
  Music,
  Baby,
  Luggage,
  Car,
  Shield,
  CheckCircle2,
} from "lucide-react"

interface Trip {
  id: string
  driverId: string
  origin: string
  destination: string
  date: string
  time: string
  availableSeats: number
  pricePerPerson: number
  vehicle: string
  music?: boolean
  pets?: boolean
  children?: boolean
  luggage?: boolean
  notes?: string
}

interface TripDetailScreenProps {
  onBack: () => void
  userId: string | null
  trip: Trip
  userType: "passenger" | "driver"
}

export function TripDetailScreen({ onBack, userId, trip, userType }: TripDetailScreenProps) {
    console.log("Reserving seats for trip ID:", trip);
    console.log("User ID:", userId);

  //COMENTO CAMBIO PARA VER SI FUNCIONA TRIP
  //const params = useParams();
  //const tripId = params.id;

  const handleReserve = async (seats: number) => {
    const tripId = trip.id;

    console.log("Reserving seats for trip ID:", tripId);
    if (!tripId) {
      alert("ID del viaje no encontrado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/trips/${tripId}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, seats }),
      });

      if (!response.ok) throw new Error("Error al reservar el lugar");

      alert("Lugar reservado con éxito");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al reservar el lugar");
    }
  };

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Detalle del viaje</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Driver Info */}
        <div className="p-6 bg-gradient-to-b from-primary/5 to-background">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{trip.driverId}</h2>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Verificada
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">4.8</span>
                  <span>(45 viajes)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Miembro desde Enero 2024</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Llamar
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Mensaje
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Route */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Ruta del viaje</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{trip.origin}</p>
                  <p className="text-sm text-muted-foreground">Terminal de ómnibus</p>
                </div>
              </div>

              <div className="ml-4 border-l-2 border-dashed border-border h-8" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">{trip.destination}</p>
                  <p className="text-sm text-muted-foreground">Estación de tren</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Trip Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Información del viaje</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha</span>
                </div>
                <span className="font-medium">{trip.date}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Hora de salida</span>
                </div>
                <span className="font-medium">{trip.time}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duración estimada</span>
                </div>
                <span className="font-medium">2h 30min</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Lugares disponibles</span>
                </div>
                <span className="font-medium">{trip.availableSeats}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">Vehículo</span>
                </div>
                <span className="font-medium">{trip.vehicle}</span>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Preferencias del viaje</h3>
            <div className="flex flex-wrap gap-2">
            {trip.pets && (
              <Badge variant="outline" className="text-sm">
                <Music className="w-3 h-3 mr-1" />
                Mascotas permitidas
              </Badge>
            )}
            {trip.music && (
              <Badge variant="outline" className="text-sm">
                <Music className="w-3 h-3 mr-1" />
                Música
              </Badge>
            )}
            {trip.children && (
              <Badge variant="outline" className="text-sm">
                <Baby className="w-3 h-3 mr-1" />
                Acepta niños
              </Badge>
            )}
            {trip.luggage && (
              <Badge variant="outline" className="text-sm">
                <Luggage className="w-3 h-3 mr-1" />
                Espacio para equipaje
              </Badge>
            )}
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      {userType === "passenger" && (
        <div className="p-6 border-t border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Precio por persona</span>
            <div className="flex items-center gap-1">
              <DollarSign className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{trip.pricePerPerson}</span>
            </div>
          </div>
          <Button
            className="w-full h-12"
            size="lg"
            onClick={() => handleReserve(1)}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Reservar lugar
          </Button>
        </div>
      )}
    </div>
  )
}

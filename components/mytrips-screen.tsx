"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, ArrowLeft, Play, Flag, Star } from "lucide-react"
import {Dialog, DialogContent} from "@/components/ui/dialog"

interface MyTripsScreenProps {
  userId: string
  onNavigate: (screen: "home" | "create" | "profile" | "rating") => void
  onSelectTrip: (trip: any) => void
}

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
  state?: "pending" | "in_progress" | "completed"
}

export function MyTripsScreen({
  userId,
  onNavigate,
  onSelectTrip,
}: MyTripsScreenProps) {
  const [myTrips, setMyTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tripToComplete, setTripToComplete] = useState<string | null>(null)

  // Cargar viajes del chofer
  useEffect(() => {
  const fetchMyTrips = async () => {
    try {
      const res = await fetch(`https://rumbo-back-production.up.railway.app/api/trips`)
      if (!res.ok) throw new Error("Error al cargar tus viajes")
      const data = await res.json()

      // Filtra solo los viajes del chofer logueado
      const filtered = (data.data || []).filter(
        (trip: Trip) => trip.driverId === userId
      )
      setMyTrips(filtered)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchMyTrips()
}, [userId])

  // Iniciar viaje
  const handleStartTrip = async (tripId: string) => {
    setActionLoading(tripId)
    setMessage(null)
    try {
      const res = await fetch(
        `https://rumbo-back-production.up.railway.app/api/trips/${tripId}/start`,
        { method: "PATCH" }
      )
      if (!res.ok) throw new Error("Error al iniciar el viaje.")
      await res.json()

      setMyTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId ? { ...trip, state: "in_progress" } : trip
        )
      )
      setMessage("✅ Viaje iniciado correctamente.")
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Finalizar viaje
  const handleCompleteTrip = async (tripId: string) => {
    setActionLoading(tripId)
    setMessage(null)
    try {
      const res = await fetch(
        `https://rumbo-back-production.up.railway.app/api/trips/${tripId}/complete`,
        { method: "PATCH" }
      )
      if (!res.ok) throw new Error("Error al finalizar el viaje.")
      await res.json()

      setMyTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId ? { ...trip, state: "completed" } : trip
        )
      )
      setMessage("🏁 Viaje finalizado correctamente.")
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <p className="p-4 text-center">Cargando tus viajes...</p>
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Mis viajes</h1>
        </div>
      </div>

      {/* Mensaje de acción */}
      {message && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          {message}
        </p>
      )}

      {/* Contenido */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {myTrips.length === 0 ? (
          <p className="text-muted-foreground">
            No tenés viajes publicados todavía.
          </p>
        ) : (
          myTrips.map((trip) => (
            <Card
              key={trip.id}
              className="p-4 space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {trip.origin} → {trip.destination}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> {trip.date} - {trip.time}
                  </div>
                </div>
                <Badge variant="secondary">
                  {trip.availableSeats} lugares
                </Badge>
              </div>

              <div className="flex justify-end items-center gap-1 text-primary font-semibold">
                <DollarSign className="h-4 w-4" /> {trip.pricePerPerson}
              </div>

              {/* Estado actual */}
              <div className="text-sm text-muted-foreground">
                Estado:{" "}
                {trip.state === "in_progress"
                  ? "En curso 🚗"
                  : trip.state === "completed"
                  ? "Finalizado ✅"
                  : "Pendiente 🕓"}
              </div>

              {/* Botones según estado */}
              <div className="flex gap-3 mt-3">
                {trip.state === "pending" && (
                  <Button
                    onClick={() => handleStartTrip(trip.id)}
                    disabled={actionLoading === trip.id}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {actionLoading === trip.id
                      ? "Iniciando..."
                      : "Iniciar viaje"}
                  </Button>
                )}
                {trip.state === "in_progress" && (
                  <Button
                    variant="destructive"
                    onClick={() => setTripToComplete(trip.id)}
                    disabled={actionLoading === trip.id}
                    className="flex-1"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    {actionLoading === trip.id
                      ? "Finalizando..."
                      : "Finalizar viaje"}
                  </Button>
                )}
                {trip.state === "completed" && (
                  <Button
                    variant="outline"
                    onClick={() => onNavigate("rating")}
                    className="flex-1"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Calificar pasajeros
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de confirmación de pago */}
      <Dialog open={!!tripToComplete} onOpenChange={() => setTripToComplete(null)}>
        <DialogContent className="sm:max-w-md p-6">
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-semibold">💵 No olvides recibir tu pago</h2>
            <p className="text-sm text-muted-foreground">
              Antes de finalizar el viaje, asegurate de haber recibido el pago de los pasajeros.
            </p>
            <Button
              onClick={async () => {
                if (tripToComplete) {
                  await handleCompleteTrip(tripToComplete)
                  setTripToComplete(null)
                }
              }}
              className="w-full mt-4"
            >
              Ya recibí el pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

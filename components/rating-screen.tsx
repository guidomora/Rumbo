"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Clock, User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"

interface RatingScreenProps {
  userId: string
  userType: "passenger" | "driver"
  onNavigate: (screen: "home" | "search" | "create" | "profile" | "my-trips") => void
}

interface Trip {
  id: string
  driverId: string
  origin: string
  destination: string
  date: string
  time: string
  state: "pending" | "in_progress" | "completed"
}

interface Passenger {
  id: string
  name: string
  email: string
  phone: string
  dni: string
  seats: number
}

export function RatingScreen({
  userId,
  userType,
  onNavigate,
}: RatingScreenProps) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripPassengers, setTripPassengers] = useState<Record<string, Passenger[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  // Cargar viajes completados y reservas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        if (userType === "passenger") {
          // Para pasajeros: obtener todos los viajes y verificar si el usuario es pasajero
          // Obtenemos todos los viajes y luego verificamos los pasajeros de cada uno
          const tripsRes = await fetch(`https://rumbo-back-production.up.railway.app/api/trips`)
          
          if (!tripsRes.ok) {
            setTrips([])
            return
          }
          
          let tripsData
          try {
            tripsData = await tripsRes.json()
            console.log("Todos los viajes disponibles:", tripsData)
          } catch (err) {
            setTrips([])
            return
          }
          
          const allTrips = tripsData.data || []
          
          // Para cada viaje, verificar si el usuario es pasajero
          const tripsWithPassengers = await Promise.all(
            allTrips.map(async (trip: Trip) => {
              try {
                const passengersRes = await fetch(`https://rumbo-back-production.up.railway.app/api/trips/${trip.id}/passengers`)
                if (passengersRes.ok) {
                  const passengersData = await passengersRes.json()
                  const passengers = passengersData.data || []
                  const isPassenger = passengers.some((p: Passenger) => p.id === userId)
                  return { trip, isPassenger }
                }
                return { trip, isPassenger: false }
              } catch {
                return { trip, isPassenger: false }
              }
            })
          )
          
          // Filtrar solo viajes completados donde el usuario es pasajero
          const completedTrips = tripsWithPassengers
            .filter(({ trip, isPassenger }) => {
              const isCompleted = trip.state === "completed"
              return isCompleted && isPassenger
            })
            .map(({ trip }) => trip)
          
          console.log("Viajes completados como pasajero:", completedTrips)
          setTrips(completedTrips)
        } else {
          // Para conductores: obtener todos los viajes y filtrar los del conductor
          // Usamos el mismo método que mytrips-screen.tsx
          const tripsRes = await fetch(`https://rumbo-back-production.up.railway.app/api/trips`)
          
          if (!tripsRes.ok) {
            let errorMessage = `Error al cargar viajes (${tripsRes.status})`
            try {
              const errorText = await tripsRes.text()
              if (errorText) {
                const errorJson = JSON.parse(errorText)
                errorMessage = errorJson.message || errorMessage
              }
            } catch {
              // Si no se puede parsear, usar el mensaje por defecto
            }
            throw new Error(errorMessage)
          }
          
          let tripsData
          try {
            tripsData = await tripsRes.json()
            console.log("Respuesta completa del endpoint (conductor):", tripsData)
          } catch (err) {
            throw new Error("Error al procesar la respuesta del servidor")
          }
          
          // Filtrar solo viajes completados donde el usuario es conductor
          const allTrips = tripsData.data || []
          console.log("Todos los viajes disponibles:", allTrips)
          console.log("userId actual:", userId)
          
          const completedTrips = allTrips.filter(
            (trip: Trip) => {
              const isCompleted = trip.state === "completed"
              const isDriver = trip.driverId === userId
              const shouldInclude = isCompleted && isDriver
              console.log(`Viaje ${trip.id}: completed=${isCompleted}, driver=${isDriver}, include=${shouldInclude}`)
              return shouldInclude
            }
          )
          console.log("Viajes completados como conductor:", completedTrips)
          setTrips(completedTrips)
          
          // Para cada viaje, obtener sus pasajeros
          const passengersMap: Record<string, Passenger[]> = {}
          await Promise.all(
            completedTrips.map(async (trip: Trip) => {
              try {
                const passengersRes = await fetch(
                  `https://rumbo-back-production.up.railway.app/api/trips/${trip.id}/passengers`
                )
                if (passengersRes.ok) {
                  try {
                    const passengersData = await passengersRes.json()
                    const passengers = passengersData.data || []
                    console.log(`Pasajeros del viaje ${trip.id}:`, passengers)
                    passengersMap[trip.id] = passengers
                  } catch {
                    console.warn(`Error parseando pasajeros del viaje ${trip.id}`)
                    passengersMap[trip.id] = []
                  }
                } else {
                  console.warn(`No se pudieron obtener pasajeros para el viaje ${trip.id} (${passengersRes.status})`)
                  passengersMap[trip.id] = []
                }
              } catch (err) {
                console.error(`Error fetching passengers for trip ${trip.id}:`, err)
                passengersMap[trip.id] = []
              }
            })
          )
          console.log("Mapa de pasajeros por viaje:", passengersMap)
          setTripPassengers(passengersMap)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [userId, userType])

  const handleRate = async (tripId: string, targetUserId: string) => {
    if (rating === 0) {
      showToast("Por favor selecciona una calificación", "error")
      return
    }

    if (!targetUserId) {
      showToast("Error: No se pudo identificar al usuario a calificar", "error")
      return
    }

    setSubmitting(true)
    try {
      // Construir el body según el endpoint
      const body: { score: number; comment?: string; authorId?: string } = {
        score: rating,
      }
      
      if (comment && comment.trim()) {
        body.comment = comment.trim()
      }
      
      if (userId) {
        body.authorId = userId
      }

      const res = await fetch(`https://rumbo-back-production.up.railway.app/api/users/${targetUserId}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let errorMessage = "Error al calificar"
        try {
          const errorText = await res.text()
          if (errorText) {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.message || errorMessage
          }
        } catch {
          errorMessage = `Error al calificar (${res.status})`
        }
        throw new Error(errorMessage)
      }

      // Verificar que la respuesta sea válida
      const responseData = await res.json()
      console.log("Calificación enviada:", responseData)

      showToast("Calificación enviada correctamente", "success")
      
      // Remover el viaje o pasajero de la lista
      if (userType === "passenger") {
        setTrips((prev) => prev.filter((t) => t.id !== tripId))
      } else {
        // Remover el pasajero calificado de la lista
        if (selectedTrip) {
          setTripPassengers((prev) => {
            const updated = { ...prev }
            if (updated[selectedTrip.id]) {
              updated[selectedTrip.id] = updated[selectedTrip.id].filter(
                (p) => p.id !== selectedPassengerId
              )
              // Si no quedan pasajeros, remover el viaje
              if (updated[selectedTrip.id].length === 0) {
                setTrips((prev) => prev.filter((t) => t.id !== selectedTrip.id))
              }
            }
            return updated
          })
        }
      }
      
      setSelectedTrip(null)
      setSelectedPassengerId(null)
      setRating(0)
      setComment("")
    } catch (err: any) {
      showToast(err.message || "Error al calificar", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const openRatingDialog = (trip: Trip, passengerId?: string) => {
    setSelectedTrip(trip)
    if (passengerId) {
      setSelectedPassengerId(passengerId)
    }
    setRating(0)
    setComment("")
  }

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {userType === "passenger" ? "Calificar conductores" : "Calificar pasajeros"}
          </h1>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg m-4">
          <p className="text-destructive text-center mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null)
              setLoading(true)
              // Recargar los datos
              const fetchData = async () => {
                try {
                  setLoading(true)
                  setError(null)
                  
                  if (userType === "passenger") {
                    const tripsRes = await fetch(`https://rumbo-back-production.up.railway.app/api/trips/users/${userId}`)
                    if (!tripsRes.ok) throw new Error("Error al cargar viajes")
                    const tripsData = await tripsRes.json()
                    
                    const completedTrips = (tripsData.data || []).filter(
                      (trip: Trip) => trip.state === "completed" && trip.driverId !== userId
                    )
                    setTrips(completedTrips)
                  } else {
                    const tripsRes = await fetch(`https://rumbo-back-production.up.railway.app/api/trips/users/${userId}`)
                    if (!tripsRes.ok) throw new Error("Error al cargar viajes")
                    const tripsData = await tripsRes.json()
                    
                    const completedTrips = (tripsData.data || []).filter(
                      (trip: Trip) => trip.state === "completed" && trip.driverId === userId
                    )
                    setTrips(completedTrips)
                    
                    const passengersMap: Record<string, Passenger[]> = {}
                    await Promise.all(
                      completedTrips.map(async (trip: Trip) => {
                        try {
                          const passengersRes = await fetch(
                            `https://rumbo-back-production.up.railway.app/api/trips/${trip.id}/passengers`
                          )
                          if (passengersRes.ok) {
                            const passengersData = await passengersRes.json()
                            passengersMap[trip.id] = passengersData.data || []
                          }
                        } catch (err) {
                          console.error(`Error fetching passengers for trip ${trip.id}:`, err)
                          passengersMap[trip.id] = []
                        }
                      })
                    )
                    setTripPassengers(passengersMap)
                  }
                } catch (err: any) {
                  setError(err.message)
                } finally {
                  setLoading(false)
                }
              }
              fetchData()
            }}
            className="w-full"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      )}

      {/* Content - Solo mostrar si no está cargando y no hay error */}
      {!loading && !error && (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {userType === "passenger" ? (
          // Vista para pasajeros
          trips.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tenés viajes completados pendientes de calificar.
            </p>
          ) : (
            trips.map((trip) => (
              <Card key={trip.id} className="p-4 space-y-3">
                <div>
                  <p className="font-semibold">
                    {trip.origin} → {trip.destination}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" /> {trip.date} - {trip.time}
                  </div>
                </div>
                <Button
                  onClick={() => openRatingDialog(trip)}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Calificar conductor
                </Button>
              </Card>
            ))
          )
        ) : (
          // Vista para conductores
          trips.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tenés viajes completados con pasajeros para calificar.
            </p>
          ) : (
            trips
              .filter((trip) => {
                const passengers = tripPassengers[trip.id] || []
                return passengers.length > 0
              })
              .map((trip) => {
                const passengers = tripPassengers[trip.id] || []
                
                return (
                  <Card key={trip.id} className="p-4 space-y-3">
                    <div>
                      <p className="font-semibold">
                        {trip.origin} → {trip.destination}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" /> {trip.date} - {trip.time}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {passengers.map((passenger) => (
                        <div key={passenger.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <span className="text-sm font-medium">{passenger.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({passenger.seats} {passenger.seats === 1 ? "asiento" : "asientos"})
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openRatingDialog(trip, passenger.id)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Calificar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })
          )
          )}
        </div>
      )}

      {/* Dialog de calificación */}
      <Dialog open={!!selectedTrip} onOpenChange={() => {
        setSelectedTrip(null)
        setSelectedPassengerId(null)
        setRating(0)
        setComment("")
      }}>
        <DialogContent className="sm:max-w-md p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {userType === "passenger" ? "Calificar conductor" : "Calificar pasajero"}
            </h2>
            
            {selectedTrip && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{selectedTrip.origin} → {selectedTrip.destination}</p>
                <p>{selectedTrip.date} - {selectedTrip.time}</p>
              </div>
            )}

            {/* Estrellas */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comentario */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentario (opcional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Cómo fue tu experiencia?"
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTrip(null)
                  setSelectedPassengerId(null)
                  setRating(0)
                  setComment("")
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedTrip) {
                    const targetUserId = userType === "passenger" 
                      ? selectedTrip.driverId 
                      : selectedPassengerId
                    
                    if (!targetUserId) {
                      showToast("Error: No se pudo identificar al usuario a calificar", "error")
                      return
                    }
                    
                    handleRate(selectedTrip.id, targetUserId)
                  }
                }}
                disabled={submitting || rating === 0}
                className="flex-1"
              >
                {submitting ? "Enviando..." : "Enviar calificación"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


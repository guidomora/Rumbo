"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Star, MapPin, Calendar, Settings, Shield, Award, Car, DollarSign, Edit } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface ProfileScreenProps {
  onBack: () => void
  userType: "passenger" | "driver"
  onLogout: () => void
  userId?: string | null
}

const tripHistory = [
  {
    id: 1,
    from: "Olavarría",
    to: "Once, CABA",
    date: "20 Sep 2024",
    price: 8500,
    rating: 5,
  },
  {
    id: 2,
    from: "Once, CABA",
    to: "Olavarría",
    date: "18 Sep 2024",
    price: 8500,
    rating: 5,
  },
  {
    id: 3,
    from: "Olavarría",
    to: "Retiro, CABA",
    date: "15 Sep 2024",
    price: 7800,
    rating: 4,
  },
]

export function ProfileScreen({ onBack, userType, onLogout, userId }: ProfileScreenProps) {
  const [editing, setEditing] = useState(false)

  // editable fields
  const [fullName, setFullName] = useState<string>("")
  const [about, setAbout] = useState<string>(
    "Estudiante de UADE, viajo todos los días desde Olavarría. Me gusta la música y conversar durante el viaje.\nSiempre puntual!"
  )
  const [vehicle, setVehicle] = useState<string>("Toyota Corolla")
  const [vehicleDetails, setVehicleDetails] = useState<string>("2020 • Blanco • ABC 123")

  // backups for cancel
  const [backup, setBackup] = useState({ fullName: "", about: "", vehicle: "", vehicleDetails: "" })

  const [loadingUser, setLoadingUser] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      setLoadingUser(true)
      try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`)
        if (!res.ok) throw new Error("Error al obtener datos de usuario")
        const data = await res.json()
        const user = data.user || data.data || {}
        if (user.fullName) setFullName(user.fullName)
        if (user.about) setAbout(user.about)
        if (user.vehicle) setVehicle(user.vehicle)
        if (user.vehicleDetails) setVehicleDetails(user.vehicleDetails)
      } catch (err: any) {
        setUserError(err.message)
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUser()
  }, [userId])

  const startEdit = () => {
    setBackup({ fullName, about, vehicle, vehicleDetails })
    setEditing(true)
  }

  const handleCancel = () => {
    setFullName(backup.fullName)
    setAbout(backup.about)
    setVehicle(backup.vehicle)
    setVehicleDetails(backup.vehicleDetails)
    setEditing(false)
  }

  const handleSave = async () => {
    if (!userId) {
      showToast("User ID ausente", "error")
      return
    }
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, about, vehicle, vehicleDetails }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Error al guardar perfil")
      }
      showToast("Perfil actualizado correctamente", "success")
      setEditing(false)
    } catch (err: any) {
      showToast(err.message || "Error al guardar", "error")
    }
  }

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

          <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12" />
          </div>
          {editing ? (
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-center text-2xl font-bold mb-1"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
          )}
          <p className="text-sm opacity-90 mb-3">{userType === "driver" ? "Conductor verificado" : "Pasajero"}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              <Shield className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              <Award className="w-3 h-3 mr-1" />
              Usuario destacado
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 -mt-8">
        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">4.9</div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">Calificación</p>
        </Card>

        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">45</div>
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Viajes</p>
        </Card>

        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">8</div>
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Meses</p>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 space-y-6">
        {/* About */}
        <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Sobre mí</h3>
              <Button variant="ghost" size="sm" onClick={startEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {editing ? (
              <Textarea value={about} onChange={(e) => setAbout(e.target.value)} className="text-sm text-muted-foreground" />
            ) : (
              <p className="text-sm text-muted-foreground">{about}</p>
            )}
        </Card>

        {/* Vehicle (if driver) */}
        {userType === "driver" && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mi vehículo</h3>
              <Button variant="ghost" size="sm" onClick={startEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                {editing ? (
                  <div>
                    <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="font-medium" />
                    <Input value={vehicleDetails} onChange={(e) => setVehicleDetails(e.target.value)} className="text-sm text-muted-foreground mt-1" />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{vehicle}</p>
                    <p className="text-sm text-muted-foreground">{vehicleDetails}</p>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Trip History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Historial de viajes</h3>
            <Button variant="link" className="text-sm p-0 h-auto">
              Ver todos
            </Button>
          </div>

          <div className="space-y-3">
            {tripHistory.map((trip) => (
              <Card key={trip.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="font-medium">{trip.from}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span className="font-medium">{trip.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(trip.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span>{trip.price.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Logros</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-xs font-medium">Puntual</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-medium">Confiable</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium">5 estrellas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
  <div className="mt-5 p-6 border-t border-border bg-card space-y-2">
        {editing ? (
          <div className="space-y-2">
            <Button className="w-full h-12" onClick={handleSave}>
              Guardar cambios
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" className="w-full bg-transparent" onClick={startEdit}>
              Editar perfil
            </Button>
            <Button variant="ghost" className="w-full text-destructive" onClick={onLogout}>
              Cerrar sesión
            </Button>
          </>
        )}
      </div>
      
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Star,
  MapPin,
  Calendar,
  Settings,
  Shield,
  Award,
  Car,
  DollarSign,
  Edit,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface ProfileScreenProps {
  onBack: () => void;
  userType: "passenger" | "driver";
  onLogout: () => void;
  userId?: string | null;
}

interface Trip {
  id: string;
  driverId: string;
  createdByUserId: string | null;
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  pricePerPerson: number;
  vehicle: string;
  music: boolean;
  pets: boolean;
  children: boolean;
  luggage: boolean;
  state: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ProfileScreen({
  onBack,
  userType,
  onLogout,
  userId,
}: ProfileScreenProps) {
  const [editingAbout, setEditingAbout] = useState(false);

  // editable fields
  const [fullName, setFullName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");
  const [vehicleDetails, setVehicleDetails] = useState<string>("");

  // backups for cancel
  const [backupAbout, setBackupAbout] = useState("");

  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    console.log("Fetching data for userId:", userId);

    const fetchUser = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const url = `https://rumbo-back-production.up.railway.app/api/users/${userId}`;
        console.log("Fetching user from:", url);
        const res = await fetch(url);
        console.log("User response status:", res.status);
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error("User fetch error:", errorData);
          throw new Error(`Error ${res.status}: ${errorData}`);
        }
        
        const data = await res.json();
        console.log("User data received:", data);
        
        // Intentar diferentes estructuras de respuesta
        const user = data.user || data.data || data;
        console.log("Parsed user:", user);
        
        // Intentar obtener el nombre de diferentes campos posibles
        const userName = user.fullName || user.name || user.Name || "";
        console.log("User name found:", userName);
        if (userName) setFullName(userName);
        
        // Intentar cargar "about" desde localStorage primero
        try {
          const storedAbout = localStorage.getItem(`user_about_${userId}`);
          if (storedAbout) {
            setAbout(storedAbout);
          } else if (user.about) {
            setAbout(user.about);
          }
        } catch {
          // Si hay error, usar el de la API
          if (user.about) setAbout(user.about);
        }
        
        if (user.vehicle) setVehicle(user.vehicle);
        if (user.vehicleDetails) setVehicleDetails(user.vehicleDetails);
      } catch (err: any) {
        console.error("User fetch error:", err);
        setUserError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchTrips = async () => {
      setLoadingTrips(true);
      setTripsError(null);
      try {
        // Obtener todos los viajes y filtrar por usuario
        const url = `https://rumbo-back-production.up.railway.app/api/trips`;
        console.log("Fetching trips from:", url);
        const res = await fetch(url);
        console.log("Trips response status:", res.status);
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error("Trips fetch error:", errorData);
          throw new Error(`Error ${res.status}: ${errorData}`);
        }
        
        const data = await res.json();
        console.log("Trips data received:", data);
        
        // Intentar diferentes estructuras de respuesta
        let tripsData = data.trips || data.data || data || [];
        console.log("All trips:", tripsData);
        
        // Filtrar viajes del usuario actual
        if (Array.isArray(tripsData)) {
          tripsData = tripsData.filter(
            (trip: Trip) => trip.driverId === userId || trip.createdByUserId === userId
          );
          console.log("Filtered trips for user:", tripsData);
        }
        
        setTrips(Array.isArray(tripsData) ? tripsData : []);
      } catch (err: any) {
        console.error("Trips fetch error:", err);
        setTripsError(err.message);
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchUser();
    fetchTrips();
  }, [userId]);

  const startEdit = () => {
    setBackupAbout(about);
    setEditingAbout(true);
  };

  const handleCancel = () => {
    setAbout(backupAbout);
    setEditingAbout(false);
  };

  const handleSave = async () => {
    if (!userId) {
      showToast("User ID ausente", "error");
      return;
    }
    try {
      // Guardar en localStorage
      localStorage.setItem(`user_about_${userId}`, about);
      
      showToast("Perfil actualizado correctamente", "success");
      setEditingAbout(false);
    } catch (err: any) {
      console.error("Save error:", err);
      showToast(err.message || "Error al guardar", "error");
    }
  };

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-linear-to-b from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center text-center gap-4 mb-4">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>

            <div className="flex flex-col items-start">
              {loadingUser ? (
                <h2 className="text-1xl font-bold mb-1">Cargando...</h2>
              ) : userError ? (
                <h2 className="text-1xl font-bold mb-1 text-destructive">Error</h2>
              ) : (
                <h2 className="text-1xl font-bold mb-1">{fullName || "Usuario"}</h2>
              )}
              <p className="text-sm opacity-90 mb-1">
                {userType === "driver" ? "Conductor verificado" : "Pasajero"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-15">
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0"
            >
              <Shield className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0"
            >
              <Award className="w-3 h-3 mr-1" />
              Usuario destacado
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 -mt-20">
        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">4.3</div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">Calificación</p>
        </Card>

        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {trips.length}
          </div>
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Viajes</p>
        </Card>

        <Card className="p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">3</div>
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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Sobre mí</h3>
            <Button variant="ghost" size="sm" onClick={startEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          {loadingUser ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : editingAbout ? (
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="text-sm text-muted-foreground"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {about || "No hay información disponible"}
            </p>
          )}
        </Card>

        {/* Vehicle (if driver) */}
        {userType === "driver" && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Mi vehículo</h3>
            </div>
            {loadingUser ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{vehicle || "Sin información"}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicleDetails || "Sin detalles"}
                  </p>
                </div>
              </div>
            )}
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
            {loadingTrips ? (
              <p className="text-sm text-muted-foreground">
                Cargando viajes...
              </p>
            ) : tripsError ? (
              <p className="text-sm text-destructive">{tripsError}</p>
            ) : trips.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay viajes disponibles
              </p>
            ) : (
              trips.map((trip: Trip) => (
                <Card key={trip.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="font-medium">{trip.origin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-secondary" />
                        <span className="font-medium">{trip.destination}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-primary">
                        {trip.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {trip.date} {trip.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <DollarSign className="w-3 h-3" />
                      <span>${trip.pricePerPerson.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold">Logros</h3>
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
              <p className="text-xs font-medium">4 estrellas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-5 p-6 border-t border-border bg-card space-y-2">
        {editingAbout ? (
          <div className="space-y-2">
            <Button className="w-full h-12" onClick={handleSave}>
              Guardar cambios
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              className="w-full text-destructive"
              onClick={onLogout}
            >
              Cerrar sesión
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
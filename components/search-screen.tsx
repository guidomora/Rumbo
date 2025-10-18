"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

interface SearchScreenProps {
  onBack: () => void;
  onSelectTrip: (tripId: string) => void;
}

interface Trip {
  id: string;
  driverId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  pricePerPerson: number;
  music?: boolean;
  pets?: boolean;
  children?: boolean;
  luggage?: boolean;
  notes?: string;
}

export function SearchScreen({ onBack, onSelectTrip }: SearchScreenProps) {
  const [filters, setFilters] = useState({
    music: false,
    pets: false,
    kids: false,
    luggage: false,
    custom: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [lastTrip, setLastTrip] = useState<Trip | null>({
    id: "99",
    driverId: "Lucía Fernández",
    origin: "Bahía Blanca",
    destination: "Mar del Plata",
    date: "10-12-2023",
    time: "08:00",
    availableSeats: 1,
    pricePerPerson: 12000,
    music: true,
    pets: false,
    children: true,
    luggage: true,
    notes: "Salida puntual desde la terminal.",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrips([
      {
        id: "1",
        driverId: "María González",
        origin: "Olavarría",
        destination: "Once, CABA",
        date: "25-11-2023",
        time: "14:30",
        availableSeats: 2,
        pricePerPerson: 8500,
        music: true,
        pets: false,
        children: true,
        luggage: true,
      },
      {
        id: "2",
        driverId: "Carlos Rodríguez",
        origin: "Chivilcoy",
        destination: "Retiro, CABA",
        date: "25-11-2023",
        time: "14:30",
        availableSeats: 3,
        pricePerPerson: 8500,
        music: false,
        pets: true,
        children: false,
        luggage: true,
      },
      {
        id: "3",
        driverId: "Juan Pérez",
        origin: "Mercedes",
        destination: "Palermo, CABA",
        date: "25-11-2023",
        time: "14:30",
        availableSeats: 3,
        pricePerPerson: 8500,
        music: true,
        pets: true,
        children: false,
        luggage: false,
      },
    ]);
    setLoading(false);
  }, []);

  // Función para normalizar cadenas eliminando tildes
  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  };

  // Aplicar filtros
  const filteredTrips = trips.filter((trip) => {
    if (filters.music && !trip.music) return false;
    if (filters.pets && !trip.pets) return false;
    if (filters.kids && !trip.children) return false;
    if (filters.luggage && !trip.luggage) return false;
    if (
      searchFilters.origin &&
      !normalizeString(trip.origin).includes(
        normalizeString(searchFilters.origin)
      )
    )
      return false;
    if (
      searchFilters.destination &&
      !normalizeString(trip.destination).includes(
        normalizeString(searchFilters.destination)
      )
    )
      return false;
    if (searchFilters.date && trip.date !== searchFilters.date) return false;
    if (filters.custom) {
      const query = normalizeString(filters.custom);
      const tripString = normalizeString(
        `${trip.driverId} ${trip.origin} ${trip.destination} ${trip.notes ?? ""}`
      );
      if (!tripString.includes(query)) return false;
    }
    return true;
  });

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
        <div className="flex flex-col gap-2">
          {/* Input Origen */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <Input
              placeholder="Origen"
              className="flex-1"
              value={searchFilters.origin}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, origin: e.target.value })
              }
            />
          </div>

          {/* Input Destino */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
            <Input
              placeholder="Destino"
              className="flex-1"
              value={searchFilters.destination}
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  destination: e.target.value,
                })
              }
            />
          </div>

          {/* Fecha y Filtro en la misma fila */}
          <div className="flex items-center gap-2">
            {/* Input Fecha */}
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                type="date"
                className="flex-1"
                value={searchFilters.date}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, date: e.target.value })
                }
              />
            </div>

            {/* Botón de filtro */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh] p-4 overflow-auto">
                <SheetHeader>
                  <SheetTitle>Filtros de búsqueda</SheetTitle>
                  <SheetDescription>
                    Personalizá tu búsqueda según tus preferencias
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-auto mt-4 space-y-4">
                  <Card className="p-4 bg-background border border-border">
                    {[
                      {
                        id: "music",
                        label: "Música durante el viaje",
                        icon: Music,
                      },
                      { id: "pets", label: "Acepta mascotas", icon: Dog },
                      { id: "kids", label: "Acepta niños", icon: Baby },
                      {
                        id: "luggage",
                        label: "Espacio para equipaje",
                        icon: Luggage,
                      },
                    ].map(({ id, label, icon: Icon }) => (
                      <div
                        key={id}
                        className="flex items-center justify-between border-b last:border-b-0 pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor={id}>{label}</Label>
                        </div>
                        <Switch
                          id={id}
                          checked={(filters as any)[id]}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, [id]: checked })
                          }
                        />
                      </div>
                    ))}
                  </Card>
                  <div className="mt-4">
                    <Label htmlFor="customFilter" className="h-10">Filtro personalizado</Label>
                    <Input className="h-5"
                      id="customFilter"
                      placeholder="Ejemplo: destino playa, precio barato..."
                      value={filters.custom}
                      onChange={(e) => setFilters({ ...filters, custom: e.target.value })}
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
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando viajes...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredTrips.length} viajes encontrados
            </p>

            <div className="space-y-3">
              {lastTrip && (
                <Card
                  key="last-trip"
                  className="p-4 border-primary border-2 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTrip(lastTrip.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{lastTrip.driverId}</p>
                        <Badge variant="secondary" className="text-xs">
                          Sugerencia - Último viaje
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{lastTrip.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="font-medium">
                        {lastTrip.destination}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    onSelectTrip(trip.id);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{trip.driverId}</p>
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            Conductor ID
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {trip.availableSeats}{" "}
                      {trip.availableSeats === 1 ? "lugar" : "lugares"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{trip.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="font-medium">{trip.destination}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
                    {trip.music && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        <Music className="w-3 h-3" />
                        Música
                      </Badge>
                    )}
                    {trip.pets && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        <Dog className="w-3 h-3" />
                        Mascotas
                      </Badge>
                    )}
                    {trip.children && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        <Baby className="w-3 h-3" />
                        Niños
                      </Badge>
                    )}
                    {trip.luggage && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        <Luggage className="w-3 h-3" />
                        Equipaje
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {trip.date} {trip.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-primary">
                      <DollarSign className="w-5 h-5" />
                      <span>{trip.pricePerPerson.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

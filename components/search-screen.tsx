"use client"

import { useEffect, useRef, useState } from "react";
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
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"


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
}

interface TripDetailsProps {
  trip: Trip
  onBack: () => void
}

interface SearchScreenProps {
  onBack: () => void
  onSelectTrip: (trip: Trip) => void
}

export function SearchScreen({ onBack, onSelectTrip }: SearchScreenProps) {
  const [filters, setFilters] = useState({
    music: false,
    pets: false,
    kids: false,
    luggage: false,
  })
  const [searchFilters, setSearchFilters] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  //coordenadas random de bsas, despues cambiar
  const center = { lat: -34.6037, lng: -58.3816 }
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [showOriginMap, setShowOriginMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);

  const originMapRef = useRef(null);
  const destinationMapRef = useRef(null);
 const originMapInstance = useRef<google.maps.Map | null>(null);
const destinationMapInstance = useRef<google.maps.Map | null>(null);


  // ✅ Cargar viajes desde el backend

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/trips")
        if (!res.ok) throw new Error("Error al obtener los viajes")
        const data = await res.json()
        setTrips(data.data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

    useEffect(() => {
    if (showOriginMap && originMapRef.current && !originMapInstance.current) {
      originMapInstance.current = initMap(
        originMapRef.current,
        setOrigin,
        () => setShowOriginMap(false), // cerrar mapa origen
        "Buscar origen..."
      );
    }

    if (showDestinationMap && destinationMapRef.current && !destinationMapInstance.current) {
      destinationMapInstance.current = initMap(
        destinationMapRef.current,
        setDestination,
        () => setShowDestinationMap(false), // cerrar mapa destino
        "Buscar destino..."
      );
    }
  }, [showOriginMap, showDestinationMap]);

  
  const initMap = (
    container: HTMLDivElement,
    setValue: (val: string) => void,
    onSelect: () => void,
    placeholder: string
  ) => {
    const map = new google.maps.Map(container, {
      center: { lat: -34.6037, lng: -58.3816 }, 
      zoom: 12,
    });

    const marker = new google.maps.Marker({
      map,
      draggable: true,
    });

    const geocoder = new google.maps.Geocoder();
    const input = document.createElement("input");
    input.placeholder = placeholder;
    input.type = "text";
    input.style.cssText =
      "width: 90%; margin: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 6px;";

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      if(place.geometry?.location){
        map.panTo(place.geometry.location);
        marker.setPosition(place.geometry.location);
        const formatted = place.formatted_address || input.value;
        setValue(formatted);
        onSelect(); // cerrar mapa
      }
    });

    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      marker.setPosition(e.latLng);
      geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const formatted = results[0].formatted_address;
          setValue(formatted);
          input.value = formatted;
          onSelect(); // cerrar mapa
        }
      });
    });

    return map;
  };

  // Función para normalizar cadenas eliminando tildes
  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  };

  // ✅ Aplicar filtros
  const filteredTrips = trips.filter((trip) => {
    if (filters.music && !trip.music) return false;
    if (filters.pets && !trip.pets) return false;
    if (filters.kids && !trip.children) return false;
    if (filters.luggage && !trip.luggage) return false;
    if (searchFilters.origin && !normalizeString(trip.origin).includes(normalizeString(searchFilters.origin))) return false;
    if (searchFilters.destination && !normalizeString(trip.destination).includes(normalizeString(searchFilters.destination))) return false;
    if (searchFilters.date && trip.date !== searchFilters.date) return false;
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
          <div className="space-y-2">
            {/* ORIGEN */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input
                placeholder="Origen"
                className="pl-10 transition-all border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={searchFilters.origin}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, origin: e.target.value })
                }
                onFocus={() => {
                  setShowOriginMap(true);
                  setShowDestinationMap(false);
                }}
              />

              {showOriginMap && (
                <div className="mt-3" style={{ height: "350px", width: "100%" }}>
                  <LoadScript
                    googleMapsApiKey="AIzaSyD_Ms_mWsr5B57C_sXg10Von2ryohtGfKo"
                    onLoad={() => setIsMapLoaded(true)}
                  >
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                      }}
                      center={center}
                      zoom={12}
                        options={{
                          disableDefaultUI: true,     
                          zoomControl: true,          
                          mapTypeControl: false,      
                          streetViewControl: false,  
                          fullscreenControl: false,   
                          clickableIcons: false,      
                        }}
                      onClick={(e) => {
                        const latLng = e.latLng;
                        const geocoder = new google.maps.Geocoder();

                        geocoder.geocode({ location: latLng }, (results, status) => {
                          
                          if (status === "OK" && results && results?.length>0) {
                            let generalLocation = "";

                            for (const result of results) {
                              const barrio = result.address_components.find(comp => comp.types.includes("neighborhood") || comp.types.includes("sublocality_level_1"));
                              if (barrio){
                                generalLocation = barrio.long_name;
                                break;
                              }
                            }

                            if (!generalLocation){
                              for(const result of results){
                                const admin2 = result.address_components.find(comp =>
                                comp.types.includes("administrative_area_level_2")
                              );
                              if(admin2){
                                generalLocation = admin2.long_name;
                                break;
                              }
                              }
                            }

                            if (!generalLocation) {
                              const locality = results[0].address_components.find(comp =>
                                comp.types.includes("locality")
                              );
                              generalLocation = locality ? locality.long_name : results[0].formatted_address;
                            }

                            setSearchFilters(prev => ({ ...prev, origin: generalLocation }));
                            setShowOriginMap(false);
                            setShowDestinationMap(true);
                          }
                        });
                      }}>
                    </GoogleMap>
                  </LoadScript>
                </div>
              )}
            </div>

            {/* DESTINO */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-secondary" />
              <Input
                placeholder="Destino"
                className="pl-10 transition-all border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={searchFilters.destination}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, destination: e.target.value })
                }
                onFocus={() => {
                  setShowDestinationMap(true);
                  setShowOriginMap(false);
                }}
              />

              {showDestinationMap && (
                <div className="mt-3" style={{ height: "350px", width: "100%" }}>
                  <LoadScript
                    googleMapsApiKey="AIzaSyD_Ms_mWsr5B57C_sXg10Von2ryohtGfKo"
                    onLoad={() => setIsMapLoaded(true)}
                  >
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                      }}
                      zoom={12}
                      options={{
                          disableDefaultUI: true,     
                          zoomControl: true,          
                          mapTypeControl: false,      
                          streetViewControl: false,  
                          fullscreenControl: false,   
                          clickableIcons: false,      
                        }}
                      center={center}
                      onClick={(e) => {
                        const latLng = e.latLng;
                        const geocoder = new google.maps.Geocoder();

                        geocoder.geocode({ location: latLng }, (results, status) => {
                          if (status === "OK" && results && results?.length>0) {
                            let generalLocation = "";

                            for (const result of results) {
                              const barrio = result.address_components.find(comp => comp.types.includes("neighborhood") || comp.types.includes("sublocality_level_1"));
                              if (barrio){
                                generalLocation = barrio.long_name;
                                break;
                              }
                            }

                            if (!generalLocation){
                              for(const result of results){
                                const admin2 = result.address_components.find(comp =>
                                comp.types.includes("administrative_area_level_2")
                              );
                              if(admin2){
                                generalLocation = admin2.long_name;
                                break;
                              }
                              }
                            }

                            if (!generalLocation) {
                              const locality = results[0].address_components.find(comp =>
                                comp.types.includes("locality")
                              );
                              generalLocation = locality ? locality.long_name : results[0].formatted_address;
                            }

                            setSearchFilters(prev => ({ ...prev, destination: generalLocation }));
                            setShowDestinationMap(false);
                          }
                        });
                      }}

                    >
                    </GoogleMap>
                  </LoadScript>
                </div>
              )}
            </div>

            {/* FECHA */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={searchFilters.date}
                  onFocus={(e) => {
                    // cerrar mapas
                    setShowOriginMap(false);
                    setShowDestinationMap(false);

                    const input = e.target;
                    requestAnimationFrame(() => input.focus());
                  }}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, date: e.target.value })
                  }
                />
              </div>



            {/* Sheet de filtros */}
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
                  {[
                    { id: "music", label: "Música durante el viaje", icon: Music },
                    { id: "pets", label: "Acepta mascotas", icon: Dog },
                    { id: "kids", label: "Acepta niños", icon: Baby },
                    { id: "luggage", label: "Espacio para equipaje", icon: Luggage },
                  ].map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor={id}>{label}</Label>
                      </div>
                      <Switch
                        id={id}
                        checked={(filters as any)[id]}
                        onCheckedChange={(checked) => setFilters({ ...filters, [id]: checked })}
                      />
                    </div>
                  ))}
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
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTrip(trip)}
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
                          <span className="text-xs text-muted-foreground">Conductor ID</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {trip.availableSeats} {trip.availableSeats === 1 ? "lugar" : "lugares"}
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

                  <div className="flex items-center gap-2 mb-3">
                    {trip.music && <Badge variant="outline" className="text-xs"><Music className="w-3 h-3 mr-1" />Música</Badge>}
                    {trip.pets && <Badge variant="outline" className="text-xs"><Dog className="w-3 h-3 mr-1" />Mascotas</Badge>}
                    {trip.children && <Badge variant="outline" className="text-xs"><Baby className="w-3 h-3 mr-1" />Niños</Badge>}
                    {trip.luggage && <Badge variant="outline" className="text-xs"><Luggage className="w-3 h-3 mr-1" />Equipaje</Badge>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{trip.date} {trip.time}</span>
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
  )
}

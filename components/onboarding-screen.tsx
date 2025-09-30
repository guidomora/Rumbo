"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, Users, Shield, Leaf } from "lucide-react"

interface OnboardingScreenProps {
  onComplete: () => void
}

const slides = [
  {
    icon: Car,
    title: "Viajá compartiendo",
    description: "Conectá con conductores y pasajeros que van hacia tu mismo destino",
  },
  {
    icon: Users,
    title: "Comunidad confiable",
    description: "Perfiles verificados y sistema de calificaciones para tu seguridad",
  },
  {
    icon: Shield,
    title: "Viajes seguros",
    description: "Geolocalización en tiempo real y contactos de emergencia",
  },
  {
    icon: Leaf,
    title: "Sustentable y económico",
    description: "Ahorrá dinero mientras cuidás el medio ambiente",
  },
]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const CurrentIcon = slides[currentSlide].icon

  return (
    <div className="h-[800px] flex flex-col bg-gradient-to-b from-primary/10 to-background">
      {/* Logo */}
      <div className="p-6 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary">RUMBO</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <CurrentIcon className="w-16 h-16 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-balance">{slides[currentSlide].title}</h2>

        <p className="text-muted-foreground text-lg text-balance">{slides[currentSlide].description}</p>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"}`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <Button onClick={handleNext} className="w-full h-12 text-base font-semibold" size="lg">
          {currentSlide < slides.length - 1 ? "Siguiente" : "Comenzar"}
        </Button>

        {currentSlide < slides.length - 1 && (
          <Button onClick={onComplete} variant="ghost" className="w-full">
            Saltar
          </Button>
        )}
      </div>
    </div>
  )
}

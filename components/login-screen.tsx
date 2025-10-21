"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Mail, Lock, User, Phone, CreditCard } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userType: "passenger" | "driver", userId: string | null) => void

}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"passenger" | "driver" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = await response.json()
      setIsLoggedIn(true) // Marcar como logueado
      setUserId(data.user.id); // Guardar el userId recibido
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      alert("Hubo un problema al iniciar sesión")
    }
  }

  return (
    <div className="h-[800px] flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 text-center border-b border-border">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary">RUMBO</h1>
        </div>
        <p className="text-sm text-muted-foreground">Viajá compartiendo, ahorrá y cuidá el planeta</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isLoggedIn ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Selecciona tu rol:</p>
                <Button
                  className="w-full h-12"
                  size="lg"
                  onClick={() => setUserType("passenger")}
                >
                  Ingresar como Pasajero
                </Button>
                <Button
                  className="w-full h-12"
                  size="lg"
                  variant="secondary"
                  onClick={() => setUserType("driver")}
                >
                  Ingresar como Conductor
                </Button>
                {userType && (
                  (() => {
                    onLogin(userType, userId);
                    return null;
                  })()
                )}
              </div>
            ) : (
              <Button onClick={handleLogin} className="w-full h-12" size="lg">
                Ingresar
              </Button>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Juan Pérez" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="reg-email" type="email" placeholder="tu@email.com" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="+54 9 11 1234-5678" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="dni" placeholder="12.345.678" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="reg-password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button onClick={() => onLogin("passenger", userId)} className="w-full h-12" size="lg">
                Crear cuenta
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Al registrarte, aceptás nuestros Términos y Condiciones
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

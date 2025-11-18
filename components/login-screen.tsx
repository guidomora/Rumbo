"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { useToast } from "@/components/ui/toast"
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
  
  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    dni: ""
  })

  const handleLogin = async () => {
    if(!email && !password ){
      showToast("Por favor ingresá tu email y contraseña", "error")
      return
    }
    if (!email) {
      showToast("Por favor ingresá tu email", "error")
      return
    }
    if (!password) {
      showToast("Por favor ingresá tu contraseña", "error")
      return
    }

    try {
      const response = await fetch("https://rumbo-back-production.up.railway.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      console.log(response)

      // If login failed, try to surface specific server errors
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        if (response.status === 404) {
          // Email not found
          showToast(errBody.message || "Email no registrado", "error")
          return
        }
        if (response.status === 401) {
          // Wrong password
          showToast(errBody.message || "Contraseña incorrecta", "error")
          return
        }

        // Generic fallback
        showToast(errBody.message || "Credenciales inválidas", "error")
        return
      }

      const data = await response.json()
      // Success
      setIsLoggedIn(true) // Marcar como logueado
      setUserId(data.user?.id ?? null)// Guardar el userId recibido

      if(data.user?.id ?? null){
        localStorage.setItem("userId", data.user.id)
      }

      showToast("Inicio de sesión exitoso", "success")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)
      showToast(error?.message || "Hubo un problema al iniciar sesión", "error")
    }
  }

  const handleForgotPassword = async () => {
    // Open modal handled in component — function kept for compatibility
    setForgotModalOpen(true)
  }

  // Modal state for forgot password
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotPassword, setForgotPassword] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const { showToast } = useToast()

  const submitForgot = async () => {
    const emailToUse = forgotEmail || email || registerData.email
    const passwordToUse = forgotPassword || password || registerData.password
    if (!emailToUse) {
      showToast("Por favor ingresá un email válido", "error")
      return
    }
    if (!passwordToUse) {
      showToast("Por favor ingresá una nueva contraseña", "error")
      return
    }

    setForgotLoading(true)
    try {
      const url = `https://rumbo-back-production.up.railway.app/api/users/${encodeURIComponent(emailToUse)}/password`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordToUse }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Error al solicitar recuperación de contraseña")
      }
      showToast("Se ha cambiado la contraseña correctamente", "success")
      setForgotModalOpen(false)
    } catch (err: any) {
      console.error(err)
      showToast(err.message || "Hubo un error al solicitar la recuperación", "error")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("https://rumbo-back-production.up.railway.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })
      console.log(response)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al registrar usuario")
      }

      const data = await response.json()
  setUserId(data.user.id)
  showToast("¡Registro exitoso! Ahora puedes iniciar sesión.", "success")
      
      // Limpiar el formulario
      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        dni: ""
      })
    } catch (error) {
      console.error("Error al registrar:", error)
      showToast(error instanceof Error ? error.message : "Hubo un problema al registrar el usuario", "error")
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
              <>
                <Button onClick={handleLogin} className="w-full h-12" size="lg">
                  Ingresar
                </Button>
                <Button variant="link" className="w-full mt-2 text-center" onClick={() => setForgotModalOpen(true)}>
                  ¿Olvidaste tu contraseña?
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="Juan Pérez" 
                  className="pl-10"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="pl-10"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+54 9 11 1234-5678" 
                  className="pl-10"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="dni" 
                  placeholder="12.345.678" 
                  className="pl-10"
                  value={registerData.dni}
                  onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="reg-password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleRegister} 
                className="w-full h-12" 
                size="lg"
              >
                Crear cuenta
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Al registrarte, aceptás nuestros Términos y Condiciones
            </p>
          </TabsContent>
        </Tabs>
      </div>

  <Modal open={forgotModalOpen} title="Recuperar contraseña" onClose={() => { setForgotModalOpen(false); }}>
        <div className="space-y-3">
          <Label htmlFor="forgot-email">Email</Label>
          <Input id="forgot-email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="tu@email.com" />
          <Input id="forgot-password" value={forgotPassword} onChange={(e) => setForgotPassword(e.target.value)} placeholder="*********" />
          
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={submitForgot} disabled={forgotLoading}>{forgotLoading ? "Enviando..." : "Enviar"}</Button>
            <Button variant="ghost" className="flex-1" onClick={() => { setForgotModalOpen(false); }}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

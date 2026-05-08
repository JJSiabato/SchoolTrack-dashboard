"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { School, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/useAuthStore"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      toast.success("Bienvenido a SchoolTrack")
      router.push("/dashboard")
    } else {
      toast.error("Credenciales incorrectas")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-md shadow-2xl border-primary/10 backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-4 items-center text-center pb-8 pt-8">
          <div className="flex items-center justify-center rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
            <School className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">SchoolTrack</CardTitle>
            <CardDescription className="text-base">
              Smart Academic Management
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="admin"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="admin"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base group">
              Iniciar Sesión
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 text-sm text-muted-foreground">
          Usa admin / admin para ingresar
        </CardFooter>
      </Card>
    </div>
  )
}

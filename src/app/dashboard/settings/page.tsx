"use client"

import { useState } from "react"
import { useSchoolStore } from "@/store/useSchoolStore"
import { useTheme } from "next-themes"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SettingsPage() {
  const { settings, updateSettings } = useSchoolStore()
  const { setTheme } = useTheme()
  
  const [formData, setFormData] = useState({
    institutionName: settings.institutionName,
    academicYear: settings.academicYear,
    gradingScale: settings.gradingScale,
    theme: settings.theme,
  })

  const handleSave = () => {
    updateSettings(formData)
    setTheme(formData.theme)
    toast.success("Configuración guardada exitosamente")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administre la configuración general del sistema y la institución.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil Institucional</CardTitle>
          <CardDescription>
            Datos básicos de la institución educativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Nombre de la Institución</Label>
            <Input 
              id="institutionName" 
              value={formData.institutionName} 
              onChange={e => setFormData({...formData, institutionName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicYear">Año Lectivo Actual</Label>
            <Input 
              id="academicYear" 
              value={formData.academicYear} 
              onChange={e => setFormData({...formData, academicYear: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias del Sistema</CardTitle>
          <CardDescription>
            Ajustes visuales y operativos del software.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradingScale">Escala de Calificaciones</Label>
              <select 
                id="gradingScale" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.gradingScale}
                onChange={e => setFormData({...formData, gradingScale: e.target.value as any})}
              >
                <option value="0-5">0.0 - 5.0 (Nacional)</option>
                <option value="0-10">0 - 10 (Internacional)</option>
                <option value="0-100">0 - 100 (Porcentual)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Tema Visual</Label>
              <select 
                id="theme" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.theme}
                onChange={e => setFormData({...formData, theme: e.target.value as any})}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

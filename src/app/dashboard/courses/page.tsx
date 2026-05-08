"use client"

import { useState } from "react"
import { useSchoolStore } from "@/store/useSchoolStore"
import { BookOpen, Users, Clock, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function CoursesPage() {
  const { courses, teachers, students, grades, addCourse, updateCourse, deleteCourse } = useSchoolStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    directorId: "",
    schedule: "Morning",
    academicYear: "2026",
  })

  const handleOpenDialog = (course?: any) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        name: course.name,
        code: course.code,
        directorId: course.directorId,
        schedule: course.schedule,
        academicYear: course.academicYear,
      })
    } else {
      setEditingCourse(null)
      setFormData({
        name: "",
        code: "",
        directorId: "",
        schedule: "Morning",
        academicYear: "2026",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingCourse) {
      updateCourse({ ...editingCourse, ...formData })
    } else {
      addCourse({
        id: crypto.randomUUID(),
        ...formData,
      } as any)
    }
    setIsDialogOpen(false)
  }

  const getTeacherName = (id: string) => {
    const t = teachers.find((t) => t.id === id)
    return t ? `${t.firstName} ${t.lastName}` : "Sin Asignar"
  }

  const getStudentsCount = (courseId: string) => {
    return students.filter((s) => s.courseId === courseId).length
  }

  const getCourseAverage = (courseId: string) => {
    const courseGrades = grades.filter((g) => g.courseId === courseId)
    if (courseGrades.length === 0) return "N/A"
    const avg = courseGrades.reduce((acc, g) => acc + g.score, 0) / courseGrades.length
    return avg.toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Gestión de cursos, directores de grupo y métricas por nivel.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <span className="sr-only">Abrir menú</span>
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleOpenDialog(course)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Curso
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteCourse(course.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center">
                      <BookOpen className="mr-2 h-3 w-3" />
                      Director
                    </span>
                    <span className="font-medium text-foreground">{getTeacherName(course.directorId)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      Jornada
                    </span>
                    <span className="font-medium text-foreground">
                      {course.schedule === "Morning" ? "Mañana" : course.schedule === "Afternoon" ? "Tarde" : "Única"}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="mr-2 h-3 w-3" />
                      Estudiantes
                    </span>
                    <span className="font-medium text-foreground">{getStudentsCount(course.id)} inscritos</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <div className="flex w-full justify-between items-center text-sm">
                <span className="text-muted-foreground">Promedio General</span>
                <Badge variant="secondary" className="font-bold">
                  {getCourseAverage(course.id)}
                </Badge>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Editar Curso" : "Nuevo Curso"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Modifica los detalles del curso aquí." : "Ingresa los datos del nuevo curso."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="director" className="text-right">Director</Label>
              <div className="col-span-3">
                <Select value={formData.directorId} onValueChange={(v) => setFormData({ ...formData, directorId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule" className="text-right">Jornada</Label>
              <div className="col-span-3">
                <Select value={formData.schedule} onValueChange={(v) => setFormData({ ...formData, schedule: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jornada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Mañana</SelectItem>
                    <SelectItem value="Afternoon">Tarde</SelectItem>
                    <SelectItem value="Full-day">Única</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

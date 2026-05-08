"use client"

import { useState } from "react"
import { useSchoolStore } from "@/store/useSchoolStore"
import { Plus, Search, Trash2, Edit, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Student } from "@/types"
import { toast } from "sonner"

export default function StudentsPage() {
  const { students, courses, addStudent, updateStudent, deleteStudent } = useSchoolStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  // Form states
  const [formData, setFormData] = useState<Partial<Student>>({})

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student)
      setFormData(student)
    } else {
      setEditingStudent(null)
      setFormData({
        status: "Active",
        gender: "Other"
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.document || !formData.courseId) {
      toast.error("Por favor complete los campos requeridos")
      return
    }

    if (editingStudent) {
      updateStudent(formData as Student)
      toast.success("Estudiante actualizado exitosamente")
    } else {
      const newStudent: Student = {
        ...(formData as Student),
        id: `s${Math.random().toString(36).substr(2, 9)}`,
      }
      addStudent(newStudent)
      toast.success("Estudiante creado exitosamente")
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este estudiante?")) {
      deleteStudent(id)
      toast.success("Estudiante eliminado")
    }
  }

  const exportCSV = () => {
    toast.success("Exportando lista de estudiantes a CSV...")
    // Simulated export
  }

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.document.includes(searchTerm)
  )

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || "N/A"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estudiantes</h2>
          <p className="text-muted-foreground">
            Gestión de estudiantes matriculados en la institución.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Estudiante
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o documento..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Acudiente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.document}</TableCell>
                  <TableCell>{getCourseName(student.courseId)}</TableCell>
                  <TableCell>{student.guardian}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                      {student.status === "Active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(student)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}</DialogTitle>
            <DialogDescription>
              Ingrese los datos del estudiante. Haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombres</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName || ""} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName || ""} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document">Documento</Label>
                <Input 
                  id="document" 
                  value={formData.document || ""} 
                  onChange={e => setFormData({...formData, document: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <select 
                  id="course" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.courseId || ""}
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="" disabled>Seleccione un curso</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian">Acudiente</Label>
              <Input 
                id="guardian" 
                value={formData.guardian || ""} 
                onChange={e => setFormData({...formData, guardian: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email || ""} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  value={formData.phone || ""} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

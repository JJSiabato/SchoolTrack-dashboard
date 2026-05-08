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
import { Teacher } from "@/types"
import { toast } from "sonner"

export default function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchoolStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const [formData, setFormData] = useState<Partial<Teacher>>({})

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher)
      setFormData(teacher)
    } else {
      setEditingTeacher(null)
      setFormData({
        status: "Active",
        courseIds: []
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.specialty || !formData.subject) {
      toast.error("Por favor complete los campos requeridos")
      return
    }

    if (editingTeacher) {
      updateTeacher(formData as Teacher)
      toast.success("Docente actualizado exitosamente")
    } else {
      const newTeacher: Teacher = {
        ...(formData as Teacher),
        id: `t${Math.random().toString(36).substr(2, 9)}`,
      }
      addTeacher(newTeacher)
      toast.success("Docente creado exitosamente")
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este docente?")) {
      deleteTeacher(id)
      toast.success("Docente eliminado")
    }
  }

  const filteredTeachers = teachers.filter(
    (t) =>
      t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Docentes</h2>
          <p className="text-muted-foreground">
            Gestión de docentes y asignación de materias.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Docente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o especialidad..."
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
              <TableHead>Especialidad</TableHead>
              <TableHead>Materia Principal</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </TableCell>
                  <TableCell>{teacher.specialty}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.courseIds.length}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>
                      {teacher.status === "Active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(teacher)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(teacher.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
            <DialogTitle>{editingTeacher ? "Editar Docente" : "Nuevo Docente"}</DialogTitle>
            <DialogDescription>
              Ingrese los datos del docente.
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
                <Label htmlFor="specialty">Especialidad</Label>
                <Input 
                  id="specialty" 
                  value={formData.specialty || ""} 
                  onChange={e => setFormData({...formData, specialty: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Materia Principal</Label>
                <Input 
                  id="subject" 
                  value={formData.subject || ""} 
                  onChange={e => setFormData({...formData, subject: e.target.value})} 
                />
              </div>
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

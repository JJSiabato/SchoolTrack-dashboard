"use client"

import { useState, useEffect } from "react"
import { useSchoolStore } from "@/store/useSchoolStore"
import { Calendar, Save, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { AttendanceStatus } from "@/types"

export default function AttendancePage() {
  const { courses, students, attendances, addAttendance } = useSchoolStore()
  
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  
  // State for current edits
  const [currentAttendances, setCurrentAttendances] = useState<Record<string, AttendanceStatus>>({})

  const courseStudents = students.filter(s => s.courseId === selectedCourse)

  // Initialize current attendances when course/date changes
  // Check if there's already attendance for this date
  const loadAttendance = () => {
    if (!selectedCourse) return

    const existingRecords = attendances.filter(
      a => a.courseId === selectedCourse && a.date === selectedDate
    )

    const initialMap: Record<string, AttendanceStatus> = {}
    
    courseStudents.forEach(student => {
      const existing = existingRecords.find(r => r.studentId === student.id)
      initialMap[student.id] = existing ? existing.status : "Present" // Default Present
    })
    
    setCurrentAttendances(initialMap)
  }

  // Effect to reload when selections change
  useEffect(() => {
    loadAttendance()
  }, [selectedCourse, selectedDate])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentAttendances(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = () => {
    if (!selectedCourse) return

    // Create new records
    const newRecords = courseStudents.map(student => ({
      id: `a${Math.random().toString(36).substr(2, 9)}`,
      studentId: student.id,
      courseId: selectedCourse,
      subject: "General",
      date: selectedDate,
      status: currentAttendances[student.id] || "Present"
    }))

    // In a real app we'd update existing ones, for the MVP we'll just add
    addAttendance(newRecords)
    toast.success("Asistencia guardada exitosamente")
  }

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-500 hover:bg-green-600">Presente</Badge>
      case "Absent":
        return <Badge variant="destructive">Ausente</Badge>
      case "Late":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Tarde</Badge>
      case "Excused":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Justificado</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Asistencias</h2>
        <p className="text-muted-foreground">
          Registro diario de asistencia por curso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Asistencia</CardTitle>
          <CardDescription>Seleccione un curso y la fecha para tomar asistencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="course">Curso</Label>
              <select 
                id="course" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="" disabled>Seleccione un curso</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-8"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lista de Estudiantes</CardTitle>
              <CardDescription>
                {courseStudents.length} estudiantes inscritos
              </CardDescription>
            </div>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Asistencia
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Estado Actual</TableHead>
                    <TableHead className="text-right">Marcar Como</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseStudents.length > 0 ? (
                    courseStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.lastName}, {student.firstName}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(currentAttendances[student.id] || "Present")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="sm" 
                              variant={currentAttendances[student.id] === "Present" ? "default" : "outline"}
                              className={currentAttendances[student.id] === "Present" ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => handleStatusChange(student.id, "Present")}
                              title="Presente"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentAttendances[student.id] === "Absent" ? "destructive" : "outline"}
                              onClick={() => handleStatusChange(student.id, "Absent")}
                              title="Ausente"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentAttendances[student.id] === "Late" ? "default" : "outline"}
                              className={currentAttendances[student.id] === "Late" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                              onClick={() => handleStatusChange(student.id, "Late")}
                              title="Tarde"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={currentAttendances[student.id] === "Excused" ? "default" : "outline"}
                              className={currentAttendances[student.id] === "Excused" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
                              onClick={() => handleStatusChange(student.id, "Excused")}
                              title="Justificado"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No hay estudiantes en este curso.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

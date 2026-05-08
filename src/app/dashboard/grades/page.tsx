"use client"

import { useState, useEffect } from "react"
import { useSchoolStore } from "@/store/useSchoolStore"
import { Save, FileSpreadsheet } from "lucide-react"
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
import { GradeRecord } from "@/types"

export default function GradesPage() {
  const { courses, students, grades, addGrade, updateGrade } = useSchoolStore()
  
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("Matemáticas")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Q1")
  
  // State for current edits
  const [currentGrades, setCurrentGrades] = useState<Record<string, { score: number, obs: string, id?: string }>>({})

  const subjects = ["Matemáticas", "Ciencias", "Inglés", "Historia", "Física", "Química", "Literatura", "Arte"]
  const periods = ["Q1", "Q2", "Q3", "Q4"]

  const courseStudents = students.filter(s => s.courseId === selectedCourse)

  const loadGrades = () => {
    if (!selectedCourse) return

    const existingRecords = grades.filter(
      g => g.courseId === selectedCourse && g.subject === selectedSubject && g.period === selectedPeriod
    )

    const initialMap: Record<string, { score: number, obs: string, id?: string }> = {}
    
    courseStudents.forEach(student => {
      const existing = existingRecords.find(r => r.studentId === student.id)
      initialMap[student.id] = existing 
        ? { score: existing.score, obs: existing.observation, id: existing.id }
        : { score: 0, obs: "" } 
    })
    
    setCurrentGrades(initialMap)
  }

  useEffect(() => {
    loadGrades()
  }, [selectedCourse, selectedSubject, selectedPeriod])

  const handleScoreChange = (studentId: string, val: string) => {
    const num = parseFloat(val)
    const score = isNaN(num) ? 0 : num
    setCurrentGrades(prev => ({ 
      ...prev, 
      [studentId]: { ...prev[studentId], score: score > 5 ? 5 : score < 0 ? 0 : score } 
    }))
  }

  const handleObsChange = (studentId: string, obs: string) => {
    setCurrentGrades(prev => ({ 
      ...prev, 
      [studentId]: { ...prev[studentId], obs } 
    }))
  }

  const handleSave = () => {
    if (!selectedCourse) return

    courseStudents.forEach(student => {
      const data = currentGrades[student.id]
      if (data) {
        if (data.id) {
          // Update
          updateGrade({
            id: data.id,
            studentId: student.id,
            courseId: selectedCourse,
            subject: selectedSubject,
            period: selectedPeriod,
            score: data.score,
            observation: data.obs
          })
        } else if (data.score > 0 || data.obs !== "") {
          // Add new if there's data
          addGrade({
            id: `g${Math.random().toString(36).substr(2, 9)}`,
            studentId: student.id,
            courseId: selectedCourse,
            subject: selectedSubject,
            period: selectedPeriod,
            score: data.score,
            observation: data.obs
          })
        }
      }
    })

    toast.success("Calificaciones guardadas exitosamente")
    loadGrades() // Refresh IDs
  }

  const getPerformanceBadge = (score: number) => {
    if (score === 0) return <Badge variant="outline">Sin calificar</Badge>
    if (score >= 4.5) return <Badge className="bg-primary hover:bg-primary/90">Superior</Badge>
    if (score >= 4.0) return <Badge className="bg-green-500 hover:bg-green-600">Alto</Badge>
    if (score >= 3.0) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Básico</Badge>
    return <Badge variant="destructive">Bajo</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calificaciones</h2>
        <p className="text-muted-foreground">
          Registro y gestión de notas académicas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="course">Curso</Label>
              <select 
                id="course" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              <Label htmlFor="subject">Materia</Label>
              <select 
                id="subject" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="period">Periodo</Label>
              <select 
                id="period" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
              >
                {periods.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Registro de Notas</CardTitle>
              <CardDescription>
                Escala de 0.0 a 5.0
              </CardDescription>
            </div>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Notas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead className="w-32">Nota</TableHead>
                    <TableHead>Desempeño</TableHead>
                    <TableHead>Observación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseStudents.length > 0 ? (
                    courseStudents.map(student => {
                      const data = currentGrades[student.id] || { score: 0, obs: "" }
                      return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.lastName}, {student.firstName}
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="5"
                            value={data.score || ""}
                            onChange={e => handleScoreChange(student.id, e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          {getPerformanceBadge(data.score)}
                        </TableCell>
                        <TableCell>
                          <Input 
                            placeholder="Añadir observación..."
                            value={data.obs}
                            onChange={e => handleObsChange(student.id, e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    )})
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
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

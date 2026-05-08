"use client"

import { useSchoolStore } from "@/store/useSchoolStore"
import { Download, FileText, PieChart as PieChartIcon, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { toast } from "sonner"

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const { students, courses, grades } = useSchoolStore()

  // Data for Students by Course PieChart
  const studentsByCourse = courses.map(course => {
    return {
      name: course.code,
      value: students.filter(s => s.courseId === course.id).length
    }
  }).filter(c => c.value > 0)

  // Data for Average Grade by Subject BarChart
  const subjects = [...new Set(grades.map(g => g.subject))]
  const gradesBySubject = subjects.map(subject => {
    const subjectGrades = grades.filter(g => g.subject === subject)
    const avg = subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length 
      : 0
    return {
      name: subject,
      Promedio: Number(avg.toFixed(1))
    }
  })

  // Data for Performance Distribution
  const getPerformanceCount = (min: number, max: number) => {
    return grades.filter(g => g.score >= min && (max === 5 ? g.score <= max : g.score < max)).length
  }
  const performanceData = [
    { name: 'Superior (4.5 - 5.0)', value: getPerformanceCount(4.5, 5) },
    { name: 'Alto (4.0 - 4.4)', value: getPerformanceCount(4.0, 4.5) },
    { name: 'Básico (3.0 - 3.9)', value: getPerformanceCount(3.0, 4.0) },
    { name: 'Bajo (0.0 - 2.9)', value: getPerformanceCount(0, 3.0) },
  ]

  const exportReport = (reportName: string) => {
    toast.success(`Generando reporte de ${reportName}...`, {
      description: "El archivo PDF comenzará a descargarse en breve."
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
          <p className="text-muted-foreground">
            Visualización de métricas y generación de informes oficiales.
          </p>
        </div>
        <Button onClick={() => exportReport("Consolidado General")}>
          <Download className="mr-2 h-4 w-4" />
          Descargar Consolidado
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Estudiantes por Curso
            </CardTitle>
            <CardDescription>Distribución de matrícula</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentsByCourse}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {studentsByCourse.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Promedio por Materia
            </CardTitle>
            <CardDescription>Rendimiento global académico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradesBySubject} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip />
                  <Bar dataKey="Promedio" fill="var(--color-primary, #2563eb)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Desempeño</CardTitle>
            <CardDescription>Clasificación de todas las calificaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" name="Calificaciones" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index === 0 ? '#3b82f6' : 
                        index === 1 ? '#10b981' : 
                        index === 2 ? '#f59e0b' : '#ef4444'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Boletines</CardTitle>
            <CardDescription>Generar boletines informativos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <Button variant="secondary" onClick={() => exportReport("Boletines")}>Generar PDF</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asistencia</CardTitle>
            <CardDescription>Reporte detallado de inasistencias</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <Button variant="secondary" onClick={() => exportReport("Asistencia")}>Generar Excel</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sábana de Notas</CardTitle>
            <CardDescription>Registro completo de calificaciones</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <Button variant="secondary" onClick={() => exportReport("Sábana de Notas")}>Generar Excel</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

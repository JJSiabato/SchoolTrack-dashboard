"use client"

import { useSchoolStore } from "@/store/useSchoolStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, AlertCircle, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { startOfWeek, format, subDays, isSameDay } from "date-fns"

export default function DashboardPage() {
  const { students, teachers, courses, attendances, grades } = useSchoolStore()

  // Calculate KPIs
  const totalStudents = students.length
  const totalTeachers = teachers.length
  const totalCourses = courses.length

  // Calculate average attendance for today
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")
  const todayAttendances = attendances.filter(a => a.date === todayStr)
  const presentToday = todayAttendances.filter(a => a.status === "Present" || a.status === "Late").length
  const attendanceRate = todayAttendances.length > 0 
    ? Math.round((presentToday / todayAttendances.length) * 100) 
    : 0

  // Calculate academic average
  const averageGrade = grades.length > 0
    ? (grades.reduce((acc, g) => acc + g.score, 0) / grades.length).toFixed(1)
    : "0.0"

  // Students in risk (average below 3.0)
  const studentsWithRisk = new Set(
    grades.filter(g => g.score < 3.0).map(g => g.studentId)
  ).size

  // Mock data for attendance chart
  const last5Days = Array.from({ length: 5 }).map((_, i) => {
    const d = subDays(today, 4 - i)
    return format(d, "yyyy-MM-dd")
  })

  const attendanceData = last5Days.map(date => {
    const dayRecords = attendances.filter(a => a.date === date)
    const present = dayRecords.filter(a => a.status === "Present" || a.status === "Late").length
    const absent = dayRecords.filter(a => a.status === "Absent" || a.status === "Excused").length
    return {
      name: format(new Date(date), "EEE"), // e.g., Mon, Tue
      Presentes: present,
      Ausentes: absent,
    }
  })

  // Mock data for courses performance
  const coursePerformance = courses.map(course => {
    const courseGrades = grades.filter(g => g.courseId === course.id)
    const avg = courseGrades.length > 0 
      ? courseGrades.reduce((acc, g) => acc + g.score, 0) / courseGrades.length 
      : 0
    return {
      name: course.code,
      Promedio: Number(avg.toFixed(1))
    }
  }).slice(0, 5) // Show top 5

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general de la institución académica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Docentes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Activos actualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Promedio general de hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Académico</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade} / 5.0</div>
            <p className="text-xs text-muted-foreground">Escala general</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Asistencia Semanal</CardTitle>
            <CardDescription>Resumen de asistencia de los últimos 5 días.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="Presentes" fill="var(--color-primary, #2563eb)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ausentes" fill="var(--color-destructive, #ef4444)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Rendimiento por Curso</CardTitle>
            <CardDescription>Promedio académico de los top 5 cursos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Promedio" stroke="var(--color-primary, #2563eb)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Alertas Académicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Estudiantes en riesgo</p>
                  <p className="text-sm text-muted-foreground">
                    Tienen promedio inferior a 3.0
                  </p>
                </div>
                <div className="ml-auto font-medium text-destructive">{studentsWithRisk}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Inasistencias altas</p>
                  <p className="text-sm text-muted-foreground">
                    Más de 3 fallas esta semana
                  </p>
                </div>
                <div className="ml-auto font-medium text-amber-500">12</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

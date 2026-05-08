import { Student, Teacher, Course, AttendanceRecord, GradeRecord, Settings } from "@/types";
import { addDays, format, subDays } from "date-fns";

const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofía", "Diego", "Valentina", "Andrés", "Camila", "Mateo", "Isabella", "Alejandro"];
const lastNames = ["García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Gómez", "Sánchez", "Díaz", "Torres", "Ramírez", "Ruiz", "Mendoza", "Castillo", "Rojas"];

const generateId = () => Math.random().toString(36).substr(2, 9);
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateMockCourses = (): Course[] => {
  return [
    { id: "c1", name: "10A - Matemáticas Avanzadas", code: "MAT-10A", directorId: "t1", schedule: "Morning", academicYear: "2026" },
    { id: "c2", name: "10B - Ciencias Generales", code: "SCI-10B", directorId: "t2", schedule: "Afternoon", academicYear: "2026" },
    { id: "c3", name: "11A - Física Aplicada", code: "PHY-11A", directorId: "t3", schedule: "Morning", academicYear: "2026" },
    { id: "c4", name: "11B - Química Orgánica", code: "CHE-11B", directorId: "t4", schedule: "Afternoon", academicYear: "2026" },
    { id: "c5", name: "9A - Historia Universal", code: "HIS-09A", directorId: "t5", schedule: "Morning", academicYear: "2026" },
    { id: "c6", name: "9B - Literatura", code: "LIT-09B", directorId: "t6", schedule: "Afternoon", academicYear: "2026" },
    { id: "c7", name: "8A - Inglés Intermedio", code: "ENG-08A", directorId: "t7", schedule: "Morning", academicYear: "2026" },
    { id: "c8", name: "8B - Arte y Diseño", code: "ART-08B", directorId: "t8", schedule: "Afternoon", academicYear: "2026" },
  ];
};

export const generateMockTeachers = (): Teacher[] => {
  const teachers: Teacher[] = [];
  const subjects = ["Matemáticas", "Ciencias", "Física", "Química", "Historia", "Literatura", "Inglés", "Arte"];
  for (let i = 1; i <= 10; i++) {
    teachers.push({
      id: `t${i}`,
      firstName: randomElement(firstNames),
      lastName: randomElement(lastNames),
      specialty: randomElement(subjects),
      subject: randomElement(subjects),
      email: `teacher${i}@schooltrack.edu`,
      phone: `+57 300 ${randomInt(1000000, 9999999)}`,
      status: i <= 9 ? "Active" : "Inactive",
      courseIds: [`c${randomInt(1, 8)}`, `c${randomInt(1, 8)}`],
    });
  }
  return teachers;
};

export const generateMockStudents = (): Student[] => {
  const students: Student[] = [];
  for (let i = 1; i <= 50; i++) {
    const fn = randomElement(firstNames);
    const ln = randomElement(lastNames);
    students.push({
      id: `s${i}`,
      firstName: fn,
      lastName: ln,
      document: `${randomInt(1000000000, 1999999999)}`,
      courseId: `c${randomInt(1, 8)}`,
      age: randomInt(13, 18),
      gender: randomElement(["Male", "Female"]),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@student.schooltrack.edu`,
      phone: `+57 310 ${randomInt(1000000, 9999999)}`,
      status: "Active",
      guardian: `${randomElement(firstNames)} ${ln}`,
    });
  }
  return students;
};

export const generateMockAttendance = (students: Student[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generar asistencia para los últimos 5 días
  for (let d = 0; d < 5; d++) {
    const targetDate = format(subDays(today, d), "yyyy-MM-dd");
    students.forEach(student => {
      const isAbsent = Math.random() > 0.9;
      const isLate = Math.random() > 0.85;
      let status: "Present" | "Absent" | "Late" | "Excused" = "Present";
      if (isAbsent) status = Math.random() > 0.5 ? "Absent" : "Excused";
      else if (isLate) status = "Late";

      records.push({
        id: generateId(),
        studentId: student.id,
        courseId: student.courseId,
        subject: "General",
        date: targetDate,
        status,
      });
    });
  }
  return records;
};

export const generateMockGrades = (students: Student[]): GradeRecord[] => {
  const records: GradeRecord[] = [];
  const subjects = ["Matemáticas", "Ciencias", "Inglés", "Historia"];
  const periods = ["Q1", "Q2"];

  students.forEach(student => {
    subjects.forEach(subject => {
      periods.forEach(period => {
        const score = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0 mostly
        records.push({
          id: generateId(),
          studentId: student.id,
          courseId: student.courseId,
          subject,
          period,
          score,
          observation: score >= 4.5 ? "Excelente rendimiento" : score >= 3.5 ? "Buen trabajo" : "Necesita mejorar",
        });
      });
    });
  });
  return records;
};

export const defaultSettings: Settings = {
  institutionName: "Colegio San José",
  academicYear: "2026",
  gradingScale: "0-5",
  theme: "system",
};

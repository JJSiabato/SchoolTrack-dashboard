export type Gender = "Male" | "Female" | "Other";
export type StudentStatus = "Active" | "Inactive";
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";
export type GradeLevel = "Bajo" | "Básico" | "Alto" | "Superior";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  courseId: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  status: StudentStatus;
  guardian: string;
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  subject: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  courseIds: string[]; // Cursos asignados
}

export interface Course {
  id: string;
  name: string; // e.g. "Grade 10A"
  code: string;
  directorId: string;
  schedule: "Morning" | "Afternoon" | "Full-day";
  academicYear: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  subject: string;
  date: string; // ISO string YYYY-MM-DD
  status: AttendanceStatus;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  subject: string;
  period: string; // e.g. "Q1", "Q2"
  score: number; // 0.0 to 5.0
  observation: string;
}

export interface Settings {
  institutionName: string;
  academicYear: string;
  gradingScale: "0-5" | "0-10" | "0-100";
  theme: "light" | "dark" | "system";
}

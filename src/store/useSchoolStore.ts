import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Teacher, Course, AttendanceRecord, GradeRecord, Settings } from '@/types';
import { generateMockStudents, generateMockTeachers, generateMockCourses, generateMockAttendance, generateMockGrades, defaultSettings } from '@/lib/mockData';

interface SchoolState {
  isInitialized: boolean;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  attendances: AttendanceRecord[];
  grades: GradeRecord[];
  settings: Settings;

  // Actions
  initializeData: () => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  addAttendance: (records: AttendanceRecord[]) => void;
  updateAttendance: (record: AttendanceRecord) => void;
  
  addGrade: (grade: GradeRecord) => void;
  updateGrade: (grade: GradeRecord) => void;
  
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      students: [],
      teachers: [],
      courses: [],
      attendances: [],
      grades: [],
      settings: defaultSettings,

      initializeData: () => {
        if (get().isInitialized) return;
        const students = generateMockStudents();
        set({
          isInitialized: true,
          courses: generateMockCourses(),
          teachers: generateMockTeachers(),
          students,
          attendances: generateMockAttendance(students),
          grades: generateMockGrades(students),
        });
      },

      addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
      updateStudent: (student) => set((state) => ({ students: state.students.map((s) => (s.id === student.id ? student : s)) })),
      deleteStudent: (id) => set((state) => ({ students: state.students.filter((s) => s.id !== id) })),

      addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, teacher] })),
      updateTeacher: (teacher) => set((state) => ({ teachers: state.teachers.map((t) => (t.id === teacher.id ? teacher : t)) })),
      deleteTeacher: (id) => set((state) => ({ teachers: state.teachers.filter((t) => t.id !== id) })),

      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (course) => set((state) => ({ courses: state.courses.map((c) => (c.id === course.id ? course : c)) })),
      deleteCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),


      addAttendance: (records) => set((state) => ({ attendances: [...state.attendances, ...records] })),
      updateAttendance: (record) => set((state) => ({ attendances: state.attendances.map((a) => (a.id === record.id ? record : a)) })),

      addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
      updateGrade: (grade) => set((state) => ({ grades: state.grades.map((g) => (g.id === grade.id ? grade : g)) })),

      updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'schooltrack-data-storage',
    }
  )
);

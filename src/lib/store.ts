import { useEffect, useState } from "react";

export type Student = {
  id: string;
  name: string;
  usn: string;
  department: string;
  semester: string;
  attendance: number;
  internal: number;
  assignment: number;
};

const STUDENTS_KEY = "spps.students";
const AUTH_KEY = "spps.auth";

export function predict(attendance: number, internal: number, assignment: number) {
  // simple weighted score
  const score = attendance * 0.35 + (internal / 30) * 100 * 0.45 + (assignment / 20) * 100 * 0.2;
  const pass = score >= 55;
  const confidence = Math.max(50, Math.min(99, Math.round(pass ? score : 100 - score)));
  return { pass, confidence: confidence, score: Math.round(score) };
}

function read(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list: Student[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("spps:students"));
}

export function useStudents() {
  const [list, setList] = useState<Student[]>([]);
  useEffect(() => {
    setList(read());
    const h = () => setList(read());
    window.addEventListener("spps:students", h);
    return () => window.removeEventListener("spps:students", h);
  }, []);
  return list;
}

export function addStudent(s: Omit<Student, "id">) {
  const list = read();
  list.unshift({ ...s, id: crypto.randomUUID() });
  write(list);
}

export function updateStudent(id: string, patch: Partial<Student>) {
  write(read().map((s) => (s.id === id ? { ...s, ...patch } : s)));
}

export function deleteStudent(id: string) {
  write(read().filter((s) => s.id !== id));
}

export function login(user: string, pass: string) {
  if (user && pass) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, at: Date.now() }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function useAuth() {
  const [auth, setAuth] = useState<{ user: string } | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      setAuth(raw ? JSON.parse(raw) : null);
    } catch {
      setAuth(null);
    }
    setReady(true);
  }, []);
  return { auth, ready };
}
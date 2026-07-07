import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

type Row = {
  id: string;
  name: string;
  usn: string;
  department: string;
  semester: string;
  attendance: number;
  internal_marks: number;
  assignment_marks: number;
};

function fromRow(r: Row): Student {
  return {
    id: r.id,
    name: r.name,
    usn: r.usn,
    department: r.department,
    semester: r.semester,
    attendance: Number(r.attendance),
    internal: Number(r.internal_marks),
    assignment: Number(r.assignment_marks),
  };
}

export function predict(attendance: number, internal: number, assignment: number) {
  const score = attendance * 0.35 + (internal / 30) * 100 * 0.45 + (assignment / 20) * 100 * 0.2;
  const pass = score >= 55;
  const confidence = Math.max(50, Math.min(99, Math.round(pass ? score : 100 - score)));
  return { pass, confidence, score: Math.round(score) };
}

const KEY = ["students"] as const;

export function useStudents(): Student[] {
  const { data } = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Row[]).map(fromRow);
    },
  });
  return data ?? [];
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Omit<Student, "id">) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("students").insert({
        user_id: u.user.id,
        name: s.name,
        usn: s.usn,
        department: s.department,
        semester: s.semester,
        attendance: s.attendance,
        internal_marks: s.internal,
        assignment_marks: s.assignment,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export async function logout() {
  await supabase.auth.signOut();
}
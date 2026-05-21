"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { User } from "@/types/api";

type AdminContextValue = {
  user: User;
  isAdmin: boolean;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function AdminProvider({ user, children }: { user: User; children: ReactNode }) {
  return (
    <AdminContext.Provider value={{ user, isAdmin: user.role === "admin" }}>
      {children}
    </AdminContext.Provider>
  );
}

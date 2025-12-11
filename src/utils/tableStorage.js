import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTableStore = create(
  persist(
    (set) => ({
      table: null,

      setTable: (table) => set({ table }),

      clearTable: () => set({ table: null }),
    }),
    {
      name: "table-storage",
    }
  )
);

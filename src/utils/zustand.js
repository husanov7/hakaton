import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const setOrder = create(
  persist(
    (set) => ({
      order: [],
      addOrder: (dish) => set((state) => ({ order: [...state.order, dish] })),
      delOrder: () => set((state) => ({ order: [] })),
    }),
    {
      name: "food-storage",
    }
  )
);

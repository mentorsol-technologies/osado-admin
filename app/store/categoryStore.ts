import { create } from "zustand";

interface Category {
  name: string;
  status: "Active" | "Inactive";
  description: string;
  image?: string;
}

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (index: number, category: Category) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (index, category) =>
    set((state) => {
      const updated = [...state.categories];
      updated[index] = category;
      return { categories: updated };
    }),
}));

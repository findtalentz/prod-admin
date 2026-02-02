import { create } from "zustand";

type Category = {
  _id: string;
  name: string;
  type: string;
  image: string;
};

interface CategoryStore {
  category: Category | null;
  setCategory: (category: Category) => void;
  clearCategory: () => void;
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  category: null,
  setCategory: (category: Category) => set(() => ({ category })),
  clearCategory: () => set(() => ({ category: null })),
}));

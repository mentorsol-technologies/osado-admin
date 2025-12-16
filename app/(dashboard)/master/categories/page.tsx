"use client";

import { Music, Dumbbell, Palette, Briefcase, Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/hooks/useCategoryMutations";
import { toast } from "react-toastify";
import AddCategoryModal from "./AddCategoryForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategoryMutation();
  const { data, isLoading, isError } = useCategoriesQuery();

  const handleAdd = (data: any) => {
    console.log("New category added:", data);
    // call API here to save new category
  };

  const handleDelete = () => {
    if (!selectedCategory?.id) return;

    deleteCategory(selectedCategory.id, {
      onSuccess: () => {
        toast.error("category deleted Successfully!");
        setDeleteOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Categories Management
        </h2>
        <Button onClick={() => setAddOpen(true)} leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline">Add New Category</span>
        </Button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-black-400 rounded-xl shadow-md p-4 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg bg-black-300" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-black-300" />
                    <Skeleton className="h-3 w-1/2 bg-black-300" />
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-3 w-full bg-black-300" />
                  <Skeleton className="h-3 w-5/6 bg-black-300" />
                  <Skeleton className="h-3 w-2/3 bg-black-300" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-9 w-full bg-black-300" />
                  <Skeleton className="h-9 w-full bg-black-300" />
                </div>
              </div>
            ))
          : data?.map((cat: any) => (
              <CategoryCard
                key={cat.id}
                iconUrl={cat.iconUrl}
                name={cat.name}
                categoryID={cat.categoryID}
                createdDate={cat.createdAt}
                subCategoriesCount={cat.subCategoriesCount}
                status={cat.status}
                onEdit={() => {
                  setSelectedCategory(cat);
                  setEditOpen(true);
                }}
                onDelete={() => {
                  setSelectedCategory(cat);
                  setDeleteOpen(true);
                }}
              />
            ))}
      </div>
      {/* Add Modal */}
      <AddCategoryModal
        open={addOpen}
        setOpen={setAddOpen}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      <EditCategoryModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedCategory={
          selectedCategory && {
            id: selectedCategory.id,
            name: selectedCategory.name,
            status: selectedCategory.status,
            description: selectedCategory.description,
            image: selectedCategory.iconUrl,
          }
        }
        onSave={(data) => console.log("Updated:", data)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

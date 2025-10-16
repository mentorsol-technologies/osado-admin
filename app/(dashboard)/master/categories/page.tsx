"use client";

import { Music, Dumbbell, Palette, Briefcase, Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import AddCategoryModal from "./AddCategoryForm";
import { useCategoriesQuery, useDeleteCategoryMutation } from "@/hooks/useCategoryMutations";
import { toast } from 'react-toastify';


export default function Categories() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategoryMutation();
  const { data, isLoading, isError } = useCategoriesQuery();
  console.log("user Data", data)

  const handleAdd = (data: any) => {
    console.log("New category added:", data);
    // call API here to save new category
  };

  const handleDelete = () => {
    if (!selectedCategory?.id) return;

    deleteCategory(selectedCategory.id, {
      onSuccess: () => {
        toast.error("category deleted Successfully!")
        setDeleteOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">

      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">Categories Management</h2>
        <Button
          onClick={() => setAddOpen(true)}
          leftIcon={<Plus size={18} />}
        >
          <span className="hidden md:inline">Add New Category</span>
        </Button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <CategoryCard key={i} isLoading />
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
        description={`Are you sure you want to delete "${selectedCategory?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

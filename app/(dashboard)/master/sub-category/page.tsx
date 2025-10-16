"use client";

import { Music, Dumbbell, Palette, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import EditSubCategoryModal from "./EditSubcategoryForm";
import AddSubCategoryModal from "./AddSubcategoryForm";
import SubCategoryCard from "./SubCategoryCard";
import { useDeleteSubCategoryMutation, useSubCategoriesQuery } from "@/hooks/useSubCategoriesMutations";
import { toast } from 'react-toastify';

export default function SubCategories() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading, isError } = useSubCategoriesQuery();
  const { mutate: deleteSubCategory, isPending } = useDeleteSubCategoryMutation();


  const handleAdd = (data: any) => {
    console.log("New category added:", data);
    // call API here to save new category
  };

  const handleDelete = () => {
    if (!selectedCategory?.id) return;

    deleteSubCategory(selectedCategory.id, {
      onSuccess: () => {
        toast.error("subcategory deleted successfully !")
        setDeleteOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Subcategories for Travel & Outdoor
        </h2>
        <Button onClick={() => setAddOpen(true)} leftIcon={<Plus size={18} />}>
          <span className="hidden md:inline">Add Subcategory</span>
        </Button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SubCategoryCard key={i} isLoading />
            ))
          :data?.map((cat: any) => (
          <SubCategoryCard
             key={cat.id}
            iconUrl={cat.iconUrl}
            name={cat.name}
            subCategoryID={cat.subCategoryID}
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
      <AddSubCategoryModal
        open={addOpen}
        setOpen={setAddOpen}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      <EditSubCategoryModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedCategory={selectedCategory}
        onSave={(data) => console.log("Updated:", data)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Subcategory"
        description={`Are you sure you want to delete "${selectedCategory?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

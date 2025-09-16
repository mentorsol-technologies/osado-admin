"use client";

import { Music, Dumbbell, Palette, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddCategoryModal from "../categories/AddCategoryForm";
import EditCategoryModal from "../categories/EditCategoryForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import CategoryCard from "../categories/CategoryCard";

const categories = [
  {
    icon: Music,
    title: "Music & Concerts",
    id: "32456",
    createdDate: "12/03/2024",
    subcategories: 1,
    status: "Active",
  },
  {
    icon: Dumbbell,
    title: "Sports & Fitness",
    id: "32457",
    createdDate: "12/03/2024",
    subcategories: 3,
    status: "Active",
  },
  {
    icon: Palette,
    title: "Arts & Culture",
    id: "32458",
    createdDate: "12/03/2024",
    subcategories: 5,
    status: "Active",
  },
  {
    icon: Briefcase,
    title: "Business & Networking",
    id: "32459",
    createdDate: "12/03/2024",
    subcategories: 0,
    status: "Active",
  },
];

export default function SubCategories() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleAdd = (data: any) => {
    console.log("New category added:", data);
    // call API here to save new category
  };

  const handleDelete = () => {
    console.log("Category deleted:", selectedCategory);
  };

  return (
    <div className="p-6 bg-black-500 !min-h-[calc(100vh-120px)]  rounded-lg">
      
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Subcategories for Travel & Outdoor</h2>
        <Button
            onClick={() => setAddOpen(true)}
            leftIcon={<Plus size={18} />}
        > 
            <span className="hidden md:inline">Add Subcategory</span>
        </Button>
        </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            {...cat}
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
        selectedCategory={selectedCategory}
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

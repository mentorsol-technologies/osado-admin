"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRolesQuery, useDeleteRoleMutation } from "@/hooks/useRolesMutations";
import { Plus, Shield, Trash2 } from "lucide-react";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { MdOutlineEdit } from "react-icons/md";
import AddRoleModal from "./CreateRole";
import EditRoleModal from "./EditRole";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response, isLoading } = useRolesQuery(page, limit);
  const rolesList = (response as any)?.data ?? [];
  const total = (response as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleAddRole = (formData: any) => {
    console.log("New Role Added:", formData);
    setAddOpen(false);
  };

  const handleDelete = () => {
    if (!selectedRole?.id) return;
    deleteRole(selectedRole.id, {
      onSuccess: () => {
        toast.success("Role deleted successfully!");
        setDeleteOpen(false);
        setSelectedRole(null);
      },
    });
  };

  const columns = [
    {
      key: "iconURL",
      label: "Icon",
      render: (row: any) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.iconURL} alt={row.role} />
          <AvatarFallback>
            <Shield className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ),
    },
    { key: "role", label: "Role" },
    { key: "roleDescription", label: "Description" },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex justify-center gap-3">
          <button
            className="p-1 border border-black-600"
            onClick={() => {
              setSelectedRole(row);
              setEditOpen(true);
            }}
          >
            <MdOutlineEdit size={16} />
          </button>
          <button
            className="p-1 rounded-md bg-purple-600"
            onClick={() => {
              setSelectedRole(row);
              setDeleteOpen(true);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Optional: add fallback for empty roles list
  const data = rolesList || [];

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">
          Role Management
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          Add New Role
        </Button>
      </div>

      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={data}
          columns={columns}
          rowsPerPage={limit}
          searchable
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
      <AddRoleModal
        open={addOpen}
        setOpen={setAddOpen}
        onSave={handleAddRole}
      />

      <EditRoleModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedRole={selectedRole}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Role"
        description={`Are you sure you want to delete the "${selectedRole?.role}" role? This action cannot be undone.`}
      />
    </div>
  );
};

export default RoleManagement;

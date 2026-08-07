"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRolesQuery } from "@/hooks/useRolesMutations";
import { Plus, Shield } from "lucide-react";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { MdOutlineEdit } from "react-icons/md";
import { BiStop } from "react-icons/bi";
import AddRoleModal from "./CreateRole";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RoleManagement = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response, isLoading } = useRolesQuery(page, limit);
  const rolesList = (response as any)?.data ?? [];
  const total = (response as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [addOpen, setAddOpen] = useState(false);

  const handleAddRole = (formData: any) => {
    console.log("New Role Added:", formData);
    setAddOpen(false);
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
    // {
    //   key: "actions",
    //   label: "Actions",
    //   render: (row: any) => (
    //     <div className="flex justify-center gap-3">
    //       <button className="p-1 border border-black-600">
    //         <MdOutlineEdit size={16} />
    //       </button>
    //       <button className="p-1 rounded-md bg-purple-600">
    //         <BiStop size={16} />
    //       </button>
    //     </div>
    //   ),
    // },
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
    </div>
  );
};

export default RoleManagement;

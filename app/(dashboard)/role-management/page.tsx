"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRolesQuery } from "@/hooks/useRolesMutations";
import { Plus } from "lucide-react";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { MdOutlineEdit } from "react-icons/md";
import { BiStop } from "react-icons/bi";
import AddRoleModal from "./CreateRole";

const RoleManagement = () => {
    const { data: rolesList, isLoading } = useRolesQuery();

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
                <img
                    src={row.iconURL}
                    alt={row.role}
                    className="w-8 h-8 rounded-full object-cover"
                />
            ),
        },
        { key: "role", label: "Role" },
        { key: "roleDescription", label: "Description" },
        {
            key: "actions",
            label: "Actions",
            render: (row: any) => (
                <div className="flex justify-center gap-3">
                    <button className="p-1 border border-black-600">
                        <MdOutlineEdit size={16} />
                    </button>
                    <button className="p-1 rounded-md bg-red-600">
                        <BiStop size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // Optional: add fallback for empty roles list
    const data = rolesList || [];
    const filters: FilterConfig[] = [
        {
            key: "sort_by",
            label: "Sort by",
            sortBy: true,
            options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
        },
    ];
    return (
        <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="lg:text-3xl text-xl font-medium text-white">
                    Role Management
                </h2>
                <Button leftIcon={<Plus size={18} />} className="w-full sm:w-auto" onClick={() => setAddOpen(true)}>
                    Add New Role
                </Button>
            </div>

            <div className="w-full">
                <CommonTable
                    mobileView="card"
                    data={data}
                    columns={columns}
                    rowsPerPage={10}
                    filters={filters}
                    searchable
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

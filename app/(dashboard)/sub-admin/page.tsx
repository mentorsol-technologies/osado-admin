"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/components/ui/table/commonTable";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import AddSubAdminModal from "./AddSubAdminForm";
import EditSubAdminModal from "./EditSubAdminForm";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import SuspendedSubAdminModal from "./SuspendedSubAdminModal";
import { BiStop } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import {
  useDeleteSubAdminMutation,
  useGetSubAdminsQuery,
} from "@/hooks/useSubAdminMutations";
import { formatDate } from "@/lib/utils";

export default function SubAdminPage() {
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data, isLoading, isError } = useGetSubAdminsQuery();
  const { mutate: deleteSubAdmin, isPending } = useDeleteSubAdminMutation();

  const handleDelete = () => {
    if (!selectedAdmin?.id) return;

    deleteSubAdmin(selectedAdmin.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedAdmin(null);
      },
    });
  };

  const columns = [
    {
      key: "fullName",
      label: "Full Name",
      render: (row: any) => `${row.name ?? ""} ${row.surName ?? ""}`.trim(),
    },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
    {
      key: "updatedAt",
      label: "Date Added",
      render: (row: any) => <span>{formatDate(row.updatedAt)}</span>,
    },

    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-4 py-1 text-sm ${
            row.status === "active"
              ? "text-green-400 border border-green-500/30"
              : "text-red-400 border border-red-500/30"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex justify-center gap-3">
          <button
            className="p-1 border border-black-600"
            onClick={() => {
              setSelectedAdmin(row);
              setEditOpen(true);
            }}
          >
            <MdOutlineEdit size={16} />
          </button>
          <button
            className="p-1 border border-black-600"
            // onClick={() => {
            //   setSelectedAdmin(row);
            //   setEditOpen(true);
            // }}
          >
            <BiStop size={16} />
          </button>
          <button
            className="p-1 rounded-md bg-red-600 text-white"
            onClick={() => {
              setSelectedAdmin(row);
              setDeleteOpen(true);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];
  const filters = [
    {
      key: "status",
      label: "Status",
      mapTo: "status",
      options: ["All", "Active", "Inactive"],
    },
    {
      key: "sort_by",
      label: "Sort by",
      options: ["All", "Newest", "Oldest", "A–Z", "Z–A"],
      sortBy: true,
    },
  ];

  const handleSuspendSubmit = (data: any) => {
    console.log("Suspended Sub Admin Reason:", data);
  };

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl  font-medium text-white">
          Sub Admin
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          Add Sub Admin
        </Button>
      </div>

      {/* Table */}
      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={data}
          columns={columns}
          rowsPerPage={5}
          filters={filters}
          searchable
          renderCardActions={(row) => (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setSelectedAdmin(row);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedAdmin(row);
                  setSuspendOpen(true);
                }}
              >
                Suspend
              </Button>
            </div>
          )}
        />
      </div>

      {/* Add Modal */}
      <AddSubAdminModal
        open={addOpen}
        setOpen={setAddOpen}
        // onSave={(data) => {
        //   console.log("New Sub Admin Data:", data);
        // }}
      />

      {/* Edit Modal */}
      <EditSubAdminModal
        open={editOpen}
        setOpen={setEditOpen}
        onSave={(data) => console.log("Edited:", data)}
        selectedAdmin={selectedAdmin}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Sub Admin"
        description={`Are you sure you want to delete "${selectedAdmin?.name}"? This action cannot be undone.`}
      />

      {/* Suspend Modal */}
      <SuspendedSubAdminModal
        open={suspendOpen}
        setOpen={setSuspendOpen}
        onSave={handleSuspendSubmit}
      />
    </div>
  );
}

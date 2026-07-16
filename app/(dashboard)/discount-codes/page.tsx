"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { BiStop } from "react-icons/bi";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import {
  useGetDiscountCodesQuery,
  useDeleteDiscountCodeMutation,
} from "@/hooks/useDiscountCodeMutations";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import DiscountCodeModal from "./DiscountCodeModal";

export default function DiscountCodesPage() {
  const { data: codes } = useGetDiscountCodesQuery();
  const { mutate: deleteCode, isPending: isDeleting } =
    useDeleteDiscountCodeMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);

  const tableData =
    codes?.map((code: any) => ({
      code: code.code,
      value: `${Number(code.value)}%`,
      usage: `${code.usedCount}`,
      validUntil: code.validUntil
        ? new Date(code.validUntil).toLocaleDateString()
        : "No expiry",
      status: code.isActive ? "Active" : "Inactive",
      raw: code,
    })) || [];

  const columns = [
    { key: "code", label: "Code" },
    { key: "value", label: "Percent Off" },
    { key: "usage", label: "Times Used" },
    { key: "validUntil", label: "Valid Until" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            row.status === "Active"
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
              setSelectedCode(row.raw);
              setEditOpen(true);
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-1 rounded-md bg-purple-600"
            onClick={() => {
              setSelectedCode(row.raw);
              setDeleteOpen(true);
            }}
          >
            <BiStop size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "sort_by",
      label: "Sort by",
      sortBy: true,
      options: ["Newest", "Oldest", "A–Z", "Z–A"],
    },
  ];

  const handleDelete = () => {
    if (!selectedCode?.id) return;
    deleteCode(selectedCode.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedCode(null);
      },
    });
  };

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">
          Discount Codes
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedCode(null);
            setAddOpen(true);
          }}
        >
          Add New Discount Code
        </Button>
      </div>

      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={tableData}
          columns={columns}
          rowsPerPage={10}
          filters={filters}
          searchable
          renderCardActions={(row: any) => (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setSelectedCode(row.raw);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCode(row.raw);
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>

      <DiscountCodeModal open={addOpen} setOpen={setAddOpen} codeData={null} />

      <DiscountCodeModal
        open={editOpen}
        setOpen={setEditOpen}
        codeData={selectedCode}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Discount Code"
        description={`Are you sure you want to delete "${selectedCode?.code}"? This action cannot be undone.`}
      />
    </div>
  );
}

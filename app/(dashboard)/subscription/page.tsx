"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { BiStop } from "react-icons/bi";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import {
  useGetSubscriptionPlansQuery,
  useDeleteSubscriptionPlanMutation,
} from "@/hooks/useSubscriptionMutations";
import DeleteConfirmModal from "@/components/ui/commonComponent/DeleteConfirmModal";
import SubscriptionPlanModal from "./SubscriptionPlanModal";

export default function SubscriptionPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: response } = useGetSubscriptionPlansQuery(page, limit);
  const plans = (response as any)?.data ?? [];
  const total = (response as any)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const { mutate: deletePlan, isPending: isDeleting } =
    useDeleteSubscriptionPlanMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const tableData =
    plans?.map((plan: any) => ({
      name: plan.name || "--",
      price: `${Math.round(Number(plan.price) || 0)} ${(plan.currency || "KWD").toUpperCase()}`,
      billingCycle: plan.billingCycle === "yearly" ? "Yearly" : "Monthly",
      status: plan.isActive ? "Active" : "Inactive",
      raw: plan,
    })) || [];

  const columns = [
    { key: "name", label: "Plan Name" },
    { key: "price", label: "Price" },
    { key: "billingCycle", label: "Billing Cycle" },
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
              setSelectedPlan(row.raw);
              setEditOpen(true);
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-1 rounded-md bg-purple-600"
            onClick={() => {
              setSelectedPlan(row.raw);
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
    if (!selectedPlan?.id) return;
    deletePlan(selectedPlan.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedPlan(null);
      },
    });
  };

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">
          Subscription Plans
        </h2>
        <Button
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedPlan(null);
            setAddOpen(true);
          }}
        >
          Add New Subscription
        </Button>
      </div>

      <div className="w-full">
        <CommonTable
          mobileView="card"
          data={tableData}
          columns={columns}
          rowsPerPage={limit}
          filters={filters}
          searchable
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
          renderCardActions={(row: any) => (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setSelectedPlan(row.raw);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedPlan(row.raw);
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>

      <SubscriptionPlanModal
        open={addOpen}
        setOpen={setAddOpen}
        planData={null}
      />

      <SubscriptionPlanModal
        open={editOpen}
        setOpen={setEditOpen}
        planData={selectedPlan}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Subscription Plan"
        description={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

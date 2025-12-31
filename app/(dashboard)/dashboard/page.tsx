"use client";
import PaymentsChart from "@/components/charts/PaymentsChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { useCategoriesQuery } from "@/hooks/useCategoryMutations";
import { useGetUsersListQuery } from "@/hooks/useUsersMutations";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { MdOutlineEdit } from "react-icons/md";

export default function DashboardPage() {
  const { data, isLoading } = useGetUsersListQuery();
  const { data: CategoriesList } = useCategoriesQuery();
  const router = useRouter();

  const influencerList = useMemo(() => {
    const users = data || [];
    return users.filter((user: any) => user.role?.role === "influencer");
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (!CategoriesList?.length) return ["All"];

    return ["All", ...CategoriesList.map((cat: any) => cat.name)];
  }, [CategoriesList]);

  const filters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      mapTo: "status",
      options: ["All", "Active", "Inactive"],
    },
    {
      key: "date",
      label: "Date",
      type: "date",
    },
    {
      key: "category",
      label: "Category",
      options: categoryOptions,
    },
  ];
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Influencer" },
    { key: "event", label: "Event" },
    {
      key: "createdAt",
      label: "Date",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "categories",
      label: "Category",
      render: (row: any) => (
        <div className="flex flex-wrap gap-2">
          {row.categories?.length ? (
            row.categories.map((cat: any) => (
              <span
                key={cat.id}
                className="rounded bg-gray-700/40 px-2 py-1 text-xs"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`rounded px-2 py-1 text-xs border
        ${
          row.status === "active"
            ? "text-green-400 border-green-500/30"
            : "text-blue-400 border-blue-500/30"
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
            onClick={() => router.push("/influencers")}
          >
            <Eye size={16} />
          </button>
          {/* <button className="p-1 border border-black-600">
            <MdOutlineEdit size={16} />
          </button>
          <button className="p-1 rounded-md  bg-red-600">
            <Trash2 size={16} />
          </button> */}
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <PaymentsChart />
        </div>
      </div>
      <div>
        <CommonTable
          title="Influencer Applications"
          data={influencerList}
          columns={columns}
          rowsPerPage={5}
          filters={filters}
          searchable
        />
      </div>
    </div>
  );
}

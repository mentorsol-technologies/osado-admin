"use client";
import PaymentsChart from "@/components/charts/PaymentsChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { DashboardStats, StatsCards } from "@/components/dashboard/stats-cards";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { useCategoriesQuery } from "@/hooks/useCategoryMutations";
import {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
} from "@/hooks/useProfileMutations";
import { useInfluencerApplicationsQuery } from "@/hooks/useInfluencerApplicationsMutations";
import ApplicationDetailModal from "./ApplicationDetailModal";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const monthNameToYYYYMM = (monthName: string, year = new Date().getFullYear()) => {
  const index = MONTH_NAMES.indexOf(monthName);
  const monthNum = index >= 0 ? index + 1 : new Date().getMonth() + 1;
  return `${year}-${String(monthNum).padStart(2, "0")}`;
};

// Proposal status -> label shown in the Influencer Applications table.
const mapApplicationStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ACCEPTED":
      return "Confirmed";
    case "REJECTED":
    case "WITHDRAWN":
      return "Canceled";
    default:
      return status || "—";
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: applicationsResponse } = useInfluencerApplicationsQuery();
  const { data: CategoriesList } = useCategoriesQuery();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const currentMonthName = MONTH_NAMES[new Date().getMonth()];
  const [paymentsMonth, setPaymentsMonth] = useState(currentMonthName);
  const [revenueMonth, setRevenueMonth] = useState(currentMonthName);

  const { data: dashboardStats } = useGetDashboardStatsQuery(
    monthNameToYYYYMM(paymentsMonth),
  );
  const { data: revenueChart } = useGetRevenueChartQuery(
    monthNameToYYYYMM(revenueMonth),
    6,
  );

  // Flatten each application (proposal) into a row the table can
  // search / filter / render. `categories` is kept at the top level so the
  // existing category filter (which reads row.categories) keeps working.
  const applications = useMemo(() => {
    const list = applicationsResponse?.data || [];
    return list.map((p: any) => ({
      ...p,
      influencerName:
        `${p.influencer?.name || ""} ${p.influencer?.surName || ""}`.trim() || "—",
      eventTitle: p.event?.title || "—",
      categories: p.event?.categories || [],
      priceLabel: p.proposedPrice != null ? `KWD ${p.proposedPrice}` : "—",
      displayStatus: mapApplicationStatus(p.status),
    }));
  }, [applicationsResponse]);

  const categoryOptions = useMemo(() => {
    if (!CategoriesList?.length) return ["All"];

    return ["All", ...CategoriesList.map((cat: any) => cat.name)];
  }, [CategoriesList]);

  const filters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      mapTo: "displayStatus",
      options: ["All", "Pending", "Confirmed", "Canceled"],
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
    { key: "influencerName", label: "Influencer" },
    { key: "eventTitle", label: "Event" },
    {
      key: "createdAt",
      label: "Date",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "id",
      label: "ID",
      render: (row: any) => (
        <span className="text-xs text-gray-300">{row.id}</span>
      ),
    },
    { key: "priceLabel", label: "Price" },
    {
      key: "categories",
      label: "Category",
      render: (row: any) => (
        <div className="flex flex-wrap gap-2">
          {row.categories?.length ? (
            <>
              {row.categories.slice(0, 2).map((cat: any) => (
                <span
                  key={cat.id}
                  className="rounded bg-gray-700/40 px-2 py-1 text-xs"
                >
                  {cat.name}
                </span>
              ))}

              {row.categories.length > 2 && (
                <span className="rounded bg-gray-700/40 px-2 py-1 text-xs">
                  +{row.categories.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: "displayStatus",
      label: "Status",
      render: (row: any) => {
        const s = row.displayStatus;
        const cls =
          s === "Confirmed"
            ? "text-green-400 border-green-500/30"
            : s === "Canceled"
              ? "text-red-400 border-red-500/30"
              : "text-blue-400 border-blue-500/30";
        return (
          <span className={`rounded px-2 py-1 text-xs border ${cls}`}>{s}</span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex justify-center gap-3">
          <button
            className="p-1 border border-black-600"
            title="View application"
            onClick={() => {
              setSelectedApplication(row);
              setDetailOpen(true);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <StatsCards stats={dashboardStats as unknown as DashboardStats[]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            data={(revenueChart as any)?.data}
            selectedMonth={revenueMonth}
            onMonthChange={setRevenueMonth}
          />
        </div>
        <div>
          <PaymentsChart
            pendingPaymentsCount={(dashboardStats as any)?.[0]?.pendingPaymentsCount}
            pendingWithdrawalRequestsCount={(dashboardStats as any)?.[0]?.pendingWithdrawalRequestsCount}
            selectedMonth={paymentsMonth}
            onMonthChange={setPaymentsMonth}
          />
        </div>
      </div>
      <div>
        <CommonTable
          title="Influencer Applications"
          data={applications}
          columns={columns}
          rowsPerPage={10}
          filters={filters}
          searchable
        />
        <ApplicationDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          application={selectedApplication}
        />
      </div>
    </div>
  );
}

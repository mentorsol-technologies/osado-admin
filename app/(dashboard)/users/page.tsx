"use client";

import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonTable, FilterConfig } from "@/components/ui/table/commonTable";
import { useGetUsersListQuery } from "@/hooks/useUsersMutations";
import UserViewModal from "./UserViewModal";

export default function UsersPage() {
  const { data, isLoading } = useGetUsersListQuery();

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const usersList = useMemo(() => {
    const users = data || [];
    return users.filter((user: any) => user.role?.role === "user");
  }, [data]);

  const tableData = useMemo(
    () =>
      usersList.map((user: any) => ({
        full_name: `${user.name || ""} ${user.surName || ""}`.trim() || "--",
        email: user.email || "--",
        phone_number: user.phoneNumber || "--",
        city: user.city || "--",
        registration_date: user.createdAt?.split("T")[0] || "--",
        status: user.status === "suspended" ? "Suspended" : "Active",
        raw: user,
      })),
    [usersList],
  );

  const columns = [
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
    { key: "city", label: "City" },
    { key: "registration_date", label: "Registration Date" },
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
              setSelectedUser(row.raw);
              setOpenViewModal(true);
            }}
          >
            <Eye size={16} />
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

  return (
    <div className="p-4 bg-black-500 !min-h-[calc(100vh-120px)] rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="lg:text-3xl text-xl font-medium text-white">Users</h2>
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
            <Button
              className="flex-1"
              onClick={() => {
                setSelectedUser(row.raw);
                setOpenViewModal(true);
              }}
            >
              View
            </Button>
          )}
        />
      </div>

      <UserViewModal
        open={openViewModal}
        onOpenChange={setOpenViewModal}
        user={selectedUser}
      />
    </div>
  );
}

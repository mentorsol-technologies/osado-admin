"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { Eye, ChevronDown } from "lucide-react";
import FiltersBar, { Filter } from "@/components/ui/commonComponent/FiltersBar";
import { useState, useEffect } from "react";
import ViewProviderDetails from "./ViewBookingDetailsModal";
import {
  GetServiceListQuery,
  useCreateServiceBookingMutation,
  useGetServiceProviderListQuery,
  useGetServiceUsersListQuery,
} from "@/hooks/useServiceBookingMutations";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";
import TimeRangePicker from "@/components/ui/commonComponent/TimeRangePicker";

const schema = z.object({
  service: z.string().min(1, "Service is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  status: z.enum(["Confirmed", "Pending", "Suspended"]),
  country: z.string().min(1, "Country is required"),
  providerId: z.string().min(1, "Provider is required"),
  userId: z.string().min(1, "User Id is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddBookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: FormData) => void;
  selectedBooking?: FormData;
  providerId?: string;
}

export default function AddBookingModal({
  open,
  setOpen,
  onSave,
  selectedBooking,
  providerId,
}: AddBookingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: selectedBooking || {
      service: "",
      bookingDate: "",
      bookingTime: "",
      location: "",
      city: "",
      status: "Confirmed",
      country: "",
    },
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  const bookingDateRaw = watch("bookingDate");
  const bookingTimeRaw = watch("bookingTime");

  const bookingDateISO = bookingDateRaw ? bookingDateRaw.split("T")[0] : "";

  const filterDateISO = filterDate ? filterDate.split("T")[0] : "";

  const {
    data: serviceProviderList,
    refetch: fetchProviders,
    isFetching,
  } = useGetServiceProviderListQuery(
    {
      searchQuery: "",
      bookingDate: filterDateISO,
      bookingTime: filterTime,
    },
    false
  );

  useEffect(() => {
    if (filterDateISO && filterTime) {
      fetchProviders();
    }
  }, [filterDateISO, filterTime, fetchProviders]);

  const providerIdValue = watch("providerId");
  const { data: servicesList } = GetServiceListQuery(providerIdValue);

  const {
    data: userList,
    refetch: fetchUsers,
    isFetching: isFetchingUsers,
  } = useGetServiceUsersListQuery(
    {
      searchQuery: "",
      page: 1,
      limit: 20,
    },
    false
  );

  const { mutate: createServiceBooking } = useCreateServiceBookingMutation();

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Reset form and all related state
  const resetForm = () => {
    reset({
      service: "",
      bookingDate: "",
      bookingTime: "",
      location: "",
      city: "",
      status: "Confirmed",
      country: "",
      providerId: "",
      userId: "",
    });
    setFilterDate("");
    setFilterTime("");
    setSelectedFilters({});
    setSelectedProvider(null);
    setSelectedUser(null);
    setProviderDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleProviderDropdownClick = async () => {
    setProviderDropdownOpen((prev) => !prev);
    if (!providerDropdownOpen) await fetchProviders();
  };

  const handleUserDropdownClick = async () => {
    setUserDropdownOpen((prev) => !prev);
    if (!userDropdownOpen) await fetchUsers();
  };

  const filters: Filter[] = [
    { key: "date", label: "Date", type: "date" },
    { key: "timeRange", label: "Time Range", type: "time" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (prev[key] === value || value === "All" || value === "") {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      return updated;
    });

    // Only update filter state for provider fetching, not booking form values
    if (key === "date") setFilterDate(value);
    if (key === "timeRange") setFilterTime(value);
  };

  const providerPackages = servicesList?.portfolios?.[0]?.packages || [];

  const onSubmit = (data: FormData) => {
    const selectedPackage = servicesList?.portfolios
      ?.flatMap((p: any) => p.packages)
      ?.find((pkg: any) => pkg.id === data.service);

    const payload = {
      userId: selectedUser?.id,
      bookingDate: bookingDateISO,
      bookingTime: bookingTimeRaw,
      city: data.city,
      location: data.location,
      country: data.country,
      status: "pending",
      latitude: String(data.latitude),
      longitude: String(data.longitude),
      bookingServiceDetails: [
        {
          providerPortfolioId: selectedPackage.providerPortfolioId,
          providerPackageId: [selectedPackage.id],
        },
      ],
    };

    console.log("Final Payload:", payload);

    createServiceBooking(payload, {
      onSuccess: () => {
        resetForm();
        setOpen(false);
      },
      onError: (err) => console.error("Error creating booking:", err),
    });
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          setOpen(isOpen);
        }}
        title="Add New Booking"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={handleSubmit(onSubmit)} className="flex-1">
              Submit
            </Button>

            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        }
      >
        <form
          id="booking-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Filters */}
          <FiltersBar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Providers + Users */}
          <div className="flex justify-between gap-6 mb-8">
            {/* Provider */}
            <div className="flex justify-between items-center w-full gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedProvider?.photoURL ||
                    "https://via.placeholder.com/150"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">
                    {selectedProvider?.name || "Select Provider"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedProvider?.role?.role || "Role not available"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Eye
                  className="h-5 w-5 text-white cursor-pointer"
                  onClick={() => setViewModalOpen(true)}
                />
                <ChevronDown
                  className="h-5 w-5 text-white cursor-pointer"
                  onClick={handleProviderDropdownClick}
                />
              </div>
            </div>

            {/* User */}
            <div className="flex justify-between items-center w-full gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedUser?.photoURL || "https://via.placeholder.com/150"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">
                    {selectedUser?.name || "Select User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedUser?.role?.role || "Customer"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className="h-5 w-5 text-white cursor-pointer"
                onClick={handleUserDropdownClick}
              />
            </div>
          </div>

          {/* Dropdown Lists */}
          {providerDropdownOpen && (
            <div className=" mt-2 w-64 bg-[#111] border border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {isFetching ? (
                <p className="p-3 text-gray-300">Loading...</p>
              ) : serviceProviderList?.data.length > 0 ? (
                serviceProviderList.data.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProvider(item);
                      setValue("providerId", item.id);
                      setProviderDropdownOpen(false);
                    }}
                    className="p-2 flex items-center gap-3 hover:bg-gray-800 cursor-pointer"
                  >
                    <img
                      src={item.photoURL || "https://via.placeholder.com/40"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs capitalize">
                        {item.role?.role || "Unknown Role"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-400">No providers found</p>
              )}
            </div>
          )}

          {userDropdownOpen && (
            <div className="mt-2 w-64 bg-[#111] border border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {isFetchingUsers ? (
                <p className="p-3 text-gray-300">Loading...</p>
              ) : userList?.length > 0 ? (
                userList.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedUser(item);
                      setValue("userId", item.id);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 flex items-center gap-3 hover:bg-gray-800 cursor-pointer"
                  >
                    <img
                      src={item.photoURL || "https://via.placeholder.com/40"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs capitalize">
                        {item.role?.role || "User"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-400">No users found</p>
              )}
            </div>
          )}

          {/* Form Inputs */}
          <div className="flex justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block mb-1 text-sm">Select Service</label>
                <Select onValueChange={(val) => setValue("service", val)}>
                  <SelectTrigger className="border-[#333] text-white">
                    <SelectValue placeholder="Select Package" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerPackages.length > 0 ? (
                      providerPackages.map((pkg: any) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.packageName}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="p-2 text-gray-300">No packages found</p>
                    )}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-xs text-red-500">
                    {errors.service.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm">Booking Time</label>
                <TimeRangePicker
                  value={watch("bookingTime") || ""}
                  onChange={(val) => setValue("bookingTime", val)}
                  mode="single"
                  placeholder="Select Booking Time"
                />
                {errors.bookingTime && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bookingTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">City</label>
                <CommonInput placeholder="City" {...register("city")} />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="block mb-1 text-sm">Booking Date</label>
                <CommonInput
                  placeholder="Booking date"
                  type="calendar"
                  value={watch("bookingDate")}
                  onChange={(e) => setValue("bookingDate", e.target.value)}
                  minDate={(() => {
                    const d = new Date();
                    d.setHours(0, 0, 0, 0);
                    return d;
                  })()}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Location</label>
                <GooglePlacesAutocomplete
                  value={watch("location")}
                  onChange={(v) => setValue("location", v)}
                  onPlaceSelect={(place) => {
                    if (place.city) setValue("city", place.city);
                    if (place.country) setValue("country", place.country);
                    if (place.lat) setValue("latitude", place.lat);
                    if (place.lng) setValue("longitude", place.lng);
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Country</label>
                <CommonInput
                  placeholder="Country"
                  value={watch("country")}
                  onChange={(e) => setValue("country", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Status</label>
            <Select
              defaultValue="Confirmed"
              onValueChange={(val) =>
                setValue("status", val as "Confirmed" | "Pending" | "Suspended")
              }
            >
              <SelectTrigger className=" border-[#333] text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </Modal>

      <ViewProviderDetails
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        providerId={selectedProvider?.id}
      />
    </>
  );
}

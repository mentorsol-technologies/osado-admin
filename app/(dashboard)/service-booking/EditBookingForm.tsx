"use client";

import { useEffect, useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, ChevronDown, RefreshCw, User, Loader2 } from "lucide-react";
import {
  GetServiceListQuery,
  usePopulatedBookingDetailsQuery,
} from "@/hooks/useServiceBookingMutations";
import {
  useGetServiceProviderListQuery,
  useGetServiceUsersListQuery,
  useUpdateServiceBookingMutation,
} from "@/hooks/useServiceBookingMutations";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";
import TimeRangePicker from "@/components/ui/commonComponent/TimeRangePicker";
import ViewProviderDetails from "./ViewBookingDetailsModal";

const schema = z.object({
  service: z.string().min(1, "Service is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  status: z.enum([
    "Accepted",
    "Pending",
    "Suspended",
    "Cancelled",
    "Rescheduled",
  ]),
  country: z.string().min(1, "Country is required"),
  providerId: z.string().min(1, "Provider is required"),
  userId: z.string().min(1, "User Id is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditBookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBookingId?: string;
  onSave?: (data: any) => void;
}

export default function EditBookingModal({
  open,
  setOpen,
  selectedBookingId,
  onSave,
}: EditBookingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: "",
      bookingDate: "",
      bookingTime: "",
      location: "",
      city: "",
      status: "Accepted",
      country: "",
      providerId: "",
      userId: "",
    },
  });

  const { data, isLoading, error } = usePopulatedBookingDetailsQuery(
    selectedBookingId ?? "",
  );
  const populatedData = data;

  // watchers
  const bookingDateRaw = watch("bookingDate");
  const bookingTimeRaw = watch("bookingTime");
  const bookingDateISO = bookingDateRaw ? bookingDateRaw.split("T")[0] : "";

  // The Booking Date/Time fields drive provider availability lookup directly -
  // no separate filter inputs, so there's only one date/time to fill in.
  const {
    data: serviceProviderList,
    refetch: fetchProviders,
    isFetching: isFetchingProviders,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetServiceProviderListQuery(
    {
      searchQuery: "",
      bookingDate: bookingDateISO,
      bookingTime: bookingTimeRaw,
    },
    false,
  );

  // Flatten every loaded page into one list for the dropdown.
  const providers =
    serviceProviderList?.pages?.flatMap((p: any) => p?.data ?? []) ?? [];

  // Load the next page when the dropdown is scrolled near the bottom.
  const handleProviderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < 48 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (bookingDateISO && bookingTimeRaw) {
      fetchProviders();
    }
  }, [bookingDateISO, bookingTimeRaw, fetchProviders]);

  // service list based on providerId selected
  const providerIdValue = watch("providerId");
  const { data: servicesList } = GetServiceListQuery(providerIdValue);

  // user list fetch (same as add modal)
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
    false,
  );

  // update mutation
  const { mutate: updateServiceBooking } = useUpdateServiceBookingMutation();

  // local UI state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleProviderDropdownClick = async () => {
    const next = !providerDropdownOpen;
    setProviderDropdownOpen(next);
    if (next) {
      setUserDropdownOpen(false);
      await fetchProviders();
    }
  };

  const handleUserDropdownClick = async () => {
    const next = !userDropdownOpen;
    setUserDropdownOpen(next);
    if (next) {
      setProviderDropdownOpen(false);
      await fetchUsers();
    }
  };

  const providerPackages = servicesList?.portfolios?.[0]?.packages || [];

  useEffect(() => {
    if (populatedData) {
      const statusRaw = populatedData?.[0]?.status;
      const formattedStatus =
        statusRaw?.charAt(0).toUpperCase() + statusRaw?.slice(1).toLowerCase();
      reset({
        service: "",
        bookingDate: populatedData?.[0].bookingDate || "",
        bookingTime: populatedData?.[0].bookingTime || "",
        location: populatedData?.[0].location || "",
        city: populatedData?.[0].city || "",
        status: formattedStatus || "Confirmed",
        country: populatedData?.[0].country || "",
        providerId: populatedData?.[0].providerDetails?.id || "",
        userId: populatedData?.[0]?.customer?.id || "",
      });
      setSelectedProvider(populatedData?.[0]?.providerDetails || null);
      setSelectedUser(populatedData?.[0].customer || null);
    }
  }, [populatedData, reset]);

  useEffect(() => {
    if (populatedData && providerPackages.length > 0) {
      const packageId = populatedData?.[0]?.packageDetails?.id;
      if (packageId) {
        setValue("service", packageId);
      }
    }
  }, [populatedData, providerPackages, setValue]);

  const onSubmit = (data: FormData) => {
    if (!selectedBookingId) return;

    const selectedPackage = servicesList?.portfolios
      ?.flatMap((p: any) => p.packages)
      ?.find((pkg: any) => pkg.id === data.service);

    const payload = {
      userId: data.userId,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      city: data.city,
      location: data.location,
      country: data.country,
      status: data.status.toLowerCase(),
      latitude: String(data.latitude),
      longitude: String(data.longitude),
      bookingServiceDetails: [
        {
          providerPortfolioId:
            selectedPackage?.providerPortfolioId ||
            populatedData?.data?.[0]?.packageDetails?.providerPortfolioId,
          providerPackageId: [
            selectedPackage?.id || populatedData?.data?.[0]?.packageDetails?.id,
          ],
        },
      ],
    };

    updateServiceBooking(
      { id: selectedBookingId, data: payload },
      {
        onSuccess: (res) => {
          if (onSave) onSave(res);
          setOpen(false);
        },
        onError: (err) => console.error("Update booking error:", err),
      },
    );
  };

  const providerPhoto =
    selectedProvider?.photoURL ||
    populatedData?.data?.[0]?.providerDetails?.photoURL;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Edit Booking"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="flex-1 bg-brand hover:opacity-90"
            >
              Submit
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form
          id="edit-booking-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Providers + Users */}
          <div className="flex justify-between gap-6 mb-8">
            {/* Provider */}
            <div className="flex justify-between items-center w-full gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={providerPhoto} />
                  <AvatarFallback>
                    {selectedProvider?.name ||
                    populatedData?.data?.[0]?.providerDetails?.name ? (
                      (
                        selectedProvider?.name ||
                        populatedData?.data?.[0]?.providerDetails?.name
                      )[0].toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">
                    {selectedProvider?.name ||
                      populatedData?.data?.[0]?.providerDetails?.name ||
                      "Select Provider"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedProvider?.role?.role ||
                      populatedData?.data?.[0]?.providerDetails?.role?.role ||
                      "Role not available"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Eye
                  className="h-5 w-5 text-white cursor-pointer"
                  onClick={() => setViewModalOpen(true)}
                />
                <ChevronDown
                  className={`h-5 w-5 text-white cursor-pointer transition-transform duration-200 ${
                    providerDropdownOpen ? "rotate-180" : ""
                  }`}
                  onClick={handleProviderDropdownClick}
                />
              </div>
            </div>

            {/* User */}
            <div className="flex justify-between items-center w-full gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      selectedUser?.photoURL ||
                      populatedData?.data?.[0]?.customer?.photoURL
                    }
                  />
                  <AvatarFallback>
                    {selectedUser?.name ||
                    populatedData?.data?.[0]?.customer?.name ? (
                      (
                        selectedUser?.name ||
                        populatedData?.data?.[0]?.customer?.name
                      )[0].toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">
                    {selectedUser?.name ||
                      populatedData?.data?.[0]?.customer?.name ||
                      "Select User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedUser?.role?.role || "Customer"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-white cursor-pointer transition-transform duration-200 ${
                  userDropdownOpen ? "rotate-180" : ""
                }`}
                onClick={handleUserDropdownClick}
              />
            </div>
          </div>

          {/* Dropdown Lists */}
          {providerDropdownOpen && (
            <div
              onScroll={handleProviderScroll}
              className="mt-2 w-full bg-[#111] border border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200"
            >
              {isFetchingProviders && providers.length === 0 ? (
                <div className="flex items-center justify-center gap-2 p-4 text-gray-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : providers.length > 0 ? (
                <>
                  {providers.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProvider(item);
                        setValue("providerId", item.id);
                        setValue("service", "");
                        setProviderDropdownOpen(false);
                      }}
                      className="p-2 flex items-center gap-3 hover:bg-gray-800 cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.photoURL} />
                        <AvatarFallback>
                          {item.name ? item.name[0].toUpperCase() : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs capitalize">
                          {item.role?.role || "Unknown Role"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2 p-3 text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Loading more...</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="p-3 text-gray-400">No providers found</p>
              )}
            </div>
          )}

          {userDropdownOpen && (
            <div className="mt-2 w-full bg-[#111] border border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200">
              {isFetchingUsers ? (
                <div className="flex items-center justify-center gap-2 p-4 text-gray-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.photoURL} />
                      <AvatarFallback>
                        {item.name ? item.name[0].toUpperCase() : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
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
                <Select
                  value={watch("service")}
                  onValueChange={(val) => setValue("service", val)}
                >
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
                />
                {errors.bookingDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bookingDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">Location</label>
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
              value={watch("status")}
              onValueChange={(val) =>
                setValue(
                  "status",
                  val as
                    | "Accepted"
                    | "Pending"
                    | "Suspended"
                    | "Cancelled"
                    | "Rescheduled",
                )
              }
            >
              <SelectTrigger className=" border-[#333] text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
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

"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import CommonInput from "@/components/ui/input";
import {
  useCurrentAdminQuery,
  useUpdateProfileMutation,
} from "@/hooks/useProfileMutations";
import { uploadToS3 } from "@/lib/s3Upload";
import { getUserUploadLink } from "@/services/users/userServices";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: adminData, isLoading } = useCurrentAdminQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [profileImage, setProfileImage] = useState<string>("");
  const [photoId, setPhotoId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    email: "",
    phoneNumber: "",
    city: "",
    callingCode: "",
    countryCode: "",
    roleId: "",
    authProvider: "",
  });

  /* Populate data */
  useEffect(() => {
    if (!adminData) return;

    const user = adminData?.data || adminData;

    setFormData({
      name: user.name || "",
      surName: user.surName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      city: user.city || "",
      callingCode: user.callingCode || "",
      countryCode: user.countryCode || "",
      roleId: user.roleId || "",
      authProvider: user.authProvider || "",
    });

    if (user.photoURL) {
      setProfileImage(user.photoURL || user.photo?.url);
    }
  }, [adminData]);

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePencilClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url, fields, uploadId } = await getUserUploadLink(file.type);
      await uploadToS3(file, url, fields);

      setPhotoId(uploadId);
      setProfileImage(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
      toast.error("Avatar upload failed");
    }
  };

  /* Submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      ...formData,
      ...(photoId && { photoId }),
    };

    updateProfileMutation.mutate(payload);
  };

  /* Loading */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-black-500 rounded-lg w-full px-4 py-8">
      <div className="max-w-[820px] w-full lg:px-6">
        {/* Avatar */}
        <div className="flex flex-col items-center lg:items-start gap-3 mb-10">
          <div className="relative">
            <Avatar className="h-28 w-28">
              <AvatarImage src={profileImage} />
              <AvatarFallback>
                {formData.name ? formData.name[0].toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={handlePencilClick}
              className="absolute bottom-0 left-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
            >
              <Pencil size={16} className="text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommonInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <CommonInput
              label="Surname"
              value={formData.surName}
              onChange={(e) => handleInputChange("surName", e.target.value)}
            />

            <CommonInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />

            <CommonInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />

            <CommonInput
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />

            <CommonInput
              label="Calling Code"
              value={formData.callingCode}
              onChange={(e) => handleInputChange("callingCode", e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-10">
            <Button
              type="submit"
              className="w-full md:w-1/3 h-[50px] text-lg"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Pencil, Settings } from "lucide-react";
import { UpdateProfileInfoForm } from "@/features/user/components/update-info-form";
import { useGetProfile } from "@/features/user/hooks/queries/user-get-profile";
import { useParams } from "react-router-dom";
import { GlobalLoading } from "@/components/shared/global-loading";
import { ProfileNotFound } from "@/features/user/components/profile-not-found";
import ProfileAvatar from "@/features/user/components/profile-avatar";
import { formatDate } from "@/lib/helper";
import { useAuthContext } from "@/context/auth-provider";
import { PetList } from "@/features/pet/components/pet-list";
import useCreatePostModal from "@/features/post/hooks/use-create-post-modal";
import { UserPostList } from "@/features/post/components/user-post-list";

const SocialProfile = () => {
  const { profileId } = useParams();
  const { user } = useAuthContext();

  const { onOpen } = useCreatePostModal();
  const { data, isLoading: isProfileLoading } = useGetProfile(profileId!);
  const profile = data?.user;

  const [editMode, setEditMode] = useState<boolean>(false);

  const isLoading = isProfileLoading;

  if (isLoading) return <GlobalLoading />;
  if (!profile) return <ProfileNotFound />;
  const initialsData = {
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile?.phoneNumber || "",
    gender: profile.gender,
  };
  const isAuthor = user?._id === profile._id;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Profile Header - Instagram style */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <ProfileAvatar
          fullName={profile.fullName}
          profilePicture={profile.profilePicture}
          editable={isAuthor}
        />

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.fullName}
            </h1>

            {isAuthor && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 hover:bg-orange-50 text-gray-800"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Chỉnh sửa hồ sơ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 hover:bg-orange-50"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            )}
          </div>

          {!editMode ? (
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                {profile.role === "CUSTOMER" ? "KHÁCH HÀNG" : profile.role}
                <Badge className="ml-2 bg-orange-500 text-white">
                  {profile.status === "ACTIVE"
                    ? "ĐANG HOẠT ĐỘNG"
                    : profile.status}
                </Badge>
              </p>
              <p className="text-gray-500 text-sm">
                Thành viên từ {formatDate(new Date(profile.createdAt))}
              </p>
            </div>
          ) : (
            <UpdateProfileInfoForm
              data={initialsData}
              onCancel={() => setEditMode(false)}
            />
          )}
        </div>
      </div>

      {/*  Pet List */}
      {profileId && <PetList profileId={profileId} />}

      {isAuthor && (
        <div className="flex justify-end mb-6">
          <Button onClick={onOpen} variant="default" size="sm">
            <Camera className="h-4 w-4 mr-2" /> Tạo bài viết
          </Button>
        </div>
      )}
      {profileId && <UserPostList profileId={profileId} />}
    </div>
  );
};

export default SocialProfile;

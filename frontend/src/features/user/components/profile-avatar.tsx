import React, {useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useUpdateProfilePicture } from "@/features/user/hooks/mutations/update-profile-picture";
import { getAvatarFallbackText } from "@/lib/helper";

interface ProfileAvatarProps {
  fullName: string;
  profilePicture?: {
    url: string | null;
  }; 
  editable?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  fullName,
  profilePicture, 
  editable = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfilePicture = useUpdateProfilePicture();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    updateProfilePicture.mutate(formData);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
const initials = getAvatarFallbackText(fullName)
  return (
    <div
      className="relative group"
      
    >
      <Avatar className={`border-orange-200 h-24 w-24 border-2 object-cover`}>
        <AvatarImage src={profilePicture?.url || ""} />
        <AvatarFallback className={`bg-orange-400 text-white text-base`}>
         {initials} 
        </AvatarFallback>
      </Avatar>

      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Button
            variant="secondary"
            size="icon"
            className={`
              absolute -bottom-2 -right-2 rounded-full bg-orange-500 hover:bg-orange-600 p-1.5
              border-2 border-white shadow-sm 
              
              ${updateProfilePicture.isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleEditClick}
            disabled={updateProfilePicture.isPending}
          >
            {updateProfilePicture.isPending ? (
              <Loader2 className={` text-white animate-spin`} />
            ) : (
              <Camera className={` text-white`} />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
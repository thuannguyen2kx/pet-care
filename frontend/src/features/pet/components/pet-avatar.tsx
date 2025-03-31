import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useUpdatePetPicture } from "../hooks/mutations/update-pet-picture";

interface PetAvatarProps {
  pet: {
    _id: string;
    name: string;
    profilePicture?: {
      url: string | null;
      publicId?: string | null;
    };
  };
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

const PetAvatar: React.FC<PetAvatarProps> = ({
  pet,
  size = "md",
  editable = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatePetPicture = useUpdatePetPicture();

  // Size classes mapping
  const sizeClasses = {
    sm: "h-10 w-10 border-2",
    md: "h-16 w-16 border-2",
    lg: "h-20 w-20 md:h-24 md:w-24 border-4",
  };

  // Size classes for icon
  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Size classes for text
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("petPicture", file);

    updatePetPicture.mutate({
      petId: pet._id,
      data: formData,
    });
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar className={`${sizeClasses[size]} border-orange-200`}>
        <AvatarImage src={pet.profilePicture?.url || ""} />
        <AvatarFallback className={`bg-orange-400 text-white ${textSizeClasses[size]}`}>
          {pet.name?.substring(0, 2)}
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
              border-2 border-white shadow-sm transition-opacity
              ${isHovering ? 'opacity-100' : 'opacity-0 md:opacity-70'}
              ${updatePetPicture.isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleEditClick}
            disabled={updatePetPicture.isPending}
          >
            {updatePetPicture.isPending ? (
              <Loader2 className={`${iconSizeClasses[size]} text-white animate-spin`} />
            ) : (
              <Camera className={`${iconSizeClasses[size]} text-white`} />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default PetAvatar;
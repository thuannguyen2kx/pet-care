import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserPets } from "../hooks/queries/get-pets";
import PetAvatar from "./pet-avatar";
import { Badge } from "@/components/ui/badge";
import PetCard from "./pet-card";
import { Plus } from "lucide-react";
import useCreatePetSheet from "../hooks/use-create-pet-sheet";
import { useAuthContext } from "@/context/auth-provider";

interface PetListProps {
  profileId: string;
}
export const PetList = ({ profileId }: PetListProps) => {
  const { onOpen } = useCreatePetSheet();
  const { user } = useAuthContext();
  const { data, isLoading } = useUserPets(profileId);

  const pets = data?.pets || [];
  const isOwner = user?._id === profileId;

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <>
      <div className="overflow-x-auto mb-8">
        <div className="flex items-center gap-4 py-2">
          {pets.map((pet) => (
            <Dialog key={pet._id}>
              <DialogTrigger>
                <PetAvatar pet={pet} size="lg" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>{pet.name}</span>
                    <Badge className="bg-orange-500 text-white text-xs">
                      {pet.species}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <PetCard pet={pet} />
              </DialogContent>
            </Dialog>
          ))}
          {isOwner && (
            <button
              onClick={onOpen}
              className="flex flex-col items-center gap-1"
            >
              <div className="h-16 w-16 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50">
                <Plus className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-xs font-medium">Thêm thú cưng</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

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
import { useState } from "react";
import { ResponsiveModal } from "@/components/shared/responsive-modal";
import PetForm from "./pet-form";

export const PetList = () => {
  const [create, setCreate] = useState(false)
  const { data, isLoading } = useUserPets();

  const pets = data?.pets || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
    <div className="overflow-x-auto mb-8">
      <div className="flex gap-4 py-2">
        {pets.map((pet) => (
          <Dialog key={pet._id}>
            <DialogTrigger>
              <PetAvatar pet={pet} />
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

        <button onClick={() => setCreate(true)} className="flex flex-col items-center gap-1">
          <div className="h-16 w-16 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50">
            <Plus className="h-6 w-6 text-orange-500" />
          </div>
          <span className="text-xs font-medium">Thêm thú cưng</span>
        </button>
      </div>
    </div>
    <ResponsiveModal open={create} onOpenChange={setCreate}>
      <PetForm onSuccess={() => setCreate(false)} />
    </ResponsiveModal>
    </>
  );
};

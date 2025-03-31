
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import PetForm from "./pet-form";
import { usePetDetails } from "../hooks/queries/get-pet";

interface EditPetSheetProps {
  petId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const EditPetSheet = ({ open, petId, onOpenChange}: EditPetSheetProps) => {
  const {data, isLoading} = usePetDetails(petId)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent  className="px-3 pb-4 max-w-[400px] sm:max-w-[540px] h-screen overflow-y-auto remove-scrollbar">
        <SheetHeader>
          <SheetTitle>Cập nhật thông tin thú cưng của bạn</SheetTitle>
          <SheetDescription>
            Cập nhật thông tin thú cưng của bạn để quản lý thông tin sức khoẻ tốt hơn, chia sẻ đến mọi
            người nhiều điều thú vị.
          </SheetDescription>
        </SheetHeader>
        {
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <PetForm pet={data?.pet} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)}/>
          )
        }
      </SheetContent>
    </Sheet>
  );
};

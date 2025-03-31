import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import PetForm from "./pet-form";

interface AddPetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const AddPetSheet = ({ open, onOpenChange }: AddPetSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="px-3 pb-4 max-w-[400px] sm:max-w-[540px] h-screen overflow-y-auto remove-scrollbar">
        <SheetHeader>
          <SheetTitle>Thêm thú cưng của bạn</SheetTitle>
          <SheetDescription>
            Thêm thú cưng quản lý thông tin sức khoẻ tốt hơn, chia sẻ đến mọi
            người nhiều điều thú vị.
          </SheetDescription>
        </SheetHeader>

        <PetForm onSuccess={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
};

import { Button } from '@/shared/ui/button';

export const DeletePetButton = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <div className="pt-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 justify-start"
        onClick={onDelete}
      >
        Xoá thú cưng
      </Button>
    </div>
  );
};

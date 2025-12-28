import { Button } from '@/shared/ui/button';

export function FormActions({
  isSubmitting,
  onClose,
}: {
  isSubmitting: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
        Huỷ
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Lưu thông tin
      </Button>
    </div>
  );
}

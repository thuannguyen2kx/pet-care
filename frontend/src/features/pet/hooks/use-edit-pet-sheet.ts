import { parseAsBoolean, useQueryState } from "nuqs";

const useEditPetSheet = () => {
  const [open, setOpen] = useQueryState(
    "edit-pet",
    parseAsBoolean.withDefault(false)
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export default useEditPetSheet;

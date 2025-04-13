
import { parseAsBoolean, useQueryState } from "nuqs";

const useCreatePetSheet = () => {
  const [open, setOpen] = useQueryState(
    "create-pet",
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

export default useCreatePetSheet;

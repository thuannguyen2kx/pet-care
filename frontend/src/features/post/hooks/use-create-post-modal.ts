
import { parseAsBoolean, useQueryState } from "nuqs";

const useCreatePostModal = () => {
  const [open, setOpen] = useQueryState(
    "create-post",
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

export default useCreatePostModal;

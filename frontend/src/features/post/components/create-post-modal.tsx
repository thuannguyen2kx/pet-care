import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from '@/components/ui/dialog';
import CreatePostForm from './create-post-formt'; 

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl p-0">
        <DialogHeader className="px-4 pt-4 pb-0 flex justify-between items-center">
          <DialogTitle>Create Post</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-sm opacity-70 transition-opacity hover:opacity-100" />
        </DialogHeader>
        <div className="overflow-y-auto max-h-[80vh] remove-scrollbar">
          <CreatePostForm onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostType } from "@/features/post/types/api.types";

interface PostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PostType;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export function PostFormDialog({ 
  open, 
  onOpenChange, 
  post, 
  onSubmit, 
  isSubmitting 
}: PostFormDialogProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [visibility, setVisibility] = useState(post?.visibility || "public");

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags.join(", ") || "");
      setVisibility(post.visibility || "public");
    } else if (open && !post) {
      // New post - reset form
      setTitle("");
      setContent("");
      setTags("");
      setVisibility("public");
    }
  }, [open, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (title) formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("visibility", visibility);
    
    // If we're editing an existing post, we need to append the media IDs
    // if (post && post.media && post.media.length > 0) {
    //   const mediaIds = post.media.map(m => m._id).join(',');
    //   formData.append("mediaIds", mediaIds);
    // }
    
    // Get file inputs
    const fileInput = document.getElementById('media') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("media", fileInput.files[i]);
      }
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription>
            {post 
              ? "Make changes to your post here."
              : "Fill out the form to create a new post."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                required
                rows={5}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="pet, dogs, cats, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(value) => setVisibility(value as 'public' | 'private')}
              >
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="media">Upload Media</Label>
              <Input
                id="media"
                type="file"
                multiple
                accept="image/*,video/*"
              />
              <p className="text-xs text-gray-500">
                You can upload up to 10 images or videos.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
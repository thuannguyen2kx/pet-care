import { useState, useEffect, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Lock,
  ImagePlus,
  X,
  Loader2,
  FileText,
  Tag,
  Type,
  Eye,
  Save
} from "lucide-react";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags.join(", ") || "");
      setVisibility(post.visibility || "public");
      
      // Reset file selection
      setSelectedFiles([]);
      setPreviewUrls([]);
    } else if (open && !post) {
      // New post - reset form
      setTitle("");
      setContent("");
      setTags("");
      setVisibility("public");
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [open, post]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Also remove preview URL
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (title) formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("visibility", visibility);
    
    // Append selected files
    selectedFiles.forEach(file => {
      formData.append("media", file);
    });
    
    // If we're editing an existing post, append existing media IDs
    // if (post && post.media && post.media.length > 0) {
    //   const mediaIds = post.media.map(m => m._id).join(',');
    //   formData.append("mediaIds", mediaIds);
    // }
    
    onSubmit(formData);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">
            {post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </DialogTitle>
          <DialogDescription>
            {post 
              ? "Chỉnh sửa nội dung bài viết của bạn."
              : "Nhập nội dung để tạo bài viết mới."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <ScrollArea className="px-6 py-4 max-h-[70vh]">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Tiêu đề (Không bắt buộc)
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Nội dung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Thẻ (cách nhau bởi dấu phẩy)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="thú cưng, chó, mèo, v.v."
                />
                {tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{trimmedTag}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="visibility" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Quyền riêng tư
                </Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setVisibility(value as 'public' | 'private')}
                >
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Chọn quyền riêng tư" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Công khai</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Riêng tư</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  Media (Ảnh/Video)
                </Label>
                
                <div className="flex items-center gap-2">
                  <Input
                    id="media"
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {selectedFiles.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={clearFileInput}
                    >
                      <X className="h-4 w-4 mr-1" /> Xóa
                    </Button>
                  )}
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index}`} 
                          className="h-20 w-full object-cover rounded-md" 
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {post && post.media && post.media.length > 0 && selectedFiles.length === 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Media hiện tại:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {post.media.map((item, index) => (
                        <div key={index} className="relative">
                          {item.type === 'image' ? (
                            <img 
                              src={item.url} 
                              alt="" 
                              className="h-20 w-full object-cover rounded-md" 
                            />
                          ) : (
                            <div className="h-20 w-full bg-gray-100 flex items-center justify-center rounded-md">
                              <span className="text-gray-500 text-xs">Video</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tải media mới sẽ thay thế các media hiện tại.
                    </p>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Bạn có thể tải lên tối đa 10 ảnh hoặc video.
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="px-6 py-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={!content.trim() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{post ? "Cập nhật" : "Tạo bài viết"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
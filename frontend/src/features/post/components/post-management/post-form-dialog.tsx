import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Save,
  Sparkles,
} from "lucide-react";
import { PostType } from "@/features/post/types/api.types";
import AIAssistantModal from "@/features/ai-assitant/components/ai";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Form validation schema
const postFormSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  tags: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

type PostFormValues = z.infer<typeof postFormSchema>;

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
  isSubmitting,
}: PostFormDialogProps) {
  // Initialize React Hook Form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      tags: post?.tags?.join(", ") || "",
      visibility: post?.visibility || "public",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  // AI Assistant state
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [documentContext, setDocumentContext] = useState("");
  const [selectionRange, setSelectionRange] = useState<{
    index: number;
    length: number;
  } | null>(null);

  // Get form values for watching changes
  const watchedContent = form.watch("content");
  const watchedTitle = form.watch("title");
  const watchedTags = form.watch("tags");

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      form.reset({
        title: post.title || "",
        content: post.content || "",
        tags: post.tags?.join(", ") || "",
        visibility: post.visibility || "public",
      });
      
      // Reset file selection
      setSelectedFiles([]);
      setPreviewUrls([]);
    } else if (open && !post) {
      // New post - reset form
      form.reset({
        title: "",
        content: "",
        tags: "",
        visibility: "public",
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [open, post, form]);

  // Update document context for AI whenever form values change
  useEffect(() => {
    setDocumentContext(
      `Title: ${watchedTitle || ""}\nContent: ${watchedContent || ""}\nTags: ${watchedTags || ""}`
    );
  }, [watchedTitle, watchedContent, watchedTags]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);

      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
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

  const handleFormSubmit = (values: PostFormValues) => {
    const formData = new FormData();
    if (values.title) formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("tags", values.tags || "");
    formData.append("visibility", values.visibility);

    // Append selected files
    selectedFiles.forEach((file) => {
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
      fileInputRef.current.value = "";
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  // AI Assistant Functions
  const handleOpenAI = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();

      if (selection && selection.length > 0) {
        // Text is selected
        setSelectionRange(selection);
        const selected = editor.getText(selection.index, selection.length);
        setSelectedText(selected);
      } else {
        // No text selected
        setSelectionRange(null);
        setSelectedText("");
      }
    }
    setIsAIMenuOpen(true);
  }, []);

  // Insert AI-generated content into the Quill editor
  const insertAIContent = useCallback(
    (aiContent: string) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();

        if (selectionRange) {
          // Replace selected text with AI content
          editor.deleteText(selectionRange.index, selectionRange.length);
          editor.insertText(selectionRange.index, aiContent);
          editor.setSelection(selectionRange.index + aiContent.length, 0);
        } else {
          // No selection, insert at current cursor position or at the end
          const currentSelection = editor.getSelection();
          const insertIndex = currentSelection
            ? currentSelection.index
            : editor.getLength();
          editor.insertText(insertIndex, aiContent);
          editor.setSelection(insertIndex + aiContent.length, 0);
        }

        // Update form value with new editor content
        const html = editor.root.innerHTML;
        form.setValue("content", html, { 
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
      }

      setIsAIMenuOpen(false);
    },
    [selectionRange, form]
  );

  // Handle keyboard shortcut for AI assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === " ") {
        // Check if we're in the editor (look for quill-related elements)
        const activeElement = document.activeElement;
        const isInQuillEditor =
          activeElement?.className?.includes("ql-editor") ||
          activeElement?.closest(".ql-editor");

        if (isInQuillEditor) {
          e.preventDefault();
          handleOpenAI();
        }
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenAI, open]);

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
            <DialogTitle className="text-xl">
              {post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </DialogTitle>
            <DialogDescription>
              {post
                ? "Chỉnh sửa nội dung bài viết của bạn."
                : "Nhập nội dung để tạo bài viết mới."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col overflow-hidden h-full"
            >
              <div className="flex-grow overflow-hidden">
                <ScrollArea className="h-[calc(70vh-8rem)] px-6 py-4">
                  <div className="grid gap-4 px-2 pb-4">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Tiêu đề (Không bắt buộc)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề bài viết"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Content Field */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Nội dung <span className="text-red-500">*</span>
                            </FormLabel>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center"
                              onClick={handleOpenAI}
                            >
                              <Sparkles className="h-3.5 w-3.5 mr-1" />
                              AI
                            </Button>
                          </div>
                          <FormControl>
                            <div className="editor-container">
                              <ReactQuill
                                ref={quillRef}
                                value={field.value}
                                onChange={(content) => {
                                  field.onChange(content);
                                }}
                                placeholder="Nhập nội dung bài viết..."
                                theme="snow"
                                className="min-h-[150px]"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Nhấn Ctrl+Space để sử dụng trợ lý AI
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tags Field */}
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Thẻ (cách nhau bởi dấu phẩy)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="thú cưng, chó, mèo, v.v."
                              {...field}
                            />
                          </FormControl>
                          {field.value && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {field.value.split(",").map((tag, index) => {
                                const trimmedTag = tag.trim();
                                if (!trimmedTag) return null;
                                return (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    #{trimmedTag}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Visibility Field */}
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Quyền riêng tư
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn quyền riêng tư" />
                              </SelectTrigger>
                            </FormControl>
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
                        </FormItem>
                      )}
                    />

                    {/* Media Upload (Not part of form fields) */}
                    <div className="grid gap-2">
                      <FormLabel className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" />
                        Media (Ảnh/Video)
                      </FormLabel>

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

                      {post &&
                        post.media &&
                        post.media.length > 0 &&
                        selectedFiles.length === 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Media hiện tại:
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {post.media.map((item, index) => (
                                <div key={index} className="relative">
                                  {item.type === "image" ? (
                                    <img
                                      src={item.url}
                                      alt=""
                                      className="h-20 w-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="h-20 w-full bg-gray-100 flex items-center justify-center rounded-md">
                                      <span className="text-gray-500 text-xs">
                                        Video
                                      </span>
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
              </div>

              <DialogFooter className="px-6 py-4 border-t border-slate-200 flex-shrink-0 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || isSubmitting}
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
          </Form>
          <AIAssistantModal
            isOpen={isAIMenuOpen}
            onClose={() => setIsAIMenuOpen(false)}
            selectedText={selectedText}
            documentContext={documentContext}
            insertContent={insertAIContent}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
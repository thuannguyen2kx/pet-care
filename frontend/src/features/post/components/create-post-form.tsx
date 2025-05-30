import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Camera,
  X,
  Tag,
  Globe,
  Lock,
  Loader2,
  Image as ImageIcon,
  TrashIcon,
  Tags,
} from "lucide-react";
import { useCreatePost } from "../hooks/mutations/use-create-post";
import { Tag as TagBadge } from "./tag";
import { useAuthContext } from "@/context/auth-provider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useUserPets } from "@/features/pet/hooks/queries/get-pets";
import { toast } from "sonner";

import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";
import AIAssistantModal from "@/features/ai-assitant/components/ai";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Form validation schema
const postFormSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  petIds: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

type PostFormValues = z.infer<typeof postFormSchema>;
type FieldName = keyof z.infer<typeof postFormSchema>;

// Media item interface
interface MediaItem {
  file: File;
  preview: string;
  caption?: string;
}

interface CreatePostFormProps {
  onClose?: () => void;
}

// Utility function to convert file to Data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userId = user?._id || "";
  const mutation = useCreatePost();

  const { data } = useUserPets(userId);
  const pets = data?.pets || [];

  // Form with React Hook Form
  const methods = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      petIds: "",
      visibility: "public",
    },
  });

  // UI state
  const [activeStep, setActiveStep] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [documentContext, setDocumentContext] = useState("");
  const quillRef = useRef<ReactQuill | null>(null);
  const [selectionRange, setSelectionRange] = useState<{
    index: number;
    length: number;
  } | null>(null);

  const steps = useMemo(() => ["Upload", "Details"], []);

  const formValues = methods.watch();
  const descriptionValue = methods.watch("content");

  // Update document context for AI whenever form values change
  useEffect(() => {
    setDocumentContext(
      `Title: ${formValues.title || ""}\nDescription: ${
        formValues.content || ""
      }`
    );
  }, [formValues]);

  // When tags change, update the form value
  useEffect(() => {
    methods.setValue("tags", tagArray.join(","));
  }, [tagArray, methods]);

  // Handle opening the AI assistant modal
  const handleOpenAI = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();

      if (selection) {
        // Store the selection range for later use when inserting content
        setSelectionRange(selection);
        const selected = editor.getText(selection.index, selection.length);
        setSelectedText(selected);
      } else {
        setSelectionRange(null);
        setSelectedText("");
      }
    }
    setIsAIMenuOpen(true);
  }, []);

  // Insert AI-generated content into the editor
  const insertAIContent = useCallback(
    (content: string) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();

        if (selectionRange) {
          // Replace selected text with AI content
          editor.deleteText(selectionRange.index, selectionRange.length);
          editor.insertText(selectionRange.index, content);
          editor.setSelection(selectionRange.index + content.length, 0);
        } else {
          // If no selection, insert at current cursor position or at the end
          const currentSelection = editor.getSelection();
          const insertIndex = currentSelection
            ? currentSelection.index
            : editor.getLength();
          editor.insertText(insertIndex, content);
          editor.setSelection(insertIndex + content.length, 0);
        }

        // Update form value with new editor content
        const html = editor.root.innerHTML;
        methods.setValue("content", html);
      }

      setIsAIMenuOpen(false);
    },
    [methods, selectionRange]
  );

  // Keyboard shortcut for AI assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === " ") {
        const activeElement = document.activeElement as HTMLElement;
        const name = activeElement?.getAttribute("name") as FieldName;

        // Check if we're in the editor or an input field
        if (name || activeElement.className.includes("ql-editor")) {
          e.preventDefault();
          handleOpenAI();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenAI]);

  // Handle tag input
  const handleAddTag = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (tagInput.trim() && !tagArray.includes(tagInput.trim())) {
        setTagArray((prev) => [...prev, tagInput.trim()]);
        setTagInput("");
      }
    },
    [tagInput, tagArray]
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTagArray((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const files = Array.from(event.target.files);

      try {
        const mediaFiles = await Promise.all(
          files.map(async (file) => {
            const dataUrl = await fileToDataURL(file);
            return {
              file,
              preview: dataUrl,
            };
          })
        );

        setMedia((prev) => [...prev, ...mediaFiles]);

        if (activeStep === 0 && media.length === 0) {
          setActiveStep(1); // Move to details step if this is the first image
        }
      } catch {
        toast("Có lỗi xảy ra", {
          description: "Có lỗi xảy ra trong quá trình tải ảnh",
        });
      }
    },
    [activeStep, media.length]
  );

  // Handle image drop
  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!event.dataTransfer.files || event.dataTransfer.files.length === 0)
        return;

      const files = Array.from(event.dataTransfer.files);

      try {
        const mediaFiles = await Promise.all(
          files.map(async (file) => {
            const dataUrl = await fileToDataURL(file);
            return {
              file,
              preview: dataUrl,
            };
          })
        );

        setMedia((prev) => [...prev, ...mediaFiles]);

        if (activeStep === 0) {
          setActiveStep(1); // Move to details step
        }
      } catch {
        toast("Có lỗi", {
          description: "Có lỗi khi tải ảnh",
        });
      }
    },
    [activeStep]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  // Handle removing an image
  const handleRemoveImage = useCallback(
    (index: number) => {
      setMedia((prev) => {
        const newMedia = [...prev];
        newMedia.splice(index, 1);
        return newMedia;
      });

      // Update preview index if needed
      setPreviewIndex((prev) =>
        prev >= media.length - 1 ? Math.max(0, media.length - 2) : prev
      );
    },
    [media.length]
  );

  // Handle navigation between steps
  const nextStep = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle form submission
  const onSubmit = useCallback(
    async (values: PostFormValues) => {
      if (!values.content.trim()) {
        toast("Vui lòng nhập nội dung bài viết");
        return;
      }

      if (media.length === 0) {
        toast("Cảnh báo", {
          description:
            "Bạn có chắn chắn muốn tạo bài viết mà không có ảnh nào?",
        });
        // You could add a confirmation step here if needed
      }

      setIsSubmitting(true);

      try {
        // Create FormData for multipart/form-data submission
        const submitData = new FormData();

        // Add text fields
        submitData.append("title", values.title || "");
        submitData.append("content", values.content);
        submitData.append("tags", values.tags || "");
        submitData.append("petIds", values.petIds || "");
        submitData.append("visibility", values.visibility);

        // Add media files
        media.forEach((item) => {
          submitData.append("media", item.file);
        });

        // Submit the form
        await mutation.mutateAsync(submitData);

        toast("Thành công", {
          description: "Bạn đã tạo bài viết thành công",
        });

        // Close modal or redirect
        if (onClose) {
          onClose();
        } else {
          navigate("/");
        }
      } catch {
        toast("Có lỗi tạo bài viết");
      } finally {
        setIsSubmitting(false);
      }
    },
    [media, mutation, navigate, onClose]
  );

  // Action button based on step
  const ActionButton = useMemo(() => {
    if (activeStep === steps.length - 1) {
      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary font-medium"
          onClick={methods.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang tạo bài viết..." : "Tạo bài viết"}
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-primary font-medium"
        onClick={nextStep}
        disabled={media.length === 0}
      >
        Tiếp tục
      </Button>
    );
  }, [
    activeStep,
    steps.length,
    methods,
    onSubmit,
    isSubmitting,
    nextStep,
    media.length,
  ]);

  // Render current media preview
  const CurrentMediaPreview = useMemo(() => {
    if (media.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <ImageIcon size={48} className="mb-2" />
          <p className="text-sm">No media selected</p>
          <label className="mt-4 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded cursor-pointer">
            Tải lên ảnh hoặc video
            <input
              type="file"
              className="hidden"
              accept="image/* video/*"
              multiple
              onChange={handleImageUpload}
            />
          </label>
        </div>
      );
    }

    if (media.length === 1) {
      return (
        <>
          {media[0].file.type.startsWith("video/") ? (
            <video controls className="max-w-full max-h-full object-contain">
              <source src={media[0].preview} type={media[0].file.type} />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          ) : (
            <img
              src={media[0].preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}
        </>
      );
    }

    return (
      <div className="relative w-full h-full">
        <Carousel className="w-full aspect-square owflow-hidden">
          <CarouselContent>
            {media.map((item, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="h-full flex items-center justify-center">
                  {item.file.type.startsWith("video/") ? (
                    <video
                      controls
                      className="max-w-full max-h-full object-contain"
                    >
                      <source src={item.preview} type={item.file.type} />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  ) : (
                    <img
                      src={item.preview}
                      alt={`Preview ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {previewIndex + 1}/{media.length}
        </div>
      </div>
    );
  }, [media, previewIndex, handleImageUpload]);

  return (
    <FormProvider {...methods}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between py-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={prevStep}
            disabled={activeStep === 0 || isSubmitting}
          >
            {activeStep > 0 ? "Quay lại" : ""}
          </Button>
          {ActionButton}
        </div>

        {/* Steps content */}
        <div>
          {/* Step 1: Upload Media */}
          {activeStep === 0 && (
            <div className="p-4">
              <div
                className="border-2 border-dashed border-primary/20 rounded-lg h-80 flex flex-col items-center justify-center p-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Camera className="h-12 w-12 text-primary/40 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Kéo thả ảnh của bạn vào đây
                </p>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Chia sẻ ảnh thú cưng, hoạt động hoặc trải nghiệm của bạn
                </p>
                <label className="inline-flex items-center px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg cursor-pointer">
                  Tải ảnh hoặc video từ thiết bị
                  <input
                    type="file"
                    className="hidden"
                    accept="image/* video/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Show already uploaded images if any */}
              {media.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">
                    Tải lên ảnh/video:
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {media.map((item, index) => (
                      <div
                        key={index}
                        className="relative group rounded-md overflow-hidden aspect-square"
                      >
                        <img
                          src={item.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {activeStep === 1 && (
            <div className="flex flex-col md:flex-row">
              {/* Media Preview */}
              <div className="w-full md:w-1/2 aspect-square overflow-hidden bg-gray-100 flex items-center justify-center border-slate-300 md:border-r">
                {CurrentMediaPreview}
              </div>

              {/* Post Details Form */}
              <div className="w-full md:w-1/2 p-4">
                <Form {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* User Info */}
                    <div className="flex items-center mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture?.url || ""} />
                        <AvatarFallback className="bg-primary text-white text-xs">
                          {user?.fullName
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm font-medium">
                        {user?.fullName}
                      </span>
                    </div>

                    {/* Title */}
                    <FormField
                      control={methods.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Tiêu đề (Tuỳ chọn)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Thêm tiêu đề bài viết..."
                              className="mt-1"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Content */}
                    <div className="relative">
                      <Label htmlFor="content" className="text-gray-700">
                        Nội dung
                      </Label>
                      <div className="relative">
                        <ReactQuill
                          ref={quillRef}
                          value={descriptionValue}
                          onChange={(value) =>
                            methods.setValue("content", value)
                          }
                          placeholder="Write something..."
                          theme="snow"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-0 mt-2 h-7 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 z-10"
                          onClick={handleOpenAI}
                        >
                          <span className="mr-1">✨</span> AI
                        </Button>
                      </div>

                      {methods.formState.errors.content && (
                        <p className="text-sm text-red-500 mt-1">
                          {methods.formState.errors.content.message}
                        </p>
                      )}
                    </div>

                    {/* Media Display */}
                    {media.length > 0 && (
                      <div>
                        <Label className="text-gray-700">
                          Tải lên ảnh/video
                        </Label>
                        <div className="space-y-3 mt-2">
                          {media.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.preview}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <TrashIcon size={18} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Tags */}
                    <div>
                      <Label
                        htmlFor="tags"
                        className="text-gray-700 flex items-center"
                      >
                        <Tags className="h-4 w-4 mr-1" /> Từ khoá
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2 mb-2">
                        {tagArray.map((tag) => (
                          <TagBadge
                            key={tag}
                            onClose={() => handleRemoveTag(tag)}
                          >
                            #{tag}
                          </TagBadge>
                        ))}
                      </div>
                      <div className="flex">
                        <Input
                          id="tags-input"
                          placeholder="Theo từ khoá..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(e);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          className="ml-2"
                          disabled={!tagInput.trim()}
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>

                    {/* Pet Selection */}
                    <FormField
                      control={methods.control}
                      name="petIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 flex items-center">
                            <Tag className="h-4 w-4 mr-1" /> Gắn thẻ thú cưng
                            của bạn
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Chọn thú cưng của bạn" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pets?.map((pet) => (
                                <SelectItem key={pet._id} value={pet._id}>
                                  {pet.name} ({pet.species})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Visibility */}
                    <FormField
                      control={methods.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Chế độ hiển thị
                          </FormLabel>
                          <div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Globe
                                  size={18}
                                  className="mr-2 text-gray-600"
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    Công khai
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Mọi người có thể xem
                                  </p>
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value === "public"}
                                  onCheckedChange={(checked) =>
                                    field.onChange(
                                      checked ? "public" : "private"
                                    )
                                  }
                                />
                              </FormControl>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Lock
                                  size={18}
                                  className="mr-2 text-gray-600"
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    Riêng tư
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Chỉ mình bạn có thể xem
                                  </p>
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value === "private"}
                                  onCheckedChange={(checked) =>
                                    field.onChange(
                                      checked ? "private" : "public"
                                    )
                                  }
                                />
                              </FormControl>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Submit button (for mobile view) */}
                    <div className="mt-2 md:hidden">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !methods.formState.isValid}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Đang tạo bài viết...
                          </>
                        ) : (
                          "Tạo bài viết"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>

        <AIAssistantModal
          isOpen={isAIMenuOpen}
          onClose={() => setIsAIMenuOpen(false)}
          selectedText={selectedText}
          documentContext={documentContext}
          insertContent={insertAIContent}
        />
      </div>
    </FormProvider>
  );
};

export default CreatePostForm;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Loader2, 
  ArrowLeft, 
  ImagePlus, 
  X, 
  Upload, 
  Sparkles 
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetService } from "@/features/service/hooks/queries/get-service";
import { useCreateService } from "@/features/service/hooks/mutations/create-service";
import { useUpdateService } from "@/features/service/hooks/mutations/update-service";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  serviceFormSchema,
} from "@/features/service/schema";
import {
  PetCategory,
  petCategoryTranslations,
  PetSize,
  petSizeTranslations,
  Specialty,
  specialtyTranslations,
} from "@/constants";
import ServiceAIAssistantModal from "@/features/ai-assitant/components/service-ai-assitant";

// Import ReactQuill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Định nghĩa kiểu dữ liệu cho đối tượng hình ảnh
type ImageType = {
  url: string;
  publicId: string;
};

const ServiceForm: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!serviceId;
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

  // Fetch service details if in edit mode
  const {
    data,
    isLoading: isLoadingService,
    isError: serviceError,
  } = useGetService(serviceId || "");

  const serviceData = data?.service;
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService(serviceId || "");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
      applicablePetTypes: [],
      applicablePetSizes: [],
      images: [],
      isActive: true,
    },
  });

  const [imageUrls, setImageUrls] = useState<ImageType[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Set form values when service data is loaded
  useEffect(() => {
    if (serviceData && isEditMode) {
      form.reset({
        name: serviceData.name,
        description: serviceData.description || "",
        price: serviceData.price,
        duration: serviceData.duration,
        category: serviceData.category,
        applicablePetTypes: serviceData.applicablePetTypes || [],
        applicablePetSizes: serviceData.applicablePetSizes || [],
        images: serviceData.images || [],
        isActive: serviceData.isActive,
      });
      setImageUrls(serviceData.images || []);
    }
  }, [serviceData, isEditMode, form]);

  // Watch form values for AI context
  const watchedName = form.watch("name");
  const watchedCategory = form.watch("category");
  const watchedPetTypes = form.watch("applicablePetTypes");
  const watchedDescription = form.watch("description");

  // Update document context for AI whenever form values change
  useEffect(() => {
    const petTypesText = watchedPetTypes.map(type => petCategoryTranslations[type as PetCategory] || type).join(", ");
    const categoryText = specialtyTranslations[watchedCategory as Specialty] || watchedCategory;
    
    setDocumentContext(
      `Tên dịch vụ: ${watchedName || 'Chưa có tên'}\n` +
      `Loại dịch vụ: ${categoryText || 'Chưa chọn'}\n` +
      `Loại thú cưng: ${petTypesText || 'Chưa chọn'}\n` +
      `Mô tả hiện tại: ${watchedDescription || 'Chưa có mô tả'}`
    );
  }, [watchedName, watchedCategory, watchedPetTypes, watchedDescription]);

  const onSubmit = (data: ServiceFormValues) => {
    if (isEditMode) {
      // Cập nhật dịch vụ: sử dụng JSON
      const servicePayload = {
        ...data,
        images: imageUrls,
      };

      updateServiceMutation.mutate(servicePayload, {
        onSuccess: () => {
          toast.success("Cập nhật dịch vụ thành công");
          navigate("/admin/services");
        },
        onError: (error) => {
          toast.error("Cập nhật dịch vụ thất bại");
          console.error(error);
        },
      });
    } else {
      // Tạo dịch vụ mới: sử dụng FormData
      const formData = new FormData();

      // Thêm các trường dữ liệu cơ bản
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("duration", data.duration.toString());
      formData.append("category", data.category);
      formData.append("isActive", data.isActive.toString());

      // Thêm các trường tùy chọn
      if (data.description) {
        formData.append("description", data.description);
      }

      // Thêm mảng các loại thú cưng và kích thước
      data.applicablePetTypes.forEach((type, index) => {
        formData.append(`applicablePetTypes[${index}]`, type);
      });

      if (data.applicablePetSizes && data.applicablePetSizes.length > 0) {
        data.applicablePetSizes.forEach((size, index) => {
          formData.append(`applicablePetSizes[${index}]`, size);
        });
      }

      // Thêm các file hình ảnh đã upload
      imageFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      // Thêm các URL hình ảnh đã có
      imageUrls.forEach((img, index) => {
        if (img.url) {
          formData.append(`existingImages[${index}][url]`, img.url);
        }
        if (img.publicId) {
          formData.append(`existingImages[${index}][publicId]`, img.publicId);
        }
      });

      createServiceMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Tạo dịch vụ thành công");
          navigate("/manager/services");
        },
        onError: (error) => {
          toast.error("Tạo dịch vụ thất bại");
          console.error(error);
        },
      });
    }
  };

  // Thêm hình ảnh từ URL
  const addImageUrl = () => {
    if (newImageUrl && !imageUrls.some((img) => img.url === newImageUrl)) {
      // Tạo một ID công khai tạm thời nếu không có
      const newImage: ImageType = {
        url: newImageUrl,
        publicId: `temp_${Date.now()}`, // ID tạm thời
      };
      setImageUrls([...imageUrls, newImage]);
      setNewImageUrl("");
    }
  };

  // Xử lý upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Kiểm tra từng file
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      // Kiểm tra kích thước
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} vượt quá 5MB`);
        return;
      }

      // Kiểm tra loại file
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} không phải là hình ảnh hợp lệ`);
        return;
      }

      validFiles.push(file);
    });

    // Thêm các file hợp lệ vào state
    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xóa file đã upload
  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Xóa hình ảnh từ URL
  const removeImageUrl = (url: string) => {
    setImageUrls(imageUrls.filter((img) => img.url !== url));
  };

  // AI Assistant functions
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
  const insertAIContent = useCallback((aiContent: string) => {
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
        const insertIndex = currentSelection ? currentSelection.index : editor.getLength();
        editor.insertText(insertIndex, aiContent);
        editor.setSelection(insertIndex + aiContent.length, 0);
      }
      
      // Update form value with new editor content
      const html = editor.root.innerHTML;
      form.setValue("description", html, { 
        shouldDirty: true, 
        shouldTouch: true,
        shouldValidate: true 
      });
    }
    
    setIsAIMenuOpen(false);
  }, [form, selectionRange]);

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
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenAI]);

  // Cấu hình ReactQuill
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet',
    'header',
    'color', 'background'
  ];

  if (isLoadingService && isEditMode) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (serviceError && isEditMode) {
    return (
      <div className="text-red-500 p-8">
        Lỗi khi tải dịch vụ. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/manager/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle className="text-2xl font-bold">
              {isEditMode ? "Chỉnh Sửa Dịch Vụ" : "Tạo Dịch Vụ Mới"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Cập nhật thông tin dịch vụ hiện có"
                : "Điền vào biểu mẫu để tạo dịch vụ mới"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Dịch Vụ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên dịch vụ" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mô Tả</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleOpenAI}
                      className="h-7 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      AI Hỗ trợ
                    </Button>
                  </div>
                  <FormControl>
                    <div className="editor-container min-h-[150px]">
                      <ReactQuill
                        ref={quillRef}
                        value={field.value}
                        onChange={(content) => {
                          field.onChange(content);
                        }}
                        placeholder="Mô tả dịch vụ chi tiết tại đây..."
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Nhấn Ctrl+Space để sử dụng trợ lý AI viết mô tả
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời Lượng (phút)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dịch vụ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Specialty).map((item) => (
                        <SelectItem key={item} value={item}>
                          {specialtyTranslations[item] || item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicablePetTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Loại Thú Cưng Áp Dụng</FormLabel>
                    <FormDescription>
                      Chọn loại thú cưng mà dịch vụ này áp dụng cho
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(PetCategory).map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="applicablePetTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = [
                                      ...(field.value || []),
                                    ];
                                    return checked
                                      ? field.onChange([...currentValues, type])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== type
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {petCategoryTranslations[type] || type}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicablePetSizes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Kích Thước Thú Cưng Áp Dụng</FormLabel>
                    <FormDescription>
                      Chọn kích thước thú cưng mà dịch vụ này áp dụng cho
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(PetSize).map((size) => (
                      <FormField
                        key={size}
                        control={form.control}
                        name="applicablePetSizes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={size}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(size)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = [
                                      ...(field.value || []),
                                    ];
                                    return checked
                                      ? field.onChange([...currentValues, size])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== size
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {petSizeTranslations[size] || size}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Hình Ảnh Dịch Vụ</Label>

              {/* Hiển thị các hình ảnh đã có từ URL */}
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((img) => (
                  <div
                    key={img.publicId}
                    className="relative overflow-hidden rounded-md border border-border"
                  >
                    <img
                      src={img.url}
                      alt="Dịch vụ"
                      className="h-20 w-20 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/150?text=Lỗi+Hình+Ảnh";
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeImageUrl(img.url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Hiển thị xem trước các file đã upload */}
              {imageFiles.length > 0 && (
                <div className="mt-4">
                  <Label>Hình ảnh đã chọn để tải lên</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageFiles.map((file, index) => (
                      <div
                        key={`file-${index}`}
                        className="relative overflow-hidden rounded-md border border-border"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Hình ảnh ${index + 1}`}
                          className="h-20 w-20 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={() => removeImageFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input thêm URL hình ảnh */}
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Nhập URL hình ảnh"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  disabled={!newImageUrl}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Thêm URL
                </Button>
              </div>

              {/* Upload file */}
              {!isEditMode && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md bg-muted hover:bg-muted/80"
                    >
                      <Upload className="h-4 w-4" />
                      Tải lên hình ảnh
                    </Label>
                    <FormDescription className="text-xs">
                      Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)
                    </FormDescription>
                  </div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Kích Hoạt</FormLabel>
                    <FormDescription>
                      Dịch vụ này sẽ hiển thị với khách hàng nếu được kích hoạt
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/services")}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={
                  createServiceMutation.isPending ||
                  updateServiceMutation.isPending
                }
              >
                {createServiceMutation.isPending ||
                updateServiceMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : isEditMode ? (
                  "Cập Nhật Dịch Vụ"
                ) : (
                  "Tạo Dịch Vụ"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* AI Assistant Modal */}
      <ServiceAIAssistantModal
        isOpen={isAIMenuOpen}
        onClose={() => setIsAIMenuOpen(false)}
        selectedText={selectedText}
        documentContext={documentContext}
        insertContent={insertAIContent}
        serviceCategory={watchedCategory}
      />
    </Card>
  );
};

export default ServiceForm;
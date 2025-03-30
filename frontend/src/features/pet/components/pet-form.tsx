import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useUpdatePet } from "../hooks/mutations/update-pet";
import { usePetCreation } from "../hooks/mutations/use-pet-creation";

// Loại giới tính
const genderOptions = [
  { value: "Đực", label: "Đực" },
  { value: "Cái", label: "Cái" },
  { value: "Không xác định", label: "Không xác định" },
];

// Các loài phổ biến
const speciesOptions = [
  { value: "Chó", label: "Chó" },
  { value: "Mèo", label: "Mèo" },
  { value: "Chim", label: "Chim" },
  { value: "Chuột", label: "Chuột" },
  { value: "Thỏ", label: "Thỏ" },
  { value: "Cá", label: "Cá" },
  { value: "Khác", label: "Khác" },
];

// Schema validation
const petFormSchema = z.object({
  name: z.string().min(1, "Tên thú cưng không được để trống"),
  species: z.string().min(1, "Loài thú cưng không được để trống"),
  breed: z.string().optional(),
  age: z.coerce.number().positive("Tuổi phải là số dương").optional(),
  weight: z.coerce.number().positive("Cân nặng phải là số dương").optional(),
  gender: z.string().optional(),
  habits: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  specialNeeds: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetFormProps {
  pet?: {
    _id: string;
    name: string;
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
    gender?: string;
    habits?: string[];
    allergies?: string[];
    specialNeeds?: string;
    profilePicture?: {
      url: string | null;
      publicId?: string | null;
    };
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onSuccess, onCancel }) => {
  const [habits, setHabits] = useState<string[]>([""]);
  const [allergies, setAllergies] = useState<string[]>([""]);
  const [petPicture, setPetPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(
    pet?.profilePicture?.url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!pet;

  // Hooks để tạo/cập nhật thú cưng
  const { handleCreatePet, isCreating } = usePetCreation();
  const updatePet = useUpdatePet();

  // Form với validation
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet?.name || "",
      species: pet?.species || "",
      breed: pet?.breed || "",
      age: pet?.age,
      weight: pet?.weight,
      gender: pet?.gender || "",
      habits: pet?.habits || [""],
      allergies: pet?.allergies || [""],
      specialNeeds: pet?.specialNeeds || "",
    },
  });

  // Khởi tạo habits và allergies
  useEffect(() => {
    if (pet?.habits && pet.habits.length > 0) {
      setHabits(pet.habits);
    }

    if (pet?.allergies && pet.allergies.length > 0) {
      setAllergies(pet.allergies);
    }

    if (pet?.profilePicture?.url) {
      setPicturePreview(pet.profilePicture.url);
    }
  }, [pet]);

  // Xử lý khi có thay đổi habit
  const handleHabitChange = (index: number, value: string) => {
    const newHabits = [...habits];
    newHabits[index] = value;
    setHabits(newHabits);
    form.setValue(
      "habits",
      newHabits.filter((habit) => habit.trim() !== "")
    );
  };

  // Thêm một habit mới
  const addHabit = () => {
    setHabits([...habits, ""]);
  };

  // Xóa một habit
  const removeHabit = (index: number) => {
    if (habits.length > 1) {
      const newHabits = [...habits];
      newHabits.splice(index, 1);
      setHabits(newHabits);
      form.setValue(
        "habits",
        newHabits.filter((habit) => habit.trim() !== "")
      );
    }
  };

  // Xử lý khi có thay đổi allergy
  const handleAllergyChange = (index: number, value: string) => {
    const newAllergies = [...allergies];
    newAllergies[index] = value;
    setAllergies(newAllergies);
    form.setValue(
      "allergies",
      newAllergies.filter((allergy) => allergy.trim() !== "")
    );
  };

  // Thêm một allergy mới
  const addAllergy = () => {
    setAllergies([...allergies, ""]);
  };

  // Xóa một allergy
  const removeAllergy = (index: number) => {
    if (allergies.length > 1) {
      const newAllergies = [...allergies];
      newAllergies.splice(index, 1);
      setAllergies(newAllergies);
      form.setValue(
        "allergies",
        newAllergies.filter((allergy) => allergy.trim() !== "")
      );
    }
  };

  // Xử lý khi chọn ảnh
  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPetPicture(file);
      const preview = URL.createObjectURL(file);
      setPicturePreview(preview);
    }
  };

  // Xử lý khi click vào nút chọn ảnh
  const handleSelectPicture = () => {
    fileInputRef.current?.click();
  };

  // Xử lý khi submit form
  const onSubmit = async (data: PetFormValues) => {
    try {
      // Lọc các trường habits và allergies trống
      const filteredHabits = habits.filter((item) => item.trim() !== "");
      const filteredAllergies = allergies.filter((item) => item.trim() !== "");

      // Chuẩn bị dữ liệu để gửi đến backend
      const formattedData = {
        ...data,
        // Đảm bảo age và weight là số nếu có giá trị
        age: data.age !== undefined && data.age !== null ? Number(data.age) : undefined,
        weight: data.weight !== undefined && data.weight !== null ? Number(data.weight) : undefined,
        // Đảm bảo habits và allergies là mảng
        habits: filteredHabits.length > 0 ? filteredHabits : undefined,
        allergies: filteredAllergies.length > 0 ? filteredAllergies : undefined
      };

      if (isEditMode && pet) {
        // Cập nhật thú cưng
        await updatePet.mutateAsync({
          petId: pet._id,
          data: formattedData
        });
        toast("Cập nhật thành công", {
          description: "Thông tin thú cưng đã được cập nhật.",
        });
      } else {
        // Tạo thú cưng mới
        await handleCreatePet(formattedData, petPicture || undefined);
        toast("Tạo thành công", {
          description: "Thú cưng mới đã được tạo.",
        });
      }

      // Gọi callback nếu thành công
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi lưu thú cưng:", error);
      toast("Lỗi", {
        description: "Đã xảy ra lỗi khi lưu thông tin thú cưng.",
      });
    }
  };

  const isPending = isCreating || updatePet.isPending;

  return (
    <Card className="border-orange-200 max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
        <CardTitle className="text-xl text-orange-800">
          {isEditMode ? "Cập nhật thông tin thú cưng" : "Thêm thú cưng mới"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Ảnh đại diện */}
            <div className="flex justify-center mb-6">
              {picturePreview ? (
                <div className="relative">
                  <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-orange-200">
                    <img
                      src={picturePreview}
                      alt="Pet preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full bg-orange-500 hover:bg-orange-600 p-1.5
                    border-2 border-white shadow-sm"
                    onClick={handleSelectPicture}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-28 w-28 rounded-full border-dashed border-2 border-orange-300 flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100"
                  onClick={handleSelectPicture}
                >
                  <Camera className="h-6 w-6 text-orange-500 mb-2" />
                  <span className="text-xs text-orange-700">Thêm ảnh</span>
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePictureChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên thú cưng */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thú cưng *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên thú cưng"
                        {...field}
                        className="border-orange-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Loài */}
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loài *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-orange-200">
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {speciesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giống */}
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giống</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập giống"
                        {...field}
                        className="border-orange-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tuổi */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuổi (năm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Nhập tuổi"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number(e.target.value);
                          field.onChange(value);
                        }}
                        className="border-orange-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cân nặng */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Nhập cân nặng"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number(e.target.value);
                          field.onChange(value);
                        }}
                        className="border-orange-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giới tính */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-orange-200">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thói quen */}
            <div>
              <h3 className="text-sm font-medium mb-2">Thói quen</h3>
              {habits.map((habit, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={habit}
                    onChange={(e) => handleHabitChange(index, e.target.value)}
                    placeholder="Nhập thói quen"
                    className="border-orange-200 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => removeHabit(index)}
                    disabled={habits.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={addHabit}
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm thói quen
              </Button>
            </div>

            {/* Dị ứng */}
            <div>
              <h3 className="text-sm font-medium mb-2">Dị ứng</h3>
              {allergies.map((allergy, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={allergy}
                    onChange={(e) => handleAllergyChange(index, e.target.value)}
                    placeholder="Nhập dị ứng"
                    className="border-orange-200 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => removeAllergy(index)}
                    disabled={allergies.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={addAllergy}
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm dị ứng
              </Button>
            </div>

            {/* Nhu cầu đặc biệt */}
            <FormField
              control={form.control}
              name="specialNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhu cầu đặc biệt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nhu cầu đặc biệt hoặc lưu ý chăm sóc"
                      {...field}
                      className="border-orange-200 min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={onCancel}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : isEditMode ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PetForm;
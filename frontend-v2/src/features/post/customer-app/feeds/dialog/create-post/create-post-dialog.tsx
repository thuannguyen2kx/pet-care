import { XIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
  type UseFormReturn,
} from 'react-hook-form';

import { MediaUploader } from '@/features/post/customer-app/feeds/dialog/create-post/media-uploader';
import type { CreatePost } from '@/features/post/domain/post.state';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CreatePost>;
  onSubmit: () => void;
  isSubmitting: boolean;
};
export function CreatePostDialog({ open, onOpenChange, form, isSubmitting, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>Hôm nay bạn và thú cưng có gì mới</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form>
            <Tabs defaultValue="content">
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="media">Đính kèm</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                <PostContentTab />
              </TabsContent>
              <TabsContent value="media" className="space-y-4">
                <PostMediaTab />
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <PostSettingsTab />
              </TabsContent>
            </Tabs>
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            Đăng bài
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PostContentTab() {
  const form = useFormContext<CreatePost>();
  return (
    <>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Tiêu đề (tuỳ chọn)</FieldLabel>
              <Input
                id={field.name}
                placeholder="VD: Thú cưng đi học"
                {...field}
                className="border-transparent shadow-none focus-visible:ring-0"
              />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nội dung</FieldLabel>
              <Textarea
                id={field.name}
                placeholder="Chia sẽ những trải nghiệm về thú cưng của bạn"
                {...field}
                rows={5}
                className="border-transparent shadow-none focus-visible:ring-0"
              />
            </Field>
          )}
        />
      </FieldGroup>
    </>
  );
}
function PostMediaTab() {
  const form = useFormContext<CreatePost>();
  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="media"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Hình ảnh</FieldLabel>
            <MediaUploader
              value={field.value ?? { added: [], existing: [] }}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </Field>
        )}
      />
    </FieldGroup>
  );
}
function PostSettingsTab() {
  const [input, setInput] = useState('');
  const form = useFormContext<CreatePost>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tags',
  });
  const addTag = () => {
    const value = input.trim();
    if (!value) return;

    const exists = fields.some((tag) => tag.value === value);
    if (exists) return;

    append({ value });
    setInput('');
  };
  return (
    <>
      <FieldGroup>
        <Controller
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Thẻ</FieldLabel>
              <Input
                value={input}
                placeholder="Nhập thẻ và nhấn Enter"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="border-transparent shadow-none focus-visible:ring-0"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {fields.map((field, index) => (
                  <span
                    key={field.id}
                    className="bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                  >
                    #{field.value}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4"
                      onClick={() => remove(index)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="visibility"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Quyền truy cập</FieldLegend>
              <FieldDescription>Những ai có thể xem bài viết của bạn</FieldDescription>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                <FieldLabel htmlFor={`${field.name}-public`} className="border-transparent">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldTitle>Công khai</FieldTitle>
                      <FieldDescription>Mọi người đều có thể thấy</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value="public"
                      id={`${field.name}-public`}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor={`${field.name}-private`} className="border-transparent">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldTitle>Riêng tư</FieldTitle>
                      <FieldDescription>Chỉ mình tôi có thể thấy</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value="private"
                      id={`${field.name}-private`}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </FieldGroup>
    </>
  );
}

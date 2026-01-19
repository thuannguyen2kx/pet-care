import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';

import { useAdminCreatePostController } from '@/features/post/admin-app/post-list/application/use-create-post-controller';
import { MediaUploader } from '@/features/post/customer-app/feeds/dialog/create-post/media-uploader';
import type { CreatePost } from '@/features/post/domain/post.state';
import { Button } from '@/shared/ui/button';
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
import { Textarea } from '@/shared/ui/textarea';

export function AdminCreatePostWidget() {
  const createPostController = useAdminCreatePostController();
  return (
    <div className="bg-card mx-4 p-6">
      <AdminCreatePostForm
        form={createPostController.form}
        onSubmit={createPostController.actions.submitPost}
        isSubmitting={createPostController.state.isSubmitting}
      />
    </div>
  );
}

function AdminCreatePostForm({
  form,
  isSubmitting,
  onSubmit,
}: {
  form: UseFormReturn<CreatePost>;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const [input, setInput] = useState('');
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
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Tiêu đề (tuỳ chọn)</FieldLabel>
              <Input
                id={field.name}
                placeholder="VD: Tips chăm sóc lông cho các bé mùa đông"
                {...field}
                className="shadow-none focus-visible:ring-0"
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
              <FieldLabel htmlFor={field.name}>
                Cửa hàng của bạn đang diễn ra như thế nào?
              </FieldLabel>
              <Textarea
                id={field.name}
                placeholder="Chia sẻ thông tin cập nhật, thông báo hoặc những hiểu biết quý báu với khách hàng của bạn..."
                {...field}
                rows={10}
                className="shadow-none focus-visible:ring-0"
              />
            </Field>
          )}
        />
      </FieldGroup>

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

      <div className="flex items-center justify-end gap-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Đang đăng' : 'Đăng bài viết'}
        </Button>
      </div>
    </form>
  );
}

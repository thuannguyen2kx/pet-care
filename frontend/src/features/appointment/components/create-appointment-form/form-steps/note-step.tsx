"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { Pencil } from "lucide-react"
import { motion } from "framer-motion"

interface NotesStepProps {
  form: UseFormReturn<FormValues>
}

const NotesStep: React.FC<NotesStepProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <FormLabel className="text-lg font-medium mb-2 flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Ghi chú (không bắt buộc)
            </FormLabel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <FormControl>
              <Textarea placeholder="Nhập ghi chú cho cuộc hẹn..." className="min-h-[200px] resize-none" {...field} />
            </FormControl>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <FormDescription className="mt-3">
              Thêm thông tin chi tiết hoặc yêu cầu đặc biệt cho cuộc hẹn của bạn. Ví dụ:
            </FormDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Thú cưng của bạn có vấn đề sức khỏe đặc biệt</li>
                <li>Yêu cầu về sản phẩm hoặc dịch vụ cụ thể</li>
                <li>Thông tin về tính cách hoặc hành vi của thú cưng</li>
              </ul>
          </motion.div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default NotesStep

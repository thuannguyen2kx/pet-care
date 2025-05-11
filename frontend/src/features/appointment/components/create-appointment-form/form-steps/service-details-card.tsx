"use client"

import type React from "react"
import type { ServiceType } from "@/features/service/types/api.types"
import { formatDuration } from "@/features/appointment/utils/appointment-form-config"
import { formatVND } from "@/lib/helper"
import { type PetCategory, petCategoryTranslations } from "@/constants"
import { Clock, DollarSign, Info, PawPrint } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Renderer from "@/components/shared/renderer"

interface ServiceDetailsCardProps {
  service?: ServiceType
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
  if (!service) return null

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />
        Dịch vụ đã chọn
      </h3>
      <div className="rounded-lg border border-primary/20 p-5 bg-primary/5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="text-xl font-medium text-primary">{service.name}</h4>
            <Renderer value={service.description || ""} maxHeight={100} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá</p>
                <p className="font-medium text-lg">{formatVND(service.price)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="font-medium">{service.duration ? formatDuration(service.duration) : "N/A"}</p>
              </div>
            </div>
          </div>

          {service.applicablePetTypes && service.applicablePetTypes.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Loại thú cưng phù hợp</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.applicablePetTypes.map((type) => (
                  <Badge key={type} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {petCategoryTranslations[type as PetCategory] || type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceDetailsCard

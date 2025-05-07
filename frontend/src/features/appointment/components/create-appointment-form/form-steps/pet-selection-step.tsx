"use client"

import React, { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { AlertTriangle, Plus, Search } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ServiceType } from "@/features/service/types/api.types"
import type { PetType } from "@/features/pet/types/api.types"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import ServiceDetailsCard from "./service-details-card"
import useCreatePetSheet from "@/features/pet/hooks/use-create-pet-sheet"
import { type PetCategory, petCategoryTranslations } from "@/constants"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface PetSelectionStepProps {
  form: UseFormReturn<FormValues>
  service?: ServiceType
  pets: PetType[]
  isLoading: boolean
  isPetCompatible: boolean
  incompatibilityReason: string
  setIsPetCompatible: (isCompatible: boolean) => void
  setIncompatibilityReason: (reason: string) => void
}

const PetSelectionStep: React.FC<PetSelectionStepProps> = ({
  form,
  service,
  pets,
  isLoading,
  isPetCompatible,
  incompatibilityReason,
  setIsPetCompatible,
  setIncompatibilityReason,
}) => {
  const { onOpen: openCreatePet } = useCreatePetSheet()
  const [searchTerm, setSearchTerm] = React.useState("")

  // Check if selected pet is compatible with the service
  const checkPetServiceCompatibility = (petId: string, serviceData: ServiceType | undefined) => {
    if (!petId || !serviceData) {
      setIsPetCompatible(true)
      return true
    }

    const selectedPet = pets.find((pet) => pet._id === petId)

    if (!selectedPet) {
      setIsPetCompatible(true)
      return true
    }

    // Check species compatibility
    if (serviceData.applicablePetTypes && !serviceData.applicablePetTypes.includes(selectedPet.species)) {
      setIsPetCompatible(false)
      setIncompatibilityReason(
        `Dịch vụ này chỉ phù hợp với ${serviceData.applicablePetTypes
          .map((type) => petCategoryTranslations[type as PetCategory] || type)
          .join(", ")}`,
      )
      return false
    }

    // Check size compatibility if applicable
    if (serviceData.applicablePetSizes && selectedPet.weight) {
      // Determine pet size based on weight
      let petSize = ""
      if (selectedPet.weight < 5) petSize = "small"
      else if (selectedPet.weight < 15) petSize = "medium"
      else petSize = "large"

      if (!serviceData.applicablePetSizes.includes(petSize)) {
        setIsPetCompatible(false)
        setIncompatibilityReason(
          `Dịch vụ này chỉ phù hợp với thú cưng có kích thước ${serviceData.applicablePetSizes
            .map((size) => {
              if (size === "small") return "nhỏ"
              if (size === "medium") return "vừa"
              return "lớn"
            })
            .join(", ")}`,
        )
        return false
      }
    }

    setIsPetCompatible(true)
    return true
  }

  // Check pet compatibility when pet changes
  useEffect(() => {
    const petId = form.watch("petId")
    if (petId) {
      checkPetServiceCompatibility(petId, service)
    }
  }, [form.watch("petId"), service])

  // Helper to get pet size label
  const getPetSizeLabel = (weight?: number) => {
    if (!weight) return null
    if (weight < 5) return "Nhỏ"
    if (weight < 15) return "Vừa"
    return "Lớn"
  }

  // Filter pets based on search term
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Đang tải thông tin...</p>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <ServiceDetailsCard service={service} />
      </motion.div>

      <FormField
        control={form.control}
        name="petId"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <motion.div variants={item}>
              <FormLabel className="text-lg font-medium flex items-center gap-2">
                <span>Chọn thú cưng</span>
                {pets.length > 0 && (
                  <Badge className="ml-2">
                    {pets.length} thú cưng
                  </Badge>
                )}
              </FormLabel>
            </motion.div>

            {pets.length > 0 && (
              <motion.div variants={item} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thú cưng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </motion.div>
            )}

            {pets.length > 0 ? (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  checkPetServiceCompatibility(value, service)
                }}
                value={field.value}
                className="space-y-3"
              >
                <FormControl>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredPets.length > 0 ? (
                      filteredPets.map((pet, index) => {
                        const isPetIncompatible =
                          (service?.applicablePetTypes && !service.applicablePetTypes.includes(pet.species)) ||
                          (service?.applicablePetSizes &&
                            pet.weight &&
                            !service.applicablePetSizes.includes(
                              pet.weight < 5 ? "small" : pet.weight < 15 ? "medium" : "large",
                            ))

                        return (
                          <motion.div
                            key={pet._id}
                            variants={item}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "relative flex items-center p-4 rounded-lg border transition-all",
                              field.value === pet._id
                                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                : "border-muted hover:border-muted-foreground/50",
                              isPetIncompatible && "opacity-60",
                            )}
                          >
                            <RadioGroupItem
                              value={pet._id}
                              id={`pet-${pet._id}`}
                              className="absolute right-4 top-4"
                              disabled={!!isPetIncompatible}
                            />

                            <div className="flex gap-3 w-full">
                              {/* Pet Avatar */}
                              <div className="flex-shrink-0">
                                {pet.profilePicture ? (
                                  <img
                                    src={pet.profilePicture.url || ""}
                                    alt={pet.name}
                                    className="h-16 w-16 rounded-full object-cover border-2 border-muted"
                                  />
                                ) : (
                                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                                    {pet.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>

                              {/* Pet Details */}
                              <div className="flex flex-col flex-1">
                                <h3 className="font-medium text-lg">{pet.name}</h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {petCategoryTranslations[pet.species as PetCategory] || pet.species}
                                  </Badge>
                                  {pet.breed && (
                                    <Badge variant="outline" className="text-xs">
                                      {pet.breed}
                                    </Badge>
                                  )}
                                  {pet.weight && (
                                    <Badge variant="outline" className="text-xs">
                                      {pet.weight} kg ({getPetSizeLabel(pet.weight)})
                                    </Badge>
                                  )}
                                  {pet.gender && (
                                    <Badge variant="outline" className="text-xs">
                                      {pet.gender}
                                    </Badge>
                                  )}
                                </div>

                                {isPetIncompatible && (
                                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Không phù hợp với dịch vụ này
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    ) : (
                      <div className="col-span-full text-center p-8 border border-dashed rounded-lg">
                        <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Không tìm thấy thú cưng phù hợp với "{searchTerm}"</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                          Xóa tìm kiếm
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </FormControl>
              </RadioGroup>
            ) : (
              <motion.div
                variants={item}
                className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg"
              >
                <p className="mb-4 text-muted-foreground">Chưa có thú cưng nào. Vui lòng thêm thú cưng trước.</p>
                <Button onClick={openCreatePet} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Thêm thú cưng mới
                </Button>
              </motion.div>
            )}

            {pets.length > 0 && (
              <motion.div variants={item} className="flex justify-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCreatePet}
                  className="gap-1 border-primary hover:bg-primary/10 text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Thêm thú cưng mới
                </Button>
              </motion.div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />

      {!isPetCompatible && form.watch("petId") && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Thú cưng không phù hợp</AlertTitle>
            <AlertDescription>{incompatibilityReason}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PetSelectionStep

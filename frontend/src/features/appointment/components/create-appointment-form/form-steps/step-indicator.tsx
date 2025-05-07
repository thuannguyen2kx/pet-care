"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StepIndicatorProps {
  currentStep: number
  steps: Record<string, number>
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const totalSteps = Object.values(steps).filter((step) => typeof step === "number").length

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {Object.values(steps)
          .filter((step) => typeof step === "number")
          .map((step, index) => (
            <React.Fragment key={step}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "relative h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  currentStep === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 text-muted-foreground",
                )}
              >
                {currentStep > step ? <Check className="h-5 w-5" /> : <span>{step + 1}</span>}

                {/* Step label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {step === 0
                    ? "Thú cưng"
                    : step === 1
                      ? "Ngày"
                      : step === 2
                        ? "Giờ"
                        : step === 3
                          ? "Nhân viên"
                          : step === 4
                            ? "Ghi chú"
                            : step === 5
                              ? "Thanh toán"
                              : "Xác nhận"}
                </div>
              </motion.div>

              {index < totalSteps - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn("h-1 w-8 origin-left", currentStep > step ? "bg-primary" : "bg-muted-foreground/30")}
                />
              )}
            </React.Fragment>
          ))}
      </div>
    </div>
  )
}

export default StepIndicator

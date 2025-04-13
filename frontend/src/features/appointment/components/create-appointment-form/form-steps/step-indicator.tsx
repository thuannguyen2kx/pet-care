import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: Record<string, number>;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2">
        {Object.values(steps)
          .filter((step) => typeof step === "number")
          .map((step) => (
            <React.Fragment key={step}>
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2",
                  currentStep === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                {currentStep > step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{step + 1}</span>
                )}
              </div>
              {step < Object.keys(steps).length / 2 - 1 && (
                <div
                  className={cn(
                    "h-1 w-10",
                    currentStep > step
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default StepIndicator;
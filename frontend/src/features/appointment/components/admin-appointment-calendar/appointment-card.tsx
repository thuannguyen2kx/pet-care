import React from "react";
import { cn } from "@/lib/utils";
import { AppointmentOverlapBadge } from "./appointment-overlap-badge";
import { PetCategory, petCategoryTranslations } from "@/constants";

export interface AppointmentCardProps {
  id: string;
  title?: string;
  time: string;
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  pet: {
    name: string;
    species?: string;
    breed?: string;
    profilePicture?: {
      url: string | null;
      publicId: string | null;
    };
  };
  status: string;
  employee?: {
    fullName: string;
    profilePicture?: {
      url: string | null;
      publicId: string | null;
    };
  };
  onClick?: (e: React.MouseEvent) => void;
  isInWeekView?: boolean;
  isOverlapping?: boolean;
  overlapIndex?: number;
  totalOverlapping?: number;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  time,
  customer,
  pet,
  status,
  employee,
  onClick,
  isInWeekView = false,
  isOverlapping = false,
  overlapIndex = 0,
  totalOverlapping = 1
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'confirmed':
        return 'border-l-green-500 bg-green-50';
      case 'in-progress':
        return 'border-l-blue-500 bg-blue-50';
      case 'completed':
        return 'border-l-gray-500 bg-gray-50';
      case 'cancelled':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-purple-500 bg-purple-50';
    }
  };

  // Render a compact card for week view with overlapping support
  if (isInWeekView) {
    const width = isOverlapping ? `calc(100% / ${totalOverlapping})` : '100%';
    const marginLeft = isOverlapping ? `calc(${width} * ${overlapIndex})` : '0';
    
    return (
      <div 
        className={cn(
          "absolute p-1.5 rounded-sm border-l-4 text-xs cursor-pointer hover:shadow-md transition-shadow",
          getStatusColor(status)
        )}
        style={{ 
          width, 
          left: marginLeft,
          zIndex: overlapIndex + 1 
        }}
        onClick={onClick}
      >
        <div className="font-medium truncate">{title || 'Cuộc hẹn'}</div>
        <div className="truncate">{customer?.fullName}</div>
      </div>
    );
  }

  // Render a detailed card for day view
  return (
    <div 
      className={cn(
        "p-3 rounded border-l-4 cursor-pointer hover:shadow-md transition-shadow",
        getStatusColor(status),
        isOverlapping && "mb-1" // Add margin between overlapping appointments
      )}
      style={{
        opacity: isOverlapping ? 0.9 - (overlapIndex * 0.1) : 1,
        zIndex: isOverlapping ? 10 - overlapIndex : 1
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{title || 'Cuộc hẹn'}</span>
        <div className="flex items-center space-x-1">
          {isOverlapping && totalOverlapping > 1 && overlapIndex === 0 && (
            <AppointmentOverlapBadge count={totalOverlapping - 1} />
          )}
          <div className={`w-2 h-2 rounded-full ${
            status === 'pending' ? 'bg-yellow-500' :
            status === 'confirmed' ? 'bg-green-500' :
            status === 'in-progress' ? 'bg-blue-500' :
            status === 'completed' ? 'bg-gray-500' :
            'bg-red-500'
          }`} />
        </div>
      </div>
      
      <div className="text-sm mt-1">{time}</div>
      
      <div className="mt-2 text-sm">
        <div><span className="font-medium">Khách hàng:</span> {customer?.fullName}</div>
        <div><span className="font-medium">Thú cưng:</span> {pet?.name} {pet?.species && petCategoryTranslations[pet.species as PetCategory]}</div>
        {employee && <div><span className="font-medium">Nhân viên:</span> {employee.fullName}</div>}
      </div>
    </div>
  );
};
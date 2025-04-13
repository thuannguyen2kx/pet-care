// src/features/appointment/components/calendar/appointment-card.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a util function for class names

export interface AppointmentCardProps {
  id: string;
  title?: string;
  time: string;
  customer: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  pet: {
    _id: string;
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
    _id: string;
    fullName: string;
    profilePicture?: {
      url: string | null;
      publicId: string | null;
    };
  };
  onClick?: () => void;
  isInWeekView?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  time,
  customer,
  pet,
  status,
  employee,
  onClick,
  isInWeekView = false
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

  // Render a compact card for week view
  if (isInWeekView) {
    return (
      <div 
        className={cn(
          "p-1.5 rounded-sm border-l-4 text-xs cursor-pointer hover:shadow-md transition-shadow",
          getStatusColor(status)
        )}
        onClick={onClick}
      >
        <div className="font-medium truncate">{title}</div>
        <div className="truncate">{customer?.fullName}</div>
      </div>
    );
  }

  // Render a detailed card for other views
  return (
    <div 
      className={cn(
        "p-3 rounded border-l-4 cursor-pointer hover:shadow-md transition-shadow",
        getStatusColor(status)
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        <div className={`w-2 h-2 rounded-full ${
          status === 'pending' ? 'bg-yellow-500' :
          status === 'confirmed' ? 'bg-green-500' :
          status === 'in-progress' ? 'bg-blue-500' :
          status === 'completed' ? 'bg-gray-500' :
          'bg-red-500'
        }`} />
      </div>
      
      <div className="text-sm mt-1">{time}</div>
      
      <div className="mt-2 text-sm">
        <div><span className="font-medium">Khách hàng:</span> {customer?.fullName}</div>
        <div><span className="font-medium">Thú cưng:</span> {pet?.name} {pet?.species && `(${pet.species})`}</div>
        {employee && <div><span className="font-medium">Nhân viên:</span> {employee.fullName}</div>}
      </div>
    </div>
  );
};
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  FilePlus,
  Pill,
  Stethoscope,
  Heart,
  Cake,
  Weight,
  User,
  Shield,
  AlertTriangle,
} from "lucide-react";

import PetAvatar from "@/features/pet/components/pet-avatar";
import { usePetDetails } from "@/features/pet/hooks/queries/get-pet";


import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PetCategory, petCategoryTranslations } from "@/constants";

// Schema for adding vaccination

const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = usePetDetails(petId!);
  const pet = data?.pet;


  const handleBackClick = () => {
    navigate(-1);
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading || !pet) {
    return <PetDetailSkeleton />;
  }



  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      {/* Header with back button and edit option */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition-colors rounded-lg"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>

       
      </div>

      {/* Pet information card */}
      <div className="relative mb-10">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-4 h-40 bg-gradient-to-r from-orange-100 to-amber-50 rounded-3xl -z-10 opacity-60 blur-xl" />

        <Card className="p-0 border-orange-100  bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left column - Avatar and basic info */}
            <div className="w-full md:w-1/3 p-6 md:border-r border-orange-100 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50/30">
              <div className="relative group mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-amber-300 opacity-70 blur group-hover:opacity-100 transition-all duration-300" />
                <div className="relative">
                  <PetAvatar pet={pet} size="lg" editable={false} />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 text-center">
                {pet.name}
              </h1>

              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-sm">
                  {petCategoryTranslations[pet.species as PetCategory]}
                </Badge>
                {pet.breed && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-white/70 text-orange-800"
                  >
                    {pet.breed}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right column - Pet details */}
            <div className="w-full md:w-2/3 p-6">
              <h2 className="text-lg font-semibold text-zinc-800 flex items-center mb-4 gap-2">
                <Heart className="h-5 w-5 text-orange-500" />
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {pet.age !== undefined && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Cake className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Tuổi</p>
                      <p className="font-medium text-zinc-800">{pet.age} năm</p>
                    </div>
                  </div>
                )}

                {pet.weight !== undefined && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Weight className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Cân nặng
                      </p>
                      <p className="font-medium text-zinc-800">
                        {pet.weight} kg
                      </p>
                    </div>
                  </div>
                )}

                {pet.gender && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Giới tính
                      </p>
                      <p className="font-medium text-zinc-800">{pet.gender}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Special needs section */}
              {pet.specialNeeds && (
                <div className="p-3.5 rounded-xl border border-orange-100 bg-orange-50/50 mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="h-5 w-5 text-orange-500" />
                    <p className="font-medium text-zinc-800">
                      Nhu cầu đặc biệt
                    </p>
                  </div>
                  <p className="text-zinc-600 pl-7">{pet.specialNeeds}</p>
                </div>
              )}

              {/* Habits and allergies section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pet.habits && pet.habits.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-orange-500" />
                      <p className="font-medium text-zinc-800">Thói quen</p>
                    </div>
                    <ul className="space-y-1 pl-2">
                      {pet.habits.map((habit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-zinc-600"
                        >
                          <span className="text-orange-400 mr-2">•</span>
                          <span>{habit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pet.allergies && pet.allergies.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <p className="font-medium text-zinc-800">Dị ứng</p>
                    </div>
                    <ul className="space-y-1 pl-2">
                      {pet.allergies.map((allergy, index) => (
                        <li
                          key={index}
                          className="flex items-start text-zinc-600"
                        >
                          <span className="text-orange-400 mr-2">•</span>
                          <span>{allergy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for vaccination and medical history */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-8 h-24 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full -z-10 opacity-50 blur-xl" />

        <Tabs defaultValue="vaccinations" className="w-full">
          <TabsList className="w-full p-1 bg-white border border-orange-100 rounded-lg shadow-sm mb-6">
            <TabsTrigger
              value="vaccinations"
              className="flex-1 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
            >
              <Pill className="h-4 w-4 mr-2" />
              Tiêm phòng
            </TabsTrigger>
            <TabsTrigger
              value="medical"
              className="flex-1 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Lịch sử y tế
            </TabsTrigger>
          </TabsList>

          {/* Vaccination tab content */}
          <TabsContent
            value="vaccinations"
            className="focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="p-0 border border-orange-100 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
                <CardTitle className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-orange-500" />
                  Lịch sử tiêm phòng
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-5 bg-white">
                {pet.vaccinations && pet.vaccinations.length > 0 ? (
                  <div className="space-y-4">
                    {pet.vaccinations.map((vaccination, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50/40 to-amber-50/40 hover:from-orange-50 hover:to-amber-50 transition-colors duration-200"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Pill className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-800 text-lg">
                            {vaccination.name}
                          </h4>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 text-zinc-600 p-2 rounded-md bg-white border border-orange-50">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">
                                      Ngày tiêm: {formatDate(vaccination.date)}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-800 text-white">
                                  <p>Ngày thực hiện tiêm phòng</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {vaccination.expiryDate && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 text-zinc-600 p-2 rounded-md bg-white border border-orange-50">
                                      <Calendar className="h-4 w-4 text-orange-500" />
                                      <span className="font-medium">
                                        Hết hạn:{" "}
                                        {formatDate(vaccination.expiryDate)}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-800 text-white">
                                    <p>Ngày vaccine hết hiệu lực</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {vaccination.certificate && (
                              <div className="flex items-center gap-2 text-zinc-600 md:col-span-2 p-2 rounded-md bg-white border border-orange-50">
                                <FilePlus className="h-4 w-4 text-orange-500" />
                                <span className="font-medium">
                                  Mã CN: {vaccination.certificate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Pill className="h-8 w-8 text-orange-300" />
                      </div>
                    </div>
                    <p className="text-zinc-500 mb-2">
                      Chưa có thông tin tiêm phòng
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical history tab content */}
          <TabsContent
            value="medical"
            className="focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="p-0 border border-orange-100 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
                <CardTitle className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-orange-500" />
                  Lịch sử y tế
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-5 bg-white">
                {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {pet.medicalHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50/40 to-amber-50/40 hover:from-orange-50 hover:to-amber-50 transition-colors duration-200"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Stethoscope className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className="font-semibold text-zinc-800 text-lg">
                              {record.condition}
                            </h4>
                            <Badge
                              variant="outline"
                              className="bg-white border-orange-100 text-zinc-600 font-medium px-3 py-1 self-start"
                            >
                              {formatDate(record.diagnosis)}
                            </Badge>
                          </div>

                          {record.treatment && (
                            <div className="mt-3 p-3 rounded-lg bg-white border border-orange-50">
                              <p className="text-sm font-medium text-orange-700 mb-1.5">
                                Phương pháp điều trị:
                              </p>
                              <p className="text-sm text-zinc-600">
                                {record.treatment}
                              </p>
                            </div>
                          )}

                          {record.notes && (
                            <div className="mt-3 p-3 rounded-lg bg-white border border-orange-50">
                              <p className="text-sm font-medium text-orange-700 mb-1.5">
                                Ghi chú:
                              </p>
                              <p className="text-sm text-zinc-600">
                                {record.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Stethoscope className="h-8 w-8 text-orange-300" />
                      </div>
                    </div>
                    <p className="text-zinc-500 mb-2">
                      Chưa có thông tin lịch sử y tế
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

// Loading skeleton
const PetDetailSkeleton = () => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Pet info card skeleton */}
      <div className="mb-10">
        <Skeleton className="rounded-xl h-[250px] md:h-[200px] w-full" />
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default PetDetail;

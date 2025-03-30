import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Calendar,
  Edit,
  FilePlus,
  Pill,
  Plus,
  Stethoscope, 
} from "lucide-react";

import { format } from "date-fns";
import PetAvatar from "@/features/pet/components/pet-avatar"; 
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { usePetDetails } from "@/features/pet/hooks/queries/get-pet";
import { useAddVaccination } from "@/features/pet/hooks/mutations/add-vaccination";
import { useAddMedicalRecord } from "@/features/pet/hooks/mutations/add-medical-record";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Schema for adding vaccination
const vaccinationSchema = z.object({
  name: z.string().min(1, "Tên vaccine không được để trống"),
  date: z.string().min(1, "Ngày tiêm không được để trống"),
  expiryDate: z.string().optional(),
  certificate: z.string().optional(),
});

// Schema for adding medical record
const medicalRecordSchema = z.object({
  condition: z.string().min(1, "Tình trạng không được để trống"),
  diagnosis: z.string().min(1, "Ngày chẩn đoán không được để trống"),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

type VaccinationFormValues = z.infer<typeof vaccinationSchema>;
type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;



const PetDetail = () => {
  const {petId} = useParams()
  const navigate = useNavigate();
  const { data, isLoading, refetch } = usePetDetails(petId!);
  const pet = data?.pet;
  const addVaccination = useAddVaccination();
  const addMedicalRecord = useAddMedicalRecord();
  
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = useState(false);
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);
  
  // Form for adding vaccination
  const vaccinationForm = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      expiryDate: "",
      certificate: "",
    },
  });
  
  // Form for adding medical record
  const medicalForm = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      condition: "",
      diagnosis: format(new Date(), "yyyy-MM-dd"),
      treatment: "",
      notes: "",
    },
  });
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleEditClick = () => {
    // if (onEdit) {
    //   onEdit();
    // } else {
    //   router.push(`/pets/${petId}/edit`);
    // }
  };
  
  // Handle vaccination form submission
  const onVaccinationSubmit = async (data: VaccinationFormValues) => {
    if(!petId) return
    try {
      await addVaccination.mutateAsync({
        petId,
        data: {
          name: data.name,
          date: data.date,
          expiryDate: data.expiryDate || undefined,
          certificate: data.certificate || undefined,
        },
      });
      
      vaccinationForm.reset();
      setIsVaccinationDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Lỗi khi thêm tiêm phòng:", error);
    }
  };
  
  // Handle medical record form submission
  const onMedicalSubmit = async (data: MedicalRecordFormValues) => {
    if(!petId) return
    try {
      await addMedicalRecord.mutateAsync({
        petId,
        data: {
          condition: data.condition,
          diagnosis: data.diagnosis,
          treatment: data.treatment || undefined,
          notes: data.notes || undefined,
        },
      });
      
      medicalForm.reset();
      setIsMedicalDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Lỗi khi thêm lịch sử y tế:", error);
    }
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (isLoading || !pet) {
    return <div className="flex justify-center items-center h-64">Đang tải thông tin...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        
        <Button
          variant="outline"
          className="border-orange-300 hover:bg-orange-50 text-gray-800"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex flex-col items-center">
          <PetAvatar pet={pet} size="lg" editable={true} />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{pet.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-orange-500">{pet.species}</Badge>
            {pet.breed && <Badge variant="outline" className="border-orange-200">{pet.breed}</Badge>}
          </div>
        </div>
        
        <Card className="flex-1 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
            <CardTitle className="text-xl text-orange-800">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              {pet.age !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Tuổi</p>
                  <p className="font-medium">{pet.age} năm</p>
                </div>
              )}
              
              {pet.weight !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Cân nặng</p>
                  <p className="font-medium">{pet.weight} kg</p>
                </div>
              )}
              
              {pet.gender && (
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium">{pet.gender}</p>
                </div>
              )}
            </div>
            
            {pet.specialNeeds && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Nhu cầu đặc biệt</p>
                <p className="mt-1">{pet.specialNeeds}</p>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pet.habits && pet.habits.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thói quen</p>
                  <ul className="list-disc list-inside">
                    {pet.habits.map((habit, index) => (
                      <li key={index} className="text-sm">{habit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {pet.allergies && pet.allergies.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dị ứng</p>
                  <ul className="list-disc list-inside">
                    {pet.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm">{allergy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="vaccinations" className="mt-8">
        <TabsList className="bg-orange-50 border-orange-200 border">
          <TabsTrigger value="vaccinations" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Tiêm phòng
          </TabsTrigger>
          <TabsTrigger value="medical" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Lịch sử y tế
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vaccinations">
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
              <CardTitle className="text-lg text-orange-800">Lịch sử tiêm phòng</CardTitle>
              
              <Dialog open={isVaccinationDialogOpen} onOpenChange={setIsVaccinationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Thêm mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm thông tin tiêm phòng</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...vaccinationForm}>
                    <form onSubmit={vaccinationForm.handleSubmit(onVaccinationSubmit)} className="space-y-4">
                      <FormField
                        control={vaccinationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên vaccine *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nhập tên vaccine" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={vaccinationForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày tiêm *</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={vaccinationForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={vaccinationForm.control}
                        name="certificate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã chứng nhận</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nhập mã chứng nhận (nếu có)" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsVaccinationDialogOpen(false)}
                          className="border-gray-300"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={addVaccination.isPending}
                        >
                          {addVaccination.isPending ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent className="pt-6">
              {pet.vaccinations && pet.vaccinations.length > 0 ? (
                <div className="space-y-4">
                  {pet.vaccinations.map((vaccination, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-md border border-orange-100 bg-orange-50"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-orange-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{vaccination.name}</h4>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Ngày tiêm: {formatDate(vaccination.date)}</span>
                          </div>
                          
                          {vaccination.expiryDate && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Hết hạn: {formatDate(vaccination.expiryDate)}</span>
                            </div>
                          )}
                          
                          {vaccination.certificate && (
                            <div className="flex items-center gap-1 text-gray-600 md:col-span-2">
                              <FilePlus className="h-4 w-4" />
                              <span>Mã CN: {vaccination.certificate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Pill className="h-12 w-12 text-gray-300 mb-2" />
                  <p>Chưa có thông tin tiêm phòng</p>
                  <Button
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setIsVaccinationDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm thông tin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical">
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
              <CardTitle className="text-lg text-orange-800">Lịch sử y tế</CardTitle>
              
              <Dialog open={isMedicalDialogOpen} onOpenChange={setIsMedicalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Thêm mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm lịch sử y tế</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...medicalForm}>
                    <form onSubmit={medicalForm.handleSubmit(onMedicalSubmit)} className="space-y-4">
                      <FormField
                        control={medicalForm.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tình trạng/Bệnh *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nhập tình trạng bệnh" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="diagnosis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày chẩn đoán *</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="treatment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phương pháp điều trị</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Nhập phương pháp điều trị" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Nhập ghi chú thêm" 
                                {...field} 
                                className="border-orange-200" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsMedicalDialogOpen(false)}
                          className="border-gray-300"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={addMedicalRecord.isPending}
                        >
                          {addMedicalRecord.isPending ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent className="pt-6">
              {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {pet.medicalHistory.map((record, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-md border border-orange-100 bg-orange-50"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-5 w-5 text-orange-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{record.condition}</h4>
                          <span className="text-sm text-gray-500">{formatDate(record.diagnosis)}</span>
                        </div>
                        
                        {record.treatment && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 font-medium">Điều trị:</p>
                            <p className="text-sm text-gray-700">{record.treatment}</p>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 font-medium">Ghi chú:</p>
                            <p className="text-sm text-gray-700">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Stethoscope className="h-12 w-12 text-gray-300 mb-2" />
                  <p>Chưa có thông tin lịch sử y tế</p>
                  <Button
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setIsMedicalDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm thông tin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetDetail;
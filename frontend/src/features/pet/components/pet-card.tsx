import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2 } from "lucide-react";
import PetAvatar from "./pet-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate } from "react-router-dom";
import { useDeletePet } from "../hooks/mutations/delete-pet";
import { formatDate } from "@/lib/helper";
import { PetType } from "../types/api.types";

interface PetCardProps {
  pet: PetType;
  onEdit?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit }) => {
  const navigate = useNavigate();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xóa thú cưng",
    "Bạn có chắn chắc muốn xoá thú cưng này?"
  );
  const deletePet = useDeletePet();

  const handleViewDetails = () => {
    navigate(`/pets/${pet._id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/pets/${pet._id}/edit`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const ok = await confirmDelete();

    if (!ok) return;

    deletePet.mutate(pet._id);
  };

  return (
    <>
      <DeleteDialog />
      <Card
        className="border-orange-200 overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
        onClick={handleViewDetails}
      >
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 p-4">
          <div className="flex items-center gap-4">
            <PetAvatar pet={pet} size="md" />
            <div className="flex-1">
              <CardTitle className="text-xl text-orange-800 flex items-center justify-between">
                <span>{pet.name}</span>
                <Badge className="bg-orange-500 text-white text-xs ml-2">
                  {pet.species}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                {pet.breed || "Giống lai"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {pet.age !== undefined && (
              <div className="text-gray-700">
                <p className="text-xs text-gray-500">Tuổi</p>
                <p>
                  {pet.age} {pet.age === 1 ? "năm" : "năm"}
                </p>
              </div>
            )}

            {pet.weight !== undefined && (
              <div className="text-gray-700">
                <p className="text-xs text-gray-500">Cân nặng</p>
                <p>{pet.weight} kg</p>
              </div>
            )}

            {pet.gender && (
              <div className="text-gray-700">
                <p className="text-xs text-gray-500">Giới tính</p>
                <p>{pet.gender}</p>
              </div>
            )}
          </div>

          {pet.vaccinations && pet.vaccinations.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Tiêm phòng gần đây</p>
              <div className="space-y-1">
                {pet.vaccinations.slice(0, 2).map((vaccination, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{vaccination.name}</span>
                    <span className="text-gray-500 text-xs">
                      {vaccination.expiryDate &&
                        `(Hết hạn: ${formatDate(
                          new Date(vaccination.expiryDate)
                        )})`}
                    </span>
                  </div>
                ))}
                {pet.vaccinations.length > 2 && (
                  <p className="text-orange-500 text-xs">
                    + {pet.vaccinations.length - 2} loại vaccine khác
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-orange-50 p-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 p-2"
            onClick={handleViewDetails}
          >
            Xem chi tiết
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 h-8 w-8"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-800 hover:bg-red-100 h-8 w-8"
              onClick={handleDelete}
              disabled={deletePet.isPending}
            >
              {deletePet.isPending ? (
                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default PetCard;

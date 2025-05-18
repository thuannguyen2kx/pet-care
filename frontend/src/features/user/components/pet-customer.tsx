import { useUserPets } from '@/features/pet/hooks/queries/get-pets';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Weight, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PetType } from '@/features/pet/types/api.types';
import { PetCategory, petCategoryTranslations } from '@/constants';

export default function PetCustomer() {
  const { customerId } = useParams<{ customerId: string }>();
  const { data, isLoading, isError } = useUserPets(customerId || "");
  const pets = data?.pets;

  if (isLoading) {
    return <PetListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Pets</h2>
        <p className="text-gray-600 mb-4">
          We couldn't load the pet information. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No Pets Found</h2>
        <p className="text-gray-600 mb-4">
          This customer doesn't have any registered pets yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold mb-6">Customer's Pets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

function PetCard({ pet }: { pet: PetType }) {
  return (
    <Card className="p-0 gap-0 overflow-hidden shadow-none hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {pet.profilePicture?.url ? (
          <img 
            src={pet.profilePicture.url} 
            alt={`${pet.name} the ${pet.breed}`}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <span className="text-4xl text-blue-400">{pet.name.charAt(0)}</span>
            </div>
          </div>
        )}
        <Badge 
          variant={pet.species === "DOG" ? "default" : "secondary"} 
          className="absolute top-3 right-3 shadow-sm px-3 py-1"
        >
          {petCategoryTranslations[pet.species as PetCategory] || pet.species}
        </Badge>
      </div>
      
      <CardHeader className="pb-0 pt-4">
        <CardTitle className="text-xl font-bold text-gray-800">{pet.name}</CardTitle>
        <p className="text-sm font-medium text-gray-500">{pet.breed}</p>
      </CardHeader>
      
      <CardContent className="pt-2 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-gray-700">{pet.age} tuổi</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
            <Weight size={16} className="text-blue-500" />
            <span className="text-gray-700">{pet.weight} kg</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md col-span-2">
            <Info size={16} className="text-blue-500" />
            <span className="text-gray-700">{pet.gender}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-4">
        <Link 
          to={`/manager/pets/${pet._id}`} 
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
          >
            Xem chi tiết
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function PetListSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 border-b pb-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden border border-gray-200">
            <Skeleton className="h-52 w-full" />
            <CardHeader className="pb-0 pt-4">
              <Skeleton className="h-6 w-36 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pt-2 pb-2">
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md col-span-2" />
              </div>
            </CardContent>
            <CardFooter className="pt-1 pb-4">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageType {
  url: string;
  publicId?: string;
  alt?: string;
}

interface ImageCarouselProps {
  images?: ImageType[];
  aspectRatio?: string;
  showControls?: boolean;
  className?: string;
}


const SimpleImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  aspectRatio = "aspect-video",
  showControls = true,
  className = "",
}) => {
  // Handle case with no images
  if (!images || images.length === 0) {
    return (
      <div className={cn(`w-full ${aspectRatio} bg-gray-200 flex items-center justify-center`, className)}>
        <span className="text-gray-400">Không có hình ảnh nào</span>
      </div>
    );
  }

  return (
    <Carousel className={cn(`w-full ${aspectRatio} overflow-hidden`, className)}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.publicId} className="w-full h-full">
            <img
              src={image?.url || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={image?.alt || `Image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {showControls && images.length > 1 && (
        <>
          <CarouselPrevious className="size-6 left-2 bg-black/30 hover:bg-black/50 text-white" />
          <CarouselNext className="size-6 right-2 bg-black/30 hover:bg-black/50 text-white" />
        </>
      )}
    </Carousel>
  );
};

export default SimpleImageCarousel;
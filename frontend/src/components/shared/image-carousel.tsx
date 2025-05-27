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
  type?: "image" | "video";
}

interface ImageCarouselProps {
  media?: ImageType[];
  aspectRatio?: string;
  showControls?: boolean;
  className?: string;
  showNoImageMessage?: boolean;
}

const SimpleImageCarousel: React.FC<ImageCarouselProps> = ({
  media = [],
  aspectRatio = "aspect-video",
  showControls = true,
  className = "",
  showNoImageMessage = false,
}) => {
  // Handle case with no images
  if (Array.isArray(media) && media.length === 0) {
    if (showNoImageMessage) {
      return (
        <div
          className={cn(
            `w-full ${aspectRatio} bg-gray-200 flex items-center justify-center`,
            className
          )}
        >
          <span className="text-gray-400">Không có hình ảnh nào</span>
        </div>
      );
    } else return null;
  }

  return (
    <Carousel
      className={cn(`flex items-center justify-center w-full bg-gray-100 h-full ${aspectRatio} overflow-hidden`, className)}
    >
      <CarouselContent>
        {media.map((item, index) => (
          <CarouselItem key={item.publicId} className="w-full h-full">
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                className="object-contain w-full max-h-[60vh]"
              />
            ) : (
              <img
                src={
                  item?.url ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      {showControls && media.length > 1 && (
        <>
          <CarouselPrevious className="size-6 left-2 bg-black/30 hover:bg-black/50 text-white" />
          <CarouselNext className="size-6 right-2 bg-black/30 hover:bg-black/50 text-white" />
        </>
      )}
    </Carousel>
  );
};

export default SimpleImageCarousel;

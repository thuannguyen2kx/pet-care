import type { Post } from '@/features/post/domain/post.entity';
import { BlurImage } from '@/shared/components/blur-image';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function AdminPostMedia({ media }: { media: Post['media'] }) {
  if (!media?.length) return null;

  if (media.length === 1) {
    return <SingleMedia media={media[0]} />;
  }

  return <MediaCarousel media={media} />;
}
function SingleMedia({ media }: { media: Post['media'][0] }) {
  return (
    <div className="mb-8">
      <Dialog modal>
        <DialogTrigger asChild>
          <div className="border-border bg-secondary cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-95">
            <AspectRatio ratio={16 / 9}>
              {media.type === 'image' ? (
                <BlurImage src={media.url} alt="Post media" className="h-full w-full" />
              ) : (
                <video src={media.url} controls className="h-full w-full object-cover" />
              )}
            </AspectRatio>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl border-0 bg-black/90 p-0">
          <DialogHeader className="hidden">
            <DialogTitle className="sr-only">Chi tiết đính kèm bài viết</DialogTitle>
            <DialogDescription className="sr-only">Nội dung đính kèm bài bài</DialogDescription>
          </DialogHeader>
          {media.type === 'image' ? (
            <BlurImage src={media.url} alt="Post media" className="h-full w-full" />
          ) : (
            <video src={media.url} controls autoPlay className="h-auto w-full" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MediaCarousel({ media }: { media: Post['media'] }) {
  return (
    <div className="relative mb-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {media.map((media, idx) => (
            <CarouselItem key={idx} className="basis-full">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="border-border bg-secondary cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-95">
                    <AspectRatio ratio={16 / 9}>
                      {media.type === 'image' ? (
                        <BlurImage src={media.url} alt={`Post media ${idx + 1}`} />
                      ) : (
                        <video src={media.url} controls className="h-full w-full object-cover" />
                      )}
                    </AspectRatio>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-0 p-0">
                  <DialogHeader className="sr-only hidden">
                    <DialogTitle className="sr-only">Chi tiết đính kèm bài viết</DialogTitle>
                    <DialogDescription className="sr-only">
                      Nội dung đính kèm bài viết
                    </DialogDescription>
                  </DialogHeader>
                  {media.type === 'image' ? (
                    <BlurImage src={media.url} alt={`Post media ${idx + 1}`} />
                  ) : (
                    <video src={media.url} controls autoPlay className="h-auto w-full" />
                  )}
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-1" />
        <CarouselNext className="right-2 md:right-1" />
      </Carousel>
      <div className="bg-muted text-muted-foreground absolute right-2 bottom-2 rounded-md px-2 py-1 text-xs">
        {media.length} đính kèm
      </div>
    </div>
  );
}

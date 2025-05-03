import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
}

export const ShareModal = ({
  isOpen,
  onOpenChange,
  title,
  url,
  description = "",
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  // Encode content for sharing
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);

  // Generate sharing links
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Đã sao chép liên kết bài viết");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareToSocial = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ bài viết</DialogTitle>
          <DialogDescription>
            Chia sẻ bài viết này tới bạn bè của bạn trên các nền tảng xã hội
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {/* Share buttons */}
          <div className="flex justify-between px-2">
            <button 
              onClick={() => shareToSocial("facebook")}
              className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <div className="rounded-full bg-blue-100 p-3">
                <Facebook className="h-6 w-6" />
              </div>
              <span className="text-xs">Facebook</span>
            </button>
            
            <button 
              onClick={() => shareToSocial("twitter")}
              className="flex flex-col items-center gap-1 text-sky-500 hover:text-sky-700"
            >
              <div className="rounded-full bg-sky-100 p-3">
                <Twitter className="h-6 w-6" />
              </div>
              <span className="text-xs">Twitter</span>
            </button>
            
            <button 
              onClick={() => shareToSocial("linkedin")}
              className="flex flex-col items-center gap-1 text-blue-700 hover:text-blue-900"
            >
              <div className="rounded-full bg-blue-100 p-3">
                <Linkedin className="h-6 w-6" />
              </div>
              <span className="text-xs">LinkedIn</span>
            </button>
            
            <button 
              onClick={() => shareToSocial("email")}
              className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700"
            >
              <div className="rounded-full bg-red-100 p-3">
                <Mail className="h-6 w-6" />
              </div>
              <span className="text-xs">Email</span>
            </button>
          </div>
          
          {/* Copy link section */}
          <div className="mt-2">
            <Label htmlFor="link" className="text-sm text-gray-500">
              Hoặc sao chép liên kết
            </Label>
            <div className="flex mt-1">
              <Input
                id="link"
                readOnly
                value={url}
                className="flex-1 pr-10"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="ml-2"
                onClick={copyToClipboard}
              >
                <Copy className={copied ? "text-green-500" : "text-gray-500"} />
              </Button>
            </div>
          </div> 
        </div>
        
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};